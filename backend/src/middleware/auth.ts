import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

export type AuthUser = { id: string; email: string; role: string; tv?: number };

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function auth(requiredRoles?: ("user" | "admin" | "amed")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "Missing token" });
    }
    const token = header.split(" ")[1];
    try {
      const payload = verifyAccessToken(token);
      const user: AuthUser = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        tv: payload.tv,
      };
      if (requiredRoles && !requiredRoles.includes(user.role as any)) {
        return res.status(403).json({ success: false, error: "Forbidden" });
      }
      req.user = user;
      next();
    } catch {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }
  };
}
