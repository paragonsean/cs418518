import express from "express";
import UserController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";
import PasswordController from "../controllers/PasswordController.js";
import checkUserAuth from "../middleware/AuthMiddleware.js";
var router = express.Router();

//  Public Routes (No Authentication Required)
router.post("/register", AuthController.register);
router.post("/login", AuthController.userLogin);
router.post("/send-reset-password-email", PasswordController.sendUserPasswordResetEmail);
router.post("/verify-otp", AuthController.verifyOTP);
router.get("/verify-email", PasswordController.verifyEmail);
router.post("/reset-password/:token", PasswordController.resetPassword);

//  Protected Routes (Require Authentication)
router.use(checkUserAuth);
router.post("/changepassword", UserController.changeUserPassword);
router.get("/loggeduser", UserController.loggedUser);
router.put("/updateprofile", UserController.updateUserProfile);
export default router;