import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { STORAGE_KEYS } from "../config";
import * as Sentry from "@sentry/react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(null);
  const navigate = useNavigate();

  // useEffect qui gère la redirection après mise à jour du user
  useEffect(() => {
    if (shouldRedirect && user) {
      if (user.role === "amed") {
        navigate("/amed", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
      setShouldRedirect(null); // Reset
    }
  }, [user, shouldRedirect, navigate]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authAPI.me();
      setUser(response.data.data);

      // Sentry User
      Sentry.setUser({
        id: response.data.data.id,
        email: response.data.data.email,
        username: response.data.data.username,
      });

    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      Sentry.setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.data.accessToken);
      setUser(response.data.data.user);
      setShouldRedirect(true); // Active la redirection

      // Sentry User
      Sentry.setUser({
        id: response.data.data.user.id,
        email: response.data.data.user.email,
        username: response.data.data.user.username,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.data.accessToken);
      setUser(response.data.data.user);
      setShouldRedirect(true); // Active la redirection

      // Sentry User
      Sentry.setUser({
        id: response.data.data.user.id,
        email: response.data.data.user.email,
        username: response.data.data.user.username,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      setUser(null);
      Sentry.setUser(null);
      navigate("/login");
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
