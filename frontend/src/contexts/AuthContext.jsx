import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

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
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authAPI.me();
      setUser(response.data.data);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });

      localStorage.setItem("accessToken", response.data.data.accessToken);
      setUser(response.data.data.user);
      setShouldRedirect(true); // Active la redirection

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);

      localStorage.setItem("accessToken", response.data.data.accessToken);
      setUser(response.data.data.user);
      setShouldRedirect(true); // Active la redirection

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
      localStorage.removeItem("accessToken");
      setUser(null);
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
