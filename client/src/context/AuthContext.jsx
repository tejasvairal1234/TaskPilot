import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Sync user to sessionStorage whenever it changes
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("accessToken");
    }
  }, [user]);

  // On mount, attempt to restore session via refresh token
  useEffect(() => {
    const restoreSession = async () => {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        // Try to get a new access token from the refresh cookie
        try {
          const { data } = await authService.refresh();
          sessionStorage.setItem("accessToken", data.accessToken);
          const meRes = await authService.getMe();
          setUser(meRes.data.user);
        } catch {
          // No valid session — user needs to log in
          setUser(null);
        }
      } else {
        // Token exists — verify it by fetching /me
        try {
          const { data } = await authService.getMe();
          setUser(data.user);
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    };

    restoreSession();

    // Listen for forced logout from axios interceptor
    const handleForcedLogout = () => {
      setUser(null);
    };
    window.addEventListener("auth:logout", handleForcedLogout);
    return () => window.removeEventListener("auth:logout", handleForcedLogout);
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials);
    sessionStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await authService.register(formData);
    sessionStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore errors — clear state regardless
    }
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
