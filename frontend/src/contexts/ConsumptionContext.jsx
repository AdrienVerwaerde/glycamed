// src/contexts/ConsumptionContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { consumptionAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const ConsumptionContext = createContext();

export function ConsumptionProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [consumptions, setConsumptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch consumptions on mount and when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchConsumptions();
    } else {
      setConsumptions([]);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchConsumptions = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data } = await consumptionAPI.getByUserId(user.id);
      setConsumptions(data.data || []);
    } catch (err) {
      console.error("Error fetching consumptions:", err);
      setError(err.response?.data?.error || err.message);
      setConsumptions([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const addConsumption = async (consumptionData) => {
    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    try {
      const payload = {
        product: consumptionData.product_name,
        quantity: consumptionData.quantity,
        location: consumptionData.location,
        userId: user.id,
        caffeine: consumptionData.nutriments?.caffeine_100g || 0,
        sugar: consumptionData.nutriments?.sugars_100g || 0,
        calories: consumptionData.nutriments?.["energy-kcal_100g"] || 0,
        notes: consumptionData.notes || "",
      };

      const { data } = await consumptionAPI.create(payload);
      const newConsumption = data.data;

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
      const { data } = await consumptionAPI.update(id, consumptionData);
      const updated = data.data;

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
    } catch (err) {
      console.error("Error removing consumption:", err);
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Calculate totals from current consumptions with safe defaults
  const totals = consumptions.reduce(
    (acc, curr) => ({
      sugar: acc.sugar + (curr.sugar || 0),
      calories: acc.calories + (curr.calories || 0),
      caffeine: acc.caffeine + (curr.caffeine || 0),
    }),
    { sugar: 0, calories: 0, caffeine: 0 } // Default values
  );

  return (
    <ConsumptionContext.Provider
      value={{
        consumptions,
        totals,
        loading,
        error,
        addConsumption,
        updateConsumption,
        removeConsumption,
        refreshConsumptions: fetchConsumptions,
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
