"use client";
import React, { useEffect, useState } from "react";
import {
  fetchAllCourses,  // Fetch all courses from /api/courses
} from "@/utils/courseActions.js";

import {
  fetchAdvisingRecords, // (Optional) If you still need to fetch existing records
  createAdvisingRecord, // Create a new advising record
} from "@/utils/advisingActions.js";

// NOTE: axios is no longer needed if you're not fetching user data
// import axios from "axios";

export default function Advising() {
  // ---------- STATE -----------
  const [courses, setCourses] = useState([]);
  const [lastTerm, setLastTerm] = useState("");
  const [gpa, setGPA] = useState("");
  const [currentTerm, setCurrentTerm] = useState("");
  const [todaysDate, setTodaysDate] = useState(new Date().toLocaleDateString());

  // For entering student info & plans
  const [typedStudentName, setTypedStudentName] = useState("");

  // For course selection
  const [plannedCoursesList, setPlannedCoursesList] = useState([
    { courseGroupLevel: "", courseName: "" },
  ]);
  const [prerequisiteCourseList, setPrerequisiteCourseList] = useState([
    { courseGroupLevel: "", courseName: "" },
  ]);

  // ---------- EFFECTS -----------
  useEffect(() => {
    // Load all courses on mount
    loadCourses();
  }, []);

  // ---------- API CALLS -----------
  const loadCourses = async () => {
    try {
      const data = await fetchAllCourses();
      console.log("Fetched courses:", data); // Debugging log
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading courses:", error);
      setCourses([]);
    }
  };

  // ---------- HANDLERS -----------
  const newRecord = async () => {
    // Convert plannedCoursesList to a comma-separated string
    const allPlannedCourses = plannedCoursesList
      .map((c) => c.courseName)
      .join(", ");

    // Convert prerequisiteCourseList to a comma-separated string
    const allPrereqCourses = prerequisiteCourseList
      .map((c) => c.courseName)
      .join(", ");

    // Build the record data
    const recordData = {
      date: todaysDate,
      current_term: currentTerm,
      last_term: lastTerm,
      last_gpa: gpa,
      prerequisites: allPrereqCourses,
      student_name: typedStudentName.trim(),
      planned_courses: allPlannedCourses,
      // If you do not have a student_email, remove or keep as needed
      // student_email: "",
    };

    try {
      await createAdvisingRecord(recordData);
      alert(`Course plan successfully added for ${typedStudentName.trim()}.`);
      window.location.reload();
    } catch (err) {
      console.error("Error adding new course plan:", err);
      alert("Internal Error: unable to add new course plan");
    }
  };

  // Add another course to plan
  const addPlannedCourse = () => {
    setPlannedCoursesList((prev) => [
      ...prev,
      { courseGroupLevel: "", courseName: "" },
    ]);
  };

  // Update planned course fields
  const handleCourseChange = (index, field, value) => {
    const updated = [...plannedCoursesList];
    updated[index][field] = value;
    setPlannedCoursesList(updated);
  };

  // Add another prerequisite
  const addPrereqCourse = () => {
    setPrerequisiteCourseList((prev) => [
      ...prev,
      { courseGroupLevel: "", courseName: "" },
    ]);
  };

  // Update prerequisite course fields
  const handlePrerequisiteChange = (index, field, value) => {
    const updated = [...prerequisiteCourseList];
    updated[index][field] = value;
    setPrerequisiteCourseList(updated);
  };

  // ---------- RENDER -----------
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center text-xl font-bold">Submit a New Course Plan</h2>

      <div className="mb-4">
        <label>Last Term Attended:</label>
        <input
          type="text"
          onChange={(e) => setLastTerm(e.target.value)}
          className="border rounded w-full p-2"
        />
      </div>

      <div className="mb-4">
        <label>GPA:</label>
        <input
          type="number"
          onChange={(e) => setGPA(e.target.value)}
          className="border rounded w-full p-2"
        />
      </div>

      <div className="mb-4">
        <label>Current Term:</label>
        <input
          type="text"
          onChange={(e) => setCurrentTerm(e.target.value)}
          className="border rounded w-full p-2"
        />
      </div>

      <div className="mb-4">
        <label>Course Selection:</label>
        {plannedCoursesList.map((course, index) => (
          <div key={index} className="flex gap-2 mb-2">
            {/* Course Level Dropdown */}
            <select
              value={course.courseGroupLevel}
              onChange={(e) =>
                handleCourseChange(index, "courseGroupLevel", e.target.value)
              }
              className="border rounded p-2"
            >
              <option value="">Select Level</option>
              {[100, 200, 300, 400].map((lvl) => (
                <option key={lvl} value={lvl}>
                  Level {lvl}
                </option>
              ))}
            </select>

            {/* Course Name Dropdown */}
            <select
              value={course.courseName}
              onChange={(e) =>
                handleCourseChange(index, "courseName", e.target.value)
              }
              className="border rounded p-2"
              disabled={!course.courseGroupLevel} // Prevent selection before level is chosen
            >
              <option value="">Select Course</option>
              {Array.isArray(courses) && courses.length > 0 ? (
                courses
                  .filter((c) => c.course_lvlGroup === course.courseGroupLevel)
                  .map((c) => (
                    <option
                      key={`${c.id || c.course_name}`}
                      value={c.course_name}
                    >
                      {c.course_name}
                    </option>
                  ))
              ) : (
                <option disabled>No courses available</option>
              )}
            </select>
          </div>
        ))}

        <button
          onClick={addPlannedCourse}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Course
        </button>
      </div>

      <div className="mb-4">
        <label>Prerequisite Courses:</label>
        {prerequisiteCourseList.map((course, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <select
              value={course.courseGroupLevel}
              onChange={(e) =>
                handlePrerequisiteChange(index, "courseGroupLevel", e.target.value)
              }
              className="border rounded p-2"
            >
              <option value="">Select Level</option>
              {[100, 200, 300, 400].map((lvl) => (
                <option key={lvl} value={lvl}>
                  Level {lvl}
                </option>
              ))}
            </select>

            <select
              value={course.courseName}
              onChange={(e) =>
                handlePrerequisiteChange(index, "courseName", e.target.value)
              }
              className="border rounded p-2"
              disabled={!course.courseGroupLevel}
            >
              <option value="">Select Course</option>
              {Array.isArray(courses) && courses.length > 0 ? (
                courses
                  .filter((c) => c.course_lvlGroup === course.courseGroupLevel)
                  .map((c) => (
                    <option key={`${c.id}-${c.course_name}`} value={c.course_name}>
                      {c.course_name}
                    </option>
                  ))
              ) : (
                <option disabled>No courses available</option>
              )}
            </select>
          </div>
        ))}

        <button
          onClick={addPrereqCourse}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Prerequisite Course
        </button>
      </div>

      <div className="mb-4">
        <label>Enter Your Full Name:</label>
        <input
          type="text"
          onChange={(e) => setTypedStudentName(e.target.value)}
          className="border rounded w-full p-2"
        />
      </div>

      <button onClick={newRecord} className="bg-green-500 text-white p-2 rounded">
        Submit Course Plan
      </button>
    </div>
  );
}
