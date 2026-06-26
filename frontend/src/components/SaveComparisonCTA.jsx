import { Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function SaveComparisonCTA() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="mt-5 flex flex-col items-center">

      <button
        disabled={!isLoggedIn}
        className={`
          flex items-center gap-2
          h-10 px-4
          rounded-lg
          text-sm font-medium
          transition-all
          ${
            isLoggedIn
              ? "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
              : "border border-blue-500/15 bg-blue-500/5 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        <Bookmark size={15} />

        <span>
          Save Comparison
        </span>
      </button>

      {!isLoggedIn && (
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
      )}

    </div>
  );
}

export default SaveComparisonCTA;