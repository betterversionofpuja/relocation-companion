import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import useCities from "../hooks/useCities";
import { fetchComparison } from "../api/cityApi";
import {
  deleteSavedComparison,
  fetchSavedComparisons,
  saveComparison,
} from "../api/savedComparisonApi";
import CitySelector from "../components/CitySelector";
import ComparisonTable from "../components/ComparisonTable";
import Footer from "../components/Footer";
import useAuth from "../hooks/useAuth";

const cityDisplayName = (city) => (city ? `${city.name}, ${city.country}` : "");
const normalizeCityName = (value) => value.trim().toLowerCase();

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cities, loading: citiesLoading, error: citiesError } = useCities();
  const { authReady, isAuthenticated, user } = useAuth();
  const [city1, setCity1] = useState("");
  const [city2, setCity2] = useState("");
  const [comparisonData, setComparisonData] = useState(null);
  const [comparing, setComparing] = useState(false);
  const [compareError, setCompareError] = useState(null);
  const [savedComparisons, setSavedComparisons] = useState([]);
  const [savedUserId, setSavedUserId] = useState("");
  const [savingComparison, setSavingComparison] = useState(false);

  const handleCompare = useCallback(async (slug1, slug2) => {
    try {
      setComparing(true);
      setCompareError(null);
      const data = await fetchComparison(slug1, slug2);
      setComparisonData(data);
    } catch (err) {
      setCompareError("Comparison failed. Please try again.");
      console.error(err);
    } finally {
      setComparing(false);
    }
  }, []);

  useEffect(() => {
    if (!authReady || !isAuthenticated || !user?._id) return;

    let ignore = false;

    Promise.resolve()
      .then(() => fetchSavedComparisons())
      .then((comparisons) => {
        if (!ignore) {
          setSavedComparisons(comparisons);
          setSavedUserId(user._id);
        }
      })
      .catch((error) => {
        if (!ignore) console.error(error);
      });

    return () => {
      ignore = true;
    };
  }, [authReady, isAuthenticated, user?._id]);

  const selectedOrigin = useMemo(
    () => cities.find((city) => city.slug === city1),
    [cities, city1]
  );
  const selectedDestination = useMemo(
    () => cities.find((city) => city.slug === city2),
    [cities, city2]
  );
  const originCity = cityDisplayName(selectedOrigin);
  const destinationCity = cityDisplayName(selectedDestination);
  const hasSelectedPair = Boolean(city1 && city2 && city1 !== city2 && originCity && destinationCity);
  const visibleSavedComparisons = useMemo(
    () => (isAuthenticated && savedUserId === user?._id ? savedComparisons : []),
    [isAuthenticated, savedComparisons, savedUserId, user?._id]
  );

  const currentSavedComparison = useMemo(
    () =>
      visibleSavedComparisons.find(
        (comparison) =>
          comparison.originCity === originCity && comparison.destinationCity === destinationCity
      ),
    [destinationCity, originCity, visibleSavedComparisons]
  );

  const handleSaveToggle = async () => {
    if (!isAuthenticated || !hasSelectedPair || savingComparison) return;

    setSavingComparison(true);
    try {
      if (currentSavedComparison) {
        await deleteSavedComparison(currentSavedComparison._id);
        setSavedComparisons((current) =>
          current.filter((comparison) => comparison._id !== currentSavedComparison._id)
        );
        return;
      }

      const savedComparison = await saveComparison({ originCity, destinationCity });
      setSavedComparisons((current) => [
        savedComparison,
        ...current.filter((comparison) => comparison._id !== savedComparison._id),
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setSavingComparison(false);
    }
  };

  const findCitySlugByDisplayName = useCallback((displayName) => {
    const target = normalizeCityName(displayName);
    return cities.find((city) => normalizeCityName(cityDisplayName(city)) === target)?.slug || "";
  }, [cities]);

  useEffect(() => {
    const savedComparison = location.state?.savedComparison;

    if (!savedComparison || citiesLoading || citiesError || cities.length === 0) return;

    let ignore = false;

    Promise.resolve().then(() => {
      if (ignore) return;

      const originSlug = findCitySlugByDisplayName(savedComparison.originCity);
      const destinationSlug = findCitySlugByDisplayName(savedComparison.destinationCity);

      if (!originSlug || !destinationSlug) {
        setCompareError("One or both saved cities are no longer available.");
        navigate(location.pathname, { replace: true, state: null });
        return;
      }

      setCity1(originSlug);
      setCity2(destinationSlug);
      handleCompare(originSlug, destinationSlug);
      document.getElementById("compare")?.scrollIntoView({ behavior: "smooth", block: "start" });
      navigate(location.pathname, { replace: true, state: null });
    });

    return () => {
      ignore = true;
    };
  }, [
    cities.length,
    citiesError,
    citiesLoading,
    findCitySlugByDisplayName,
    handleCompare,
    location.pathname,
    location.state,
    navigate,
  ]);

  const saveState = {
    isSaved: Boolean(currentSavedComparison),
    isSaving: savingComparison,
    canSave: Boolean(isAuthenticated && hasSelectedPair && !savingComparison),
    tooltip: !isAuthenticated
      ? "Log in to save your relocation comparisons."
      : !hasSelectedPair
        ? "Select two different cities to save this move."
        : currentSavedComparison
          ? "Remove this saved move."
          : "Save this relocation comparison.",
    helperText: !isAuthenticated ? "Login/Signup to save your Comparisons!" : "",
  };

  return (
    <>
      <section className="hero-section mx-auto flex w-full max-w-7xl flex-col items-center py-6 text-center md:py-10">
        <motion.div
          className="max-w-5xl"
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.08, duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="mx-auto max-w-3xl text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
            Move With Confidence.
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
            Compare affordability, quality of life, healthcare, safety and
            environmental conditions before relocating.
          </p>

          <div className="mt-5 flex justify-center">
            <a href="#compare" className="blue-button inline-flex min-h-10 items-center rounded-lg px-4 text-sm font-semibold">
              Start Comparing
            </a>
          </div>
        </motion.div>
      </section>

      <section id="compare" className="mx-auto w-full max-w-7xl scroll-mt-6">
        {citiesLoading && (
          <div className="glass-panel mx-auto max-w-2xl rounded-lg p-6 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-200">
              Loading city database...
            </p>
          </div>
        )}

        {citiesError && (
          <div className="glass-panel mx-auto max-w-2xl rounded-lg p-6 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-300">
              Error: {citiesError}
            </p>
          </div>
        )}

        {!citiesLoading && !citiesError && (
          <CitySelector
            cities={cities}
            city1={city1}
            city2={city2}
            onCity1Change={setCity1}
            onCity2Change={setCity2}
            onCompare={handleCompare}
            loading={comparing}
            onSaveToggle={handleSaveToggle}
            saveState={saveState}
          />
        )}

        {compareError && (
          <div className="glass-panel mx-auto mt-5 max-w-2xl rounded-lg p-4 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-red-300">
              {compareError}
            </p>
          </div>
        )}

        <div id="results">
          <ComparisonTable data={comparisonData} />
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
