import { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "../api/authApi";
import { getSavedComparisons } from "../api/savedComparisonApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [savedComparisons, setSavedComparisons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();

        setUser(currentUser);

        const comparisons = await getSavedComparisons();
        setSavedComparisons(comparisons);
      } catch (error) {
        setUser(null);
        setSavedComparisons([]);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,

        savedComparisons,
        setSavedComparisons,

        loading,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}