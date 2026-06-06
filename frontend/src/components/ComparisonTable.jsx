import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const preciseMoneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatMoney = (value) => preciseMoneyFormatter.format(Number(value) || 0);
const formatCompactMoney = (value) => moneyFormatter.format(Number(value) || 0);
const formatScore = (value) => Number(value || 0).toFixed(2);
const cityLabel = (city) => city.name.toUpperCase();
const fullCityLabel = (city) => `${city.name}, ${city.country}`.toUpperCase();
const getSalaryValue = (city) =>
  Number(city.Average_Monthly_Salary_USD ?? city.averageMonthlySalary ?? 0) || 0;

const qualityBand = (value) => {
  if (value > 80) return "Excellent";
  if (value >= 60) return "High";
  if (value >= 40) return "Moderate";
  return "Poor";
};

const pollutionBand = (value) => {
  if (value < 30) return "Clean";
  if (value <= 60) return "Moderate";
  return "Heavy";
};

const pickWinner = (a, b, lowerIsBetter) => {
  if (a === b) return "tie";
  if (lowerIsBetter) return a < b ? "cityOne" : "cityTwo";
  return a > b ? "cityOne" : "cityTwo";
};

const winnerName = (winner, cityOne, cityTwo) => {
  if (winner === "cityOne") return cityLabel(cityOne);
  if (winner === "cityTwo") return cityLabel(cityTwo);
  return "Balanced";
};

const decodeComparison = ({ cityOne, cityTwo, diff }) => {
  const cityOneShort = cityLabel(cityOne);
  const cityTwoShort = cityLabel(cityTwo);
  const cityOneSalary = getSalaryValue(cityOne);
  const cityTwoSalary = getSalaryValue(cityTwo);

  const metrics = [
    {
      key: "rentMonthly",
      group: "Economy",
      label: "Monthly rent",
      insightLabel: "Monthly Rent Difference",
      a: cityOne.rentMonthly,
      b: cityTwo.rentMonthly,
      delta: diff.rentMonthly,
      lowerIsBetter: true,
      format: formatMoney,
      compact: formatCompactMoney,
      verdict: (winner, amount) => `${winner} saves ${formatMoney(amount)} on monthly rent`,
    },
    {
      key: "mealCheap",
      group: "Economy",
      label: "Food cost",
      insightLabel: "Food Difference",
      a: cityOne.mealCheap,
      b: cityTwo.mealCheap,
      delta: diff.mealCheap,
      lowerIsBetter: true,
      format: formatMoney,
      compact: formatCompactMoney,
      verdict: (winner, amount) => `${winner} has food costs lower by ${formatMoney(amount)}`,
    },
    {
      key: "groceriesMonthly",
      group: "Economy",
      label: "Transport index",
      insightLabel: "Transport Difference",
      a: cityOne.groceriesMonthly,
      b: cityTwo.groceriesMonthly,
      delta: diff.groceriesMonthly,
      lowerIsBetter: true,
      format: formatMoney,
      compact: formatCompactMoney,
      verdict: (winner, amount) => `${winner} is cheaper on transport by ${formatMoney(amount)}`,
    },
    {
      key: "transport",
      group: "Economy",
      label: "Internet cost",
      insightLabel: "Internet Difference",
      a: cityOne.transport,
      b: cityTwo.transport,
      delta: diff.transport,
      lowerIsBetter: true,
      format: formatMoney,
      compact: formatCompactMoney,
      verdict: (winner, amount) => `${winner} wins internet cost by ${formatMoney(amount)}`,
    },
    {
      key: "averageMonthlySalary",
      group: "Economy",
      label: "Average monthly salary",
      insightLabel: "Salary Difference",
      a: cityOneSalary,
      b: cityTwoSalary,
      delta: diff.averageMonthlySalary,
      lowerIsBetter: false,
      format: formatMoney,
      compact: formatCompactMoney,
      verdict: (winner, amount) => `${winner} leads average salary by ${formatMoney(amount)}`,
    },
    {
      key: "qualityOfLife",
      group: "Lifestyle",
      label: "Quality of life",
      a: cityOne.qualityOfLife,
      b: cityTwo.qualityOfLife,
      lowerIsBetter: false,
      format: (value) => `${formatScore(value)} / ${qualityBand(value)}`,
      compact: formatScore,
      verdict: (winner, amount) => `${winner} leads quality of life by ${formatScore(amount)} points`,
    },
    {
      key: "safetyIndex",
      group: "Lifestyle",
      label: "Safety",
      a: cityOne.safetyIndex,
      b: cityTwo.safetyIndex,
      lowerIsBetter: false,
      format: (value) => `${formatScore(value)} / ${qualityBand(value)}`,
      compact: formatScore,
      verdict: (winner, amount) => `${winner} is safer by ${formatScore(amount)} points`,
    },
    {
      key: "healthcareIndex",
      group: "Lifestyle",
      label: "Healthcare",
      a: cityOne.healthcareIndex,
      b: cityTwo.healthcareIndex,
      lowerIsBetter: false,
      format: (value) => `${formatScore(value)} / ${qualityBand(value)}`,
      compact: formatScore,
      verdict: (winner, amount) => `${winner} leads healthcare by ${formatScore(amount)} points`,
    },
    {
      key: "pollutionIndex",
      group: "Environment",
      label: "Pollution",
      a: cityOne.pollutionIndex,
      b: cityTwo.pollutionIndex,
      lowerIsBetter: true,
      format: (value) => `${formatScore(value)} / ${pollutionBand(value)}`,
      compact: formatScore,
      verdict: (winner, amount) => `${winner} has cleaner air by ${formatScore(amount)} points`,
    },
  ];

  const wins = {
    cityOne: { total: 0, Economy: 0, Lifestyle: 0, Environment: 0 },
    cityTwo: { total: 0, Economy: 0, Lifestyle: 0, Environment: 0 },
  };

  const rows = metrics.map((metric) => {
    const a = Number(metric.a) || 0;
    const b = Number(metric.b) || 0;
    const winner = pickWinner(a, b, metric.lowerIsBetter);
    const amount = Math.abs(Number(metric.delta ?? a - b));

    if (winner !== "tie") {
      wins[winner].total += 1;
      wins[winner][metric.group] += 1;
    }

    return {
      ...metric,
      cityOneRaw: a,
      cityTwoRaw: b,
      cityOne: metric.format(a),
      cityTwo: metric.format(b),
      winner,
      deltaAmount: amount,
      winnerLabel: winnerName(winner, cityOne, cityTwo),
      verdict:
        winner === "tie"
          ? "Both cities are effectively tied on this signal"
          : metric.verdict(winnerName(winner, cityOne, cityTwo), amount),
    };
  });

  const categoryTotals = {
    Economy: rows.filter((row) => row.group === "Economy").length,
    Lifestyle: rows.filter((row) => row.group === "Lifestyle").length,
    Environment: rows.filter((row) => row.group === "Environment").length,
  };

  const recommendedWinner =
    wins.cityOne.total === wins.cityTwo.total
      ? "tie"
      : wins.cityOne.total > wins.cityTwo.total
        ? "cityOne"
        : "cityTwo";

  const recommendedMove =
    recommendedWinner === "tie"
      ? "Balanced move"
      : `Move to ${recommendedWinner === "cityOne" ? cityOne.name : cityTwo.name}`;

  const confidenceScore =
    recommendedWinner === "tie"
      ? 68
      : Math.round(62 + (Math.abs(wins.cityOne.total - wins.cityTwo.total) / rows.length) * 34);

  const categoryWinner = (group) => {
    if (wins.cityOne[group] === wins.cityTwo[group]) return "Balanced";
    return wins.cityOne[group] > wins.cityTwo[group] ? cityOneShort : cityTwoShort;
  };

  const summary =
    recommendedWinner === "tie"
      ? "The move is balanced across the measured signals. The final decision should lean on personal priorities."
      : `${winnerName(recommendedWinner, cityOne, cityTwo)} leads the overall relocation profile, with the strongest edge in ${categoryWinner("Economy") === winnerName(recommendedWinner, cityOne, cityTwo) ? "financial" : "quality"} signals.`;

  return {
    cityOneName: fullCityLabel(cityOne),
    cityTwoName: fullCityLabel(cityTwo),
    rows,
    wins,
    categoryTotals,
    summary,
    verdict: {
      financialAdvantage: categoryWinner("Economy"),
      lifestyleAdvantage: categoryWinner("Lifestyle"),
      environmentalAdvantage: categoryWinner("Environment"),
      recommendedMove,
      confidenceScore,
    },
  };
};

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
    <p className="eyebrow">{kicker}</p>
    <h2>{title}</h2>
    {body && <p>{body}</p>}
  </div>
);

const GlassCard = ({ children, className = "" }) => (
  <motion.div
    className={`glass-card ${className}`}
    whileHover={{ y: -3 }}
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

const InsightCard = ({ label, amount, winner }) => (
  <GlassCard className="insight-card">
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
    <div className="mt-4 text-3xl font-extrabold tracking-tight text-white">
      <AnimatedCounter value={amount} prefix="$" decimals={0} />
    </div>
    <p className="mt-3 text-sm font-semibold text-sky-200">{winner}</p>
  </GlassCard>
);

const ProgressComparison = ({ row, cityOneName, cityTwoName }) => {
  const max = Math.max(row.cityOneRaw, row.cityTwoRaw, 1);
  const cityOneWidth = Math.max(8, (row.cityOneRaw / max) * 100);
  const cityTwoWidth = Math.max(8, (row.cityTwoRaw / max) * 100);

  return (
    <div className="progress-comparison">
      <div className="flex items-center justify-between gap-4">
        <p className="text-base font-bold text-white">{row.label}</p>
        <span className="rounded-full border border-sky-300/15 px-3 py-1 text-xs font-bold text-sky-200">
          {row.winnerLabel}
        </span>
      </div>
      <div className="mt-5 space-y-4">
        <div>
          <div className="mb-2 flex justify-between text-xs font-semibold text-slate-400">
            <span>{cityOneName}</span>
            <span>{row.cityOne}</span>
          </div>
          <div className="progress-track">
            <motion.div
              className="progress-fill progress-a"
              initial={{ width: 0 }}
              whileInView={{ width: `${cityOneWidth}%` }}
              viewport={{ once: true }}
            />
          </div>
        </div>
        <div>
          <div className="mb-2 flex justify-between text-xs font-semibold text-slate-400">
            <span>{cityTwoName}</span>
            <span>{row.cityTwo}</span>
          </div>
          <div className="progress-track">
            <motion.div
              className="progress-fill progress-b"
              initial={{ width: 0 }}
              whileInView={{ width: `${cityTwoWidth}%` }}
              viewport={{ once: true }}
            />
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{row.verdict}</p>
    </div>
  );
};

const CategoryAnalysis = ({ title, rows, cityOneName, cityTwoName }) => (
  <GlassCard className="category-card">
    <h3>{title}</h3>
    <div className="mt-6 space-y-6">
      {rows.map((row) => (
        <ProgressComparison
          key={row.key}
          row={row}
          cityOneName={cityOneName}
          cityTwoName={cityTwoName}
        />
      ))}
    </div>
  </GlassCard>
);

const ComparisonTable = ({ data }) => {
  if (!data) return null;

  const { cityOneName, cityTwoName, rows, wins, summary, verdict } = decodeComparison(data);
  const insightRows = rows.filter((row) => row.insightLabel);

  const verdictColor = (winner) => {
    if (winner === "cityOne") return "text-emerald-300";
    if (winner === "cityTwo") return "text-sky-300";
    return "text-slate-300";
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

      <GlassCard className="verdict-card">
        <div>
          <p className="eyebrow">Recommended Move</p>
          <h3>{verdict.recommendedMove}</h3>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            The recommendation is based on relative wins across financial,
            lifestyle and environmental indicators.
          </p>
        </div>
        <div className="confidence-ring" aria-label={`Confidence score ${verdict.confidenceScore} percent`}>
          <div>
            <AnimatedCounter value={verdict.confidenceScore} suffix="%" />
            <span>Confidence Score</span>
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

      <div className="mt-10">
        <SectionHeader kicker="Insight Summary" title="Primary Cost Signals" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {insightRows.map((row) => (
            <InsightCard
              key={row.key}
              label={row.insightLabel}
              amount={row.deltaAmount}
              winner={row.winnerLabel}
            />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <SectionHeader kicker="Category Analysis" title="Decision Drivers" />
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {["Economy", "Lifestyle", "Environment"].map((group) => (
            <CategoryAnalysis
              key={group}
              title={group}
              rows={rows.filter((row) => row.group === group)}
              cityOneName={cityOneName}
              cityTwoName={cityTwoName}
            />
          ))}
        </div>
      </div>

      <details className="detail-breakdown mt-12">
        <summary>Detailed Breakdown</summary>
        <div className="hidden grid-cols-[1fr_1.05fr_1.05fr_1.5fr] gap-4 border-b border-sky-200/10 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 lg:grid">
          <span>Metric</span>
          <span>{cityOneName}</span>
          <span>{cityTwoName}</span>
          <span>Decision signal</span>
        </div>

        <div>
          {rows.map((row) => (
            <article
              key={row.key}
              className="metric-row grid gap-3 px-5 py-5 transition sm:px-7 lg:grid-cols-[1fr_1.05fr_1.05fr_1.5fr] lg:gap-4 lg:px-6"
            >
              <div>
                <p className="font-semibold text-white">{row.label}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  {row.group}
                </p>
              </div>
              <div className="rounded-lg bg-white/[0.035] px-4 py-3 lg:bg-transparent lg:p-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 lg:hidden">
                  {cityOneName}
                </p>
                <p className="mt-1 font-semibold text-slate-100 lg:mt-0">{row.cityOne}</p>
              </div>
              <div className="rounded-lg bg-white/[0.035] px-4 py-3 lg:bg-transparent lg:p-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 lg:hidden">
                  {cityTwoName}
                </p>
                <p className="mt-1 font-semibold text-slate-100 lg:mt-0">{row.cityTwo}</p>
              </div>
              <div className="rounded-lg border border-sky-200/10 bg-black/20 px-4 py-3 lg:border-0 lg:bg-transparent lg:p-0">
                <p className={`font-semibold ${verdictColor(row.winner)}`}>{row.verdict}</p>
              </div>
            </article>
          ))}
        </div>
      </details>
    </motion.section>
  );
};

export default ComparisonTable;
