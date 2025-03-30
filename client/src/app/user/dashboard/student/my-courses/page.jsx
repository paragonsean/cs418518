"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import publicRequest from "@/utils/publicRequest"; // Import API request handler
import Cookies from "js-cookie"; // To get JWT token from cookies

const AdvisingForm = () => {
  const [history, setHistory] = useState({
    lastTerm: "",
    lastGPA: "",
    currentTerm: "",
  });

  const [availableCourses, setAvailableCourses] = useState([]); // All courses from API
  const [coursePlan, setCoursePlan] = useState([]); // Selected courses for advising
  const token = Cookies.get("jwt-token"); // Fetch JWT token for authentication

  useEffect(() => {
    fetchCourses();
  }, []);

  // ✅ Fetch courses from API
  const fetchCourses = async () => {
    const response = await publicRequest("/courses/all", "GET", null, token);
    if (response.status === "success") {
      setAvailableCourses(response.data);
    } else {
      console.error("Error fetching courses:", response.message);
    }
  };

  // ✅ Add a new course row
  const handleAddCourse = () => {
    setCoursePlan([...coursePlan, { level: "", name: "" }]);
  };

  // ✅ Update course selection
  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...coursePlan];
    updatedCourses[index][field] = value;
    setCoursePlan(updatedCourses);
  };

  // ✅ Prevent re-selection of already taken courses
  const filterAvailableCourses = (level) => {
    return availableCourses.filter(
      (course) => course.course_level === level && !coursePlan.some((c) => c.name === course.course_name)
    );
  };

  // ✅ Submit advising form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const advisingData = {
      ...history,
      plannedCourses: coursePlan,
      status: "Pending",
    };

    const response = await publicRequest("/courseadvising", "POST", advisingData, token);
    if (response.status === "success") {
      alert("Advising form submitted successfully!");
      setHistory({ lastTerm: "", lastGPA: "", currentTerm: "" });
      setCoursePlan([]);
    } else {
      alert(`Error: ${response.message}`);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Course Advising Form</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* ✅ History Section */}
            <h3 className="text-md font-semibold mb-2">History</h3>
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

            {/* ✅ Course Plan Section */}
            <h3 className="text-md font-semibold mb-2">Course Plan</h3>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-200">
                  <TableHead>Level</TableHead>
                  <TableHead>Course Name</TableHead>
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
                        {[100, 200, 300, 400].map((lvl) => (
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
                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() => setCoursePlan(coursePlan.filter((_, i) => i !== index))}
                      >
                        ❌ Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* ✅ Add Course Button */}
            <Button type="button" className="mt-4" onClick={handleAddCourse}>
              ➕ Add Course
            </Button>

            {/* ✅ Submit Button */}
            <Button type="submit" className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvisingForm;
