import { motion } from "framer-motion";

const GROUPS = ["Economy", "Lifestyle", "Environment"];

const getProgressWidth = (value, max) => `${Math.max(8, (value / max) * 100)}%`;

const getOutcome = (row, cityKey) => {
  if (row.winner === "tie") return "Tie";
  return row.winner === cityKey ? "Win" : "Loss";
};

const getBadgeClassName = (outcome) => {
  const base =
    "status-badge";

  if (outcome === "Win") {
    return `${base} status-badge-win`;
  }

  if (outcome === "Loss") {
    return `${base} status-badge-loss`;
  }

  return `${base} status-badge-tie`;
};

const ProgressRow = ({ cityName, value, width, colorClassName, outcome }) => (
  <div className="metric-table-row">
    <div className="metric-row-main">
      <span className="metric-city">{cityName}</span>
      <span className="metric-value tabular">{value}</span>
      <span className={getBadgeClassName(outcome)}>{outcome}</span>
    </div>
    <div className="progress-track metric-progress" aria-hidden="true">
      <motion.div
        className={`progress-fill ${colorClassName}`}
        initial={{ width: 0 }}
        whileInView={{ width }}
        viewport={{ once: true }}
      />
    </div>
  </div>
);

const MetricCard = ({ row, cityOneName, cityTwoName }) => {
  const max = Math.max(row.cityOneRaw, row.cityTwoRaw, 1);
  const cityOneOutcome = getOutcome(row, "cityOne");
  const cityTwoOutcome = getOutcome(row, "cityTwo");

  return (
    <article className="metric-card">
      <div className="metric-card-header">
        <div className="min-w-0">
          <h4>{row.label}</h4>
          <p>{row.verdict}</p>
        </div>
        <span className="winner-pill">{row.winnerLabel}</span>
      </div>

      <div className="metric-table" aria-label={`${row.label} comparison`}>
        <ProgressRow
          cityName={cityOneName}
          value={row.cityOne}
          width={getProgressWidth(row.cityOneRaw, max)}
          colorClassName="bg-sky-400"
          outcome={cityOneOutcome}
        />
        <ProgressRow
          cityName={cityTwoName}
          value={row.cityTwo}
          width={getProgressWidth(row.cityTwoRaw, max)}
          colorClassName="bg-emerald-400"
          outcome={cityTwoOutcome}
        />
      </div>
    </article>
  );
};

const CategoryCard = ({ title, rows, cityOneName, cityTwoName }) => (
  <motion.section
    className="category-card"
    whileHover={{ y: -3 }}
    transition={{ duration: 0.18, ease: "easeOut" }}
  >
    <div className="category-card-header">
      <h3>{title}</h3>
      <span>{rows.length} metrics</span>
    </div>
    <div className="metric-stack">
      {rows.map((row) => (
        <MetricCard
          key={row.key}
          row={row}
          cityOneName={cityOneName}
          cityTwoName={cityTwoName}
        />
      ))}
    </div>
  </motion.section>
);

const CategoryBreakdown = ({ rows, cityOneName, cityTwoName }) => (
  <div className="category-grid">
    {GROUPS.map((group) => (
      <CategoryCard
        key={group}
        title={group}
        rows={rows.filter((row) => row.group === group)}
        cityOneName={cityOneName}
        cityTwoName={cityTwoName}
      />
    ))}
  </div>
);

export default CategoryBreakdown;
