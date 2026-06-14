import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cx = 200;
const cy = 200;
const r = 130;

const dimensions = [
  { key: "affordability", label: "Affordability" },
  { key: "earning", label: "Income" },
  { key: "quality", label: "Quality of Life" },
  { key: "safety", label: "Safety" },
  { key: "healthcare", label: "Healthcare" },
  { key: "environment", label: "Clean Air" },
];

const angles = dimensions.map((_, i) => (i * Math.PI) / 3 - Math.PI / 2);

const normalizeData = (city) => {
  if (!city) return {};

  const rentVal = Number(city.rentMonthly ?? city.Average_Monthly_Rent_USD ?? 0);
  const foodVal = Number(city.foodCostIndex ?? city.mealCheap ?? city.Food_Cost_Index ?? 0);
  const transportVal = Number(city.groceriesMonthly ?? city.transportCostIndex ?? city.Transport_Cost_Index ?? 0);
  const internetVal = Number(city.transport ?? city.internetCostUsd ?? city.Internet_Cost_USD ?? 0);

  const rentScore = Math.max(0, 100 - (rentVal / 3000) * 100);
  const foodScore = Math.max(0, 100 - foodVal);
  const transportScore = Math.max(0, 100 - transportVal);
  const internetScore = Math.max(0, 100 - (internetVal / 150) * 100);
  const affordability = (rentScore + foodScore + transportScore + internetScore) / 4;

  const salaryVal = Number(city.averageMonthlySalary ?? city.Average_Monthly_Salary_USD ?? 0);
  const earning = Math.min(100, (salaryVal / 6000) * 100);

  const qolVal = Number(city.qualityOfLife ?? city.Quality_of_Life_Index ?? 0);
  const quality = Math.min(100, (qolVal / 200) * 100);

  const safety = Number(city.safetyIndex ?? city.Safety_Index ?? 0);
  const healthcare = Number(city.healthcareIndex ?? city.Healthcare_Index ?? 0);

  const pollutionVal = Number(city.pollutionIndex ?? city.Pollution_Index ?? 0);
  const environment = Math.max(0, 100 - pollutionVal);

  return {
    affordability: Math.round(affordability),
    earning: Math.round(earning),
    quality: Math.round(quality),
    safety: Math.round(safety),
    healthcare: Math.round(healthcare),
    environment: Math.round(environment),
    raw: {
      affordability: {
        rent: rentVal,
        food: foodVal,
        transport: transportVal,
        internet: internetVal,
      },
      earning: salaryVal,
      quality: qolVal,
      safety,
      healthcare,
      environment: pollutionVal,
    },
  };
};

const getLabelAnchor = (angle) => {
  const cos = Math.cos(angle);
  if (cos > 0.1) return "start";
  if (cos < -0.1) return "end";
  return "middle";
};

const getLabelDy = (angle) => {
  const sin = Math.sin(angle);
  if (sin > 0.5) return "1.2em";
  if (sin < -0.5) return "-0.5em";
  return "0.35em";
};

const getLabelDx = (angle) => {
  const cos = Math.cos(angle);
  if (Math.abs(cos) < 0.1) return 0;
  return cos > 0 ? "0.5em" : "-0.5em";
};

const formatValue = (key, rawVal) => {
  if (key === "affordability") {
    return `Rent: $${rawVal.rent.toFixed(0)}/mo | Food Cost: ${rawVal.food.toFixed(0)}`;
  }
  if (key === "earning") {
    return `$${rawVal.toLocaleString()}/mo`;
  }
  if (key === "quality" || key === "safety" || key === "healthcare") {
    return `${rawVal.toFixed(1)} / 100`;
  }
  if (key === "environment") {
    return `Pollution Index: ${rawVal.toFixed(1)} (Lower is better)`;
  }
  return String(rawVal);
};

export default function CityRadarChart({ data }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const cityOne = data?.cityOne;
  const cityTwo = data?.cityTwo;

  const scoreOne = useMemo(() => normalizeData(cityOne), [cityOne]);
  const scoreTwo = useMemo(() => normalizeData(cityTwo), [cityTwo]);

  if (!cityOne || !cityTwo) return null;

  const pointsOne = dimensions.map((dim, i) => {
    const val = scoreOne[dim.key] ?? 0;
    const dist = (val / 100) * r;
    return {
      x: cx + dist * Math.cos(angles[i]),
      y: cy + dist * Math.sin(angles[i]),
      val,
      raw: scoreOne.raw[dim.key],
    };
  });

  const pointsTwo = dimensions.map((dim, i) => {
    const val = scoreTwo[dim.key] ?? 0;
    const dist = (val / 100) * r;
    return {
      x: cx + dist * Math.cos(angles[i]),
      y: cy + dist * Math.sin(angles[i]),
      val,
      raw: scoreTwo.raw[dim.key],
    };
  });

  const gridPolygons = [0.2, 0.4, 0.6, 0.8, 1].map((scale) => {
    return angles
      .map((angle) => {
        const x = cx + r * scale * Math.cos(angle);
        const y = cy + r * scale * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(" ");
  });

  const pathOne = `${pointsOne.map((p) => `${p.x},${p.y}`).join(" L ")} Z`;
  const pathTwo = `${pointsTwo.map((p) => `${p.x},${p.y}`).join(" L ")} Z`;

  return (
    <div className="radar-container glass-card mt-6 flex flex-col items-center p-6 md:p-8">
      <div className="mb-4 text-center">
        <h3 className="text-base font-bold tracking-tight text-white sm:text-lg">
          Relocation Profiles
        </h3>
        <p className="text-xs text-slate-400">
          Comparing strengths across normalized indices (Higher is better)
        </p>
      </div>

      <div className="relative w-full max-w-[360px] sm:max-w-[400px]">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-auto overflow-visible"
          aria-label="City comparison radar chart"
        >
          <defs>
            <radialGradient id="skyGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.05)" />
              <stop offset="100%" stopColor="rgba(56, 189, 248, 0.2)" />
            </radialGradient>
            <radialGradient id="emeraldGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(52, 211, 153, 0.05)" />
              <stop offset="100%" stopColor="rgba(52, 211, 153, 0.2)" />
            </radialGradient>
          </defs>

          {/* Background Concentric Grid lines */}
          {gridPolygons.map((points, idx) => (
            <polygon
              key={idx}
              points={points}
              fill="none"
              stroke="rgba(255, 255, 255, 0.07)"
              strokeWidth="1"
            />
          ))}

          {/* Concentric grid percentage text labels */}
          {[20, 40, 60, 80, 100].map((val, idx) => {
            const scale = val / 100;
            return (
              <text
                key={idx}
                x={cx}
                y={cy - r * scale + 10}
                fill="rgba(255, 255, 255, 0.25)"
                fontSize="8"
                fontWeight="700"
                textAnchor="middle"
                className="pointer-events-none tabular"
              >
                {val}%
              </text>
            );
          })}

          {/* Axis lines and labels */}
          {angles.map((angle, idx) => {
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            const isHovered = hoveredIdx === idx;

            return (
              <g key={idx}>
                {/* Line from center to edge */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={x}
                  y2={y}
                  stroke={isHovered ? "rgba(99, 179, 237, 0.4)" : "rgba(255, 255, 255, 0.08)"}
                  strokeWidth={isHovered ? "1.5" : "1"}
                  strokeDasharray="2,2"
                />

                {/* Text Labels at the ends of axes */}
                <text
                  x={cx + (r + 14) * Math.cos(angle)}
                  y={cy + (r + 14) * Math.sin(angle)}
                  textAnchor={getLabelAnchor(angle)}
                  dy={getLabelDy(angle)}
                  dx={getLabelDx(angle)}
                  fill={isHovered ? "#93c5fd" : "rgba(255, 255, 255, 0.65)"}
                  fontSize="10"
                  fontWeight="800"
                  className="cursor-pointer select-none transition-colors duration-150"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {dimensions[idx].label}
                </text>
              </g>
            );
          })}

          {/* City One (Sky Blue) Polygon */}
          <motion.path
            d={`M ${pathOne}`}
            fill="url(#skyGrad)"
            stroke="rgb(56, 189, 248)"
            strokeWidth="2"
            strokeOpacity="0.85"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* City Two (Emerald Green) Polygon */}
          <motion.path
            d={`M ${pathTwo}`}
            fill="url(#emeraldGrad)"
            stroke="rgb(52, 211, 153)"
            strokeWidth="2"
            strokeOpacity="0.85"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Interactive nodes (circles) on each axis */}
          {angles.map((_, idx) => {
            const p1 = pointsOne[idx];
            const p2 = pointsTwo[idx];
            const isHovered = hoveredIdx === idx;

            return (
              <g key={idx}>
                {/* Node for City 1 */}
                <circle
                  cx={p1.x}
                  cy={p1.y}
                  r={isHovered ? "5" : "3.5"}
                  fill="rgb(56, 189, 248)"
                  stroke="rgba(8, 12, 18, 0.9)"
                  strokeWidth="1.5"
                  className="transition-all duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />

                {/* Node for City 2 */}
                <circle
                  cx={p2.x}
                  cy={p2.y}
                  r={isHovered ? "5" : "3.5"}
                  fill="rgb(52, 211, 153)"
                  stroke="rgba(8, 12, 18, 0.9)"
                  strokeWidth="1.5"
                  className="transition-all duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />

                {/* Invisible larger hover zone for easier selection */}
                <circle
                  cx={cx + r * 0.8 * Math.cos(angles[idx])}
                  cy={cy + r * 0.8 * Math.sin(angles[idx])}
                  r="28"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating HTML Tooltip overlay */}
        <AnimatePresence>
          {hoveredIdx !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="absolute left-1/2 top-1/2 z-10 w-64 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-xl border border-slate-700/80 bg-slate-900/90 p-4 text-xs shadow-2xl backdrop-blur-md"
            >
              <p className="font-extrabold uppercase tracking-widest text-blue-400 text-[10px] mb-2">
                {dimensions[hoveredIdx].label} Comparison
              </p>

              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between font-bold text-white mb-0.5">
                    <span className="truncate pr-2">{cityOne.City}</span>
                    <span className="text-sky-400">{pointsOne[hoveredIdx].val}%</span>
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    {formatValue(dimensions[hoveredIdx].key, pointsOne[hoveredIdx].raw)}
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-1.5">
                  <div className="flex items-center justify-between font-bold text-white mb-0.5">
                    <span className="truncate pr-2">{cityTwo.City}</span>
                    <span className="text-emerald-400">{pointsTwo[hoveredIdx].val}%</span>
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    {formatValue(dimensions[hoveredIdx].key, pointsTwo[hoveredIdx].raw)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs font-bold">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border border-sky-300/35 bg-sky-500/10" style={{ boxShadow: "0 0 10px rgba(56, 189, 248, 0.4)" }} />
          <span className="text-slate-200">{cityOne.City}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border border-emerald-300/35 bg-emerald-500/10" style={{ boxShadow: "0 0 10px rgba(52, 211, 153, 0.4)" }} />
          <span className="text-slate-200">{cityTwo.City}</span>
        </div>
      </div>
    </div>
  );
}
