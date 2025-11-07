// src/services/consumptionApi.js
import api from "./api"; // Your configured axios instance

export const consumptionService = {
  // Create a new consumption
  async create(consumptionData) {
    const { data } = await api.post("/consumptions", consumptionData);
    return data.data;
  },

  // Get all consumptions for current user
  async getAll(filters = {}) {
    const { data } = await api.get("/consumptions", { params: filters });
    return data.data;
  },

  // Get consumption by ID
  async getById(id) {
    const { data } = await api.get(`/consumptions/${id}`);
    return data.data;
  },

  // Update consumption
  async update(id, consumptionData) {
    const { data } = await api.put(`/consumptions/${id}`, consumptionData);
    return data.data;
  },

  // Delete consumption
  async delete(id) {
    const { data } = await api.delete(`/consumptions/${id}`);
    return data.data;
  },

  // Get today's consumptions
  async getToday() {
    const today = new Date().toISOString().split("T")[0];
    const { data } = await api.get("/consumptions", {
      params: {
        startDate: today,
        endDate: today,
      },
    });
    return data.data;
  },

  // Get consumptions for a date range
  async getByDateRange(startDate, endDate) {
    const { data } = await api.get("/consumptions", {
      params: { startDate, endDate },
    });
    return data.data;
  },

  // Get statistics
  async getStats(startDate, endDate) {
    const { data } = await api.get("/consumptions/stats", {
      params: { startDate, endDate },
    });
    return data.data;
  },
};
