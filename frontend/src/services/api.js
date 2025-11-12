// src/services/api.js
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
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
  refresh: () => api.post("/auth/refresh"),
};

// Alert API calls
export const alertAPI = {
  getAll: () => api.get("/alerts"),
  getById: (id) => api.get(`/alerts/${id}`),
  getByType: (type) => api.get(`/alerts/type/${type}`),
  getStats: () => api.get("/alerts/stats"),
  getToday: () => api.get("/alerts/today"),
  getConsecutive: () => api.get("/alerts/consecutive"),
  getHistory: () => api.get("/alerts/history"),
  create: (data) => api.post("/alerts", data),
  update: (id, data) => api.put(`/alerts/${id}`, data),
  delete: (id) => api.delete(`/alerts/${id}`),
  deleteAll: () => api.delete("/alerts"),
};

// Consumption API calls
export const consumptionAPI = {
  // Get all consumptions
  getAll: () => api.get("/consumptions"),

  // Get consumptions by user ID
  getByUserId: (userId) => api.get(`/consumptions/user/${userId}`),

  // Get user's consumption statistics
  getUserStats: (userId) => api.get(`/consumptions/user/${userId}/stats`),

  // Get Amed's statistics for today
  getAmedTodayStats: () => api.get("/consumptions/amed/today"),

  // Check and create alert if needed
  checkAlert: () => api.post("/consumptions/amed/check-alert"), 

  // Create consumption
  create: (data) => api.post("/consumptions", data),

  // Update consumption
  update: (id, data) => api.put(`/consumptions/${id}`, data),

  // Delete consumption
  delete: (id) => api.delete(`/consumptions/${id}`),
};

// Products API calls
export const productsAPI = {
  // Search products via your backend (which calls OFF and caches)
  search: (query, page = 1, pageSize = 20) =>
    api.get("/products/search", {
      params: { q: query, page, pageSize },
    }),

  // Get product by barcode via your backend (cached)
  getByBarcode: (barcode) => api.get(`/products/barcode/${barcode}`),
};

// User API calls
export const userAPI = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  deactivate: (id) => api.put(`/users/${id}/deactivate`),
};

export default api;
