import MetricCard from "./MetricCard";
function MetricSection({ title, metrics }) {
  return (
    <div className="bg-slate-950/80 border border-blue-500/15 rounded-3xl overflow-hidden">

      <div className="flex justify-between items-center px-5 py-4 border-b border-blue-500/10">

        <h3 className="text-xl font-bold text-white">
          {title}
        </h3>

        <span className="text-gray-500 text-sm">
          {metrics.length} metrics
        </span>

      </div>

      <div className="p-5 space-y-5">

        {metrics.map((metric) => (
          <MetricCard
            key={metric.name}
            metric={metric}
          />
        ))}

      </div>

    </div>
  );
}

export default MetricSection;