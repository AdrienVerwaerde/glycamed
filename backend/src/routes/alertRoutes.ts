import express from "express";
import {
  getAllAlerts,
  getAlertById,
  getAlertsByType,
  createAlert,
  updateAlert,
  deleteAlert,
  deleteAllAlerts,
  getAlertStats,
  getTodayAlert,
  getConsecutiveAlertDays,
  getAlertHistory,
} from "../controllers/alertController";

const router = express.Router();

// Statistics route
router.get("/stats", getAlertStats);

// Today's alert route
router.get("/today", getTodayAlert);

// Consecutive alert days route
router.get("/consecutive", getConsecutiveAlertDays);

// Alert history route
router.get("/history", getAlertHistory);

// Get alerts by type
router.get("/type/:type", getAlertsByType);

// CRUD routes
router.route("/").get(getAllAlerts).post(createAlert).delete(deleteAllAlerts); // Delete all alerts

router.route("/:id").get(getAlertById).put(updateAlert).delete(deleteAlert); // Delete specific alert

export default router;
