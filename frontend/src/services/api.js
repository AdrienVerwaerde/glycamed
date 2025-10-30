import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
