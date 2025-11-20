import express from "express";
import {
  getAllConsumptions,
  getConsumptionById,
  getConsumptionsByUserId,
  createConsumption,
  updateConsumption,
  deleteConsumption,
  getUserConsumptionStats,
  getAmedTodayStats,
  checkAndCreateAlert,
  getLeaderboard,
  getLastNDaysConsumptions,
  getWeeklyConsumptions,
  getMonthlyConsumptions,
} from "../controllers/consumptionController";

const router = express.Router();

// Amed specific routes
router.route("/amed/today").get(getAmedTodayStats); 

// Alert checking route
router.post("/amed/check-alert", checkAndCreateAlert); 

// Base routes
router.route("/").get(getAllConsumptions).post(createConsumption);

// User-specific routes
router.route("/user/:userId").get(getConsumptionsByUserId);

router.route("/user/:userId/stats").get(getUserConsumptionStats);

// Single consumption routes
router
  .route("/:id")
  .get(getConsumptionById)
  .put(updateConsumption)
  .delete(deleteConsumption);

router.get("/leaderboard", getLeaderboard);

export default router;
