"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useProfile from "@/hooks/useProfile";
import { fetchAdvisingRecords, createAdvisingRecord } from "@/utils/advisingActions";
import { fetchAllCourses } from "@/utils/courseActions";
import Cookies from "js-cookie";

const AdvisingForm = () => {
  const { getProfile } = useProfile();
  const [email, setEmail] = useState(null);
  const [advisingRecords, setAdvisingRecords] = useState([]);
  const [history, setHistory] = useState({ lastTerm: "", lastGPA: "", currentTerm: "" });
  const [availableCourses, setAvailableCourses] = useState([]);
  const [courseLevels, setCourseLevels] = useState([]);
  const [coursePlan, setCoursePlan] = useState([]);
  const [coursePrerequisites, setCoursePrerequisites] = useState({});
  const [typedStudentName, setTypedStudentName] = useState("");

  // NEW: State for completed courses
  const [completedCourses, setCompletedCourses] = useState([]);

  const todaysDate = new Date().toISOString().split("T")[0];

  // Example list of available terms - adapt as needed
  const availableTerms = ["Spring 2024", "Summer 2024", "Fall 2024", "Spring 2025", "Summer 2025", "Fall 2025"];

  // Fetch User Profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getProfile();
        if (profile?.user?.u_email) {
          setEmail(profile.user.u_email);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch Advising Records When Email is Available
  useEffect(() => {
    if (!email) return;

    const fetchData = async () => {
      try {
        const records = await fetchAdvisingRecords();
        setAdvisingRecords(records || []);
      } catch (error) {
        console.error("Error fetching advising records:", error);
      }
    };

    fetchData();
  }, [email]);

  // Fetch Courses & Extract Prerequisites
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await fetchAllCourses();
        setAvailableCourses(courses || []);

        const levels = [...new Set(courses.map((course) => course.course_lvlGroup))].sort();
        setCourseLevels(levels);

        const prereqMap = courses.reduce((acc, course) => {
          acc[course.course_name] = course.prerequisite ? course.prerequisite.split(", ") : [];
          return acc;
        }, {});

        setCoursePrerequisites(prereqMap);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // NEW: Fetch Completed Courses
  useEffect(() => {
    const fetchCompletedCourses = async () => {
      try {
        const token = Cookies.get("jwt-token");
        if (!token) {
          console.error("No token found. User is not authenticated.");
          return;
        }
        const response = await fetch("http://localhost:8000/api/completed-courses/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setCompletedCourses(data);
        } else {
          console.error("Error fetching completed courses:", data.message);
        }
      } catch (error) {
        console.error("Error fetching completed courses:", error);
      }
    };

    fetchCompletedCourses();
  }, []);

  // Add a Course to the Plan
  const handleAddCourse = () => {
    setCoursePlan([...coursePlan, { level: "", courseLevel: "", name: "" }]);
  };

  // Handle Course Selection Change
  const handleCourseChange = (index, field, value) => {
    setCoursePlan((prevPlan) => {
      const updatedCourses = [...prevPlan];
      updatedCourses[index][field] = value;

      if (field === "level") {
        updatedCourses[index]["courseLevel"] = ""; // Reset course level
        updatedCourses[index]["name"] = "";        // Reset course name
      }
      if (field === "courseLevel") {
        updatedCourses[index]["name"] = "";        // Reset name
      }
      return updatedCourses;
    });
  };

  // Filter Available Courses by Level
  const filterAvailableCourses = (level) => {
    if (!level) return [];
    return availableCourses.filter((course) => String(course.course_lvlGroup) === String(level));
  };

  // Convert course plan into a comma-separated string of courseLevels
  const formatPlannedCourses = () => coursePlan.map((c) => c.courseLevel).join(", ");
  const formatPrerequisites = () =>
    coursePlan
      .flatMap((c) => coursePrerequisites[c.name] || [])
      .join(", ");

  // Function to Add a New Advising Record
  const newRecord = async () => {
    const allPlannedCourses = formatPlannedCourses();
    const allPrereqCourses = formatPrerequisites();

    const recordData = {
      date: todaysDate,
      current_term: history.currentTerm,
      last_term: history.lastTerm,
      last_gpa: history.lastGPA,
      prerequisites: allPrereqCourses,
      student_name: typedStudentName.trim(),
      planned_courses: allPlannedCourses,
      student_email: email,
    };

    try {
      await createAdvisingRecord(recordData);
      alert("Advising form submitted successfully!");
      setHistory({ lastTerm: "", lastGPA: "", currentTerm: "" });
      setCoursePlan([]);
      setTypedStudentName("");
    } catch (error) {
      console.error("Error submitting advising form:", error);
      alert("Submission failed.");
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Course Advising Form</CardTitle>
          <p className="text-gray-600">
            {email ? `Logged in as: ${email}` : "Fetching email..."}
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              newRecord();
            }}
          >
            <h3 className="text-md font-semibold mb-2">New Course Plan</h3>

            {/* Term/GPA Inputs */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Last Term dropdown */}
              <select
                className="border p-2 rounded-md"
                value={history.lastTerm}
                onChange={(e) => setHistory({ ...history, lastTerm: e.target.value })}
                required
              >
                <option value="" disabled>Select Last Term</option>
                {availableTerms.map((term) => (
                  <option key={`last-${term}`} value={term}>
                    {term}
                  </option>
                ))}
              </select>

              {/* Last GPA numeric input */}
              <Input
                type="number"
                step="0.01"
                placeholder="Last GPA"
                value={history.lastGPA}
                onChange={(e) => setHistory({ ...history, lastGPA: e.target.value })}
                required
              />

              {/* Current Term dropdown */}
              <select
                className="border p-2 rounded-md"
                value={history.currentTerm}
                onChange={(e) => setHistory({ ...history, currentTerm: e.target.value })}
                required
              >
                <option value="" disabled>Select Current Term</option>
                {availableTerms.map((term) => (
                  <option key={`current-${term}`} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Planning Table */}
            <h3 className="text-md font-semibold mb-2">Course Plan</h3>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-200">
                  <TableHead>Level</TableHead>
                  <TableHead>Course Level</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Prerequisite</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {coursePlan.map((course, index) => (
                  <TableRow key={index}>
                    {/* Column 1: Level */}
                    <TableCell>
                      <select
                        className="border p-2 rounded-md"
                        value={course.level}
                        onChange={(e) => handleCourseChange(index, "level", e.target.value)}
                      >
                        <option value="" disabled>Select Level</option>
                        {courseLevels.map((lvl) => (
                          <option key={`level-${lvl}`} value={lvl}>
                            {lvl}
                          </option>
                        ))}
                      </select>
                    </TableCell>

                    {/* Column 2: Course Level */}
                    <TableCell>
                      <select
                        className="border p-2 rounded-md"
                        value={course.courseLevel}
                        onChange={(e) => handleCourseChange(index, "courseLevel", e.target.value)}
                        disabled={!course.level}
                      >
                        <option value="" disabled>Select Course Level</option>
                        {availableCourses
                          .filter((c) => c.course_lvlGroup === course.level)
                          .map((c) => (
                            <option
                              key={`courseLevel-${c.course_level}`}
                              value={c.course_level}
                            >
                              {c.course_level}
                            </option>
                          ))}
                      </select>
                    </TableCell>

                    {/* Column 3: Course Name */}
                    {/* Column 3: Course Name */}
                    <TableCell>
                      <select
                        className="border p-2 rounded-md"
                        value={course.name}
                        onChange={(e) => handleCourseChange(index, "name", e.target.value)}
                        disabled={!course.courseLevel}
                      >
                        <option value="" disabled>Select Course</option>
                        {availableCourses
                          .filter(
                            (c) => c.course_level === course.courseLevel
                          )
                          .map((c) => {
                            // Check if the course_level (e.g., "CS 115") exists in completedCourses.course_name
                            const isCompleted = completedCourses.some(
                              (completed) => completed.course_name === c.course_level
                            );
                            return (
                              <option
                                key={`courseName-${c.course_name}`}
                                value={c.course_name}
                                disabled={isCompleted} // Gray out the option if completed
                              >
                                {c.course_name}
                                {isCompleted ? " (Completed)" : ""}
                              </option>
                            );
                          })}
                      </select>
                    </TableCell>


                    {/* Column 4: Prerequisite */}
                    <TableCell>
                      {(coursePrerequisites[course.name] || []).join(", ") || "None"}
                    </TableCell>

                    {/* Column 5: Action */}
                    <TableCell>
                      <Button
                        onClick={() =>
                          setCoursePlan(coursePlan.filter((_, i) => i !== index))
                        }
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Button type="button" onClick={handleAddCourse} className="mt-4">
              ➕ Add Course
            </Button>
            <Button type="submit" className="mt-4 ml-4">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvisingForm;
