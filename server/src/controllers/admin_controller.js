// File: src/controllers/AdminAdvisingController.js
import AdvisingModel from "../models/advising_model.js";
import UserModel from "../models/user_model.js";
import { sendAdvisingEmail } from "../services/email_service.js";
import logger from "../services/my_logger.js";

class AdminAdvisingController {
  /**
   * GET /api/admin/advising
   * Retrieves all advising records with normalized IDs.
   */
  static async getAllAdvisingRecords(req, res) {
    try {
      const records = await AdvisingModel.getAllRecords();

      const normalized = records.map((r) => ({
        id: r._id?.toString?.() || r.id,
        student_name: r.student_name,
        student_email: r.student_email,
        term: r.term,
        status: r.status,
        planned_courses: r.planned_courses,
        last_term: r.last_term,
        last_gpa: r.last_gpa,
        current_term: r.current_term,         // ✅ Include current_term
        prerequisites: r.prerequisites,       // ✅ Include prerequisites
        date: r.date,
        feedback: r.feedback,
      }));

      return res.status(200).json(normalized);
    } catch (error) {
      logger.error("Error retrieving all advising records:", error.message);
      return res.status(500).json({
        status: "failed",
        message: "Server Error: could not fetch records",
      });
    }
  }

  /**
   * GET /api/admin/advising/:id
   * Fetches a single advising record by ID with normalized ID.
   */
  static async getAdvisingRecordById(req, res) {
    try {
      const { id } = req.params;
      logger.info(`Fetching advising record for ID: ${id}`);

      const record = await AdvisingModel.getRecordById(id);
      if (!record) {
        logger.warn(`No advising record found for ID: ${id}`);
        return res.status(404).json({ message: "Record not found" });
      }

      const normalized = {
        id: record._id?.toString?.() || record.id,
        student_name: record.student_name,
        student_email: record.student_email,
        term: record.term,
        status: record.status,
        planned_courses: record.planned_courses,
        last_term: record.last_term,
        last_gpa: record.last_gpa,
        current_term: record.current_term,       // ✅ Include current_term
        prerequisites: record.prerequisites,     // ✅ Include prerequisites
        date: record.date,
        feedback: record.feedback,
      };

      return res.status(200).json(normalized);
    } catch (error) {
      logger.error("Server error fetching record:", error.message);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/admin/advising/:id
   * Updates an advising record's status and sends an email.
   */
  static async updateAdvisingStatus(req, res) {
    try {
      const advisingId = req.params.id;
      const { status, rejectionReason } = req.body;

      const result = await AdvisingModel.updateStatusById(advisingId, status, rejectionReason);
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: "failed", message: "Record not found" });
      }

      const studentEmail = await AdvisingModel.getStudentEmailById(advisingId);
      if (!studentEmail) {
        return res.status(500).json({
          status: "failed",
          message: "Error retrieving student's email",
        });
      }

      sendAdvisingEmail(studentEmail).catch((err) =>
        logger.error("Email sending failed:", err.message)
      );

      return res.status(200).json({
        status: "success",
        message: "Status updated successfully",
      });
    } catch (error) {
      logger.error(`Error updating advising status for ID ${req.params.id}:`, error.message);
      return res.status(500).json({
        status: "failed",
        message: "Server Error: Status not updated",
      });
    }
  }

  /**
   * PUT /api/admin/advising/record/:id
   * Performs a full update of an advising record's content.
   */
  static async updateAdvisingRecord(req, res) {
    try {
      const advisingId = req.params.id;
      const {
        date,
        current_term,
        last_term,
        last_gpa,
        prerequisites,
        student_name,
        planned_courses,
      } = req.body;

      const result = await AdvisingModel.updateRecordById(advisingId, {
        date,
        current_term,
        last_term,
        last_gpa,
        prerequisites,
        student_name,
        planned_courses,
      });

      if (result.affectedRows === 0) {
        return res.status(404).json({ status: "failed", message: "Record not found" });
      }

      return res.status(200).json({ status: "success", message: "Record updated successfully" });
    } catch (error) {
      logger.error(`Error updating advising record for ID ${req.params.id}:`, error.message);
      return res.status(500).json({
        status: "failed",
        message: "Server Error: Record not updated",
      });
    }
  }

  /**
   * GET /api/admin/students
   * Retrieves a list of all students (non-admin users).
   */
  static async getAllStudents(req, res) {
    try {
      const students = await UserModel.getAllStudents();
      if (!students || students.length === 0) {
        return res.status(200).json([]);
      }
      return res.status(200).json(students);
    } catch (error) {
      logger.error("Error retrieving student list:", error.message);
      return res.status(500).json({
        status: "failed",
        message: "Server Error: could not fetch student list",
      });
    }
  }
}

export default AdminAdvisingController;
