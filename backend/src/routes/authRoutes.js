const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const passport = require('../configs/passport');

router.post('/register', authController.UserAuthRegister );
router.post('/login', authController.UserAuthLogin );
router.post('/logout', authController.UserAuthLogout );

router.post('/forgot-password', authController.UserForgotPassword);
router.post('/reset-password/:token', authController.UserResetPassword);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", 
    passport.authenticate("google", { 
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/user/login`
    }), 
    authController.GoogleAuthCallback
);

module.exports = router;