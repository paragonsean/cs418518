// File: models/courseModel.js
import pool from "../config/connectdb.js";

/**
 * A simple CourseModel class demonstrating CRUD operations 
 * against the `courses` table.
 */
class CourseModel {
  // 1) Get all courses
  static getAllCourses() {
    return new Promise((resolve, reject) => {
      pool.execute("SELECT * FROM courses", (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // 2) Get course by course level
  static getCourseByLevel(level) {
    return new Promise((resolve, reject) => {
      pool.execute(
        "SELECT * FROM courses WHERE course_level = ?",
        [level],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }

  // 3) Update course name by course level
  static updateCourseName(level, newName) {
    return new Promise((resolve, reject) => {
      pool.execute(
        "UPDATE courses SET course_name=? WHERE course_level=?",
        [newName, level],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }

  // 4) Update course prerequisite by course level
  static updatePrerequisite(level, prerequisite) {
    return new Promise((resolve, reject) => {
      pool.execute(
        "UPDATE courses SET prerequisite=? WHERE course_level=?",
        [prerequisite, level],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }

  // 5) Insert a new course
  static addCourse(courseData) {
    const { course_name, course_level, prerequisite, course_lvlGroup } =
      courseData;
    return new Promise((resolve, reject) => {
      pool.execute(
        `INSERT INTO courses 
         (course_name, course_level, prerequisite, course_lvlGroup) 
         VALUES (?, ?, ?, ?)`,
        [course_name, course_level, prerequisite, course_lvlGroup],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }

  // 6) Delete a course by level
  static deleteCourse(level) {
    return new Promise((resolve, reject) => {
      pool.execute(
        "DELETE FROM courses WHERE course_level=?",
        [level],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }
}

export default CourseModel;
