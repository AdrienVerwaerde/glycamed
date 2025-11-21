import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { auth } from "../middleware/auth";

const router = Router();

// Public route - No authentication needed for registration
router.post("/", createUser);

// Protected routes - Require authentication
router.get("/", auth(["admin"]), getAllUsers);
router.get("/:id", auth(), getUserById);
router.put("/:id", auth(), updateUser);
router.delete("/:id", auth(["admin"]), deleteUser);

export default router;
