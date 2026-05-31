const userModel = require('../models/userModel');
const interviewReportModel = require('../models/interviewReportModel');
const cloudinary = require('../configs/cloudinary');
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
      // ✅ Cloudinary upload
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
    // ✅ Cloudinary error alag se handle karo
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