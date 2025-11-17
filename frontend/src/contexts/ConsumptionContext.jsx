// src/contexts/ConsumptionContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import { consumptionAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const ConsumptionContext = createContext();

export function ConsumptionProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [consumptions, setConsumptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if we need to refresh (new day)
  const getStartOfToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString();
  };

  // Fetch today's consumptions from API
  const fetchTodayConsumptions = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching today's consumptions...");

      const response = await consumptionAPI.getTodayConsumptions();
      const fetchedData = response.data?.data;
      const fetchedConsumptions = fetchedData?.consumptions || [];

      console.log(`Found ${fetchedConsumptions.length} consumptions today`);
      console.log("Response structure:", response.data);

      setConsumptions(fetchedConsumptions);
    } catch (err) {
      console.error("Error fetching today's consumptions:", err);

      // Only set error for real errors (not 404 or empty data)
      if (err.response?.status === 404 || err.response?.status === 204) {
        console.log("No consumptions found for today");
        setConsumptions([]);
        setError(null);
      } else {
        setError(err.response?.data?.error || err.message);
        setConsumptions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch consumptions on mount
  useEffect(() => {
    console.log("Fetching data...");
    fetchTodayConsumptions();
  }, []);

  useEffect(() => {
    /**
     * Checks if today is a new day (compared to the last time checked).
     * If so, refreshes today's consumptions from the API and clears the old ones.
     */
    const checkDayChange = () => {
      const lastCheck = localStorage.getItem("lastDayCheck");
      const today = getStartOfToday();

      if (lastCheck !== today) {
        console.log("Today is a new day! Refreshing consumptions...");
        localStorage.setItem("lastDayCheck", today);

        // Clear old consumptions immediately
        setConsumptions([]);

        // Refresh today's consumptions from API
        fetchTodayConsumptions();
      }
    };

    // Set initial check
    const today = getStartOfToday();
    localStorage.setItem("lastDayCheck", today);

    // Check every minute for day change
    const interval = setInterval(checkDayChange, 60000);

    return () => clearInterval(interval);
  }, []);

  const addConsumption = async (consumptionData) => {
    // Check if user is authenticated
    if (!user?.id || !isAuthenticated) {
      throw new Error("Veuillez vous identifier pour poster");
    }

    try {
      const payload = {
        product: consumptionData.product_name,
        productImage: consumptionData.product_image || "",
        quantity: consumptionData.quantity,
        location: consumptionData.location,
        userId: user.id,
        caffeine: consumptionData.caffeine,
        sugar: consumptionData.sugar,
        calories: consumptionData.calories,
        notes: consumptionData.notes || "",
      };

      console.log("⬆️ Sending to backend:", payload);

      const response = await consumptionAPI.create(payload);

      // Handle response structure properly
      const newConsumption = response.data?.data || response.data;

      console.log("Consumption added:", newConsumption);

      // Add to current consumptions at the beginning (most recent first)
      setConsumptions([newConsumption, ...consumptions]);

      return newConsumption;
    } catch (err) {
      console.error("Error adding consumption:", err);
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateConsumption = async (id, consumptionData) => {
    try {
      const response = await consumptionAPI.update(id, consumptionData);
      const updated = response.data?.data || response.data;

      setConsumptions(consumptions.map((c) => (c._id === id ? updated : c)));
      return updated;
    } catch (err) {
      console.error("Error updating consumption:", err);
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const removeConsumption = async (id) => {
    try {
      await consumptionAPI.delete(id);
      setConsumptions(consumptions.filter((c) => c._id !== id));
      console.log("Consumption removed");
    } catch (err) {
      console.error("Error removing consumption:", err);
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Calculate totals from today consumptions only
  const totals = consumptions.reduce(
    (acc, curr) => ({
      sugar: acc.sugar + (curr.sugar || 0),
      calories: acc.calories + (curr.calories || 0),
      caffeine: acc.caffeine + (curr.caffeine || 0),
    }),
    { sugar: 0, calories: 0, caffeine: 0 }
  );

  // Daily limits
  const limits = {
    caffeine: 400, // mg per day
    sugar: 50, // g per day
    calories: 2000, // kcal per day
  };

  return (
    <ConsumptionContext.Provider
      value={{
        consumptions,
        totals,
        limits,
        loading,
        error,
        addConsumption,
        updateConsumption,
        removeConsumption,
        count: consumptions.length,
        refreshConsumptions: fetchTodayConsumptions,
      }}
    >
      {children}
    </ConsumptionContext.Provider>
  );
}

export function useConsumption() {
  const context = useContext(ConsumptionContext);
  if (!context) {
    throw new Error("useConsumption must be used within ConsumptionProvider");
  }
  return context;
}
