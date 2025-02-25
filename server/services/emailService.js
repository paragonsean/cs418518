import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/account/verify-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    html: `
      <h3>Welcome! Please verify your email</h3>
      <p>Click <a href="${verificationLink}">here</a> to verify your email.</p>
      <p>If you didn't sign up, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Sends a password reset email with a secure reset link
 */
export const sendResetPasswordEmail = async (email, token) => {
  const resetLink = `http://localhost:3000/account/reset-password/${token}`; //  Corrected format


  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `
      <h3>Password Reset Request</h3>
      <p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
