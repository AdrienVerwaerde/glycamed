import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const { data } = await authAPI.me();
          setUser(data.data);
        } catch (error) {
          console.error("Failed to get user:", error);
          localStorage.removeItem("accessToken");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem("accessToken", response.data.data.accessToken);
      setUser(response.data.data.user);
      return response.data;
    } catch (error) {
      console.error("AuthContext: Login failed", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem("accessToken", response.data.data.accessToken);
      setUser(response.data.data.user);
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
