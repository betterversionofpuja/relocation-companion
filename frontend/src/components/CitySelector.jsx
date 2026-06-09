import { useMemo } from "react";
import { motion } from "framer-motion";

const selectedCity = (cities, slug) => cities.find((city) => city.slug === slug);

const ComparisonCard = ({ label, value, cities, placeholder, onChange }) => {
  const city = selectedCity(cities, value);

  return (
    <motion.label
      className="group grid min-w-0 gap-3"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow">{label}</span>
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--text-muted)] transition-colors group-focus-within:bg-[var(--text-accent)] group-hover:bg-[var(--text-accent)]" />
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 transition-colors group-focus-within:border-[var(--border-focus)] group-hover:border-[var(--border-default)]">
        <div className="pointer-events-none pr-10">
          <p className="font-display truncate text-xl font-bold leading-tight text-[var(--text-primary)] sm:text-2xl">
            {city ? city.name : placeholder}
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">
            {city ? city.country : "Select a city to begin"}
          </p>
        </div>

        <div className="city-select-shell mt-4">
          <select
            className="city-select"
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
        </div>
      </div>
    </motion.label>
  );
};

const CitySelector = ({
  cities,
  city1,
  city2,
  onCity1Change,
  onCity2Change,
  onCompare,
  loading,
  onSaveToggle,
  saveState,
}) => {
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
      className="comparison-panel mx-auto w-full max-w-6xl !p-0"
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className="p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <span className="section-badge">City Comparison Engine</span>
            <h2 className="font-display mt-2 max-w-3xl text-2xl font-bold leading-tight text-[var(--text-primary)] sm:text-3xl md:text-4xl">
              Compare the move, not just the city.
            </h2>
          </div>
          <div className="status-pill self-start lg:self-auto">{cityCount} cities indexed</div>
        </div>

        <div className="selector-grid mt-6">
          <ComparisonCard
            label="Origin city"
            value={city1}
            cities={cities}
            placeholder="Select origin"
            onChange={onCity1Change}
          />

          <motion.div
            className="flex items-center gap-3 lg:grid lg:place-items-center"
            initial={{ scale: 0.82, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.35 }}
          >
            <span className="h-px flex-1 bg-[var(--border-subtle)] lg:hidden" />
            <span className="vs-orb mx-auto shadow-[0_0_32px_rgba(14,165,233,0.24)]">VS</span>
            <span className="h-px flex-1 bg-[var(--border-subtle)] lg:hidden" />
          </motion.div>

          <ComparisonCard
            label="Destination city"
            value={city2}
            cities={cities}
            placeholder="Select destination"
            onChange={onCity2Change}
          />
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-[var(--border-subtle)] pt-5 lg:flex-row lg:items-start lg:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            The engine weighs affordability, salary potential, healthcare, safety,
            lifestyle and environmental conditions into a decision-ready analysis.
          </p>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-end lg:w-auto">
            <div className="grid gap-2 sm:min-w-48">
              <motion.button
                onClick={onSaveToggle}
                disabled={!saveState.canSave}
                className={`ghost-button save-move-button w-full gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 ${
                  saveState.isSaved ? "is-saved" : ""
                }`}
                title={saveState.tooltip}
                whileHover={saveState.canSave ? { y: -2 } : undefined}
                whileTap={saveState.canSave ? { scale: 0.98 } : undefined}
              >
                <span aria-hidden="true">{saveState.isSaved ? "OK" : "+"}</span>
                {saveState.isSaving ? "Saving..." : saveState.isSaved ? "Saved" : "Save to My Moves"}
              </motion.button>
              {saveState.helperText && <p className="save-helper-text">{saveState.helperText}</p>}
            </div>
            <motion.button
              onClick={handleCompare}
              disabled={!canCompare}
              className="blue-button min-h-12 w-full px-6 text-sm shadow-[0_18px_48px_rgba(14,165,233,0.24)] sm:w-auto"
              whileHover={canCompare ? { y: -2 } : undefined}
              whileTap={canCompare ? { scale: 0.98 } : undefined}
            >
              {loading ? "Generating..." : "Generate Analysis"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CitySelector;
