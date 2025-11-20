import { Request, Response } from "express";
import Consumption, { IConsumption } from "../models/Consumption";
import User from "../models/User";
import Alert, { AlertType } from "../models/Alert";

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
      productImage,
      quantity,
      location,
      userId,
      caffeine,
      sugar,
      calories,
      notes,
      createdAt,
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
      productImage: productImage || "",
      quantity,
      location,
      userId,
      caffeine: caffeine || 0,
      sugar: sugar || 0,
      calories: calories || 0,
      notes: notes || "",
      createdAt: createdAt || new Date(),
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

// @desc    Get today's consumptions for current user
// @route   GET /api/consumptions/today
// @access  Private
export const getTodayConsumptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const consumptions = await Consumption.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ createdAt: -1 });

    // Always return valid data, even if empty
    const totals =
      consumptions.length > 0
        ? consumptions.reduce(
            (acc, consumption) => ({
              caffeine: acc.caffeine + consumption.caffeine,
              sugar: acc.sugar + consumption.sugar,
              calories: acc.calories + consumption.calories,
            }),
            { caffeine: 0, sugar: 0, calories: 0 }
          )
        : { caffeine: 0, sugar: 0, calories: 0 }; // Default to zeros

    res.status(200).json({
      success: true,
      data: {
        consumptions, // Empty array if none
        totals, // Zeros if none
        count: consumptions.length,
      },
    });
  } catch (error: any) {
    console.error("Error fetching today's consumptions:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

export const getLastNDaysConsumptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const days = parseInt(req.params.days) || 3;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const consumptions = await Consumption.find({
      createdAt: { $gte: startDate },
    }).sort({ createdAt: -1 });

    const totals = consumptions.reduce(
      (acc, consumption) => ({
        caffeine: acc.caffeine + consumption.caffeine,
        sugar: acc.sugar + consumption.sugar,
        calories: acc.calories + consumption.calories,
      }),
      { caffeine: 0, sugar: 0, calories: 0 }
    );

    res.status(200).json({
      success: true,
      data: {
        consumptions,
        totals,
        count: consumptions.length,
        period: `last_${days}_days`,
      },
    });
  } catch (error: any) {
    console.error("Error fetching consumptions:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

export const getWeeklyConsumptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const consumptions = await Consumption.find({
      createdAt: { $gte: startOfWeek },
    }).sort({ createdAt: -1 });

    const totals = consumptions.reduce(
      (acc, consumption) => ({
        caffeine: acc.caffeine + consumption.caffeine,
        sugar: acc.sugar + consumption.sugar,
        calories: acc.calories + consumption.calories,
      }),
      { caffeine: 0, sugar: 0, calories: 0 }
    );

    res.status(200).json({
      success: true,
      data: {
        consumptions,
        totals,
        count: consumptions.length,
        period: "weekly",
      },
    });
  } catch (error: any) {
    console.error("Error fetching weekly consumptions:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

export const getMonthlyConsumptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const consumptions = await Consumption.find({
      createdAt: { $gte: startOfMonth },
    }).sort({ createdAt: -1 });

    const totals = consumptions.reduce(
      (acc, consumption) => ({
        caffeine: acc.caffeine + consumption.caffeine,
        sugar: acc.sugar + consumption.sugar,
        calories: acc.calories + consumption.calories,
      }),
      { caffeine: 0, sugar: 0, calories: 0 }
    );

    res.status(200).json({
      success: true,
      data: {
        consumptions,
        totals,
        count: consumptions.length,
        period: "monthly",
      },
    });
  } catch (error: any) {
    console.error("Error fetching monthly consumptions:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

// @desc    Get contributors leaderboard
// @route   GET /api/consumptions/leaderboard
// @access  Public

export const getLeaderboard = async (
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

    const allConsumptions = await Consumption.find({ userId: amedUser._id })

      .populate("userId", "username email")

      .sort({ createdAt: -1 });

    const contributorsMap = new Map();

    allConsumptions.forEach((consumption: any) => {
      const addedById = consumption.userId?._id?.toString();

      if (!addedById) return;

      if (!contributorsMap.has(addedById)) {
        contributorsMap.set(addedById, {
          userId: addedById,

          username: consumption.userId?.username || "Inconnu",

          totalContributions: 0,

          lastContribution: consumption.createdAt,

          contributions: [],
        });
      }

      const contributor = contributorsMap.get(addedById);

      contributor.totalContributions++;

      contributor.contributions.push(consumption.createdAt);
    });

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const firstMonthDay = new Date(today.getFullYear(), today.getMonth(), 1);

    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const contributors = Array.from(contributorsMap.values()).map(
      (contributor) => {
        // Top

        const monthlyContributions = contributor.contributions.filter(
          (date: Date) => date >= firstMonthDay && date < nextMonth
        ).length;

        // Streak

        const sortedDates = contributor.contributions

          .map((d: Date) => new Date(d).setHours(0, 0, 0, 0))

          .sort((a: number, b: number) => b - a);

        let streakDays = 0;

        let currentDate = today.getTime();

        for (const date of sortedDates) {
          if (date === currentDate) {
            streakDays++;

            currentDate -= 24 * 60 * 60 * 1000; // Jour précédent
          } else {
            break;
          }
        }

        const todayContributions = contributor.contributions.filter(
          (date: Date) =>
            new Date(date).setHours(0, 0, 0, 0) === today.getTime()
        );

        const isFirstToday =
          todayContributions.length > 0 &&
          todayContributions[0].getTime() ===
            Math.min(...todayContributions.map((d: Date) => d.getTime()));

        return {
          userId: contributor.userId,

          username: contributor.username,

          totalContributions: contributor.totalContributions,

          lastContribution: contributor.lastContribution,

          badges: {
            monthlyContributions,

            streakDays,

            isFirstToday,

            isTopMonthly: false,
          },
        };
      }
    );

    // Trier par nombre total de contributions

    contributors.sort((a, b) => b.totalContributions - a.totalContributions);

    // Identifier le top contributeur du mois

    if (contributors.length > 0) {
      const topMonthly = contributors.reduce((max, curr) =>
        curr.badges.monthlyContributions > max.badges.monthlyContributions
          ? curr
          : max
      );

      topMonthly.badges.isTopMonthly = true;
    }

    res.status(200).json({
      success: true,

      data: contributors,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      error: "Server Error",

      message: error.message,
    });
  }
};
