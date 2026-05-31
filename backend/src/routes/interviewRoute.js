const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const interviewController = require('../controllers/interviewControllers');
const upload = require('../configs/multerConfig');

router.get('/report/stats' , authMiddleware, interviewController.interviewReportStats);

router.post('/report', authMiddleware, upload.single('resume'), interviewController.generateAiReport );

router.get('/report/:id', authMiddleware, interviewController.getSingleReport);

router.get('/reports', authMiddleware, interviewController.getAllReports);

router.post('/report/delete/:id', authMiddleware, interviewController.deleteReport);

router.post('/resume/pdf/:interviewID', authMiddleware, interviewController.generateResumePdfController);

module.exports = router;