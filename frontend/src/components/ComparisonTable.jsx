const ComparisonTable = ({ data }) => {
  if (!data) return null;

  const { cityOne, cityTwo, diff } = data;

  // Returns green if negative (city1 cheaper), red if positive (city1 expensive)
  const getDiffColor = (value) => {
    if (value < 0) return "text-green-600 font-semibold";
    if (value > 0) return "text-red-500 font-semibold";
    return "text-gray-500";
  };

  // Adds a + sign for positive diffs, keeps - for negative
  const formatDiff = (value) => {
    if (value > 0) return `+${value}`;
    return `${value}`;
  };

  const rows = [
    {
      label: "Monthly Rent (USD)",
      one: cityOne.rentMonthly,
      two: cityTwo.rentMonthly,
      diff: diff.rentMonthly,
    },
    {
      label: "Food Cost Index",
      one: cityOne.mealCheap,
      two: cityTwo.mealCheap,
      diff: diff.mealCheap,
    },
    {
      label: "Transport Cost Index",
      one: cityOne.groceriesMonthly,
      two: cityTwo.groceriesMonthly,
      diff: diff.groceriesMonthly,
    },
    {
      label: "Internet Cost (USD)",
      one: cityOne.transport,
      two: cityTwo.transport,
      diff: diff.transport,
    },
    {
      label: "Quality of Life",
      one: cityOne.qualityOfLife,
      two: cityTwo.qualityOfLife,
      diff: null, // quality scores don't need a diff
    },
    {
      label: "Safety Index",
      one: cityOne.safetyIndex,
      two: cityTwo.safetyIndex,
      diff: null,
    },
    {
      label: "Healthcare Index",
      one: cityOne.healthcareIndex,
      two: cityTwo.healthcareIndex,
      diff: null,
    },
    {
      label: "Pollution Index",
      one: cityOne.pollutionIndex,
      two: cityTwo.pollutionIndex,
      diff: null,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-white rounded-2xl shadow-md overflow-hidden">

      {/* City name header */}
      <div className="grid grid-cols-4 bg-blue-600 text-white text-center font-bold">
        <div className="p-4 text-left">Category</div>
        <div className="p-4">{cityOne.name}, {cityOne.country}</div>
        <div className="p-4">{cityTwo.name}, {cityTwo.country}</div>
        <div className="p-4">Difference</div>
      </div>

      {/* Data rows */}
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={`grid grid-cols-4 text-center border-b border-gray-100 ${
            index % 2 === 0 ? "bg-gray-50" : "bg-white"
          }`}
        >
          <div className="p-4 text-left text-gray-600 font-medium">
            {row.label}
          </div>
          <div className="p-4 text-gray-800">{row.one}</div>
          <div className="p-4 text-gray-800">{row.two}</div>
          <div className={`p-4 ${row.diff !== null ? getDiffColor(row.diff) : "text-gray-400"}`}>
            {row.diff !== null ? formatDiff(row.diff) : "—"}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="flex gap-6 p-4 bg-gray-50 text-sm text-gray-500">
        <span className="text-green-600 font-semibold">● Green = City 1 is cheaper</span>
        <span className="text-red-500 font-semibold">● Red = City 1 is more expensive</span>
      </div>

    </div>
  );
};

export default ComparisonTable;