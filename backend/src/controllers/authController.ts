import { Request, Response } from "express";
import User from "../models/User";
import { loginSchema, registerSchema } from "../types/dtos/auth";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

const isProd = process.env.NODE_ENV === "production";

function setRefreshCookie(res: Response, token: string) {
  // Scope le cookie sur la route de refresh/logout pour limiter l’exposition
  res.cookie("rt", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    path: "/api/auth/refresh",
    maxAge: parseRefreshMaxAge(),
  });
  // Optionnel: un cookie clone pour logout sur la même path
  res.cookie("rt-logout", "1", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    path: "/api/auth/logout",
    maxAge: parseRefreshMaxAge(),
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie("rt", { path: "/api/auth/refresh" });
  res.clearCookie("rt-logout", { path: "/api/auth/logout" });
}

function parseRefreshMaxAge() {
  // basique: 7d
  return 7 * 24 * 60 * 60 * 1000;
}

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Informations erronées",
      details: parsed.error.flatten(),
    });
  }
  const { email, password, username, role } = parsed.data;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, error: "Email already in use" });
  }

  const user = await User.create({ email, password, username, role });

  const access = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    tv: user.tokenVersion,
  });
  const refresh = signRefreshToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    tv: user.tokenVersion,
  });

  setRefreshCookie(res, refresh);

  return res.status(201).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      accessToken: access,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Informations manquantes",
      details: parsed.error.flatten(),
    });
  }
  const { email, password } = parsed.data;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res
      .status(401)
      .json({ success: false, error: "Utilisateur inconnu" });
  }

  const ok = await user.comparePassword(password);
  if (!ok) {
    return res
      .status(401)
      .json({ success: false, error: "Mot de passe erroné" });
  }

  const access = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    tv: user.tokenVersion,
  });
  const refresh = signRefreshToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    tv: user.tokenVersion,
  });

  setRefreshCookie(res, refresh);

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      accessToken: access,
    },
  });
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies?.rt as string | undefined;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Missing refresh token" });
  }
  try {
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.sub);
    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid refresh token" });
    }
    // Vérifie la version
    if ((payload.tv ?? 0) !== user.tokenVersion) {
      return res
        .status(401)
        .json({ success: false, error: "Refresh token expired" });
    }

    // Rotation des tokens: on renvoie un nouveau refresh + access
    const newAccess = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      tv: user.tokenVersion,
    });
    const newRefresh = signRefreshToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      tv: user.tokenVersion,
    });

    setRefreshCookie(res, newRefresh);

    return res
      .status(200)
      .json({ success: true, data: { accessToken: newAccess } });
  } catch {
    return res
      .status(401)
      .json({ success: false, error: "Invalid refresh token" });
  }
};

export const logout = async (_req: Request, res: Response) => {
  clearRefreshCookie(res);
  return res.status(200).json({ success: true, message: "Logged out" });
};

// Optionnel: invalider tous les refresh tokens d’un user (ex: reset password)
export const revokeAllUserRefreshTokens = async (
  req: Request,
  res: Response
) => {
  const userId = req.params.id;
  await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
  return res
    .status(200)
    .json({ success: true, message: "All refresh tokens revoked" });
};

// Profil courant
export const me = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const doc = await User.findById(userId);
  if (!doc) {
    // L’utilisateur n’existe plus
    return res.status(404).json({ success: false, error: "User not found" });
  }

  const user = doc.toObject();
  return res.status(200).json({
    success: true,
    data: {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  });
};
