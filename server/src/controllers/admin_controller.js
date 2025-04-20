// File: src/controllers/AdminAdvisingController.js
import AdvisingModel from "../models/advising_model.js";
import UserModel from "../models/user_model.js";
import { sendAdvisingEmail } from "../services/email_service.js";
import logger from "../services/my_logger.js";
import CompletedCoursesModel from "../models/completed_courses_model.js";

class AdminAdvisingController {
/**
 * POST /api/admin/advising/:id/update-courses
 * Converts planned courses to completed courses for a given advising ID
 */
static async updateCoursesFromAdvising(req, res) {
  try {
    const advisingId = req.params.id;
    logger.info(`Starting updateCoursesFromAdvising for advisingId: ${advisingId}`);

    const advisingRecord = await AdvisingModel.getRecordById(advisingId);
    logger.info("Advising record fetched:", advisingRecord);

    if (!advisingRecord) {
      logger.warn(`No advising record found for ID: ${advisingId}`);
      return res.status(404).json({ status: "failed", message: "Advising record not found" });
    }
    logger.info("🔍 Full advisingRecord contents:", advisingRecord);

    const { student_email: studentEmail, planned_courses, term } = advisingRecord;

    if (!planned_courses || !studentEmail) {
      logger.warn("Missing planned_courses or student_email");
      return res.status(400).json({ status: "failed", message: "Missing planned courses or student email" });
    }

    logger.info(`Student: ${studentEmail}, Planned Courses (raw):`, planned_courses);

    let parsedCourses;
    try {
      parsedCourses = Array.isArray(planned_courses)
        ? planned_courses
        : JSON.parse(planned_courses);
    } catch (parseError) {
      // Try fallback to CSV parsing
      parsedCourses = planned_courses.split(",").map((c) => c.trim());
    }
    

    if (!Array.isArray(parsedCourses) || parsedCourses.length === 0) {
      logger.warn("Parsed courses are empty or invalid");
      return res.status(400).json({ status: "failed", message: "Planned courses list is empty" });
    }

    logger.info(`Parsed Courses: ${JSON.stringify(parsedCourses)}`);

    const inserted = [];
    for (const courseName of parsedCourses) {
      try {
        logger.info(`📦 Attempting insert: '${courseName}' for student '${studentEmail}'`);
        await CompletedCoursesModel.setCompletedCourse(
          studentEmail,
          courseName,
          term || "Unknown",
          "IP"
        );
        logger.info(`✅ Successfully inserted: '${courseName}'`);
        inserted.push(courseName);
      } catch (err) {
        logger.error(`❌ Failed to insert course '${courseName}' for ${studentEmail}:`, err.message);
        console.error("🧨 Stack trace:", err);
      }
    }
    

    logger.info(`Completed insertion for ${studentEmail}:`, inserted);

    return res.status(200).json({
      status: "success",
      message: `${inserted.length} courses added to completed list`,
      insertedCourses: inserted,
    });

  } catch (error) {
    logger.error("Error in updateCoursesFromAdvising:", error.message);
    return res.status(500).json({ status: "failed", message: "Server error" });
  }
}

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
      logger.error("❌ Error in updateCoursesFromAdvising:");
      logger.error("🔍 Full error object:", error); // <-- will show structured errors
      console.error("🧨 Stack Trace:", error?.stack || error); // full developer view
    
      return res.status(500).json({
        status: "failed",
        message: "Server error",
        debug: error?.message || String(error), // visible in frontend/console
      });
    }
  }    
  
// Removed misplaced try block

/**
 * PUT /api/admin/advising/:id
 * Updates an advising record's status and sends an email.
 */
// Existing method to update advising status and send email
static async updateAdvisingStatus(req, res) {
  try {
    const advisingId = req.params.id;
    const { status, rejectionReason, feedback } = req.body;

    // Step 1: Update the advising record status
    const result = await AdvisingModel.updateStatusById(advisingId, status, rejectionReason, feedback);
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "failed", message: "Record not found" });
    }

    // Step 2: Retrieve advising record (for student email, planned courses, term)
    const advisingRecord = await AdvisingModel.getRecordById(advisingId);
    const { student_email: studentEmail, planned_courses, term } = advisingRecord;

    if (!studentEmail) {
      return res.status(500).json({
        status: "failed",
        message: "Error retrieving student's email",
      });
    }

    // Step 3: If Approved, insert planned_courses into completed_courses
    let insertedCourses = [];
    if (status === "Approved" && planned_courses) {
      let parsedCourses;

      try {
        parsedCourses = Array.isArray(planned_courses)
          ? planned_courses
          : JSON.parse(planned_courses);
      } catch (err) {
        parsedCourses = planned_courses.split(",").map((c) => c.trim()).filter(Boolean);
      }

      if (Array.isArray(parsedCourses) && parsedCourses.length > 0) {
        for (const courseName of parsedCourses) {
          try {
            await CompletedCoursesModel.setCompletedCourse(
              studentEmail,
              courseName,
              term || "Unknown",
              "IP" // In Progress
            );
            insertedCourses.push(courseName);
          } catch (insertErr) {
            logger.error(`❌ Failed to insert completed course '${courseName}' for ${studentEmail}:`, insertErr.message);
          }
        }
      } else {
        logger.warn("⚠️ Approved status but no valid planned_courses to insert.");
      }
    }

    // Step 4: Send the email to the student
    sendAdvisingEmail(studentEmail, status, feedback)
      .catch((err) => {
        logger.error("📧 Email sending failed:", err.message);
      });

    // Step 5: Return success response
    return res.status(200).json({
      status: "success",
      message: "Status updated successfully",
      insertedCourses,
    });

  } catch (error) {
    logger.error(`💥 Error updating advising status for ID ${req.params.id}:`, error.message);
    console.error("🧨 Stack trace:", error);
    return res.status(500).json({
      status: "failed",
      message: "Server Error: Status not updated",
      debug: error.message,
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
