import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCityList, fetchComparison } from "../api/cityApi";
import {
  deleteSavedComparison,
  fetchSavedComparisons,
} from "../api/savedComparisonApi";
import PageTransition from "../components/common/PageTransition";
import {
  cityDisplayName,
  decodeComparison,
  getWinningCityProfile,
  normalizeCityName,
} from "../utils/comparisonInsights";

const findCityByDisplayName = (cities, displayName) => {
  const target = normalizeCityName(displayName);
  return cities.find((city) => normalizeCityName(cityDisplayName(city)) === target);
};

const TrashIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M6 6l1 18h10l1-18" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const ArrowUpRightIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const sentenceCase = (value) => {
  const text = String(value || "").trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
};

const buildSavedComparisonBullets = (analysis, decoded) => {
  if (decoded.recommendedWinner === "tie") {
    return [
      "Balanced move across the strongest relocation signals.",
      "Tradeoff depends on affordability, lifestyle, and air quality priorities.",
    ];
  }

  const winner = getWinningCityProfile(analysis, decoded);
  const primaryReason = decoded.rows
    .filter((row) => row.winner === winner.key)
    .sort((a, b) => b.deltaAmount - a.deltaAmount)[0];
  const tradeoff = decoded.rows
    .filter((row) => row.winner !== winner.key && row.winner !== "tie")
    .sort((a, b) => b.deltaAmount - a.deltaAmount)[0];

  return [
    primaryReason
      ? sentenceCase(primaryReason.verdict.toLowerCase())
      : `${winner.name} wins more relocation signals overall.`,
    tradeoff
      ? sentenceCase(tradeoff.verdict.toLowerCase())
      : "Few major opposing signals from the losing city.",
  ];
};

const SavedMoveCard = ({ item, deleting, onViewAnalysis, onDelete }) => {
  const title = `${item.analysis.cityOne.name} vs ${item.analysis.cityTwo.name}`;
  const confidenceScore = item.decoded.verdict.confidenceScore;

  const handleCardKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onViewAnalysis(item.saved);
    }
  };

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`Open ${title} in comparison engine`}
      className="premium-card group relative flex min-h-[15rem] cursor-pointer flex-col justify-between overflow-hidden border-slate-800/80 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700/80 hover:bg-white/[0.025] focus:outline-none focus-visible:border-blue-400/50 focus-visible:ring-2 focus-visible:ring-blue-400/20 sm:p-6"
      onClick={() => onViewAnalysis(item.saved)}
      onKeyDown={handleCardKeyDown}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow">Saved Move</p>
            <h3 className="mt-3 text-lg font-bold leading-tight tracking-normal text-white sm:text-xl">
              {title}
            </h3>
          </div>

          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-500 transition-colors duration-200 group-hover:text-blue-400 group-focus-visible:text-blue-400">
            <ArrowUpRightIcon />
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex max-w-full items-center rounded-full border border-emerald-300/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
            <span className="truncate">Winner: {item.winner.label}</span>
          </span>
          <span className="inline-flex items-center rounded-full border border-blue-300/15 bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-400">
            {confidenceScore}% confidence
          </span>
        </div>

        <ul className="mt-5 space-y-2 text-xs leading-5 text-slate-400">
          {item.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="absolute bottom-4 right-4 grid h-9 w-9 translate-y-1 place-items-center rounded-lg text-slate-500 opacity-0 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 disabled:cursor-wait disabled:opacity-50"
        onClick={(event) => {
          event.stopPropagation();
          onDelete(item.saved._id);
        }}
        disabled={deleting}
        aria-label={`Delete ${title}`}
        title="Delete saved move"
      >
        <TrashIcon />
      </button>
    </article>
  );
};

const enrichSavedComparison = async (saved, cities) => {
  const origin = findCityByDisplayName(cities, saved.originCity);
  const destination = findCityByDisplayName(cities, saved.destinationCity);

  if (!origin || !destination) {
    return {
      saved,
      unavailable: true,
      error: "One or both cities are no longer available.",
    };
  }

  const analysis = await fetchComparison(origin.slug, destination.slug);
  const decoded = decodeComparison(analysis);

  return {
    saved,
    analysis,
    decoded,
    winner: getWinningCityProfile(analysis, decoded),
    bullets: buildSavedComparisonBullets(analysis, decoded),
  };
};

const SavedMoves = () => {
  const navigate = useNavigate();
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    Promise.resolve()
      .then(() => {
        if (!ignore) setLoading(true);
        return Promise.all([fetchSavedComparisons(), fetchCityList()]);
      })
      .then(async ([savedComparisons, cities]) => {
        const enrichedComparisons = await Promise.all(
          savedComparisons.map((saved) => enrichSavedComparison(saved, cities))
        );

        if (!ignore) {
          setComparisons(enrichedComparisons.filter((comparison) => !comparison.unavailable));
          setError("");
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error(err);
          setError("Saved moves could not be loaded. Please try again.");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleViewAnalysis = (savedComparison) => {
    navigate("/", {
      state: {
        savedComparison: {
          originCity: savedComparison.originCity,
          destinationCity: savedComparison.destinationCity,
        },
      },
    });
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteSavedComparison(id);
      setComparisons((current) => current.filter((comparison) => comparison.saved._id !== id));
    } catch (err) {
      console.error(err);
      setError("Saved move could not be deleted. Please try again.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <PageTransition className="saved-page">
      <section className="saved-moves content-shell">
        <div className="section-header">
          <p className="eyebrow">Saved Comparison Dashboard</p>
          <h2>Saved Moves</h2>
          <p>Review your saved city pairs and reopen any full comparison in the engine.</p>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="saved-moves-panel">
              <p className="saved-empty">Loading saved moves...</p>
            </div>
          ) : comparisons.length === 0 ? (
            <div className="saved-moves-panel">
              <p className="saved-empty">
                No saved moves yet. Start comparing cities to save your progress!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {comparisons.map((item) => (
                <SavedMoveCard
                  key={item.saved._id}
                  item={item}
                  deleting={deletingId === item.saved._id}
                  onViewAnalysis={handleViewAnalysis}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {error && (
        <div className="glass-panel mx-auto mt-5 max-w-2xl rounded-lg p-4 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-red-300">
            {error}
          </p>
        </div>
      )}
    </PageTransition>
  );
};

export default SavedMoves;
