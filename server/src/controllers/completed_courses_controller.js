import CompletedCoursesModel from "../models/completed_courses_model.js";

const CompletedCoursesController = {
  // Fetch completed courses for the authenticated student
  async getCompletedCoursesByEmail(req, res) {
    try {
      const email = req.user.email;
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
  },

  // ✅ Admin: Fetch completed courses for any student by email
  async getCompletedCoursesByEmailParam(req, res) {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json({ message: "Student email is required" });
      }

      const courses = await CompletedCoursesModel.getCompletedCoursesByEmail(email);
      if (!courses || courses.length === 0) {
        return res.status(404).json({ message: "No completed courses found for this student" });
      }

      res.status(200).json(courses);
    } catch (error) {
      console.error("Error fetching courses by email:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
};

export default CompletedCoursesController;
