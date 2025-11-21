import express from "express";
import {
  getAllConsumptions,
  getConsumptionById,
  getConsumptionsByUserId,
  getTodayConsumptions,
  createConsumption,
  updateConsumption,
  deleteConsumption,
  getUserConsumptionStats,
  getLastNDaysConsumptions,
  getWeeklyConsumptions,
  getMonthlyConsumptions,
  getLeaderboard,
} from "../controllers/consumptionController";

const router = express.Router();

// Leaderboard route
router.get("/leaderboard", getLeaderboard);

// Base routes
router.route("/").get(getAllConsumptions).post(createConsumption);

// Reports
router.get("/today", getTodayConsumptions);
router.get("/last/:days", getLastNDaysConsumptions);
router.get("/weekly", getWeeklyConsumptions);
router.get("/monthly", getMonthlyConsumptions);

// User routes
router.get("/user/:userId", getConsumptionsByUserId);
router.get("/user/:userId/stats", getUserConsumptionStats);

// ⚠️ Toujours mettre :id EN TOUT DERNIER
router
  .route("/:id")
  .get(getConsumptionById)
  .put(updateConsumption)
  .delete(deleteConsumption);

export default router;