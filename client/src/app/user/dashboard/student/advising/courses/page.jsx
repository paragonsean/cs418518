"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useProfile from "@/hooks/use_profile";
import { fetchAdvisingRecords, createAdvisingRecord } from "@/utils/advising_actions";
import { fetchAllCourses } from "@/utils/course_actions";
import Cookies from "js-cookie";
import { fetchCompletedCourses } from "@/utils/advising_api";  // Importing the function

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
  const [completedCourses, setCompletedCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const todaysDate = new Date().toISOString().split("T")[0];

  const availableTerms = ["Spring 2024", "Summer 2024", "Fall 2024", "Spring 2025", "Summer 2025", "Fall 2025"];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getProfile();
        if (profile?.user?.u_email) {
          setEmail(profile.user.u_email);
          setTypedStudentName(`${profile.user.u_first_name} ${profile.user.u_last_name}`);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [getProfile]);

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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await fetchAllCourses();
        setAvailableCourses(courses || []);
        const levels = [...new Set(courses.map(course => course.course_lvlGroup))].sort();
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

  // Using the imported function to fetch completed courses
  useEffect(() => {
    const fetchCompletedCoursesData = async () => {
      try {
        const completedData = await fetchCompletedCourses();  // Use the imported method
        setCompletedCourses(completedData);
      } catch (error) {
        setErrorMessage("Error fetching completed courses.");
        console.error("Error fetching completed courses:", error);
      }
    };
    fetchCompletedCoursesData();
  }, []);

  const handleAddCourse = () => setCoursePlan([...coursePlan, { level: "", courseLevel: "", name: "" }]);

  const handleCourseChange = (index, field, value) => {
    setCoursePlan(prevPlan => {
      const updated = [...prevPlan];
      updated[index][field] = value;
      if (field === "level") {
        updated[index].courseLevel = "";
        updated[index].name = "";
      }
      if (field === "courseLevel") updated[index].name = "";
      return updated;
    });
  };

  const formatPlannedCourses = () => coursePlan.map(c => c.courseLevel).join(", ");
  const formatPrerequisites = () => coursePlan.flatMap(c => coursePrerequisites[c.name] || []).join(", ");

  const newRecord = async () => {
    const recordData = {
      date: todaysDate,
      current_term: history.currentTerm,
      last_term: history.lastTerm,
      last_gpa: history.lastGPA,
      prerequisites: formatPrerequisites(),
      student_name: typedStudentName.trim(),
      planned_courses: formatPlannedCourses(),
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
          <p className="text-gray-600">{email ? `Logged in as: ${email}` : "Fetching email..."}</p>
        </CardHeader>

        <CardContent>
          {errorMessage && <p className="text-center text-red-500">{errorMessage}</p>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              newRecord();
            }}
          >
            <h3 className="text-md font-semibold mb-2">New Course Plan</h3>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <select
                className="border p-2 rounded-md"
                value={history.lastTerm}
                onChange={(e) => setHistory({ ...history, lastTerm: e.target.value })}
                required
              >
                <option value="" disabled>Select Last Term</option>
                {availableTerms.map(term => (
                  <option key={`last-${term}`} value={term}>{term}</option>
                ))}
              </select>

              <Input
                type="number"
                step="0.01"
                placeholder="Last GPA"
                value={history.lastGPA}
                onChange={(e) => setHistory({ ...history, lastGPA: e.target.value })}
                required
              />

              <select
                className="border p-2 rounded-md"
                value={history.currentTerm}
                onChange={(e) => setHistory({ ...history, currentTerm: e.target.value })}
                required
              >
                <option value="" disabled>Select Current Term</option>
                {availableTerms.map(term => (
                  <option key={`current-${term}`} value={term}>{term}</option>
                ))}
              </select>
            </div>

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
                    <TableCell>
                      <select
                        className="border p-2 rounded-md"
                        value={course.level}
                        onChange={(e) => handleCourseChange(index, "level", e.target.value)}
                      >
                        <option value="" disabled>Select Level</option>
                        {courseLevels.map(lvl => (
                          <option key={`level-${lvl}`} value={lvl}>{lvl}</option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell>
                      <select
                        className="border p-2 rounded-md"
                        value={course.courseLevel}
                        onChange={(e) => handleCourseChange(index, "courseLevel", e.target.value)}
                        disabled={!course.level}
                      >
                        <option value="" disabled>Select Course Level</option>
                        {availableCourses
                          .filter(c => c.course_lvlGroup === course.level)
                          .map(c => (
                            <option key={`courseLevel-${c.course_level}`} value={c.course_level}>{c.course_level}</option>
                          ))}
                      </select>
                    </TableCell>
                    <TableCell>
                      <select
                        className="border p-2 rounded-md"
                        value={course.name}
                        onChange={(e) => handleCourseChange(index, "name", e.target.value)}
                        disabled={!course.courseLevel}
                      >
                        <option value="" disabled>Select Course</option>
                        {availableCourses
                          .filter(c => c.course_level === course.courseLevel)
                          .map(c => {
                            const isCompleted = completedCourses.some(
                              completed => completed.course_name === c.course_level
                            );
                            return (
                              <option
                                key={`courseName-${c.course_name}`}
                                value={c.course_name}
                                disabled={isCompleted}
                              >
                                {c.course_name}{isCompleted ? " (Completed)" : ""}
                              </option>
                            );
                          })}
                      </select>
                    </TableCell>
                    <TableCell>{(coursePrerequisites[course.name] || []).join(", ") || "None"}</TableCell>
                    <TableCell>
                      <Button type="button" onClick={() => setCoursePlan(coursePlan.filter((_, i) => i !== index))}>Remove</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Button type="button" onClick={handleAddCourse} className="mt-4">➕ Add Course</Button>
            <Button type="submit" className="mt-4 ml-4">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvisingForm;
