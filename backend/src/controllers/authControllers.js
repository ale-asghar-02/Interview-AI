const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userModel = require('../models/userModel');
const blacklistTokenModel = require('../models/blacklistTokenModel');
const { getTransporter } = require('../configs/nodemailor');
const logger = require('../utils/logger');

const UserAuthRegister = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const normalizedEmail = email.toLowerCase();

    const isUserAlreadyExist = await userModel.findOne({ email: normalizedEmail });
    if (isUserAlreadyExist) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Non-blocking — agar email fail ho, registration fail nahi honi chahiye
    getTransporter()
      .then((transporter) =>
        transporter.sendMail({
          from: `"Interview AI" <${process.env.EMAIL_USER}>`,
          to: normalizedEmail,
          subject: 'Welcome to Interview AI! 🎉',
          html: `
            <h2>Welcome ${username}! 👋</h2>
            <p>Your account has been created successfully.</p>
            <p>Get ready for your next interview! 🚀</p>
            <p><b>Interview AI</b></p>
          `,
        })
      )
      .catch((err) => {
        logger.error(`Welcome email failed for ${normalizedEmail}: ${err.message}`);
      });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    logger.error(`Register Error: ${err.message}`);
    next(err);
  }
};

const UserAuthLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const normalizedEmail = email.toLowerCase();

    const user = await userModel.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        userImage: user.userImage,
        linkedlnURL: user.linkedlnURL,
        GithubURL: user.GithubURL,
      },
    });
  } catch (err) {
    logger.error(`Login Error: ${err.message}`);
    next(err);
  }
};

const UserAuthLogout = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      await blacklistTokenModel.create({ token });
    }

    res.clearCookie('token');

    res.status(200).json({ success: true, message: 'User logged out successfully' });
  } catch (err) {
    logger.error(`Logout Error: ${err.message}`);
    next(err);
  }
};

const UserForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Raw token user ko email mein jayega, hashed version DB mein store hoga
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/user/reset-password/${rawToken}`;

    try {
      const transporter = await getTransporter();
      await transporter.sendMail({
        from: `"Interview AI" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <h2>Password Reset Request 🔒</h2>
          <p>Hi ${user.username},</p>
          <p>Click below to reset your password. Link expires in <b>15 minutes</b>.</p>
          <br/>
          <a href="${resetLink}" style="background-color:#4CAF50;color:white;padding:12px 24px;text-decoration:none;border-radius:5px;">Reset Password</a>
          <br/><br/>
          <p>If you did not request this, ignore this email.</p>
          <p><b>Interview AI</b></p>
        `,
      });
    } catch (mailErr) {
      // Email fail hui to token bhi rollback kar do, warna user reset nahi kar payega
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      logger.error(`Reset email failed for ${user.email}: ${mailErr.message}`);
      return res.status(502).json({ success: false, message: 'Failed to send reset email, try again' });
    }

    res.status(200).json({ success: true, message: 'Password reset link sent to your email' });
  } catch (err) {
    logger.error(`Forgot Password Error: ${err.message}`);
    next(err);
  }
};

const UserResetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Non-blocking — confirmation email fail hone se reset fail nahi hona chahiye
    getTransporter()
      .then((transporter) =>
        transporter.sendMail({
          from: `"Interview AI" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: 'Password Reset Successful 🔒',
          html: `
            <h2>Password Reset Successful! ✅</h2>
            <p>Hi ${user.username}, your password has been reset successfully.</p>
            <p><b>Interview AI</b></p>
          `,
        })
      )
      .catch((err) => {
        logger.error(`Reset confirmation email failed for ${user.email}: ${err.message}`);
      });

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    logger.error(`Reset Password Error: ${err.message}`);
    next(err);
  }
};

const GoogleAuthCallback = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/user/login`);
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, userImage: user.userImage },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${process.env.FRONTEND_URL}/user/login`);
  } catch (err) {
    logger.error(`Google Auth Error: ${err.message}`);
    return res.redirect(`${process.env.FRONTEND_URL}/user/login`);
  }
};

module.exports = {
  UserAuthRegister,
  UserAuthLogin,
  UserAuthLogout,
  UserForgotPassword,
  UserResetPassword,
  GoogleAuthCallback,
};