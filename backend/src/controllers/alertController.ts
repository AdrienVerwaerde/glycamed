import { Request, Response } from "express";
import Alert, { IAlert, AlertType } from "../models/Alert";

// Helper function to validate alert type
const isValidAlertType = (type: string): type is AlertType => {
  return Object.values(AlertType).includes(type as AlertType);
};

// @desc    Create new alert
// @route   POST /api/alerts
// @access  Public
export const createAlert = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type } = req.body;

    // Validation
    if (!type) {
      res.status(400).json({
        success: false,
        error: "Please provide alert type",
      });
      return;
    }

    // Validate enum
    if (!isValidAlertType(type)) {
      res.status(400).json({
        success: false,
        error: `Invalid alert type. Must be one of: ${Object.values(
          AlertType
        ).join(", ")}`,
      });
      return;
    }

    const alert = await Alert.create({
      type,
    });

    res.status(201).json({
      success: true,
      data: alert,
    });
  } catch (error: any) {
    // Mongoose will also catch enum validation errors
    if (error.name === "ValidationError") {
      res.status(400).json({
        success: false,
        error: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

// @desc    Update alert
// @route   PUT /api/alerts/:id
// @access  Public
export const updateAlert = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    // Validation
    if (!type) {
      res.status(400).json({
        success: false,
        error: "Please provide alert type",
      });
      return;
    }

    // Validate enum
    if (!isValidAlertType(type)) {
      res.status(400).json({
        success: false,
        error: `Invalid alert type. Must be one of: ${Object.values(
          AlertType
        ).join(", ")}`,
      });
      return;
    }

    const alert = await Alert.findByIdAndUpdate(
      id,
      { type },
      {
        new: true,
        runValidators: true, // This will check enum validation
      }
    );

    if (!alert) {
      res.status(404).json({
        success: false,
        error: "Alert not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: alert,
    });
  } catch (error: any) {
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      res.status(400).json({
        success: false,
        error: "Invalid alert ID format",
      });
      return;
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      res.status(400).json({
        success: false,
        error: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Public
export const getAllAlerts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

// @desc    Get single alert by ID
// @route   GET /api/alerts/:id
// @access  Public
export const getAlertById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const alert = await Alert.findById(id);

    if (!alert) {
      res.status(404).json({
        success: false,
        error: "Alert not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: alert,
    });
  } catch (error: any) {
    if (error.name === "CastError") {
      res.status(400).json({
        success: false,
        error: "Invalid alert ID format",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

// @desc    Get alerts by type
// @route   GET /api/alerts/type/:type
// @access  Public
export const getAlertsByType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type } = req.params;

    // Validate enum
    if (!isValidAlertType(type)) {
      res.status(400).json({
        success: false,
        error: `Invalid alert type. Must be one of: ${Object.values(
          AlertType
        ).join(", ")}`,
      });
      return;
    }

    const alerts = await Alert.find({ type }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

// @desc    Delete alert
// @route   DELETE /api/alerts/:id
// @access  Public
export const deleteAlert = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const alert = await Alert.findByIdAndDelete(id);

    if (!alert) {
      res.status(404).json({
        success: false,
        error: "Alert not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {},
      message: "Alert deleted successfully",
    });
  } catch (error: any) {
    if (error.name === "CastError") {
      res.status(400).json({
        success: false,
        error: "Invalid alert ID format",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

// @desc    Delete all alerts
// @route   DELETE /api/alerts
// @access  Public
export const deleteAllAlerts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await Alert.deleteMany({});

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} alerts deleted successfully`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

// @desc    Get alert statistics
// @route   GET /api/alerts/stats
// @access  Public
export const getAlertStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats = await Alert.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          latestAlert: { $max: "$createdAt" },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const totalAlerts = await Alert.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalAlerts,
        byType: stats,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};
