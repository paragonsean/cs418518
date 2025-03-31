// File: src/controllers/AdvisingController.js
import AdvisingModel from "../models/AdvisingModel.js";
import UserModel from "../models/UserModel.js";
import { sendAdvisingEmail } from "../utils/emailService.js";
import logger from "../utils/logger.js";

class AdvisingController {
  /**
   * GET /api/advising (Admin Only)
   */
  static async getAllAdvisingRecords(req, res) {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ status: "failed", message: "Access denied. Admins only." });
      }

      const records = await AdvisingModel.getAllRecords();
      return res.status(200).json(records);
    } catch (error) {
      logger.error("Error retrieving all advising records:", error.message);
      return res.status(500).json({ status: "failed", message: "Server Error: could not fetch records" });
    }
  }

  /**
   * GET /api/advising/email (Authenticated User)
   */
  static async getAdvisingRecordsByEmail(req, res) {
    try {
      const email = req.user.email; // ✅ Extract from JWT token
      if (!email) {
        return res.status(400).json({ status: "failed", message: "User email not found in token" });
      }

      const records = await AdvisingModel.getRecordsByEmail(email);
      if (!records || records.length === 0) {
        return res.status(404).json({ status: "failed", message: "No advising records found" });
      }

      return res.status(200).json(records);
    } catch (error) {
      logger.error(`Error retrieving records for ${req.user.email}:`, error.message);
      return res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
  }

  /**
   * POST /api/advising (Authenticated User)
   */
  static async createAdvisingRecord(req, res) {
    try {
      const {
        date,
        current_term,
        last_term,
        last_gpa,
        prerequisites,
        student_name,
        planned_courses,
      } = req.body;
      const student_email = req.user.email; // ✅ Extract from JWT token

      // Check if user exists
      const existingUser = await UserModel.findByEmail(student_email);
      if (!existingUser) {
        logger.warn(`Advising creation failed - User not found: ${student_email}`);
        return res.status(400).json({ status: "failed", message: "User with this email not found." });
      }

      // Insert record
      const newRecord = await AdvisingModel.createAdvisingRecord({
        date,
        current_term,
        last_term,
        last_gpa,
        prerequisites,
        student_name,
        planned_courses,
        student_email,
      });

      return res.status(201).json({
        status: "success",
        message: "Student info successfully inserted in the database.",
        data: newRecord,
      });
    } catch (error) {
      logger.error("Error creating advising record:", error.message);
      return res.status(500).json({ status: "failed", message: "Server Error: Record not inserted" });
    }
  }

  /**
   * PUT /api/advising/:id (Authenticated User)
   */
  static async updateAdvisingStatus(req, res) {
    try {
      const advisingId = req.params.id;
      const { status, rejectionReason } = req.body;

      // Update status
      const result = await AdvisingModel.updateStatusById(advisingId, status, rejectionReason);
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: "failed", message: "Record not found" });
      }

      // Retrieve student email for notification
      const studentEmail = await AdvisingModel.getStudentEmailById(advisingId);
      if (!studentEmail) {
        return res.status(500).json({ status: "failed", message: "Error retrieving student's email" });
      }

      // Send email notification (async, so the response isn't delayed)
      sendAdvisingEmail(studentEmail).catch((err) => logger.error("Email sending failed:", err.message));

      return res.status(200).json({ status: "success", message: "Status updated successfully" });
    } catch (error) {
      logger.error(`Error updating advising status for ID ${req.params.id}:`, error.message);
      return res.status(500).json({ status: "failed", message: "Server Error: Status not updated" });
    }
  }
}

export default AdvisingController;
