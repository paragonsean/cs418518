import nodemailer from "nodemailer";

export const sendVerificationEmail = async (
  email,
  token,
  uin,
  firstName,
  lastName
) => {
  const verificationLink = `${process.env.FRONTEND_URL}/account/verify-email?token=${token}`;
  const UIN = uin;
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
      <h3>Welcome! ${firstName} ${lastName}, Your UIN is ${UIN}. Please verify your email.</h3>
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
  const resetLink = `http://localhost:3000/account/reset-password/${token}`; // Adjust as needed for your frontend URL

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

/**
 * Sends an email to the student when there is a status change in their course plan
 */
export const sendAdvisingEmail = async (studentEmail) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: studentEmail,
    subject: "Course Plan Status Update",
    html: `
      <p>Dear student,</p>
      <p>You are receiving this email because there has been a change to the status 
      of one or more of your previously submitted course plans. To view this change, 
      please log into your account and navigate to the Course Advising Form webpage.</p>
      <p>Thank you.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
