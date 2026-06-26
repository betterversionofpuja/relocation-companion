import { useLocation } from "react-router-dom";
import "../styles/spaceBackground.css";
import ComparisonResult from "../components/ComparisonResult";

function ComparePage() {
  const { state } = useLocation();
  const comparison = state?.comparison;

  return (
  <div className="min-h-screen space-bg">
    {comparison ? (
      <ComparisonResult comparison={comparison} />
    ) : (
      <p className="text-white text-center pt-20">
        No comparison found.
      </p>
    )}
  </div>
);
}

export default ComparePage