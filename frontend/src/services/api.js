import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add access token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        localStorage.setItem("accessToken", data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Login
  login: (credentials) => api.post("/auth/login", credentials),

  // Register
  register: (userData) => api.post("/auth/register", userData),

  // Logout
  logout: () => api.post("/auth/logout"),

  // Get current user
  me: () => api.get("/auth/me"),

  // Refresh token
  refresh: () => api.post("/auth/refresh"),
};

// Alert API calls
export const alertAPI = {
  // Get all alerts
  getAll: () => api.get("/alerts"),

  // Get alert by ID
  getById: (id) => api.get(`/alerts/${id}`),

  // Get alerts by type
  getByType: (type) => api.get(`/alerts/type/${type}`),

  // Get alert statistics
  getStats: () => api.get("/alerts/stats"),

  // Create alert
  create: (data) => api.post("/alerts", data),

  // Update alert
  update: (id, data) => api.put(`/alerts/${id}`, data),

  // Delete alert
  delete: (id) => api.delete(`/alerts/${id}`),

  // Delete all alerts
  deleteAll: () => api.delete("/alerts"),
};

export default api;
