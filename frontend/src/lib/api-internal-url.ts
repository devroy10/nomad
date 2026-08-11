export const API_INTERNAL_URL =
  process.env.API_INTERNAL_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "http://api:3000");
