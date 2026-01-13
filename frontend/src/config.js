export const API_URL = process.env.REACT_APP_API_URL;

export const HEALTH_LIMITS = {
  SUGAR_MAX: 50, // grams
  CAFFEINE_MAX: 400, // mg
  CALORIES_MAX: 2000, // kcal
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  USER: "glycamed_user",
  LAST_DAY_CHECK: "lastDayCheck",
};

export const SENTRY = {
  DSN: process.env.REACT_APP_SENTRY_DSN,
};
