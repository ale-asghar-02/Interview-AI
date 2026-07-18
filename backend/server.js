require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const morgan = require("morgan");
const passport = require("./src/configs/passport");
const mongooseConnection = require("./src/configs/mongooseConnection");
const errorHandler = require("./src/middlewares/errorHandler");
const logger = require("./src/utils/logger");

mongooseConnection();

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60, // 14 days, in seconds
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days, in ms
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

//* Morgan — terminal success + error, file mein sirf errors
app.use(
  morgan(":method :url :status :response-time ms", {
    stream: {
      write: (message) => {
        const status = parseInt(message.split(" ")[2]);
        if (status >= 400) {
          logger.error(message.trim()); // errors file mein bhi
        } else {
          logger.info(message.trim()); // success sirf terminal
        }
      },
    },
  }),
);

//* Root Route (health check ke liye)
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Interview-AI API is running" });
});

//* Routes
app.use("/auth/user", require("./src/routes/authRoutes"));
app.use("/user", require("./src/routes/userRoutes"));
app.use("/ai/interview", require("./src/routes/interviewRoute"));

//* Global Error Handler
app.use(errorHandler);

//* Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

//* Safety Net
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});
