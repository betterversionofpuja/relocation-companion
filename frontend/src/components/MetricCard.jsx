import { formatMetricValue } from "../utils/formatMetricValue";

function MetricCard({ metric }) {
  const maxValue = Math.max(metric.cityOne, metric.cityTwo);

  const cityOneWidth = (metric.cityOne / maxValue) * 100;
  const cityTwoWidth = (metric.cityTwo / maxValue) * 100;
  const values = formatMetricValue(metric);
  
  return (
    <div className="bg-slate-950/70 border border-blue-500/10 rounded-3xl p-5">

      <h4 className="text-white font-semibold text-lg">
        {metric.name}
      </h4>

      <p className="mt-2 text-xs text-gray-500">
        Winner: {metric.winner}
      </p>

      <div className="mt-4 space-y-4">

        <div>

          <div className="flex justify-between items-center mb-2">

            <span className="text-gray-400 text-sm">
              {metric.cityOneName}
            </span>

            <span className="text-gray-100 text-sm font-medium">
              {values.cityOne}
            </span>

          </div>

          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

            <div
              className="h-full bg-cyan-400 rounded-full"
              style={{
                width: `${cityOneWidth}%`
              }}
            />

          </div>

        </div>

        <div>

          <div className="flex justify-between items-center mb-2">

            <span className="text-gray-400 text-sm">
              {metric.cityTwoName}
            </span>

            <span className="text-gray-100 text-sm font-medium">
              {values.cityTwo}
            </span>

          </div>

          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

            <div
              className="h-full bg-emerald-400 rounded-full"
              style={{
                width: `${cityTwoWidth}%`
              }}
            />

          </div>

        </div>

      </div>

      <div className="mt-4">

        <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-semibold">
          WINNER · {metric.winner}
        </span>

      </div>

    </div>
  );
}


export default MetricCard;