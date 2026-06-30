import SystemVerdict from "./SystemVerdict";
import MetricSection from "./MetricSection";
import {
  getEconomyMetrics,
  getLifestyleMetrics,
  getEnvironmentMetrics,
} from "../constants/metrics";
import SaveComparisonCTA from "./SaveComparisonCTA";

function ComparisonResult({ comparison }) {
  const economyMetrics = getEconomyMetrics(comparison);
  const lifestyleMetrics = getLifestyleMetrics(comparison);
  const environmentMetrics = getEnvironmentMetrics(comparison);

  return (
    <section className="max-w-5xl mx-auto px-6 mb-24">

      <SystemVerdict comparison={comparison} />
      <SaveComparisonCTA comparison={comparison} />
      
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-white mb-8">
          Decision Drivers
        </h2>

        <div className="grid lg:grid-cols-3 gap-6">

          <MetricSection
            title="Economy"
            metrics={economyMetrics}
          />

          <MetricSection
            title="Lifestyle"
            metrics={lifestyleMetrics}
          />

          <MetricSection
            title="Environment"
            metrics={environmentMetrics}
          />

        </div>
      </div>

    </section>
  );
}

export default ComparisonResult;