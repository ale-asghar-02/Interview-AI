const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  family: 4, // force IPv4
});

module.exports = transporter;