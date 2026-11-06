const crypto = require("crypto");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const transporter = require("./nodemailor");
const logger = require("../utils/logger");
const { welcomeEmail } = require("../utils/emailTemplates");

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

        // Random password: koi isse form se login nahi kar sakta
        const randomPassword = crypto.randomBytes(32).toString("hex");

        user = await userModel.create({
          username: profile.displayName,
          email,
          password: await bcrypt.hash(randomPassword, 10),
          userImage: profile.photos?.[0]?.value,
        });

        // Non-blocking — email fail hone se signup fail nahi hona chahiye
        const welcome = welcomeEmail(user.username);
        transporter
          .sendMail({
            from: `"Interview AI" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: welcome.subject,
            html: welcome.html,
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