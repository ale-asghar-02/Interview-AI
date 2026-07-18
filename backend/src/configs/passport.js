const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const transporter = require("./nodemailor");
const logger = require("../utils/logger");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    logger.error(`Deserialize User Error: ${err.message}`);
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.emails || !profile.emails[0]) {
          return done(new Error("Email not provided by Google"), null);
        }

        const email = profile.emails[0].value.toLowerCase();

        let user = await userModel.findOne({ email });

        if (user) {
          return done(null, user);
        }

        user = await userModel.create({
          username: profile.displayName,
          email,
          password: await bcrypt.hash("GOOGLE_AUTH", 10),
          userImage: profile.photos[0]?.value,
        });

        transporter
          .sendMail({
            from: `"Interview AI" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Welcome to Interview AI! 🎉",
            html: `
            <h2>Welcome ${user.username}! 👋</h2>
            <p>Your account has been created successfully.</p>
            <p>Get ready for your next interview! 🚀</p>
            <p><b>Interview AI Team</b></p>
          `,
          })
          .catch((err) => {
            logger.error(`Welcome email failed: ${err.message}`);
          });

        logger.info(`New Google user created: ${email}`);
        return done(null, user);
      } catch (err) {
        logger.error(`Google Strategy Error: ${err.message}`);
        return done(err, null);
      }
    },
  ),
);

module.exports = passport;
