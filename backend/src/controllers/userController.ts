import { Request, Response } from "express";
import User, { IUser } from "../models/User";

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Public
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    // Check if it's a MongoDB ObjectId error
    if (error.kind === "ObjectId") {
      res.status(404).json({
        success: false,
        error: "User not found",
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

// @desc    Create new user
// @route   POST /api/users
// @access  Public
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, username, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      res.status(400).json({
        success: false,
        error: "User with this email already exists",
      });
      return;
    }

    // Create user
    const user = await User.create({
      email,
      password,
      username,
      role,
    });

    // Remove password from response
    const userResponse = user.toObject() as { password?: string };
    delete userResponse.password;

    res.status(201).json({
      success: true,
      data: userResponse,
    });
  } catch (error: any) {
    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      res.status(400).json({
        success: false,
        error: "Informations requises",
        messages,
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

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, username, role } = req.body;

    // Build update object (only include provided fields)
    const updateData: any = {};
    if (email) updateData.email = email;
    if (username) updateData.username = username;
    if (role) updateData.role = role;
    // Check if trying to update email to an existing one
    if (email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.params.id },
      });

      if (existingUser) {
        res.status(400).json({
          success: false,
          error: "Email already in use",
        });
        return;
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true, // Return updated document
      runValidators: true, // Run model validators
    }).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    if (error.kind === "ObjectId") {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      res.status(400).json({
        success: false,
        error: "Informations manquantes",
        messages,
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

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: {},
    });
  } catch (error: any) {
    if (error.kind === "ObjectId") {
      res.status(404).json({
        success: false,
        error: "User not found",
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

// @desc    Soft delete user (set isActive to false)
// @route   PUT /api/users/:id/deactivate
// @access  Public
export const deactivateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};
