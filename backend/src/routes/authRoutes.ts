import express from "express";
import { login, register, refresh, logout, me, revokeAllUserRefreshTokens } from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// Routes protégées
router.get("/me", auth(), me);
router.post("/revoke/:id", auth(["admin"]), revokeAllUserRefreshTokens);

export default router;
