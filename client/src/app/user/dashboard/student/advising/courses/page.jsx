"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useProfile from "@/hooks/useProfile";
import { fetchAdvisingRecords, createAdvisingRecord } from "@/utils/advisingActions";
import { fetchAllCourses } from "@/utils/courseActions";

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

  const todaysDate = new Date().toISOString().split("T")[0];

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

  // Add a Course to the Plan
  const handleAddCourse = () => {
    setCoursePlan([...coursePlan, { level: "", name: "" }]);
  };

  // Handle Course Selection Change
  const handleCourseChange = (index, field, value) => {
    setCoursePlan((prevPlan) => {
      const updatedCourses = [...prevPlan];
      updatedCourses[index][field] = value;

      if (field === "level") {
        updatedCourses[index]["name"] = "";
      }

      return updatedCourses;
    });
  };

  // Filter Available Courses by Level
  const filterAvailableCourses = (level) => {
    if (!level) return [];
    return availableCourses.filter((course) => String(course.course_lvlGroup) === String(level));
  };

  // Convert course plan into a comma-separated string
  const formatPlannedCourses = () => coursePlan.map((c) => c.name).join(", ");
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
          <p className="text-gray-600">{email ? `Logged in as: ${email}` : "Fetching email..."}</p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              newRecord();
            }}
          >
            <h3 className="text-md font-semibold mb-2">New Course Plan</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Input
                type="text"
                placeholder="Last Term"
                value={history.lastTerm}
                onChange={(e) => setHistory({ ...history, lastTerm: e.target.value })}
                required
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Last GPA"
                value={history.lastGPA}
                onChange={(e) => setHistory({ ...history, lastGPA: e.target.value })}
                required
              />
              <Input
                type="text"
                placeholder="Current Term"
                value={history.currentTerm}
                onChange={(e) => setHistory({ ...history, currentTerm: e.target.value })}
                required
              />
            </div>

            <h3 className="text-md font-semibold mb-2">Course Plan</h3>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-200">
                  <TableHead>Level</TableHead>
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
                        <option value="">Select Level</option>
                        {courseLevels.map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {lvl}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell>
                      <select
                        className="border p-2 rounded-md"
                        value={course.name}
                        onChange={(e) => handleCourseChange(index, "name", e.target.value)}
                        disabled={!course.level}
                      >
                        <option value="">Select Course</option>
                        {filterAvailableCourses(course.level).map((c) => (
                          <option key={c.course_name} value={c.course_name}>
                            {c.course_name}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell>{(coursePrerequisites[course.name] || []).join(", ") || "None"}</TableCell>
                    <TableCell>
                      <Button onClick={() => setCoursePlan(coursePlan.filter((_, i) => i !== index))}>
                         Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Button onClick={handleAddCourse}>➕ Add Course</Button>
            <Button type="submit" className="ml-4">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvisingForm;
