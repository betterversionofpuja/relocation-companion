import { useState } from "react";
import { motion } from "framer-motion";
import useCities from "../hooks/useCities";
import { fetchComparison } from "../api/cityApi";
import CitySelector from "../components/CitySelector";
import ComparisonTable from "../components/ComparisonTable";

const HomePage = () => {
  const { cities, loading: citiesLoading, error: citiesError } = useCities();
  const [comparisonData, setComparisonData] = useState(null);
  const [comparing, setComparing] = useState(false);
  const [compareError, setCompareError] = useState(null);

  const handleCompare = async (slug1, slug2) => {
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
  };

  return (
    <main className="app-shell">
      <nav className="nav-shell mx-auto flex w-full max-w-7xl items-center justify-between gap-5">
        <a href="/" className="flex min-w-0 items-center gap-3 focus-visible-ring">
          <div className="brand-mark">
            <span />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold tracking-tight text-white">
              Relocation Companion
            </p>
            <p className="hidden text-xs font-semibold text-slate-500 sm:block">
              Intelligence platform
            </p>
          </div>
        </a>

        <div className="hidden items-center gap-6 text-sm font-semibold text-slate-400 md:flex">
          <a href="#compare" className="nav-link">Compare</a>
          <a href="#results" className="nav-link">Insights</a>
        </div>

        <a href="#compare" className="blue-button inline-flex min-h-10 items-center rounded-lg px-4 text-sm font-bold">
          Start Comparing
        </a>
      </nav>

      <section className="hero-section mx-auto flex w-full max-w-7xl flex-col items-center pt-14 pb-7 text-center sm:pt-16 lg:pt-20">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
          AI-powered relocation intelligence
        </motion.div>

        <motion.div
          className="max-w-5xl"
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.08, duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="mx-auto mt-6 max-w-5xl text-[clamp(4.5rem,8vw,6rem)] font-extrabold leading-[0.92] tracking-tight text-white">
            Move With Confidence.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Compare affordability, quality of life, healthcare, safety and
            environmental conditions before relocating.
          </p>

          <div className="mt-7 flex justify-center">
            <a href="#compare" className="blue-button inline-flex min-h-12 items-center rounded-lg px-6 text-base font-bold">
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
          <CitySelector cities={cities} onCompare={handleCompare} loading={comparing} />
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

      <footer className="mx-auto mt-16 max-w-7xl border-t border-white/10 pt-6 text-center text-xs font-semibold text-slate-500">
        Data-driven relocation intelligence // {new Date().getFullYear()}
      </footer>
    </main>
  );
};

export default HomePage;
