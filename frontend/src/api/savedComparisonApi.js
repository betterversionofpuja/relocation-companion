import { api } from "./axios";

export const saveComparison = async (comparisonData) => {
  const response = await api.post(
    "/saved-comparisons",
    comparisonData
  );

  return response.data.data;
};

export const toggleSavedComparison = async (comparisonData) => {
  const response = await api.post(
    "/saved-comparisons/toggle",
    comparisonData
  );

  return response.data.data;
};

export const getSavedComparisons = async () => {
  const response = await api.get(
    "/saved-comparisons"
  );

  return response.data.data;
};

export const deleteSavedComparison = async (comparisonId) => {
  const response = await api.delete(
    `/saved-comparisons/${comparisonId}`
  );

  return response.data.data;
};