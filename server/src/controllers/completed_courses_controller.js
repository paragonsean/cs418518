// File: src/controllers/CompletedCoursesController.js
import CompletedCoursesModel from "../models/completed_courses_model.js";
import checkUserAuth from "@/middleware/auth_middleware.js";

const CompletedCoursesController = {
    async getCompletedCoursesByEmail(req, res) {
        try {
            const email = req.user.email; // Email is now extracted from the token

            if (!email) {
                return res.status(400).json({ message: "User email not found in token" });
            }

            const courses = await CompletedCoursesModel.getCompletedCoursesByEmail(email);
            if (!courses || courses.length === 0) {
                return res.status(404).json({ message: "No completed courses found" });
            }

            res.status(200).json(courses);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
};

export default CompletedCoursesController;
