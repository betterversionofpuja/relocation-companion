import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import CategoryBreakdown from "./comparison/CategoryBreakdown";
import CityRadarChart from "./comparison/CityRadarChart";
import { decodeComparison } from "../utils/comparisonInsights";

const AnimatedCounter = ({ value, prefix = "", suffix = "", decimals = 0 }) => {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 80, damping: 18 });
  const display = useTransform(spring, (latest) => {
    const next = Number(latest).toFixed(decimals);
    return `${prefix}${next}${suffix}`;
  });

  useEffect(() => {
    motionValue.set(Number(value) || 0);
  }, [motionValue, value]);

  return <motion.span>{display}</motion.span>;
};

const SectionHeader = ({ kicker, title, body }) => (
  <div className="section-header">
    <span className="section-badge">{kicker}</span>
    <h2>{title}</h2>
    {body && <p>{body}</p>}
  </div>
);

const GlassCard = ({ children, className = "" }) => (
  <motion.div
    className={`glass-card ${className}`}
    transition={{ duration: 0.18, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const VerdictCard = ({ label, value, tone = "blue" }) => (
  <GlassCard className={`verdict-mini tone-${tone}`}>
    <p>{label}</p>
    <strong>{value}</strong>
  </GlassCard>
);

const ComparisonTable = ({ data, weights }) => {
  const [viewMode, setViewMode] = useState("grid");
  if (!data) return null;

  const {
    cityOneName,
    cityTwoName,
    rows,
    wins,
    summary,
    verdict,
    weightedScoreOne,
    weightedScoreTwo,
  } = decodeComparison(data, weights);

  const handleExportCSV = () => {
    const metadata = [
      ["Relocation Comparison Report"],
      ["Generated", new Date().toLocaleDateString()],
      ["Comparison", `"${cityOneName.replace(/"/g, '""')}" vs "${cityTwoName.replace(/"/g, '""')}"`],
      ["Verdict", `"${verdict.recommendedMove.replace(/"/g, '""')}"`],
      ["Confidence", `${verdict.confidenceScore}%`],
      [`${cityOneName} Overall Score`, `${weightedScoreOne.toFixed(1)}`],
      [`${cityTwoName} Overall Score`, `${weightedScoreTwo.toFixed(1)}`],
      ["Summary", `"${summary.replace(/"/g, '""')}"`],
      [] // empty row separator
    ];

    const headers = [
      "Metric",
      "Category",
      `"${cityOneName.replace(/"/g, '""')}"`,
      `"${cityTwoName.replace(/"/g, '""')}"`,
      "Difference",
      "Winner"
    ];

    const csvContent = [
      ...metadata.map((m) => m.join(",")),
      headers.join(","),
      ...rows.map((row) => [
        `"${row.label.replace(/"/g, '""')}"`,
        `"${row.group.replace(/"/g, '""')}"`,
        `"${row.cityOne.replace(/"/g, '""')}"`,
        `"${row.cityTwo.replace(/"/g, '""')}"`,
        `"${Number(row.deltaAmount || 0).toFixed(2)} ${row.lowerIsBetter ? 'lower' : 'higher'}"`,
        `"${row.winnerLabel.replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `${cityOneName.replace(/[\s,]+/g, "_")}_vs_${cityTwoName.replace(/[\s,]+/g, "_")}_comparison.csv`;
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.section
      className="results-suite mx-auto mt-10 w-full max-w-7xl"
      initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <SectionHeader
        kicker="System Verdict"
        title={`${cityOneName} vs ${cityTwoName}`}
        body={summary}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start mt-6">
        <GlassCard className="verdict-card !mt-0 h-full flex flex-col justify-between">
          <div className="verdict-main">
            <div className="verdict-copy">
              <span className="section-badge">Main Recommendation</span>
              <h3>{verdict.recommendedMove}</h3>
              <p>
                Based on relative wins across financial, lifestyle and environmental indicators.
              </p>
            </div>
            <div className="confidence-ring" aria-label={`Confidence score ${verdict.confidenceScore} percent`}>
              <div>
                <AnimatedCounter value={verdict.confidenceScore} suffix="%" />
                <span>Confidence</span>
              </div>
            </div>
          </div>
          <div className="verdict-grid mt-4">
            <VerdictCard label="Financial Advantage" value={verdict.financialAdvantage} />
            <VerdictCard label="Lifestyle Advantage" value={verdict.lifestyleAdvantage} tone="emerald" />
            <VerdictCard label="Environmental Advantage" value={verdict.environmentalAdvantage} tone="cyan" />
            <VerdictCard label={cityOneName} value={`${weightedScoreOne.toFixed(1)} score (${wins.cityOne.total} wins)`} tone="slate" />
            <VerdictCard label={cityTwoName} value={`${weightedScoreTwo.toFixed(1)} score (${wins.cityTwo.total} wins)`} tone="slate" />
          </div>
        </GlassCard>

        <CityRadarChart data={data} />
      </div>

      <div className="mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <SectionHeader kicker="Category Analysis" title="Decision Drivers" />
        
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {/* Grid/Table Switcher */}
          <div className="flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all border-0 cursor-pointer ${
                viewMode === "grid"
                  ? "bg-slate-800 text-white shadow"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
              title="Show as Grid"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all border-0 cursor-pointer ${
                viewMode === "table"
                  ? "bg-slate-800 text-white shadow"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
              title="Show as Table"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Table
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="ghost-button flex items-center gap-2 px-4 py-2 text-xs font-bold shadow-sm"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export CSV
          </button>
        </div>
      </div>
      <div className="mt-4">
        {viewMode === "grid" ? (
          <CategoryBreakdown rows={rows} cityOneName={cityOneName} cityTwoName={cityTwoName} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/30 backdrop-blur-md shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] bg-slate-900/40">
                  <th className="py-4 px-5">Metric</th>
                  <th className="py-4 px-5">Category</th>
                  <th className="py-4 px-5">{cityOneName}</th>
                  <th className="py-4 px-5">{cityTwoName}</th>
                  <th className="py-4 px-5">Difference</th>
                  <th className="py-4 px-5 text-right">Winner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-semibold text-slate-300">
                {rows.map((row) => {
                  const isCityOneWinner = row.winner === "cityOne";
                  const isCityTwoWinner = row.winner === "cityTwo";
                  const isTie = row.winner === "tie";
                  
                  return (
                    <tr
                      key={row.key}
                      className="transition-colors duration-150 hover:bg-white/[0.015]"
                    >
                      <td className="py-4 px-5 font-bold text-white">
                        {row.label}
                      </td>
                      <td className="py-4 px-5 text-[var(--text-secondary)]">
                        {row.group}
                      </td>
                      <td className={`py-4 px-5 tabular ${isCityOneWinner ? "text-sky-400 font-bold" : ""}`}>
                        {row.cityOne}
                      </td>
                      <td className={`py-4 px-5 tabular ${isCityTwoWinner ? "text-emerald-400 font-bold" : ""}`}>
                        {row.cityTwo}
                      </td>
                      <td className="py-4 px-5 tabular text-slate-400">
                        {Number(row.deltaAmount || 0).toFixed(2)} {row.lowerIsBetter ? "lower" : "higher"}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          isTie
                            ? "bg-slate-800 text-slate-400"
                            : isCityOneWinner
                              ? "bg-sky-500/10 text-sky-400 border border-sky-500/15"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                        }`}>
                          {isTie ? "Tie" : row.winnerLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default ComparisonTable;
