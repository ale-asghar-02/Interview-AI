const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userControllers');
const upload = require('../configs/multerConfig');

router.get('/get-me', authMiddleware, userController.GetUserData);

router.post('/update-me', authMiddleware, upload.single('userImage'), userController.updateUserData);

router.post('/account-delete' , authMiddleware, userController.deleteUserAccount);

module.exports = router;