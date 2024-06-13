const { UserOTPModel } = require("../models/UserOTPModel");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPVerificationEmail = async (userId, userEmail) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Your OTP Code",
      html: `
            <div style="font-family: 'Montserrat', sans-serif; padding: 20px; background-color: #d9edec; border-radius: 8px; text-align: center; margin: auto; width: fit-content;">
              <div style="margin-bottom: 20px; text-align: center;">
                  <img src=${process.env.LOGO_URL} alt="Logo" style="width: 125px;">
               </div>
               <h2 style="color: #157ce3; font-weight:900;">WELCOME TO NOTENOOK</h2>
               <p style="color: #333; font-size: 16px;">Dear User,</p>
               <p style="color: #333; font-size: 16px;">Your OTP code is <strong style="color: #157ce3;">${otp}</strong>.</p>
               <p style="color: #333; font-size: 16px;">Please use this code to verify your account.</p>
               <p style="color: #333; font-size: 16px;">Thank you!</p>
      
             </div>`,
    };
    let otpData = await UserOTPModel.findOne({ userId });

    if (otpData) {
      await otpData.setOTP(otp);
    } else {
      otpData = new UserOTPModel({ userId });
      await otpData.setOTP(otp);
    }

    await otpData.save();

    await transporter.sendMail(mailOptions);

    return otp;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

module.exports = { sendOTPVerificationEmail };
