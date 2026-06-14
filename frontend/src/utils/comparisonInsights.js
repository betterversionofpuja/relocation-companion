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

export const formatMoney = (value) => preciseMoneyFormatter.format(Number(value) || 0);
export const formatCompactMoney = (value) => moneyFormatter.format(Number(value) || 0);
export const formatScore = (value) => Number(value || 0).toFixed(2);
export const cityDisplayName = (city) => (city ? `${city.name}, ${city.country}` : "");
export const normalizeCityName = (value) => String(value || "").trim().toLowerCase();

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

export const decodeComparison = ({ cityOne, cityTwo, diff }, weights = { economy: 33, lifestyle: 33, environment: 34 }) => {
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

  // --- Start custom scoring and normalization ---
  const calculateDimensionScores = (city) => {
    if (!city) return { economy: 0, lifestyle: 0, environment: 0 };
    const rent = Number(city.rentMonthly ?? city.Average_Monthly_Rent_USD ?? 0);
    const food = Number(city.foodCostIndex ?? city.mealCheap ?? city.Food_Cost_Index ?? 0);
    const transport = Number(city.groceriesMonthly ?? city.transportCostIndex ?? city.Transport_Cost_Index ?? 0);
    const internet = Number(city.transport ?? city.internetCostUsd ?? city.Internet_Cost_USD ?? 0);
    const salary = Number(city.averageMonthlySalary ?? city.Average_Monthly_Salary_USD ?? 0);
    const qol = Number(city.qualityOfLife ?? city.Quality_of_Life_Index ?? 0);
    const safety = Number(city.safetyIndex ?? city.Safety_Index ?? 0);
    const healthcare = Number(city.healthcareIndex ?? city.Healthcare_Index ?? 0);
    const pollution = Number(city.pollutionIndex ?? city.Pollution_Index ?? 0);

    const rentScore = Math.max(0, 100 - (rent / 3000) * 100);
    const foodScore = Math.max(0, 100 - food);
    const transportScore = Math.max(0, 100 - transport);
    const internetScore = Math.max(0, 100 - (internet / 150) * 100);
    const salaryScore = Math.min(100, (salary / 6000) * 100);

    const economyScore = (rentScore + foodScore + transportScore + internetScore + salaryScore) / 5;

    const qolScore = Math.min(100, (qol / 200) * 100);
    const safetyScore = safety;
    const healthcareScore = healthcare;

    const lifestyleScore = (qolScore + safetyScore + healthcareScore) / 3;

    const environmentScore = Math.max(0, 100 - pollution);

    return {
      economy: economyScore,
      lifestyle: lifestyleScore,
      environment: environmentScore,
    };
  };

  const scoresOne = calculateDimensionScores(cityOne);
  const scoresTwo = calculateDimensionScores(cityTwo);

  const weightedScoreOne = (scoresOne.economy * weights.economy + scoresOne.lifestyle * weights.lifestyle + scoresOne.environment * weights.environment) / 100;
  const weightedScoreTwo = (scoresTwo.economy * weights.economy + scoresTwo.lifestyle * weights.lifestyle + scoresTwo.environment * weights.environment) / 100;

  const scoreDiff = Math.abs(weightedScoreOne - weightedScoreTwo);

  const recommendedWinner =
    scoreDiff < 1.5
      ? "tie"
      : weightedScoreOne > weightedScoreTwo
        ? "cityOne"
        : "cityTwo";

  const recommendedMove =
    recommendedWinner === "tie"
      ? "Balanced move"
      : `Move to ${recommendedWinner === "cityOne" ? cityOne.name : cityTwo.name}`;

  const confidenceScore =
    recommendedWinner === "tie"
      ? 68
      : Math.min(99, Math.round(62 + (scoreDiff / 30) * 36));

  const getCategoryWinner = (score1, score2) => {
    if (Math.abs(score1 - score2) < 1.0) return "Balanced";
    return score1 > score2 ? cityOneShort : cityTwoShort;
  };

  const leadAdvantageName = () => {
    if (recommendedWinner === "tie") return "balanced";
    const wKey = recommendedWinner;
    const s1 = scoresOne;
    const s2 = scoresTwo;

    const econLead = s1.economy - s2.economy;
    const lifeLead = s1.lifestyle - s2.lifestyle;
    const envLead = s1.environment - s2.environment;

    const leads = [
      { name: "financial", val: wKey === "cityOne" ? econLead : -econLead },
      { name: "lifestyle", val: wKey === "cityOne" ? lifeLead : -lifeLead },
      { name: "environmental", val: wKey === "cityOne" ? envLead : -envLead },
    ];

    leads.sort((a, b) => b.val - a.val);
    return leads[0].name;
  };

  const summary =
    recommendedWinner === "tie"
      ? "The move is closely balanced based on your custom weight priorities. Consider adjusting your priorities or weightings to see how it shifts."
      : `${winnerName(recommendedWinner, cityOne, cityTwo)} leads your custom relocation profile with an overall score of ${recommendedWinner === "cityOne" ? weightedScoreOne.toFixed(1) : weightedScoreTwo.toFixed(1)} vs ${recommendedWinner === "cityOne" ? weightedScoreTwo.toFixed(1) : weightedScoreOne.toFixed(1)}, showing the strongest edge in ${leadAdvantageName()} factors.`;

  return {
    cityOneName: fullCityLabel(cityOne),
    cityTwoName: fullCityLabel(cityTwo),
    rows,
    wins,
    categoryTotals,
    summary,
    recommendedWinner,
    weightedScoreOne,
    weightedScoreTwo,
    verdict: {
      financialAdvantage: getCategoryWinner(scoresOne.economy, scoresTwo.economy),
      lifestyleAdvantage: getCategoryWinner(scoresOne.lifestyle, scoresTwo.lifestyle),
      environmentalAdvantage: getCategoryWinner(scoresOne.environment, scoresTwo.environment),
      recommendedMove,
      confidenceScore,
    },
  };
};

export const getWinningCityProfile = (analysis, decoded) => {
  const winnerKey = decoded.recommendedWinner === "cityTwo" ? "cityTwo" : "cityOne";
  const city = analysis[winnerKey];

  return {
    key: winnerKey,
    name: city.name,
    country: city.country,
    label: `${city.name}, ${city.country}`,
    salary: getSalaryValue(city),
    rent: Number(city.rentMonthly || 0),
    qualityOfLife: Number(city.qualityOfLife || 0),
    pollution: Number(city.pollutionIndex || 0),
  };
};

export const buildSavedComparisonSummary = (analysis, decoded) => {
  if (decoded.recommendedWinner === "tie") {
    return "This move is closely balanced. The best choice depends on your personal weighting between affordability, lifestyle, and environmental comfort.";
  }

  const winner = getWinningCityProfile(analysis, decoded);
  const positiveRows = decoded.rows
    .filter((row) => row.winner === winner.key)
    .sort((a, b) => b.deltaAmount - a.deltaAmount)
    .slice(0, 2);
  const tradeoffRows = decoded.rows
    .filter((row) => row.winner !== winner.key && row.winner !== "tie")
    .sort((a, b) => b.deltaAmount - a.deltaAmount)
    .slice(0, 2);

  const positiveText = positiveRows.map((row) => row.verdict.toLowerCase()).join(" and ");
  const tradeoffText = tradeoffRows.map((row) => row.verdict.toLowerCase()).join(" and ");

  return `${winner.name} leads overall because ${positiveText || "it wins more relocation signals"}. ${
    tradeoffText ? `The tradeoff: ${tradeoffText}.` : "There are few major opposing signals in this comparison."
  }`;
};
