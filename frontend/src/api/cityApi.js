import { api } from "./axios";

export const fetchCities = async () => {
  const response = await api.get("/cities");

  return response.data.data;
};

export const fetchComparison = async (cityOneSlug, cityTwoSlug) => {
  const response = await api.get("/cities/compare", {
    params: {
      city1: cityOneSlug,
      city2: cityTwoSlug,
    },
  });

  return response.data.data;
};