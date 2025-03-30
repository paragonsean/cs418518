// File: src/controllers/AdvisingController.js
import AdvisingModel from "../models/AdvisingModel.js";
import UserModel from "../models/UserModel.js"; // for findByEmail() usage
import { sendEmail } from "../utils/emailService.js";
import logger from "../utils/logger.js";

class AdvisingController {
  /**
   * GET /api/advising
   */
  static async getAllAdvisingRecords(req, res) {
    try {
      const records = await AdvisingModel.getAllRecords();
      res.status(200).json(records);
    } catch (error) {
      logger.error("Error retrieving all advising records:", error.message);
      res.status(500).json({ message: "Server Error: could not fetch records" });
    }
  }

  /**
   * GET /api/advising/:name
   */
  static async getAdvisingRecordsByName(req, res) {
    const studentName = req.params.name;
    try {
      const records = await AdvisingModel.getRecordsByName(studentName);
      if (records.length === 0) {
        return res.status(404).json({ message: "Student Information not found" });
      }
      res.status(200).json(records);
    } catch (error) {
      logger.error(`Error retrieving records for ${studentName}:`, error.message);
      res.status(500).json({ message: "Internal Server Error" });
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
        student_email
      } = req.body;

      // Example: check if user already exists (by email) before creating advising record
      const existingUser = await UserModel.findByEmail(student_email);
      if (!existingUser) {
        logger.warn(`Advising creation failed - User not found: ${student_email}`);
        return res
          .status(400)
          .json({ status: "failed", message: "User with this email not found." });
      }

      // Insert record
      await AdvisingModel.createAdvisingRecord({
        date,
        current_term,
        last_term,
        last_gpa,
        prerequisites,
        student_name,
        planned_courses,
        student_email
      });

      res.status(200).json({
        status: 200,
        message: "Student info successfully inserted in the database."
      });
    } catch (error) {
      logger.error("Error creating advising record:", error.message);
      res.status(500).json({
        status: 500,
        message: "Server Error: Record not inserted"
      });
    }
  }

  /**
   * PUT /api/advising/:id
   */
  static async updateAdvisingStatus(req, res) {
    const advisingId = req.params.id;
    const { status, rejectionReason } = req.body; // e.g. "Approved", "Rejected", etc.

    try {
      const result = await AdvisingModel.updateStatusById(advisingId, status, rejectionReason);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Record not found" });
      }

      // If successful, fetch the student's email from the same record
      const studentEmail = await AdvisingModel.getStudentEmailById(advisingId);
      if (!studentEmail) {
        return res.status(500).json({ message: "Error retrieving student's email" });
      }

      // Send status-change email
      await sendEmail(
        studentEmail,
        "Course Plan Status Update",
        "Dear student, you are receiving this email today as there has been a change to the status of one or more of your previously submitted course plans. To view this change, please log into your account and navigate to the Course Advising Form webpage."
      );

      res.status(200).json({ message: "Status updated successfully" });
    } catch (error) {
      logger.error(`Error updating advising status for ID ${advisingId}:`, error.message);
      res.status(500).json({ message: "Server Error: Status not updated" });
    }
  }
}

export default AdvisingController;
