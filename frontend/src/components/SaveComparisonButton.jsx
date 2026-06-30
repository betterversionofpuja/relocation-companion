import { useEffect, useState } from "react";
import { Bookmark, Check } from "lucide-react";

import {
  toggleSavedComparison,
  getSavedComparisons,
} from "../api/savedComparisonApi";

function SaveComparisonButton({ comparison }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const comparisons = await getSavedComparisons();

        const alreadySaved = comparisons.some(
          (item) =>
            item.cityOneSlug === comparison.cityOne.slug &&
            item.cityTwoSlug === comparison.cityTwo.slug
        );

        setSaved(alreadySaved);
      } finally {
        setChecking(false);
      }
    };

    checkIfSaved();
  }, [comparison]);

  const handleToggle = async () => {
    try {
      setLoading(true);

      const response = await toggleSavedComparison({
        cityOneSlug: comparison.cityOne.slug,
        cityTwoSlug: comparison.cityTwo.slug,
      });

      setSaved(response.saved);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return null;
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="
        flex items-center gap-2
        h-10 px-4
        rounded-lg
        bg-blue-600
        hover:bg-blue-500
        text-white
        text-sm
        font-medium
        transition
        disabled:opacity-70
      "
    >
      {saved ? (
        <>
          <Check size={15} />
          {loading ? "Updating..." : "Saved"}
        </>
      ) : (
        <>
          <Bookmark size={15} />
          {loading ? "Updating..." : "Save Comparison"}
        </>
      )}
    </button>
  );
}

export default SaveComparisonButton;