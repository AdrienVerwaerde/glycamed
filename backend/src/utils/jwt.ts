import jwt, { Secret, SignOptions, JwtPayload } from "jsonwebtoken";

type BasePayload = {
  sub: string;
  email: string;
  role: string;
  tv?: number;
};

const ACCESS_SECRET: Secret = process.env.JWT_ACCESS_SECRET || "fallback_access_secret";
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret";

// Utiliser le type déjà exposé par SignOptions (qui pointe vers le type interne)
type Expires = SignOptions["expiresIn"];

// Les env vars sont des string, on les cast vers le type attendu
const ACCESS_EXPIRES = (process.env.JWT_ACCESS_EXPIRES ?? "15m") as unknown as Expires;
const REFRESH_EXPIRES = (process.env.JWT_REFRESH_EXPIRES ?? "7d") as unknown as Expires;

function signToken(payload: BasePayload, secret: Secret, expiresIn: Expires): string {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
}

export const signAccessToken = (payload: BasePayload) =>
  signToken(payload, ACCESS_SECRET, ACCESS_EXPIRES);

export const signRefreshToken = (payload: BasePayload) =>
  signToken(payload, REFRESH_SECRET, REFRESH_EXPIRES);

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, ACCESS_SECRET) as BasePayload & JwtPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, REFRESH_SECRET) as BasePayload & JwtPayload;