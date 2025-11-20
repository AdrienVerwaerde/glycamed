import { createContext, useContext, useState, useEffect } from "react";
import { consumptionAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const ConsumptionContext = createContext();

export function ConsumptionProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  const [consumptions, setConsumptions] = useState([]);
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getStartOfToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString();
  };

  // ---- FETCH TODAY CONSUMPTIONS ----
  const fetchTodayConsumptions = async () => {
    if (!user?.id) return;

    try {
      console.log("🔄 Fetching today's consumptions...");

      const response = await consumptionAPI.getTodayConsumptions();
      const fetchedData = response.data?.data;
      const fetchedConsumptions = fetchedData?.consumptions || [];

      console.log(`Found ${fetchedConsumptions.length} consumptions today`);
      setConsumptions(fetchedConsumptions);
    } catch (err) {
      console.error("Error fetching today's consumptions:", err);

      if (err.response?.status === 404 || err.response?.status === 204) {
        console.log("No consumptions found for today");
        setConsumptions([]);
        setError(null);
      } else {
        setError(err.response?.data?.error || err.message);
        setConsumptions([]);
      }
    }
  };

  const fetchAmedStats = async () => {
    try {
      const res = await consumptionAPI.getAmedTodayStats();
      setStats(res.data.data || null);
    } catch (err) {
      console.error("Error fetching global stats:", err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const { data } = await consumptionAPI.getLeaderboard();
      setLeaderboard(data.data || []);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };

  // ---- GLOBAL LOADER ----
  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      await Promise.all([
        fetchUserConsumptions(),
        fetchAmedStats(),
        fetchLeaderboard(),
      ]);
    } catch (err) {
      console.error("Global fetch error:", err);
      setError(err.message || "Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserConsumptions = fetchTodayConsumptions;

  // ---- EFFECT WHEN USER LOGIN / LOGOUT ----
  useEffect(() => {
    if (isAuthenticated && user) {
      loadAllData();
      const interval = setInterval(loadAllData, 100000);
      return () => clearInterval(interval);
    } else {
      setConsumptions([]);
      setStats(null);
      setLeaderboard([]);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // ---- INITIAL FETCH ----
  useEffect(() => {
    console.log("Fetching data...");
    fetchTodayConsumptions();
  }, []);

  // ---- DAY CHANGE DETECTOR ----
  useEffect(() => {
    const checkDayChange = () => {
      const lastCheck = localStorage.getItem("lastDayCheck");
      const today = getStartOfToday();

      if (lastCheck !== today) {
        console.log("Today is a new day! Refreshing consumptions...");
        localStorage.setItem("lastDayCheck", today);

        setConsumptions([]);
        fetchTodayConsumptions();
      }
    };

    const today = getStartOfToday();
    localStorage.setItem("lastDayCheck", today);

    const interval = setInterval(checkDayChange, 60000);
    return () => clearInterval(interval);
  }, []);

  // ---- ADD ----
  const addConsumption = async (consumptionData) => {
    if (!user?.id || !isAuthenticated) {
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

      console.log("⬆️ Sending to backend:", payload);

      const response = await consumptionAPI.create(payload);
      const newConsumption = response.data?.data || response.data;

      setConsumptions((prev) => [newConsumption, ...prev]);

      fetchAmedStats();
      fetchLeaderboard();

      try {
        await consumptionAPI.checkAlert();
      } catch (_) {}

      return newConsumption;
    } catch (err) {
      console.error("Error adding consumption:", err);
      throw new Error(err.response?.data?.error || err.message);
    }
  };

  // ---- UPDATE ----
  const updateConsumption = async (id, consumptionData) => {
    try {
      const { data } = await consumptionAPI.update(id, consumptionData);
      const updated = data.data;

      setConsumptions((prev) =>
        prev.map((c) => (c._id === id ? updated : c))
      );

      fetchAmedStats();
      fetchLeaderboard();

      return updated;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message);
    }
  };

  // ---- REMOVE ----
  const removeConsumption = async (id) => {
    try {
      await consumptionAPI.delete(id);
      setConsumptions((prev) => prev.filter((c) => c._id !== id));

      fetchAmedStats();
      fetchLeaderboard();

      try {
        await consumptionAPI.checkAlert();
      } catch (_) {}

      console.log("Consumption removed");
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

  const limits = {
    caffeine: 400,
    sugar: 50,
    calories: 2000,
  };

  return (
    <ConsumptionContext.Provider
      value={{
        consumptions,
        stats,
        leaderboard,
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
