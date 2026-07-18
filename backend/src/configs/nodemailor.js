const nodemailer = require('nodemailer');
const dns = require('dns').promises;

let transporter;

async function getTransporter() {
  if (transporter) return transporter;

  // smtp.gmail.com ka IPv4 address dhoondo
  const addresses = await dns.resolve4('smtp.gmail.com');
  const ipv4Address = addresses[0];

  transporter = nodemailer.createTransport({
    host: ipv4Address,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      servername: 'smtp.gmail.com', // TLS cert validation ke liye zaroori
    },
  });

  return transporter;
}

module.exports = { getTransporter };