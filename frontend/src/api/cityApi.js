import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Fetches only name, country, slug — used to populate dropdowns
export const fetchCityList = async () => {
  const response = await apiClient.get("/cities");
  return response.data.data; // the actual array lives inside .data.data
};

// Fetches full comparison data for two cities by their slugs
export const fetchComparison = async (slug1, slug2) => {
  const response = await apiClient.get("/cities/compare", {
    params: {
      city1: slug1,
      city2: slug2,
    },
  });
  return response.data.data; // { cityOne, cityTwo, diff }
};