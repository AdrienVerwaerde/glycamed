import { Request, Response } from "express";
import Consumption, { IConsumption } from "../models/Consumption";
import User from "../models/User";

// @desc    Get all consumptions
// @route   GET /api/consumptions
// @access  Public
export const getAllConsumptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const consumptions = await Consumption.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: consumptions.length,
      data: consumptions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

// @desc    Get consumptions by user ID
// @route   GET /api/consumptions/user/:userId
// @access  Public
export const getConsumptionsByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    const consumptions = await Consumption.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: consumptions.length,
      data: consumptions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

// @desc    Get single consumption by ID
// @route   GET /api/consumptions/:id
// @access  Public
export const getConsumptionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const consumption = await Consumption.findById(req.params.id);

    if (!consumption) {
      res.status(404).json({
        success: false,
        error: "Consumption not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: consumption,
    });
  } catch (error: any) {
    if (error.kind === "ObjectId") {
      res.status(404).json({
        success: false,
        error: "Consumption not found",
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

// @desc    Create new consumption
// @route   POST /api/consumptions
// @access  Public
export const createConsumption = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      product,
      quantity,
      location,
      userId,
      caffeine,
      sugar,
      calories,
      notes,
    } = req.body;

    // Validation
    if (!product || !quantity || !location || !userId) {
      res.status(400).json({
        success: false,
        error: "Veuillez saisir tous les champs",
      });
      return;
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: "Utilisateur inconnu",
      });
      return;
    }

    // Validate numbers
    if (quantity <= 0) {
      res.status(400).json({
        success: false,
        error: "La quantité ne peut pas être 0 ou moins",
      });
      return;
    }

    if (caffeine < 0 || sugar < 0 || calories < 0) {
      res.status(400).json({
        success: false,
        error: "Caféine, sucre et calories doivent avoir une valeur positive",
      });
      return;
    }

    const consumption = await Consumption.create({
      product,
      quantity,
      location,
      userId,
      caffeine: caffeine || 0,
      sugar: sugar || 0,
      calories: calories || 0,
      notes: notes || "",
    });

    res.status(201).json({
      success: true,
      data: consumption,
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      res.status(400).json({
        success: false,
        error: messages,
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

// @desc    Update consumption
// @route   PUT /api/consumptions/:id
// @access  Public
export const updateConsumption = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { product, quantity, location, caffeine, sugar, calories, notes } =
      req.body;

    // Find consumption
    let consumption = await Consumption.findById(req.params.id);

    if (!consumption) {
      res.status(404).json({
        success: false,
        error: "Consumption not found",
      });
      return;
    }

    // Validate quantity if provided
    if (quantity !== undefined && quantity <= 0) {
      res.status(400).json({
        success: false,
        error: "Quantity must be greater than 0",
      });
      return;
    }

    // Validate nutritional values if provided
    if (
      (caffeine !== undefined && caffeine < 0) ||
      (sugar !== undefined && sugar < 0) ||
      (calories !== undefined && calories < 0)
    ) {
      res.status(400).json({
        success: false,
        error: "Caffeine, sugar, and calories cannot be negative",
      });
      return;
    }

    // Update fields
    const updateData: any = { updatedAt: new Date() };

    if (product !== undefined) updateData.product = product;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (location !== undefined) updateData.location = location;
    if (caffeine !== undefined) updateData.caffeine = caffeine;
    if (sugar !== undefined) updateData.sugar = sugar;
    if (calories !== undefined) updateData.calories = calories;
    if (notes !== undefined) updateData.notes = notes;

    consumption = await Consumption.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: consumption,
    });
  } catch (error: any) {
    if (error.kind === "ObjectId") {
      res.status(404).json({
        success: false,
        error: "Consumption not found",
      });
      return;
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      res.status(400).json({
        success: false,
        error: messages,
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

// @desc    Delete consumption
// @route   DELETE /api/consumptions/:id
// @access  Public
export const deleteConsumption = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const consumption = await Consumption.findById(req.params.id);

    if (!consumption) {
      res.status(404).json({
        success: false,
        error: "Consumption not found",
      });
      return;
    }

    await Consumption.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Consumption deleted successfully",
      data: {},
    });
  } catch (error: any) {
    if (error.kind === "ObjectId") {
      res.status(404).json({
        success: false,
        error: "Consumption not found",
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

// @desc    Get consumption statistics for a user
// @route   GET /api/consumptions/user/:userId/stats
// @access  Public
export const getUserConsumptionStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    const consumptions = await Consumption.find({ userId });

    if (consumptions.length === 0) {
      res.status(200).json({
        success: true,
        data: {
          totalConsumptions: 0,
          totalCaffeine: 0,
          totalSugar: 0,
          totalCalories: 0,
          averageCaffeine: 0,
          averageSugar: 0,
          averageCalories: 0,
        },
      });
      return;
    }

    const stats = consumptions.reduce(
      (acc, consumption) => {
        acc.totalCaffeine += consumption.caffeine;
        acc.totalSugar += consumption.sugar;
        acc.totalCalories += consumption.calories;
        return acc;
      },
      { totalCaffeine: 0, totalSugar: 0, totalCalories: 0 }
    );

    const totalConsumptions = consumptions.length;

    res.status(200).json({
      success: true,
      data: {
        totalConsumptions,
        totalCaffeine: stats.totalCaffeine,
        totalSugar: stats.totalSugar,
        totalCalories: stats.totalCalories,
        averageCaffeine: Math.round(stats.totalCaffeine / totalConsumptions),
        averageSugar: Math.round(stats.totalSugar / totalConsumptions),
        averageCalories: Math.round(stats.totalCalories / totalConsumptions),
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

// À AJOUTER à la fin de backend/src/controllers/consumptionController.ts

// @desc    Get Amed's consumption statistics for today
// @route   GET /api/consumptions/amed/today
// @access  Public
export const getAmedTodayStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const amedUser = await User.findOne({ role: "amed" });

    if (!amedUser) {
      res.status(404).json({
        success: false,
        error: "Utilisateur Amed non trouvé",
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const consumptions = await Consumption.find({
      userId: amedUser._id,
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    const totals = consumptions.reduce(
      (acc, consumption) => {
        acc.sugar += consumption.sugar || 0;
        acc.caffeine += consumption.caffeine || 0;
        acc.calories += consumption.calories || 0;
        return acc;
      },
      { sugar: 0, caffeine: 0, calories: 0 }
    );

    const uniqueContributors = new Set(
      consumptions.map((c: any) => c.userId?._id?.toString()).filter(Boolean)
    );

    const contributorsCount = consumptions.length;

    res.status(200).json({
      success: true,
      data: {
        totals,
        contributorsCount: uniqueContributors.size,
        consumptionsCount: consumptions.length,
        consumptions: consumptions.slice(0, 10),
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
