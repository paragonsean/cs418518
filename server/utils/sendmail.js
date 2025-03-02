const nodemailer = require("nodemailer");

// Universal Email Sending Function
async function sendEmail(email, subject, body) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("SMTP credentials are missing in environment variables.");
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: body,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}: ${result.response}`);

    return { success: true, response: result.response };
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    return { success: false, error: error.message };
  }
}

// Function to send verification email
async function sendVerificationEmail(userEmail, verificationCode) {
  try {
    console.log(`📨 Sending verification email to: ${userEmail}`);

    const subject = "Verify Your Account";
    const body = `<p>Your verification code is: <strong>${verificationCode}</strong></p><p>Enter this to verify your account.</p>`;

    const emailResult = await sendEmail(userEmail, subject, body);

    if (emailResult.success) {
      console.log(`Verification email sent to ${userEmail}`);
    } else {
      console.error(`Failed to send verification email:`, emailResult.error);
    }

    return emailResult;
  } catch (error) {
    console.error("Error in sendVerificationEmail:", error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendEmail, sendVerificationEmail };
