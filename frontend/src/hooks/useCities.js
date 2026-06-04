import { useState, useEffect } from "react";
import { fetchCityList } from "../api/cityApi";

const useCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const data = await fetchCityList();
        setCities(data);
      } catch (err) {
        setError("Failed to load cities. Is your backend running?");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, []); // empty array = runs once on mount only

  return { cities, loading, error };
};

export default useCities;