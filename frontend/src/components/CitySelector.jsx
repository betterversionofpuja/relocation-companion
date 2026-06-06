import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const selectedCity = (cities, slug) => cities.find((city) => city.slug === slug);

const ComparisonCard = ({ label, value, cities, placeholder, onChange }) => {
  const city = selectedCity(cities, value);

  return (
    <motion.label
      className="comparison-card group block"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <span className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </span>

      <div className="mt-5 min-h-[96px]">
        <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {city ? city.name : placeholder}
        </p>
        <p className="mt-2 text-sm font-medium text-slate-400">
          {city ? city.country : "Select a city to begin"}
        </p>
      </div>

      <select
        className="select-shell mt-5 h-12 w-full rounded-lg px-4 text-sm font-semibold"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{placeholder}</option>
        {cities.map((city) => (
          <option key={city._id} value={city.slug}>
            {city.name}, {city.country}
          </option>
        ))}
      </select>
    </motion.label>
  );
};

const CitySelector = ({ cities, onCompare, loading }) => {
  const [city1, setCity1] = useState("");
  const [city2, setCity2] = useState("");

  const canCompare = city1 && city2 && city1 !== city2 && !loading;
  const cityCount = useMemo(() => cities.length.toLocaleString("en-US"), [cities.length]);

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
    <motion.div
      className="comparison-panel mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-7"
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="eyebrow">City Comparison Engine</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Compare the move, not just the city.
          </h2>
        </div>
        <div className="status-pill">{cityCount} cities indexed</div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-[minmax(0,1fr)_76px_minmax(0,1fr)] lg:items-center">
        <ComparisonCard
          label="Origin city"
          value={city1}
          cities={cities}
          placeholder="Select origin"
          onChange={setCity1}
        />

        <motion.div
          className="vs-orb"
          initial={{ scale: 0.82, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.35 }}
        >
          VS
        </motion.div>

        <ComparisonCard
          label="Destination city"
          value={city2}
          cities={cities}
          placeholder="Select destination"
          onChange={setCity2}
        />
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
          The engine weighs affordability, salary potential, healthcare, safety,
          lifestyle and environmental conditions into a decision-ready analysis.
        </p>
        <motion.button
          onClick={handleCompare}
          disabled={!canCompare}
          className="blue-button min-h-14 w-full rounded-lg px-7 text-base font-bold md:w-auto"
          whileHover={canCompare ? { y: -2 } : undefined}
          whileTap={canCompare ? { scale: 0.98 } : undefined}
        >
          {loading ? "Generating..." : "Generate Analysis"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CitySelector;
