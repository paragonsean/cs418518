// File: src/controllers/AdvisingController.js
import AdvisingModel from "../models/AdvisingModel.js";
import UserModel from "../models/UserModel.js"; // for findByEmail() usage
import { sendAdvisingEmail } from "../utils/emailService.js";
import logger from "../utils/logger.js";

class AdvisingController {
  /**
   * GET /api/advising
   */
  static async getAllAdvisingRecords(req, res) {
    try {
      const records = await AdvisingModel.getAllRecords();
      return res.status(200).json(records);
    } catch (error) {
      logger.error("Error retrieving all advising records:", error.message);
      return res.status(500).json({ message: "Server Error: could not fetch records" });
    }
  }

  /**
   * GET /api/advising/email/:email
   */
  static async getAdvisingRecordsByEmail(req, res) {
    const studentEmail = req.params.email;  // match "email" in the route
    try {
      const records = await AdvisingModel.getRecordsByEmail(studentEmail);
      if (!records || records.length === 0) {
        return res.status(404).json({ message: "Student information not found" });
      }
      return res.status(200).json(records);
    } catch (error) {
      logger.error(`Error retrieving records for ${studentEmail}:`, error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * POST /api/advising
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
        student_email,
      } = req.body;

      // Check if user exists by email
      const existingUser = await UserModel.findByEmail(student_email);
      if (!existingUser) {
        logger.warn(`Advising creation failed - User not found: ${student_email}`);
        return res
          .status(400)
          .json({ status: "failed", message: "User with this email not found." });
      }

      // Insert the record
      await AdvisingModel.createAdvisingRecord({
        date,
        current_term,
        last_term,
        last_gpa,
        prerequisites,
        student_name,
        planned_courses,
        student_email,
      });

      return res.status(200).json({
        status: 200,
        message: "Student info successfully inserted in the database.",
      });
    } catch (error) {
      logger.error("Error creating advising record:", error.message);
      return res.status(500).json({
        status: 500,
        message: "Server Error: Record not inserted",
      });
    }
  }

  /**
   * PUT /api/advising/:id
   */
  static async updateAdvisingStatus(req, res) {
    const advisingId = req.params.id;
    const { status, rejectionReason } = req.body; // e.g. "Approved" or "Rejected"

    try {
      // Update status in DB
      const result = await AdvisingModel.updateStatusById(advisingId, status, rejectionReason);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Record not found" });
      }

      // Retrieve the updated record's email
      const studentEmail = await AdvisingModel.getStudentEmailById(advisingId);
      if (!studentEmail) {
        return res.status(500).json({ message: "Error retrieving student's email" });
      }

      // Send a status-change notification
      await sendAdvisingEmail(studentEmail);

      return res.status(200).json({ message: "Status updated successfully" });
    } catch (error) {
      logger.error(`Error updating advising status for ID ${advisingId}:`, error.message);
      return res.status(500).json({ message: "Server Error: Status not updated" });
    }
  }
}

export default AdvisingController;
