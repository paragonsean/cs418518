import CompletedCoursesModel from "../models/completed_courses_model.js";

const CompletedCoursesController = {
  // Delete a completed course for a student
async deleteCompletedCourse(req, res) {
  try {
    const email = req.user.email;
    const { course_name, term } = req.body;

    if (!email || !course_name || !term) {
      return res.status(400).json({ message: "Missing required fields: email, course_name, or term" });
    }

    const result = await CompletedCoursesModel.deleteCompletedCourse(email, course_name, term);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting completed course:", error);
    res.status(500).json({ message: "Server error while deleting completed course" });
  }
},
  // Fetch completed courses for the authenticated student
  async getCompletedCoursesByEmail(req, res) {
    try {
      const email = req.user.email;
      if (!email) {
        return res.status(400).json({ message: "User email not found in token" });
      }

      let courses = await CompletedCoursesModel.getCompletedCoursesByEmail(email);
      if (!courses || courses.length === 0) {
        // If no courses are found, insert "Orientation"
        console.log("No completed courses found. Adding 'Orientation' course.");
        await CompletedCoursesModel.setCompletedCourse(email, "Orientation", "N/A", "IP");
        
        // Fetch the updated courses after adding "Orientation"
        courses = await CompletedCoursesModel.getCompletedCoursesByEmail(email);
        
        // Return the updated courses list with "Orientation" added
        return res.status(200).json(courses);
      }

      res.status(200).json(courses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  
  // Admin: Fetch completed courses for any student by email
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
