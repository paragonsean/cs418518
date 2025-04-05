import express from "express";
import UserController from "../controllers/user_controller.js";
import AuthController from "../controllers/auth_controller.js";
import PasswordController from "../controllers/password_controller.js";
import checkUserAuth from "../middleware/auth_middleware.js";

const router = express.Router();

//  Public Routes (No Authentication Required)
router.post("/register", AuthController.register);
router.post("/login", AuthController.userLogin);
router.post("/send-reset-password-email",PasswordController.sendUserPasswordResetEmail,
);

router.post("/verify-otp", AuthController.verifyOTP);
router.get("/verify-email", PasswordController.verifyEmail);
router.post("/reset-password/:token", PasswordController.resetPassword);

router.post("/changepassword", checkUserAuth, UserController.changeUserPassword);
router.get("/loggeduser", checkUserAuth, UserController.loggedUser);
router.put("/updateprofile", checkUserAuth, UserController.updateUserProfile);

export default router;
