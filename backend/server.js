require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('./src/configs/passport');
const mongooseConnection = require('./src/configs/mongooseConnection');
const errorHandler = require('./src/middlewares/errorHandler');
const logger = require('./src/utils/logger');

mongooseConnection();

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

//* Morgan — terminal success + error, file mein sirf errors
app.use(morgan(':method :url :status :response-time ms', {
  stream: {
    write: (message) => {
      const status = parseInt(message.split(' ')[2]);
      if (status >= 400) {
        logger.error(message.trim()); // errors file mein bhi
      } else {
        logger.info(message.trim()); // success sirf terminal
      }
    }
  }
}));

//* Routes
app.use('/auth/user', require('./src/routes/authRoutes'));
app.use('/user', require('./src/routes/userRoutes'));
app.use('/ai/interview', require('./src/routes/interviewRoute'));

//* Global Error Handler
app.use(errorHandler);

//* Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

//* Safety Net
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});