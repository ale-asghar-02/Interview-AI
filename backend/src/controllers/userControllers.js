const userModel = require('../models/userModel');
const interviewReportModel = require('../models/interviewReportModel');
const cloudinary = require('../configs/cloudinary');
const transporter = require('../configs/nodemailor');
const logger = require('../utils/logger');

const GetUserData = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User data fetched successfully',
      user,
    });
  } catch (err) {
    logger.error(`Get User Error: ${err.message}`);
    next(err);
  }
};

const updateUserData = async (req, res, next) => {
  try {
    const { username, linkedlnURL, GithubURL } = req.body;
    const updateData = { username, linkedlnURL, GithubURL };

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'user_images' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      updateData.userImage = result.secure_url;
    }

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User data updated successfully',
      user,
    });
  } catch (err) {
    if (err.message?.includes('cloudinary') || err.http_code) {
      logger.error(`Cloudinary Upload Error: ${err.message}`);
      return res.status(502).json({
        success: false,
        message: 'Image upload failed, please try again',
      });
    }

    logger.error(`Update User Error: ${err.message}`);
    next(err);
  }
};

const deleteUserAccount = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.userImage) {
      try {
        const urlParts = user.userImage.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const folder = urlParts[urlParts.length - 2];
        const publicId = `${folder}/${fileName.split('.')[0]}`;

        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        logger.error(`Cloudinary Delete Error: ${cloudErr.message}`);
      }
    }

    await interviewReportModel.deleteMany({ user: req.user.id });

    await userModel.findByIdAndDelete(req.user.id);

    try {
      await transporter.sendMail({
        from: `"Interview AI" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Your Interview AI Account Has Been Deleted',
        html: `
          <h2>Goodbye, ${user.username} 👋</h2>
          <p>Your Interview AI account and all associated data have been permanently deleted.</p>
          <p>If this wasn't you, please contact our support team immediately.</p>
          <p>We're sad to see you go. You're always welcome back!</p>
          <p><b>Interview AI</b></p>
        `,
      });
    } catch (mailErr) {
      logger.error(`Delete Account Email Error: ${mailErr.message}`);
    }

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (err) {
    logger.error(`Delete Account Error: ${err.message}`);
    next(err);
  }
};

module.exports = { GetUserData, updateUserData, deleteUserAccount };