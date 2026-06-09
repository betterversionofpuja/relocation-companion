import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";
import {
  getCurrentUser,
  loginUser as loginUserRequest,
  logoutUser as logoutUserRequest,
} from "../services/authService";

const extractUser = (payload) => payload?.data?.user || payload?.data || null;
const authSessionKey = "relocation-companion-authenticated";

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
      if (nextUser) localStorage.setItem(authSessionKey, "true");
      return nextUser;
    } catch {
      setUser(null);
      localStorage.removeItem(authSessionKey);
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
      localStorage.setItem(authSessionKey, "true");
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
      localStorage.removeItem(authSessionKey);
      setLoading(false);
      setAuthReady(true);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem(authSessionKey)) {
      setLoading(false);
      setAuthReady(true);
      return;
    }

    Promise.resolve().then(fetchCurrentUser);
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
