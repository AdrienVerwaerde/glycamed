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
} from "../controllers/consumptionController";

const router = express.Router();

// Base routes
router.route("/").get(getAllConsumptions).post(createConsumption);

// Today's consumptions
router.get("/today", getTodayConsumptions);
router.get("/last/:days", getLastNDaysConsumptions);
router.get("/weekly", getWeeklyConsumptions);
router.get("/monthly", getMonthlyConsumptions);

// User-specific routes
router.route("/user/:userId").get(getConsumptionsByUserId);

router.route("/user/:userId/stats").get(getUserConsumptionStats);

// Single consumption routes
router
  .route("/:id")
  .get(getConsumptionById)
  .put(updateConsumption)
  .delete(deleteConsumption);

export default router;
