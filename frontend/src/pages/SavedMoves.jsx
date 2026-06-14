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
  const [viewMode, setViewMode] = useState("grid");

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
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-[var(--border-subtle)] pb-5">
          <div className="section-header">
            <p className="eyebrow">Saved Comparison Dashboard</p>
            <h2>Saved Moves</h2>
            <p>Review your saved city pairs and reopen any full comparison in the engine.</p>
          </div>
          
          <div className="flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 p-1 self-start sm:self-auto backdrop-blur-md">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all border-0 cursor-pointer ${
                viewMode === "grid"
                  ? "bg-slate-800 text-white shadow"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
              title="Show as Grid"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all border-0 cursor-pointer ${
                viewMode === "table"
                  ? "bg-slate-800 text-white shadow"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
              title="Show as Table"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Table
            </button>
          </div>
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
          ) : viewMode === "grid" ? (
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
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/30 backdrop-blur-md shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] bg-slate-900/40">
                    <th className="py-4 px-5">Move (Origin vs Destination)</th>
                    <th className="py-4 px-5">Winner</th>
                    <th className="py-4 px-5">Confidence</th>
                    <th className="py-4 px-5">Scores (Orig vs Dest)</th>
                    <th className="py-4 px-5 text-center">Finance Adv.</th>
                    <th className="py-4 px-5 text-center">Lifestyle Adv.</th>
                    <th className="py-4 px-5 text-center">Environment Adv.</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs font-semibold text-slate-300">
                  {comparisons.map((item) => {
                    const title = `${item.analysis.cityOne.name} vs ${item.analysis.cityTwo.name}`;
                    const scoreOne = item.decoded.weightedScoreOne?.toFixed(1) ?? "N/A";
                    const scoreTwo = item.decoded.weightedScoreTwo?.toFixed(1) ?? "N/A";

                    return (
                      <tr
                        key={item.saved._id}
                        className="transition-colors duration-150 hover:bg-white/[0.015]"
                      >
                        <td className="py-4 px-5 font-bold text-white max-w-[12rem] truncate">
                          {title}
                        </td>
                        <td className="py-4 px-5">
                          <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                            {item.winner.name}
                          </span>
                        </td>
                        <td className="py-4 px-5 tabular font-bold text-blue-400">
                          {item.decoded.verdict.confidenceScore}%
                        </td>
                        <td className="py-4 px-5 tabular text-[var(--text-secondary)]">
                          <span className="text-white">{scoreOne}</span> vs{" "}
                          <span className="text-white">{scoreTwo}</span>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            item.decoded.verdict.financialAdvantage === "Balanced"
                              ? "bg-slate-800 text-slate-400"
                              : item.decoded.verdict.financialAdvantage === item.analysis.cityOne.name.toUpperCase()
                                ? "bg-sky-500/10 text-sky-400 border border-sky-500/15"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                          }`}>
                            {item.decoded.verdict.financialAdvantage === "Balanced" ? "Tie" : item.decoded.verdict.financialAdvantage}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            item.decoded.verdict.lifestyleAdvantage === "Balanced"
                              ? "bg-slate-800 text-slate-400"
                              : item.decoded.verdict.lifestyleAdvantage === item.analysis.cityOne.name.toUpperCase()
                                ? "bg-sky-500/10 text-sky-400 border border-sky-500/15"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                          }`}>
                            {item.decoded.verdict.lifestyleAdvantage === "Balanced" ? "Tie" : item.decoded.verdict.lifestyleAdvantage}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            item.decoded.verdict.environmentalAdvantage === "Balanced"
                              ? "bg-slate-800 text-slate-400"
                              : item.decoded.verdict.environmentalAdvantage === item.analysis.cityOne.name.toUpperCase()
                                ? "bg-sky-500/10 text-sky-400 border border-sky-500/15"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                          }`}>
                            {item.decoded.verdict.environmentalAdvantage === "Balanced" ? "Tie" : item.decoded.verdict.environmentalAdvantage}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => handleViewAnalysis(item.saved)}
                              className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline bg-transparent border-0 cursor-pointer focus:outline-none"
                            >
                              Open
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.saved._id)}
                              disabled={deletingId === item.saved._id}
                              className="text-xs font-bold text-red-400 hover:text-red-300 disabled:opacity-40 bg-transparent border-0 cursor-pointer focus:outline-none"
                              aria-label={`Delete ${title}`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
