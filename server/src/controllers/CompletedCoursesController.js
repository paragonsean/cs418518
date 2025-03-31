// File: src/controllers/CompletedCoursesController.js
import CompletedCoursesModel from "../models/CompletedCoursesModel.js"; // Assume this model handles DB queries

class CompletedCoursesController {
  /**
   * GET /api/completed-courses/email/:email
   * Fetch completed courses by email
   */
  static async getCompletedCoursesByEmail(req, res) {
    const { email } = req.params;

    try {
      const records = await CompletedCoursesModel.getCompletedCoursesByEmail(email);
      if (!records || records.length === 0) {
        return res.status(404).json({ message: "No completed courses found for this student" });
      }
      return res.status(200).json(records);
    } catch (error) {
      console.error("Error fetching completed courses:", error);
      return res.status(500).json({ message: "Server Error" });
    }
  }
}

export default CompletedCoursesController;
