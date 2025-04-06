"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchAdvisingRecordById, updateAdvisingRecord } from "@/utils/advisingActions";
import { fetchAllCourses } from "@/utils/courseActions";
import Cookies from "js-cookie";

const EditAdvisingForm = () => {
  const router = useRouter();
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state fields
  const [history, setHistory] = useState({ lastTerm: "", lastGPA: "", currentTerm: "" });
  const [typedStudentName, setTypedStudentName] = useState("");
  const [coursePlan, setCoursePlan] = useState([]);

  // Courses and prerequisites
  const [availableCourses, setAvailableCourses] = useState([]);
  const [courseLevels, setCourseLevels] = useState([]);
  const [coursePrerequisites, setCoursePrerequisites] = useState({});
  const [completedCourses, setCompletedCourses] = useState([]);

  const availableTerms = [
    "Spring 2024",
    "Summer 2024",
    "Fall 2024",
    "Spring 2025",
    "Summer 2025",
    "Fall 2025",
  ];
  const todaysDate = new Date().toISOString().split("T")[0];

  // Fetch advising record by ID
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const data = await fetchAdvisingRecordById(id);
        setRecord(data);
      } catch (error) {
        console.error("Error fetching advising record:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRecord();
  }, [id]);

  // Fetch available courses & extract levels/prerequisites
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

  // Fetch completed courses
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

  // Pre-populate form fields when record and courses are available
  useEffect(() => {
    if (record && availableCourses.length > 0) {
      // Pre-populate term and GPA fields (assuming these keys exist in your record)
      setHistory({
        lastTerm: record.last_term || "",
        lastGPA: record.last_gpa || "",
        currentTerm: record.current_term || "",
      });
      setTypedStudentName(record.student_name || "");

      // Pre-populate course plan from the planned_courses field (assumed to be comma-separated)
      if (record.planned_courses) {
        const plannedCourseLevels = record.planned_courses.split(",").map((item) => item.trim());
        // Try to find the matching course details for each courseLevel
        const prepopulatedPlan = plannedCourseLevels.map((courseLevelValue) => {
          const matchedCourse = availableCourses.find(
            (course) => course.course_level === courseLevelValue
          );
          if (matchedCourse) {
            return {
              level: matchedCourse.course_lvlGroup,
              courseLevel: matchedCourse.course_level,
              name: matchedCourse.course_name,
            };
          } else {
            return {
              level: "",
              courseLevel: courseLevelValue,
              name: "",
            };
          }
        });
        setCoursePlan(prepopulatedPlan);
      }
    }
  }, [record, availableCourses]);

  // Add a new course row
  const handleAddCourse = () => {
    setCoursePlan([...coursePlan, { level: "", courseLevel: "", name: "" }]);
  };

  // Handle course plan changes
  const handleCourseChange = (index, field, value) => {
    setCoursePlan((prevPlan) => {
      const updatedPlan = [...prevPlan];
      updatedPlan[index][field] = value;
      if (field === "level") {
        updatedPlan[index]["courseLevel"] = "";
        updatedPlan[index]["name"] = "";
      }
      if (field === "courseLevel") {
        updatedPlan[index]["name"] = "";
      }
      return updatedPlan;
    });
  };

  // Filter available courses by selected level
  const filterAvailableCourses = (level) => {
    if (!level) return [];
    return availableCourses.filter(
      (course) => String(course.course_lvlGroup) === String(level)
    );
  };

  // Format course plan for updating (comma-separated string of course levels)
  const formatPlannedCourses = () => coursePlan.map((c) => c.courseLevel).join(", ");

  // Format prerequisites from course plan
  const formatPrerequisites = () =>
    coursePlan.flatMap((c) => coursePrerequisites[c.name] || []).join(", ");

  // Handle form submission to update the record
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedRecord = {
      date: todaysDate,
      current_term: history.currentTerm,
      last_term: history.lastTerm,
      last_gpa: history.lastGPA,
      prerequisites: formatPrerequisites(),
      student_name: typedStudentName.trim(),
      planned_courses: formatPlannedCourses(),
      student_email: record.student_email, // Preserved from original record
    };

    try {
      await updateAdvisingRecord(id, updatedRecord);
      alert("Advising record updated successfully!");
      router.push("/user/dashboard/student/advising/");
    } catch (error) {
      console.error("Error updating advising record:", error);
      alert("Failed to update advising record.");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!record) return <p className="text-center">Record not found</p>;

  return (
    <div className="container mx-auto mt-8 p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Edit Advising Record</CardTitle>
          <p className="text-gray-600">Editing record for: {record.student_email}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <h3 className="text-md font-semibold mb-2">Update Course Plan</h3>

            {/* Term & GPA Inputs */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <select
                className="border p-2 rounded-md"
                value={history.lastTerm}
                onChange={(e) => setHistory({ ...history, lastTerm: e.target.value })}
                required
              >
                <option value="" disabled>
                  Select Last Term
                </option>
                {availableTerms.map((term) => (
                  <option key={`last-${term}`} value={term}>
                    {term}
                  </option>
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
                <option value="" disabled>
                  Select Current Term
                </option>
                {availableTerms.map((term) => (
                  <option key={`current-${term}`} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>

            {/* Student Name Input */}
            <div className="mb-4">
              <Input
                placeholder="Student Name"
                value={typedStudentName}
                onChange={(e) => setTypedStudentName(e.target.value)}
                required
              />
            </div>

            {/* Course Plan Table */}
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
                        <option value="" disabled>
                          Select Level
                        </option>
                        {courseLevels.map((lvl) => (
                          <option key={`level-${lvl}`} value={lvl}>
                            {lvl}
                          </option>
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
                        <option value="" disabled>
                          Select Course Level
                        </option>
                        {filterAvailableCourses(course.level).map((c) => (
                          <option key={`courseLevel-${c.course_level}`} value={c.course_level}>
                            {c.course_level}
                          </option>
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
                        <option value="" disabled>
                          Select Course
                        </option>
                        {availableCourses
                          .filter((c) => c.course_level === course.courseLevel)
                          .map((c) => {
                            const isCompleted = completedCourses.some(
                              (completed) => completed.course_name === c.course_level
                            );
                            return (
                              <option
                                key={`courseName-${c.course_name}`}
                                value={c.course_name}
                                disabled={isCompleted}
                              >
                                {c.course_name} {isCompleted ? "(Completed)" : ""}
                              </option>
                            );
                          })}
                      </select>
                    </TableCell>
                    <TableCell>
                      {(coursePrerequisites[course.name] || []).join(", ") || "None"}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => setCoursePlan(coursePlan.filter((_, i) => i !== index))}>
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
              Update Record
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditAdvisingForm;
