import { createContext, useContext, useState, useEffect } from "react";
import { consumptionAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const ConsumptionContext = createContext();

export function ConsumptionProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  const [consumptions, setConsumptions] = useState([]);
  const [stats, setStats] = useState(null); // ← NEW
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadAllData();
      const interval = setInterval(loadAllData, 30000); // refresh every 30s
      return () => clearInterval(interval);
    } else {
      setConsumptions([]);
      setStats(null);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      await Promise.all([fetchUserConsumptions(), fetchAmedStats()]);

    } catch (err) {
      console.error("Global fetch error:", err);
      setError(err.message || "Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserConsumptions = async () => {
    if (!user?.id) return;

    try {
      const { data } = await consumptionAPI.getByUserId(user.id);
      setConsumptions(data.data || []);
    } catch (err) {
      console.error("Error fetching consumptions:", err);
      setError(err.response?.data?.error || err.message);
      setConsumptions([]);
    }
  };

  const fetchAmedStats = async () => {
    try {
      const res = await consumptionAPI.getAmedTodayStats();
      setStats(res.data.data || null);
    } catch (err) {
      console.error("Error fetching global stats:", err);
      // on n'efface pas les anciennes stats si le backend fail	  
    }
  };

  const addConsumption = async (consumptionData) => {
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

      const { data } = await consumptionAPI.create(payload);
      const newConsumption = data.data;

      setConsumptions((prev) => [newConsumption, ...prev]);

      // refresh global stats (AmedPage)
      fetchAmedStats();

      // optional alert check
      try {
        await consumptionAPI.checkAlert();
      } catch (_) {}

      return newConsumption;
    } catch (err) {
      console.error("Error adding consumption:", err);
      throw new Error(err.response?.data?.error || err.message);
    }
  };

  const updateConsumption = async (id, consumptionData) => {
    try {
      const { data } = await consumptionAPI.update(id, consumptionData);
      const updated = data.data;

      setConsumptions((prev) =>
        prev.map((c) => (c._id === id ? updated : c))
      );

      fetchAmedStats();

      return updated;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message);
    }
  };

  const removeConsumption = async (id) => {
    try {
      await consumptionAPI.delete(id);
      setConsumptions((prev) => prev.filter((c) => c._id !== id));

      fetchAmedStats();

      try {
        await consumptionAPI.checkAlert();
      } catch (_) {}

    } catch (err) {
      throw new Error(err.response?.data?.error || err.message);
    }
  };

  const totals = consumptions.reduce(
    (acc, curr) => ({
      sugar: acc.sugar + (curr.sugar || 0),
      calories: acc.calories + (curr.calories || 0),
      caffeine: acc.caffeine + (curr.caffeine || 0),
    }),
    { sugar: 0, calories: 0, caffeine: 0 }
  );


  return (
    <ConsumptionContext.Provider
      value={{
        consumptions,
        stats,
        totals,
        loading,
        error,

        addConsumption,
        updateConsumption,
        removeConsumption,

        refreshConsumptions: loadAllData,
      }}
    >
      {children}
    </ConsumptionContext.Provider>
  );
}

export function useConsumption() {
  const ctx = useContext(ConsumptionContext);
  if (!ctx) throw new Error("useConsumption must be used within a provider");
  return ctx;
}