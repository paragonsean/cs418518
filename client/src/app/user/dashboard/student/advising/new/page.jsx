"use client";
import React, { useEffect, useState } from "react";
import {
  fetchAllCourses,  // Fetch all courses from /api/courses
} from "@/utils/courseActions.js";

import {
  fetchAdvisingRecordsByEmail, // Fetch advising records by email
  createAdvisingRecord,        // Create a new advising record
} from "@/utils/advisingActions.js";

import axios from "axios"; // Only needed if fetching user data

export default function Advising() {
  // ---------- STATE -----------
  const [courses, setCourses] = useState([]);
  const [lastTerm, setLastTerm] = useState("");
  const [gpa, setGPA] = useState("");
  const [currentTerm, setCurrentTerm] = useState("");
  const [todaysDate, setTodaysDate] = useState(new Date().toLocaleDateString());
  
  // Course plans & user information
  const [coursePlans, setCoursePlans] = useState([]);
  const [courseName, setCourseName] = useState(""); 
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [studentData, setStudentData] = useState([]);

  // For course selection
  const [plannedCoursesList, setPlannedCoursesList] = useState([
    { courseGroupLevel: "", courseName: "" },
  ]);
  const [prerequisiteCourseList, setPrerequisiteCourseList] = useState([
    { courseGroupLevel: "", courseName: "" },
  ]);

  // ---------- EFFECTS -----------
  useEffect(() => {
    // Get email from query params if available
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get("email"); 
    setEmail(userEmail);

    // Load courses
    loadCourses();

    // Fetch user data if email is provided
    if (userEmail) {
      fetchEmailData(userEmail);
    }
  }, []);

  // ---------- API CALLS -----------
  const loadCourses = async () => {
    try {
      const data = await fetchAllCourses();
      console.log("Fetched courses:", data); // ✅ Debugging log
  
      // ✅ Store all courses
      setCourses(Array.isArray(data) ? data : []);
  
      // ✅ Extract prerequisites directly from course data
      const prereqMap = data.reduce((acc, course) => {
        acc[course.course_name] = course.prerequisite ? course.prerequisite.split(", ") : [];
        return acc;
      }, {});
  
      setPrerequisiteCourseList(Object.entries(prereqMap).map(([courseName, prerequisites]) => ({
        courseName,
        prerequisites
      })));
  
    } catch (error) {
      console.error("Error loading courses:", error);
      setCourses([]);
    }
  };
  
  

  const fetchEmailData = async (userEmail) => {
    try {
      const response = await axios.get(`http://localhost:8000/user/${userEmail}`);
      setUserData(response.data[0]);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchAdvisingDataByEmail = async (email) => {
    try {
      const data = await fetchAdvisingRecordsByEmail(email);
      setStudentData(data);
    } catch (error) {
      console.error("Error fetching student advising data:", error);
    }
  };

  // ---------- HANDLERS -----------
  const handleButtonClick = async () => {
    const typedName = courseName.trim();
    const fullName = `${userData?.u_first_name} ${userData?.u_last_name}`;

    if (typedName === fullName) {
      setIsButtonClicked(true);
      if (userData?.u_email) {
        try {
          const data = await fetchAdvisingRecordsByEmail(userData.u_email);
          setCoursePlans(data);
        } catch (err) {
          console.error("Error fetching course plans by email:", err);
        }
      }
    } else {
      alert("Name mismatch. Enter the exact name on your student account.");
    }
  };

  const newRecord = async () => {
    if (!userData) {
      alert("User data is not loaded yet.");
      return;
    }

    await fetchAdvisingDataByEmail(userData.u_email);

    let allPlannedCourses = plannedCoursesList.map((c) => c.courseName).join(", ");
    let allPrereqCourses = prerequisiteCourseList.map((c) => c.courseName).join(", ");

    let alreadyTakenCount = studentData.length;
    studentData.forEach((student) => {
      if (allPlannedCourses === student.planned_courses) {
        alreadyTakenCount--;
      }
    });

    if (alreadyTakenCount === studentData.length) {
      const recordData = {
        date: todaysDate,
        current_term: currentTerm,
        last_term: lastTerm,
        last_gpa: gpa,
        prerequisites: allPrereqCourses,
        student_name: `${userData.u_first_name} ${userData.u_last_name}`,
        planned_courses: allPlannedCourses,
        student_email: userData.u_email,
      };

      try {
        await createAdvisingRecord(recordData);
        alert(`Course plan successfully added for ${userData.u_first_name}.`);
        window.location.reload();
      } catch (err) {
        console.error("Error adding new course plan:", err);
        alert("Internal Error: unable to add new course plan");
      }
    } else {
      alert(`You have already taken ${allPlannedCourses}. Course plan not submitted.`);
    }
  };

  const addPlannedCourse = () => {
    setPlannedCoursesList([...plannedCoursesList, { courseGroupLevel: "", courseName: "" }]);
  };

  const handleCourseChange = (index, field, value) => {
    const updated = [...plannedCoursesList];
    updated[index][field] = value;
    setPlannedCoursesList(updated);
  };

  const addPrereqCourse = () => {
    setPrerequisiteCourseList([...prerequisiteCourseList, { courseGroupLevel: "", courseName: "" }]);
  };

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
        <input type="text" onChange={(e) => setLastTerm(e.target.value)} className="border rounded w-full p-2" />
      </div>
      
      <div className="mb-4">
        <label>GPA:</label>
        <input type="number" onChange={(e) => setGPA(e.target.value)} className="border rounded w-full p-2" />
      </div>

      <div className="mb-4">
        <label>Current Term:</label>
        <input type="text" onChange={(e) => setCurrentTerm(e.target.value)} className="border rounded w-full p-2" />
      </div>

      <div className="mb-4">
  <label>Course Selection:</label>
  {plannedCoursesList.map((course, index) => (
    <div key={index} className="flex gap-2 mb-2">
      {/* Course Level Dropdown */}
      <select 
        value={course.courseGroupLevel} 
        onChange={(e) => handleCourseChange(index, "courseGroupLevel", e.target.value)} 
        className="border rounded p-2"
      >
        <option value="">Select Level</option>
        {[100, 200, 300, 400].map((lvl) => (
          <option key={lvl} value={lvl}>Level {lvl}</option>
        ))}
      </select>

      {/* Course Name Dropdown */}
      <select 
        value={course.courseName} 
        onChange={(e) => handleCourseChange(index, "courseName", e.target.value)} 
        className="border rounded p-2"
        disabled={!course.courseGroupLevel} // Prevent selection before level is chosen
      >
        <option value="">Select Course</option>
        {Array.isArray(courses) && courses.length > 0
          ? courses
              .filter(c => c.course_lvlGroup === course.courseGroupLevel)
              .map(c => (
                <option key={`${c.id || c.course_name}`} value={c.course_name}>
                {c.course_name}
              </option>
              
              ))
          : <option disabled>No courses available</option>
        }
      </select>
    </div>
  ))}
  
  <button onClick={addPlannedCourse} className="bg-blue-500 text-white p-2 rounded">
    Add Course
  </button>
</div>
      <div className="mb-4">
        <label>Prerequisite Courses:</label>
        {prerequisiteCourseList.map((course, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <select 
              value={course.courseGroupLevel} 
              onChange={(e) => handlePrerequisiteChange(index, "courseGroupLevel", e.target.value)} 
              className="border rounded p-2"
            >
              <option value="">Select Level</option>
              {[100, 200, 300, 400].map((lvl) => (
                <option key={lvl} value={lvl}>Level {lvl}</option>
              ))}
            </select>

            <select 
              value={course.courseName} 
              onChange={(e) => handlePrerequisiteChange(index, "courseName", e.target.value)} 
              className="border rounded p-2"
              disabled={!course.courseGroupLevel}
            >
              <option value="">Select Course</option>
              {Array.isArray(courses) && courses.length > 0
                ? courses
                    .filter(c => c.course_lvlGroup === course.courseGroupLevel)
                    .map(c => (
                      <option key={c.id} value={c.course_name}>
                        {c.course_name}
                      </option>
                    ))
                : <option disabled>No courses available</option>
              }
            </select>
          </div>
        ))}
        
        <button onClick={addPrereqCourse} className="bg-blue-500 text-white p-2 rounded">
          Add Prerequisite Course
        </button>
      </div>
      <div className="mb-4">
        <label>Enter Your Full Name:</label>
        <input type="text" onChange={(e) => setCourseName(e.target.value)} className="border rounded w-full p-2" />
      </div>

      <button onClick={newRecord} className="bg-green-500 text-white p-2 rounded">Submit Course Plan</button>
    </div>
  );
}
