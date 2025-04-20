import express from "express";
import UserController from "../controllers/user_controller.js";
import AuthController from "../controllers/auth_controller.js";
import PasswordController from "../controllers/password_controller.js";
import checkUserAuth from "../middleware/auth_middleware.js";
import { recaptcha } from "../middleware/recaptcha_middleware.js";  // ← import your new middleware

const router = express.Router();

// Public Routes (No Authentication Required)
// ──────────────────────────────────────────────
// We add recaptcha("register") and recaptcha("login") here:
router.post(
  "/register",
  recaptcha("register"),
  AuthController.register
);

router.post(
  "/login",
  recaptcha("login"),
  AuthController.userLogin
);

router.post(
  "/send-reset-password-email",
  PasswordController.sendUserPasswordResetEmail
);

router.post("/verify-otp", AuthController.verifyOTP);
router.get("/verify-email", PasswordController.verifyEmail);
router.post("/reset-password/:token", PasswordController.resetPassword);

// Protected Routes (Require Valid JWT Cookie)
// ─────────────────────────────────────────────
router.post(
  "/changepassword",
  checkUserAuth,
  UserController.changeUserPassword
);

router.get(
  "/loggeduser",
  checkUserAuth,
  UserController.loggedUser
);

router.put(
  "/updateprofile",
  checkUserAuth,
  UserController.updateUserProfile
);

export default router;
