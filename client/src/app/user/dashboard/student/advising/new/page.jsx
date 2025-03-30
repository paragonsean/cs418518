"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewAdvisingPage() {
  const router = useRouter();

  // Header fields
  const [date, setDate] = useState("");
  const [lastTerm, setLastTerm] = useState("");
  const [lastGpa, setLastGpa] = useState("");
  const [currentTerm, setCurrentTerm] = useState("");

  // For dynamic courses
  const [plannedCourses, setPlannedCourses] = useState([{ level: "", name: "" }]);

  // Example: fetch courses taken last term => prevent re-selection
  const [lastTermCourses, setLastTermCourses] = useState([]);

  useEffect(() => {
    // Pre-populate "date" with today's date
    const today = new Date().toISOString().split("T")[0];
    setDate(today);

    // Example fetch: if your backend route is GET /api/last-term-courses?term=...
    // (Or you might already have it in context.)
    // For demonstration, let's do a dummy array:
    setLastTermCourses(["CS 150", "CS 250"]); 
  }, []);

  // 1) Add dynamic row
  function addCourseRow() {
    setPlannedCourses([...plannedCourses, { level: "", name: "" }]);
  }

  // 2) Remove dynamic row
  function removeCourseRow(index) {
    const newCourses = [...plannedCourses];
    newCourses.splice(index, 1);
    setPlannedCourses(newCourses);
  }

  // 3) Update row data
  function handleCourseChange(index, field, value) {
    const newCourses = [...plannedCourses];
    newCourses[index][field] = value;
    setPlannedCourses(newCourses);
  }

  // 4) Submit form => POST to /api/advising
  async function handleSubmit(e) {
    e.preventDefault();

    // Convert "plannedCourses" to a comma-separated string or whatever your DB expects
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
          prerequisites: "N/A", // optional, or actual prerequisites
          student_name: "MyName", // You may get from user context
          planned_courses: plannedCoursesString,
          student_email: "myEmail@example.com", // from user context
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create advising record");
      }
      // On success, navigate back to the main advising page
      router.push("/user/dashboard/student/advising");
    } catch (error) {
      console.error("Error submitting advising form:", error);
      alert("Error: Unable to submit");
    }
  }

  return (
    <div className="mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">New Course Advising</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Date</label>
            <input
              type="date"
              className="border rounded w-full p-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
              placeholder="e.g. Fall 2024"
              required
            />
          </div>
        </div>

        {/* Planned Courses Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Planned Courses</h2>

          {plannedCourses.map((course, index) => {
            // isDisabled if the course is in lastTermCourses
            const isLastTerm = lastTermCourses.includes(course.name);

            return (
              <div key={index} className="flex gap-4 mb-2">
                {/* Level input */}
                <select
                  className="border rounded p-2 w-1/4"
                  value={course.level}
                  onChange={(e) => handleCourseChange(index, "level", e.target.value)}
                  required
                >
                  <option value="">Select Level</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                </select>

                {/* Course Name input */}
                <input
                  type="text"
                  className={`border rounded p-2 w-full ${
                    isLastTerm ? "bg-red-100" : ""
                  }`}
                  value={course.name}
                  onChange={(e) => handleCourseChange(index, "name", e.target.value)}
                  placeholder="e.g. CS 330"
                  required
                  disabled={isLastTerm}
                />

                {/* Remove button */}
                {plannedCourses.length > 1 && (
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

          <button
            type="button"
            onClick={addCourseRow}
            className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            + Add Course
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
