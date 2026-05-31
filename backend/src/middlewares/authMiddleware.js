const blacklistTokenModel = require('../models/blacklistTokenModel');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // ✅ Token check
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized, please login' });
    }

    // ✅ Blacklist check
    const blacklistToken = await blacklistTokenModel.findOne({ token });
    if (blacklistToken) {
      return res.status(401).json({ success: false, message: 'Session expired, please login again' });
    }

    // ✅ JWT verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (err) {
    // ✅ JWT specific errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired, please login again' });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token, please login again' });
    }

    logger.error(`Auth Middleware Error: ${err.message}`);
    next(err);
  }
};

module.exports = authMiddleware;