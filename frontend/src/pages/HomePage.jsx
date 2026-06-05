import { useState } from "react";
import useCities from "../hooks/useCities";
import { fetchComparison } from "../api/cityApi";
import CitySelector from "../components/CitySelector";
import ComparisonTable from "../components/ComparisonTable";
import horizonGlow from "../assets/horizon-glow.jfif";
import globalNetworkWorldMap from "../assets/global-network-world-map.jfif";

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
    <main className="app-shell" style={{ "--hero-bg": `url(${horizonGlow})` }}>
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-sky-400/15 p-1.5 shadow-[0_0_28px_rgba(56,189,248,0.35)]">
            <div className="h-full w-full rounded-xl bg-gradient-to-br from-sky-300 to-blue-700" />
          </div>
          <div>
            <p className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-700 bg-clip-text text-2xl font-black uppercase tracking-[0.14em] text-transparent drop-shadow-[0_0_22px_rgba(56,189,248,0.78)] sm:text-3xl">
              Relocation Companion
            </p>
            <p className="mono text-xs uppercase tracking-widest text-cyan-300/70">
              City intelligence engine
            </p>
          </div>
        </div>
        <a
          href="#compare"
          className="hidden rounded-full border border-sky-300/20 bg-white/5 px-4 py-2 text-sm font-semibold text-sky-100 shadow-[0_0_22px_rgba(56,189,248,0.12)] backdrop-blur transition hover:border-sky-300/40 hover:bg-white/10 sm:inline-flex"
        >
          Start comparing
        </a>
      </nav>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-10 pt-12 pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(340px,460px)] lg:pt-20">
        <div>
          <p className="mono mb-5 text-xs uppercase tracking-[0.36em] text-sky-300/70">
            // Kaggle city data decoded into relocation decisions
          </p>
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            Compare cities before you move your life.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Stop reading raw indexes like homework. Pick two cities and get a clear,
            visual verdict across cost, safety, healthcare, quality of life, and environment.
          </p>

          <div className="mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ["Cost clarity", "Rent, food, transport"],
              ["Life quality", "Safety and healthcare"],
              ["Move confidence", "One clean verdict"],
            ].map(([title, text]) => (
              <div key={title} className="glass-panel rounded-3xl px-4 py-4">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-xs text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-orb mx-auto w-full max-w-md">
          <div className="glass-panel soft-glow overflow-hidden rounded-[2rem] p-4">
            <img
              src={globalNetworkWorldMap}
              alt="Global network world map visualizing connected relocation data"
              className="relative z-10 aspect-[4/5] w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </div>
      </section>

      <section id="compare" className="mx-auto w-full max-w-7xl">
        {citiesLoading && (
          <div className="glass-panel mx-auto mt-8 max-w-2xl rounded-3xl p-6 text-center">
            <p className="mono animate-pulse text-sm uppercase tracking-[0.26em] text-sky-200">
              // Loading city database...
            </p>
          </div>
        )}

        {citiesError && (
          <div className="glass-panel mx-auto mt-8 max-w-2xl rounded-3xl p-6 text-center">
            <p className="mono text-sm uppercase tracking-[0.22em] text-red-300">
              // Error: {citiesError}
            </p>
          </div>
        )}

        {!citiesLoading && !citiesError && (
          <CitySelector cities={cities} onCompare={handleCompare} loading={comparing} />
        )}

        {compareError && (
          <div className="glass-panel mx-auto mt-5 max-w-2xl rounded-3xl p-4 text-center">
            <p className="mono text-sm uppercase tracking-[0.18em] text-red-300">
              // {compareError}
            </p>
          </div>
        )}

        <ComparisonTable data={comparisonData} />
      </section>

      <footer className="mono mx-auto mt-16 max-w-7xl text-center text-xs uppercase tracking-[0.26em] text-sky-200/35">
        // Data-driven relocation intelligence // {new Date().getFullYear()}
      </footer>
    </main>
  );
};

export default HomePage;
