import { useState } from "react";
import useCities from "../hooks/useCities";
import { fetchComparison } from "../api/cityApi";
import CitySelector from "../components/CitySelector";
import ComparisonTable from "../components/ComparisonTable";

const HomePage = () => {
  const { cities, loading: citiesLoading, error: citiesError } = useCities();
  const [comparisonData, setComparisonData] = useState(null);
  const [comparing, setComparing] = useState(false);
  const [compareError, setCompareError] = useState(null);

  const handleCompare = async (slug1, slug2) => {
    try {
      setComparing(true);
      setCompareError(null);
      const data = await fetchComparison(slug1, slug2);
      setComparisonData(data);
    } catch (err) {
      setCompareError("Comparison failed. Please try again.");
      console.error(err);
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          Relocation Companion
        </h1>
        <p className="text-gray-500 mt-2">
          Compare cost of living and quality of life between any two cities
        </p>
      </div>

      {/* Cities loading state */}
      {citiesLoading && (
        <p className="text-center text-gray-400">Loading cities...</p>
      )}

      {/* Cities error state */}
      {citiesError && (
        <p className="text-center text-red-500">{citiesError}</p>
      )}

      {/* Dropdowns — only show when cities are loaded */}
      {!citiesLoading && !citiesError && (
        <CitySelector
          cities={cities}
          onCompare={handleCompare}
          loading={comparing}
        />
      )}

      {/* Comparison error */}
      {compareError && (
        <p className="text-center text-red-500 mt-4">{compareError}</p>
      )}

      {/* Results table */}
      <ComparisonTable data={comparisonData} />

    </div>
  );
};

export default HomePage;