import React, { createContext, useContext, useState, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

// Rôles disponibles
export const ROLES = {
  CLIENT:      "client",
  FOURNISSEUR: "fournisseur",
  ADMIN:       "admin",
  LIVREUR:     "livreur",
};

const loadUser = () => {
  try {
    const raw = localStorage.getItem("sl_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]           = useState(loadUser);
  const [activeRole, setActiveRole] = useState(
    () => localStorage.getItem("sl_active_role") || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const saveSession = (userData, token, role) => {
    localStorage.setItem("sl_token", token);
    localStorage.setItem("sl_user", JSON.stringify(userData));
    localStorage.setItem("sl_active_role", role);
    setUser(userData);
    setActiveRole(role);
  };

  const clearSession = () => {
    localStorage.removeItem("sl_token");
    localStorage.removeItem("sl_user");
    localStorage.removeItem("sl_active_role");
    setUser(null);
    setActiveRole(null);
  };

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const defaultRole = data.user.roles.includes(ROLES.ADMIN)
        ? ROLES.ADMIN
        : data.user.roles[0];
      saveSession(data.user, data.token, defaultRole);
      return { success: true, role: defaultRole };
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur de connexion";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/register", payload);
      saveSession(data.user, data.token, ROLES.CLIENT);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur lors de l'inscription";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  // Basculer entre rôle client et fournisseur (si l'utilisateur a les deux)
  const switchRole = useCallback((role) => {
    if (!user?.roles?.includes(role)) return;
    localStorage.setItem("sl_active_role", role);
    setActiveRole(role);
  }, [user]);

  const hasRole = (role) => user?.roles?.includes(role) ?? false;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user, activeRole, loading, error,
      isAuthenticated, hasRole,
      login, register, logout, switchRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
};
