import { useState } from "react";

const CitySelector = ({ cities, onCompare, loading }) => {
  const [city1, setCity1] = useState("");
  const [city2, setCity2] = useState("");

  const handleCompare = () => {
    if (!city1 || !city2) {
      alert("Please select both cities");
      return;
    }
    if (city1 === city2) {
      alert("Please select two different cities");
      return;
    }
    onCompare(city1, city2);
  };

  return (
    <div className="glass-panel soft-glow mx-auto mt-6 w-full max-w-5xl rounded-[2rem] p-5 sm:p-7 lg:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mono text-xs uppercase tracking-[0.28em] text-sky-300/70">
            // Start comparison
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">
            Choose two cities. Get the smarter move.
          </h2>
        </div>
        <div className="mono rounded-full border border-sky-300/15 bg-sky-300/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-sky-100/70">
          {cities.length} cities indexed
        </div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)] lg:items-end">
        <label className="block">
          <span className="mono mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400">
            Origin city
          </span>
          <select
            className="select-shell h-14 w-full rounded-2xl px-4 text-sm font-semibold"
            value={city1}
            onChange={(e) => setCity1(e.target.value)}
          >
            <option value="">Select first city</option>
            {cities.map((city) => (
              <option key={city._id} value={city.slug}>
                {city.name}, {city.country}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center justify-center lg:pb-1">
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-sky-300/20 bg-white/[0.04] text-sm font-bold text-sky-100 shadow-[0_0_24px_rgba(56,189,248,0.16)]">
            VS
          </div>
        </div>

        <label className="block">
          <span className="mono mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400">
            Destination city
          </span>
          <select
            className="select-shell h-14 w-full rounded-2xl px-4 text-sm font-semibold"
            value={city2}
            onChange={(e) => setCity2(e.target.value)}
          >
            <option value="">Select second city</option>
            {cities.map((city) => (
              <option key={city._id} value={city.slug}>
                {city.name}, {city.country}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm leading-6 text-slate-400">
          The engine compares affordability, quality signals, safety, healthcare,
          and environmental comfort, then summarizes the trade-off.
        </p>
        <button
          onClick={handleCompare}
          disabled={loading}
          className="blue-button h-13 rounded-2xl px-7 text-sm font-bold"
        >
          {loading ? "Analyzing..." : "Compare cities"}
        </button>
      </div>
    </div>
  );
};

export default CitySelector;
