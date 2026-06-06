import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  getCurrentUser,
  loginUser as loginUserRequest,
  logoutUser as logoutUserRequest,
} from "../services/authService";

export const AuthContext = createContext(null);

const extractUser = (payload) => payload?.data?.user || payload?.data || null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await getCurrentUser();
      const nextUser = extractUser(payload);
      setUser(nextUser);
      return nextUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
      setAuthReady(true);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const payload = await loginUserRequest(credentials);
      const nextUser = extractUser(payload);
      setUser(nextUser);
      return payload;
    } finally {
      setLoading(false);
      setAuthReady(true);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutUserRequest();
    } finally {
      setUser(null);
      setLoading(false);
      setAuthReady(true);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const value = useMemo(
    () => ({
      user,
      loading,
      authReady,
      isAuthenticated: Boolean(user),
      login,
      logout,
      fetchCurrentUser,
      setUser,
    }),
    [authReady, fetchCurrentUser, loading, login, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
