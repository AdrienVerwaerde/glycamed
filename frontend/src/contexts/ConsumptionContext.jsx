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
    if (!user?.id || !isAuthenticated) {
      setConsumptions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("📊 Fetching today's consumptions...");

      const { data } = await consumptionAPI.getTodayConsumptions();

      // ✅ Handle both empty and populated responses
      const fetchedConsumptions = data.data?.consumptions || [];

      console.log(`✅ Found ${fetchedConsumptions.length} consumptions today`);

      setConsumptions(fetchedConsumptions);
    } catch (err) {
      console.error("❌ Error fetching today's consumptions:", err);

      // ✅ Only set error for real errors (not 404 or empty data)
      if (err.response?.status === 404 || err.response?.status === 204) {
        console.log("ℹ️ No consumptions found for today");
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

  // Fetch consumptions on mount and when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchTodayConsumptions();
    } else {
      setConsumptions([]);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Check for day change every minute and refresh
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const checkDayChange = () => {
      const lastCheck = localStorage.getItem("lastDayCheck");
      const today = getStartOfToday();

      if (lastCheck !== today) {
        console.log("New day detected! Refreshing consumptions...");
        localStorage.setItem("lastDayCheck", today);

        // Refresh today's consumptions from API
        fetchTodayConsumptions();
      }
    };

    // Check immediately
    checkDayChange();

    // Check every minute for day change
    const interval = setInterval(checkDayChange, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const addConsumption = async (consumptionData) => {
    // Check if user is authenticated
    if (!user?.id) {
      throw new Error("Veuillez vous identifier pour poster");
    }

    try {
      const payload = {
        product: consumptionData.product_name,
        quantity: consumptionData.quantity,
        location: consumptionData.location,
        userId: user.id,
        caffeine: consumptionData.caffeine,
        sugar: consumptionData.sugar,
        calories: consumptionData.calories,
        notes: consumptionData.notes || "",
      };

      console.log("Sending to backend:", payload);

      const { data } = await consumptionAPI.create(payload);
      const newConsumption = data.data;

      // Add to current consumptions and refresh to get updated totals
      setConsumptions([newConsumption, ...consumptions]);

      // Optional: refresh from server to ensure sync
      // await fetchTodayConsumptions();

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
