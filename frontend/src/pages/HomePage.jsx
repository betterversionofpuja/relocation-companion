import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchCities, fetchComparison } from "../api/cityApi";

import earthBg from "../assets/earth-bg.png";
import Hero from "../components/HeroSection";
import CitySelector from "../components/CitySelector";
import CompareButton from "../components/CompareButton";

function HomePage() {
  const [cities, setCities] = useState([]);
  const [cityOne, setCityOne] = useState(
  localStorage.getItem("cityOne") || ""
);

const [cityTwo, setCityTwo] = useState(
  localStorage.getItem("cityTwo") || ""
);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadCities = async () => {
      try {
        const data = await fetchCities();
        setCities(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadCities();
  }, []);

  useEffect(() => {
  localStorage.setItem("cityOne", cityOne);
}, [cityOne]);

useEffect(() => {
  localStorage.setItem("cityTwo", cityTwo);
}, [cityTwo]);

  const handleCompare = async () => {
    if (!cityOne || !cityTwo) {
      alert("Please select both cities");
      return;
    }

    if (cityOne === cityTwo) {
      alert("Please select different cities");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await fetchComparison(cityOne, cityTwo);

      navigate("/compare", {
  state: {
    comparison: {
      ...data,
      cityOne: {
        ...data.cityOne,
        slug: cityOne,
      },
      cityTwo: {
        ...data.cityTwo,
        slug: cityTwo,
      },
    },
  },
});
    } catch (error) {
      setError("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${earthBg})`,
        }}
      >
        <Hero />

        <CitySelector
          cities={cities}
          cityOne={cityOne}
          cityTwo={cityTwo}
          setCityOne={setCityOne}
          setCityTwo={setCityTwo}
        />

        <CompareButton
          onClick={handleCompare}
          loading={loading}
        />
      </section>

      {error && (
        <p className="mt-4 text-center text-red-500">
          {error}
        </p>
      )}
    </>
  );
}

export default HomePage;