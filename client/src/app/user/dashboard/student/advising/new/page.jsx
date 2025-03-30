"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useCourses from "@/hooks/useCourses"; // ✅ Use your custom hook

export default function NewAdvisingPage() {
  const router = useRouter();

  // Admin/frozen state
  const isAdmin = true; // Replace with context/session logic
  const [status, setStatus] = useState("Pending");
  const isFrozen = status === "Approved" || status === "Rejected";
  const [adminMessage, setAdminMessage] = useState("Everything looks good");

  // Header fields
  const [date, setDate] = useState("");
  const [lastTerm, setLastTerm] = useState("");
  const [lastGpa, setLastGpa] = useState("");
  const [currentTerm, setCurrentTerm] = useState("");

  // Courses
  const [plannedCourses, setPlannedCourses] = useState([{ level: "", name: "" }]);
  const [lastTermCourses, setLastTermCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  // ✅ Use your custom course hook
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();

  // ✅ Populate header and course name list
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);

    setLastTermCourses(["CS 150", "CS 250"]); // Replace later with real logic

    if (courses.length > 0) {
      const names = courses.map((c) => c.course_name);
      setAvailableCourses(names);
    }
  }, [courses]);

  // Dynamic course row handlers
  const addCourseRow = () => setPlannedCourses([...plannedCourses, { level: "", name: "" }]);

  const removeCourseRow = (index) => {
    const updated = [...plannedCourses];
    updated.splice(index, 1);
    setPlannedCourses(updated);
  };

  const handleCourseChange = (index, field, value) => {
    const updated = [...plannedCourses];
    updated[index][field] = value;
    setPlannedCourses(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const plannedCoursesString = plannedCourses
      .map((c) => `${c.level} ${c.name}`)
      .join(", ");

    try {
      const res = await fetch("/api/advising", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          current_term: currentTerm,
          last_term: lastTerm,
          last_gpa: lastGpa,
          prerequisites: "N/A",
          student_name: "MyName",
          student_email: "myEmail@example.com",
          planned_courses: plannedCoursesString,
          status,
          admin_message: adminMessage,
        }),
      });

      if (!res.ok) throw new Error("Failed to create advising record");
      router.push("/user/dashboard/student/advising");
    } catch (error) {
      console.error("Error submitting advising form:", error);
      alert("Error: Unable to submit advising form.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">New Course Advising</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Date</label>
            <input
              type="date"
              className="border rounded w-full p-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              readOnly={isFrozen || !isAdmin}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Last Term</label>
            <input
              type="text"
              className="border rounded w-full p-2"
              value={lastTerm}
              onChange={(e) => setLastTerm(e.target.value)}
              readOnly={isFrozen || !isAdmin}
              placeholder="e.g. Spring 2024"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Last GPA</label>
            <input
              type="text"
              className="border rounded w-full p-2"
              value={lastGpa}
              onChange={(e) => setLastGpa(e.target.value)}
              readOnly={isFrozen || !isAdmin}
              placeholder="e.g. 3.75"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Current Term</label>
            <input
              type="text"
              className="border rounded w-full p-2"
              value={currentTerm}
              onChange={(e) => setCurrentTerm(e.target.value)}
              readOnly={isFrozen || !isAdmin}
              placeholder="e.g. Fall 2024"
              required
            />
          </div>
        </div>

        {/* Courses */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Planned Courses</h2>

          {coursesLoading && <p className="text-gray-500">Loading courses...</p>}
          {coursesError && <p className="text-red-500">Error: {coursesError}</p>}

          {plannedCourses.map((course, index) => {
            const isLastTerm = lastTermCourses.includes(course.name);
            const disabled = isFrozen || !isAdmin || isLastTerm;

            return (
              <div key={index} className="flex gap-4 mb-2">
                {/* Level */}
                <select
                  className="border rounded p-2 w-1/4"
                  value={course.level}
                  onChange={(e) => handleCourseChange(index, "level", e.target.value)}
                  disabled={isFrozen || !isAdmin}
                  required
                >
                  <option value="">Select Level</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                </select>

                {/* Course Name */}
                <select
                  className={`border rounded p-2 w-full ${isLastTerm ? "bg-red-100" : ""}`}
                  value={course.name}
                  onChange={(e) => handleCourseChange(index, "name", e.target.value)}
                  disabled={disabled}
                  required
                >
                  <option value="">Select Course</option>
                  {availableCourses.map((courseName) => (
                    <option
                      key={courseName}
                      value={courseName}
                      disabled={lastTermCourses.includes(courseName)}
                    >
                      {courseName}
                    </option>
                  ))}
                </select>

                {/* Remove Button */}
                {plannedCourses.length > 1 && isAdmin && !isFrozen && (
                  <button
                    type="button"
                    onClick={() => removeCourseRow(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    X
                  </button>
                )}
              </div>
            );
          })}

          {isAdmin && !isFrozen && (
            <button
              type="button"
              onClick={addCourseRow}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              + Add Course
            </button>
          )}
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="border-t pt-4 mt-6">
            <h2 className="text-lg font-semibold mb-2">Admin Decision</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Status</label>
                <select
                  className="border rounded w-full p-2"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Message</label>
                <input
                  type="text"
                  className="border rounded w-full p-2"
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
