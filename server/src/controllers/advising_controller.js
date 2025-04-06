// File: src/controllers/AdvisingController.js
import AdvisingModel from "../models/advising_model.js";
import UserModel from "../models/user_model.js";
import { sendAdvisingEmail } from "../services/email_service.js";
import logger from "../services/my_logger.js";

class AdvisingController {
  /**
   * GET /api/advising
   * Retrieves ALL advising records (e.g., for admins).
   * ( admin checks, for later )
   */
  static async getAllAdvisingRecords(req, res) {
    try {
      const records = await AdvisingModel.getAllRecords();
      return res.status(200).json(records);
    } catch (error) {
      logger.error("Error retrieving all advising records:", error.message);
      return res
        .status(500)
        .json({ status: "failed", message: "Server Error: could not fetch records" });
    }
  }

  /**
   * GET /api/advising/email
   * Retrieves advising records for the currently logged-in user (via req.user.email).
   * Make sure your route is set up like: router.get("/api/advising/email", <controllerFunc>)
   */
  static async getAdvisingRecordsByEmail(req, res) {
    try {
      const email = req.user?.email;
      if (!email) {
        return res
          .status(400)
          .json({ status: "failed", message: "User email not found on request" });
      }

      const records = await AdvisingModel.getRecordsByEmail(email);
      if (!records || records.length === 0) {
        return res.status(200).json([]); //Return an empty array instead of 404
      }

      return res.status(200).json(records);
    } catch (error) {
      logger.error(`Error retrieving records for user:`, error.message);
      return res.status(500).json({
        status: "failed",
        message: "Internal Server Error",
      });
    }
  }


  /**
   * POST /api/advising
   * Creates a new advising record for the currently logged-in user (req.user.email).
   * `student_email` is NOT expected in the body since we derive it from req.user.email.
   */
  static async createAdvisingRecord(req, res) {
    try {
      logger.info("Received request to create advising record.");
      logger.debug("Request Body:", req.body);

      // Extract user-provided fields
      const {
        date,
        current_term,
        last_term,
        last_gpa,
        prerequisites,
        student_name,
        planned_courses,
      } = req.body;

      // The actual email is from req.user
      const student_email = req.user?.email;
      if (!student_email) {
        logger.warn("No user email found on request.");
        return res.status(400).json({
          status: "failed",
          message: "No user email found on request.",
        });
      }

      // Check if user exists
      const existingUser = await UserModel.findByEmail(student_email);
      if (!existingUser) {
        logger.warn(`Advising creation failed - User not found: ${student_email}`);
        return res.status(400).json({
          status: "failed",
          message: "User with this email not found.",
        });
      }

      // Log extracted data
      logger.info(`Creating advising record for ${student_email}`);
      logger.debug(` Data:`, {
        date: date || "DEFAULT (today)",
        current_term,
        last_term,
        last_gpa,
        prerequisites,
        student_name,
        planned_courses,
      });

      // Insert record into DB
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

      logger.info(`🎉 Advising record successfully created! ID: ${newRecord.id}`);

      return res.status(201).json({
        status: "success",
        message: "Student info successfully inserted in the database.",
        data: newRecord,
      });
    } catch (error) {
      logger.error(" Error creating advising record:", error);
      return res.status(500).json({
        status: "failed",
        message: "Server Error: Record not inserted",
      });
    }
  }

  /**
   * GET /api/advising/record/:id
   * Fetches a single advising record by its ID.
   */
  static async getAdvisingRecordById(req, res) {
    try {
      const { id } = req.params;
      logger.info(`Fetching advising record for ID: ${id}`);

      const record = await AdvisingModel.getRecordById(id); // Ensure your model supports this
      if (!record) {
        logger.warn(`No advising record found for ID: ${id}`);
        return res.status(404).json({ message: "Record not found" });
      }

      return res.status(200).json(record);
    } catch (error) {
      logger.error(" Server error fetching record:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }

  /**
   * PUT /api/advising/:id
   * Updates an advising record's status by its ID.
   * In many apps, only Admin or certain roles can do this.
   */
  static async updateAdvisingStatus(req, res) {
    try {
      const advisingId = req.params.id;
      const { status, rejectionReason } = req.body;

      // Update status in DB
      const result = await AdvisingModel.updateStatusById(advisingId, status, rejectionReason);
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ status: "failed", message: "Record not found" });
      }

      // Retrieve student email for notification
      const studentEmail = await AdvisingModel.getStudentEmailById(advisingId);
      if (!studentEmail) {
        return res
          .status(500)
          .json({ status: "failed", message: "Error retrieving student's email" });
      }

      // Send email notification (async)
      sendAdvisingEmail(studentEmail).catch((err) =>
        logger.error("Email sending failed:", err.message)
      );

      return res
        .status(200)
        .json({ status: "success", message: "Status updated successfully" });
    } catch (error) {
      logger.error(`Error updating advising status for ID ${req.params.id}:`, error.message);
      return res
        .status(500)
        .json({ status: "failed", message: "Server Error: Status not updated" });
    }
  }
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

      // Update the full record in your model
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
      return res.status(500).json({ status: "failed", message: "Server Error: Record not updated" });
    }
  }
  /**
   * GET /api/students
   * Retrieves a list of all student users.
   */
  static async getAllStudents(req, res) {
    try {
      // Adjust this logic as needed if you use roles or departments
      const students = await UserModel.getAllStudents(); // assumes filtering is done inside model

      if (!students || students.length === 0) {
        return res.status(200).json([]); // return empty array, not 404
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

export default AdvisingController;
