import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const RING_SIZE = 160;
const RING_STROKE = 12;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

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

const getRingTone = (score) => {
  if (score >= 80) return "var(--ring-high)";
  if (score >= 70) return "var(--ring-medium)";
  return "var(--ring-low)";
};

const ConfidenceRing = ({ score }) => {
  const normalizedScore = Math.min(100, Math.max(0, Number(score) || 0));
  const ringOffset = RING_CIRCUMFERENCE * (1 - normalizedScore / 100);
  const ringColor = getRingTone(normalizedScore);

  return (
    <div
      className="confidence-ring-panel relative min-h-48"
      aria-label={`Confidence score ${normalizedScore} percent`}
    >
      <svg
        className="h-40 w-40 -rotate-90"
        width={RING_SIZE}
        height={RING_SIZE}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        role="img"
      >
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={RING_STROKE}
        />
        <motion.circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke={ringColor}
          strokeLinecap="round"
          strokeWidth={RING_STROKE}
          strokeDasharray={RING_CIRCUMFERENCE}
          initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
          whileInView={{ strokeDashoffset: ringOffset }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <strong className="block font-display text-3xl text-white tabular">
            <AnimatedCounter value={normalizedScore} suffix="%" />
          </strong>
          <span className="mt-1 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Confidence
          </span>
        </div>
      </div>
    </div>
  );
};

const AdvantageTile = ({ label, value, tone = "sky" }) => (
  <div className={`advantage-tile border-white/5 md:border-l first:md:border-l-0 tone-${tone}`}>
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
    <strong className="mt-2 block text-base font-bold text-white">{value}</strong>
  </div>
);

const SystemVerdict = ({ verdict }) => {
  if (!verdict) return null;

  const advantages = [
    { label: "Financial Advantage", value: verdict.financialAdvantage, tone: "blue" },
    { label: "Lifestyle Advantage", value: verdict.lifestyleAdvantage, tone: "emerald" },
    { label: "Environmental Advantage", value: verdict.environmentalAdvantage, tone: "cyan" },
  ];

  return (
    <motion.div
      className="glass-card verdict-card"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div className="grid gap-8 p-6 md:grid-cols-[minmax(0,1fr)_14rem] md:items-center md:p-8">
        <div>
          <p className="eyebrow">Recommended Move</p>
          <h3 className="mt-3 font-display text-3xl font-bold leading-tight text-white md:text-4xl">
            {verdict.recommendedMove}
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            The recommendation is based on relative wins across financial, lifestyle and
            environmental indicators.
          </p>
        </div>
        <ConfidenceRing score={verdict.confidenceScore} />
      </div>
      <div className="grid md:grid-cols-3">
        {advantages.map((advantage) => (
          <AdvantageTile
            key={advantage.label}
            label={advantage.label}
            value={advantage.value}
            tone={advantage.tone}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SystemVerdict;
