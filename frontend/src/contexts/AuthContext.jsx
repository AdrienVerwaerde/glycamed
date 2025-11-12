import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in on mount
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const { data } = await authAPI.me();
          setUser(data.data);
          if (data.data.role === "amed" && location.pathname === "/") {
            navigate("/amed", { replace: true });
          }
        } catch (error) {
          console.error("Failed to get user:", error);
          localStorage.removeItem("accessToken");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [navigate, location.pathname]);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem("accessToken", response.data.data.accessToken);
      setUser(response.data.data.user);
      if (response.data.data.user.role === "amed") {
        navigate("/amed", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
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
      if (response.data.data.user.role === "amed") {
        navigate("/amed", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
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
      navigate("/login", { replace: true }); 
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
