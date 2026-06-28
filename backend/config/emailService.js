const nodemailer = require('nodemailer');

const emailUser = process.env.SUPPORT_EMAIL_USER || '';
const emailPass = process.env.SUPPORT_EMAIL_PASS || '';

// Transporter configuration (e.g. Gmail)
let transporter = null;

if (emailUser && emailPass) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
  console.log(`✉️ Email Service Initialized: using sender ${emailUser}`);
} else {
  console.log('⚠️ Email Service: SMTP credentials not set. Falling back to log-only mode.');
}

const sendOTP = async (toEmail, code) => {
  const mailOptions = {
    from: `"Raja Rice Traders" <${emailUser || 'noreply@rajaricetraders.com'}>`,
    to: toEmail,
    subject: 'Password Reset Verification Code - Raja Rice Traders',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #2E7D32; margin: 0;">Raja Rice Traders</h2>
          <span style="color: #888888; font-size: 12px;">Quality & Trust</span>
        </div>
        <p>Hello,</p>
        <p>You requested a password reset for your Raja Rice Traders account. Please use the 6-digit verification code (OTP) below to complete your password reset. This code is valid for 15 minutes.</p>
        <div style="background-color: #f1f8e9; border: 1px dashed #2E7D32; border-radius: 8px; text-align: center; padding: 16px; margin: 24px 0; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #2E7D32;">
          ${code}
        </div>
        <p style="color: #888888; font-size: 12px;">If you did not request this password reset, please ignore this email or contact support at +91 98482 23681.</p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 24px 0;" />
        <span style="color: #aaaaaa; font-size: 11px; display: block; text-align: center;">Near Krishna Talkies, Barlapenta Bazaar, Suryapet, Telangana, India</span>
      </div>
    `
  };

  if (transporter) {
    await transporter.sendMail(mailOptions);
    console.log(`✉️ Email successfully sent to ${toEmail}`);
    return { success: true };
  } else {
    console.log(`🔑 [MOCK EMAIL] Verification Code for ${toEmail}: ${code}`);
    return { success: true, mock: true };
  }
};

module.exports = {
  sendOTP
};
