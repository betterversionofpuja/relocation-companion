export const formatMetricValue = (metric) => {
  const format = (value) => {
    switch (metric.type) {
      case "currency":
        return `$${Number(value).toLocaleString()}${metric.unit || ""}`;

      case "index":
        return `${Number(value).toFixed(2)}${metric.unit || ""}`;

      default:
        return Number(value).toFixed(2);
    }
  };

  return {
    cityOne: format(metric.cityOne),
    cityTwo: format(metric.cityTwo),
  };
};