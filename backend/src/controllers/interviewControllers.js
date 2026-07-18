const { generateInterviewReport, generateResumePdf } = require('../services/aiService');
const interviewReportModel = require('../models/interviewReportModel');
const userModel = require('../models/userModel');
const logger = require('../utils/logger');

const interviewReportStats = async (req, res, next) => {
  try {
    const userID = req.user.id;

    const user = await userModel.findById(userID).select('createdAt');
    const accountCreatedAt = user?.createdAt || new Date();
    const now = new Date();

    const monthsDiff =
      (now.getFullYear() - accountCreatedAt.getFullYear()) * 12 +
      (now.getMonth() - accountCreatedAt.getMonth());

    let timePeriodLabel;
    if (monthsDiff < 1) {
      timePeriodLabel = '1 month';
    } else if (monthsDiff < 12) {
      timePeriodLabel = `${monthsDiff + 1} month${monthsDiff + 1 > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(monthsDiff / 12);
      timePeriodLabel = `${years} year${years > 1 ? 's' : ''}`;
    }

    const reports = await interviewReportModel
      .find({ user: userID })
      .select('matchScore skillGaps resumeGeneratedAt createdAt');

    const totalReports = reports.length;

    const avgScore =
      totalReports > 0
        ? Math.round(
            reports.reduce((sum, r) => sum + (r.matchScore || 0), 0) / totalReports
          )
        : 0;

    const totalSkillGaps = reports.reduce((sum, r) => {
      return sum + (Array.isArray(r.skillGaps) ? r.skillGaps.length : 0);
    }, 0);

    const latestResume = reports.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];

    let latestResumeLabel = null;
    if (latestResume) {
      const d = new Date(latestResume.createdAt);
      latestResumeLabel = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    res.status(200).json({
      success: true,
      message: 'Stats retrieved successfully',
      stats: {
        totalReports,
        timePeriodLabel,
        avgScore,
        totalSkillGaps,
        latestResumeLabel,
      },
    });
  } catch (err) {
    logger.error(`Interview Stats Error: ${err.message}`);
    next(err);
  }
};

const generateAiReport = async (req, res, next) => {
  try {
    const pdfParse = require('pdf-parse');

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Resume PDF is required' });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const resumeContent = pdfData.text.trim();

    if (!resumeContent) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from PDF. Please upload a text-based PDF.',
      });
    }

    const { selfDescription, jobDescription } = req.body;

    const interviewReportAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeContent,
      selfDescription,
      jobDescription,
      ...interviewReportAi,
    });

    res.status(201).json({
      success: true,
      message: 'Interview report generated successfully',
      interviewReport,
    });
  } catch (err) {
    logger.error(`Generate AI Report Error: ${err.message}`);
    next(err);
  }
};

const getSingleReport = async (req, res, next) => {
  try {
    const interviewReport = await interviewReportModel.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({ success: false, message: 'Interview report not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Interview report retrieved successfully',
      interviewReport,
    });
  } catch (err) {
    logger.error(`Get Single Report Error: ${err.message}`);
    next(err);
  }
};

const getAllReports = async (req, res, next) => {
  try {
    const userID = req.user.id;

    const interviewReports = await interviewReportModel
      .find({ user: userID })
      .sort({ createdAt: -1 })
      .select(
        '-resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -preparationPlan'
      );

    res.status(200).json({
      success: true,
      message: 'Interview reports retrieved successfully',
      interviewReports,
    });
  } catch (err) {
    logger.error(`Get All Reports Error: ${err.message}`);
    next(err);
  }
};

const deleteReport = async (req, res, next) => {
  try {
    const interviewReport = await interviewReportModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({ success: false, message: 'Interview report not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Interview report deleted successfully',
    });
  } catch (err) {
    logger.error(`Delete Report Error: ${err.message}`);
    next(err);
  }
};

const generateResumePdfController = async (req, res, next) => {
  try {
    const interviewReport = await interviewReportModel.findOne({
      _id: req.params.interviewID,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({ success: false, message: 'Interview report not found' });
    }

    const { resume, selfDescription, jobDescription } = interviewReport;

    const pdfBuffer = await generateResumePdf({ resume, selfDescription, jobDescription });

    await interviewReportModel.findByIdAndUpdate(req.params.interviewID, {
      resumeGeneratedAt: new Date(),
    });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=resume_${req.params.interviewID}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    logger.error(`Generate Resume PDF Error: ${err.message}`);
    next(err);
  }
};

module.exports = {
  interviewReportStats,
  generateAiReport,
  getSingleReport,
  getAllReports,
  deleteReport,
  generateResumePdfController,
};