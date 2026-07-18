const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistTokenModel');
const logger = require('../utils/logger');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized, please login' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const blacklistToken = await blacklistTokenModel.findOne({ token });
    if (blacklistToken) {
      return res.status(401).json({ success: false, message: 'Session expired, please login again' });
    }

    req.user = decoded;
    next();

  } catch (err) {
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