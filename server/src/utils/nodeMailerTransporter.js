const nodemailer = require("nodemailer");

const otpTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const revisionCountTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.REVIEW_EMAIL,
    pass: process.env.REVIEW_EMAIL_PASS,
  },
});

module.exports = { otpTransporter, revisionCountTransporter };
