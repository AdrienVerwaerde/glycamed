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
} from "../controllers/alertController";

const router = express.Router();

// Statistics route
router.get("/stats", getAlertStats);

// Get alerts by type
router.get("/type/:type", getAlertsByType);

// CRUD routes
router.route("/").get(getAllAlerts).post(createAlert).delete(deleteAllAlerts); // Delete all alerts

router.route("/:id").get(getAlertById).put(updateAlert).delete(deleteAlert); // Delete specific alert

export default router;
