const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  // ✅ Har error ko log karo
  logger.error(`${req.method} ${req.url} - ${err.message}`);

  // ✅ Google Gemini Errors
  if (err.message?.includes("API_KEY_INVALID")) {
    return res
      .status(401)
      .json({ success: false, message: "AI service authentication failed" });
  }

  if (err.message?.includes("429") || err.message?.includes("RATE_LIMIT")) {
    return res
      .status(429)
      .json({
        success: false,
        message: "Too many requests, please try again later",
      });
  }

  if (err.message?.includes("SAFETY")) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Content was blocked by AI safety filters",
      });
  }

  if (
    err.message?.includes("GoogleGenerativeAI") ||
    err.message?.includes("gemini")
  ) {
    return res
      .status(503)
      .json({ success: false, message: "AI service temporarily unavailable" });
  }

  // ✅ JWT Errors
  if (err.name === "JsonWebTokenError") {
    return res
      .status(401)
      .json({ success: false, message: "Invalid token, please login again" });
  }

  if (err.name === "TokenExpiredError") {
    return res
      .status(401)
      .json({ success: false, message: "Session expired, please login again" });
  }

  // ✅ MongoDB Errors
  if (err.name === "ValidationError") {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "Field";
    return res
      .status(400)
      .json({ success: false, message: `${field} already exists` });
  }

  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format" });
  }

  // ✅ Production vs Development
  if (process.env.NODE_ENV === "production") {
    return res.status(err.status || 500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }

  // Development — full details dikhao
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    stack: err.stack,
  });
};

module.exports = errorHandler;