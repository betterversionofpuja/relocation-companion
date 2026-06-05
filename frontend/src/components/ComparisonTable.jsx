const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatMoney = (value) => moneyFormatter.format(Number(value) || 0);
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
      a: cityOne.rentMonthly,
      b: cityTwo.rentMonthly,
      delta: diff.rentMonthly,
      lowerIsBetter: true,
      format: formatMoney,
      verdict: (winner, amount) => `${winner} saves ${formatMoney(amount)} on monthly rent`,
    },
    {
      key: "mealCheap",
      group: "Economy",
      label: "Food cost",
      a: cityOne.mealCheap,
      b: cityTwo.mealCheap,
      delta: diff.mealCheap,
      lowerIsBetter: true,
      format: formatMoney,
      verdict: (winner, amount) => `${winner} has food costs lower by ${formatMoney(amount)}`,
    },
    {
      key: "groceriesMonthly",
      group: "Economy",
      label: "Transport index",
      a: cityOne.groceriesMonthly,
      b: cityTwo.groceriesMonthly,
      delta: diff.groceriesMonthly,
      lowerIsBetter: true,
      format: formatMoney,
      verdict: (winner, amount) => `${winner} is cheaper on transport by ${formatMoney(amount)}`,
    },
    {
      key: "transport",
      group: "Economy",
      label: "Internet cost",
      a: cityOne.transport,
      b: cityTwo.transport,
      delta: diff.transport,
      lowerIsBetter: true,
      format: formatMoney,
      verdict: (winner, amount) => `${winner} wins internet cost by ${formatMoney(amount)}`,
    },
    {
      key: "averageMonthlySalary",
      group: "Economy",
      label: "Average monthly salary",
      a: cityOneSalary,
      b: cityTwoSalary,
      delta: diff.averageMonthlySalary,
      lowerIsBetter: false,
      format: formatMoney,
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
    const winnerName = winner === "cityOne" ? cityOneShort : cityTwoShort;
    const amount = Math.abs(Number(metric.delta ?? a - b));

    if (winner !== "tie") {
      wins[winner].total += 1;
      wins[winner][metric.group] += 1;
    }

    return {
      key: metric.key,
      group: metric.group,
      label: metric.label,
      cityOne: metric.format(a),
      cityTwo: metric.format(b),
      winner,
      verdict:
        winner === "tie"
          ? "Both cities are effectively tied on this signal"
          : metric.verdict(winnerName, amount),
    };
  });

  const betterTotal =
    wins.cityOne.total === wins.cityTwo.total
      ? "The comparison is balanced"
      : wins.cityOne.total > wins.cityTwo.total
        ? `${cityOneShort} wins more categories`
        : `${cityTwoShort} wins more categories`;

  const economyWinner =
    wins.cityOne.Economy === wins.cityTwo.Economy
      ? "costs are closely matched"
      : wins.cityOne.Economy > wins.cityTwo.Economy
        ? `${cityOneShort} is stronger for affordability`
        : `${cityTwoShort} is stronger for affordability`;

  const lifestyleWinner =
    wins.cityOne.Lifestyle === wins.cityTwo.Lifestyle
      ? "living standards are closely matched"
      : wins.cityOne.Lifestyle > wins.cityTwo.Lifestyle
        ? `${cityOneShort} is stronger for living standards`
        : `${cityTwoShort} is stronger for living standards`;

  return {
    cityOneName: fullCityLabel(cityOne),
    cityTwoName: fullCityLabel(cityTwo),
    rows,
    wins,
    summary: `${betterTotal}: ${economyWinner}, while ${lifestyleWinner}.`,
  };
};

const ComparisonTable = ({ data }) => {
  if (!data) return null;

  const { cityOneName, cityTwoName, rows, wins, summary } = decodeComparison(data);

  const verdictColor = (winner) => {
    if (winner === "cityOne") return "text-emerald-300";
    if (winner === "cityTwo") return "text-sky-300";
    return "text-slate-300";
  };

  return (
    <section className="glass-panel soft-glow mx-auto mt-8 w-full max-w-7xl overflow-hidden rounded-[2rem]">
      <div className="grid gap-6 border-b border-sky-200/10 p-5 sm:p-7 lg:grid-cols-[1.25fr_.75fr] lg:p-8">
        <div>
          <p className="mono text-xs uppercase tracking-[0.28em] text-sky-300/70">
            // System verdict: analysis complete
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
            {cityOneName} vs {cityTwoName}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            {summary}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl border border-emerald-300/15 bg-emerald-300/[0.06] p-4">
            <p className="mono text-xs uppercase tracking-[0.18em] text-emerald-200/70">
              {cityOneName}
            </p>
            <p className="mt-2 text-4xl font-extrabold text-white">{wins.cityOne.total}</p>
            <p className="text-sm text-slate-400">category wins</p>
          </div>
          <div className="rounded-3xl border border-sky-300/15 bg-sky-300/[0.06] p-4">
            <p className="mono text-xs uppercase tracking-[0.18em] text-sky-200/70">
              {cityTwoName}
            </p>
            <p className="mt-2 text-4xl font-extrabold text-white">{wins.cityTwo.total}</p>
            <p className="text-sm text-slate-400">category wins</p>
          </div>
        </div>
      </div>

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
              <p className="mono mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                {row.group}
              </p>
            </div>
            <div className="rounded-2xl bg-white/[0.035] px-4 py-3 lg:bg-transparent lg:p-0">
              <p className="mono text-xs uppercase tracking-[0.16em] text-slate-500 lg:hidden">
                {cityOneName}
              </p>
              <p className="mt-1 font-semibold text-slate-100 lg:mt-0">{row.cityOne}</p>
            </div>
            <div className="rounded-2xl bg-white/[0.035] px-4 py-3 lg:bg-transparent lg:p-0">
              <p className="mono text-xs uppercase tracking-[0.16em] text-slate-500 lg:hidden">
                {cityTwoName}
              </p>
              <p className="mt-1 font-semibold text-slate-100 lg:mt-0">{row.cityTwo}</p>
            </div>
            <div className="rounded-2xl border border-sky-200/10 bg-black/20 px-4 py-3 lg:border-0 lg:bg-transparent lg:p-0">
              <p className={`font-semibold ${verdictColor(row.winner)}`}>
                {row.verdict}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ComparisonTable;
