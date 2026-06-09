import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import CategoryBreakdown from "./comparison/CategoryBreakdown";
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

const ComparisonTable = ({ data }) => {
  if (!data) return null;

  const { cityOneName, cityTwoName, rows, wins, summary, verdict } = decodeComparison(data);

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

      <GlassCard className="verdict-card">
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
        <div className="verdict-grid">
          <VerdictCard label="Financial Advantage" value={verdict.financialAdvantage} />
          <VerdictCard label="Lifestyle Advantage" value={verdict.lifestyleAdvantage} tone="emerald" />
          <VerdictCard label="Environmental Advantage" value={verdict.environmentalAdvantage} tone="cyan" />
          <VerdictCard label={cityOneName} value={`${wins.cityOne.total} wins`} tone="slate" />
          <VerdictCard label={cityTwoName} value={`${wins.cityTwo.total} wins`} tone="slate" />
        </div>
      </GlassCard>

      <div className="mt-12">
        <SectionHeader kicker="Category Analysis" title="Decision Drivers" />
        <CategoryBreakdown rows={rows} cityOneName={cityOneName} cityTwoName={cityTwoName} />
      </div>
    </motion.section>
  );
};

export default ComparisonTable;
