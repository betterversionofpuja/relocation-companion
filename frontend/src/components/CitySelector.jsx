import { useState } from "react";

const CitySelector = ({ cities, onCompare, loading }) => {
  const [city1, setCity1] = useState("");
  const [city2, setCity2] = useState("");

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
    <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl shadow-md w-full max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800">
        Compare Two Cities
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 w-full">

        {/* Dropdown 1 */}
        <select
          className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={city1}
          onChange={(e) => setCity1(e.target.value)}
        >
          <option value="">Select City 1</option>
          {cities.map((city) => (
            <option key={city._id} value={city.slug}>
              {city.name}, {city.country}
            </option>
          ))}
        </select>

        {/* VS divider */}
        <span className="self-center text-xl font-bold text-gray-400">
          VS
        </span>

        {/* Dropdown 2 */}
        <select
          className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={city2}
          onChange={(e) => setCity2(e.target.value)}
        >
          <option value="">Select City 2</option>
          {cities.map((city) => (
            <option key={city._id} value={city.slug}>
              {city.name}, {city.country}
            </option>
          ))}
        </select>

      </div>

      {/* Compare Button */}
      <button
        onClick={handleCompare}
        disabled={loading}
        className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {loading ? "Comparing..." : "Compare Cities"}
      </button>
    </div>
  );
};

export default CitySelector;