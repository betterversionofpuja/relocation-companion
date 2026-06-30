import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import SaveComparisonButton from "./SaveComparisonButton";

function SaveComparisonCTA({ comparison }) {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return (
      <div className="mt-5 flex justify-center">
        <SaveComparisonButton comparison={comparison} />
      </div>
    );
  }

  return (
    <div className="mt-5 flex flex-col items-center">

      <button
        disabled
        className="
          flex items-center gap-2
          h-10 px-4
          rounded-lg
          border border-blue-500/15
          bg-blue-500/5
          text-gray-400
          text-sm font-medium
          cursor-not-allowed
        "
      >
        Save Comparison
      </button>

      <p className="mt-2 text-xs text-gray-500 text-center">
        <Link
          to="/register"
          className="text-blue-400 hover:text-blue-300 transition"
        >
          Sign up
        </Link>

        {" / "}

        <Link
          to="/login"
          className="text-blue-400 hover:text-blue-300 transition"
        >
          Log In
        </Link>

        {" "}to save comparisons.
      </p>

    </div>
  );
}

export default SaveComparisonCTA;