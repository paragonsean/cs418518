"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditAdvisingPage() {
  const router = useRouter();
  const params = useParams();
  const advisingId = params.id; // e.g. 107, 90, etc.

  // Form fields
  const [date, setDate] = useState("");
  const [lastTerm, setLastTerm] = useState("");
  const [lastGpa, setLastGpa] = useState("");
  const [currentTerm, setCurrentTerm] = useState("");
  const [plannedCourses, setPlannedCourses] = useState([]);
  const [status, setStatus] = useState("Pending");
  const [readOnly, setReadOnly] = useState(false);

  // 1) Load existing record
  useEffect(() => {
    async function loadRecord() {
      try {
        const res = await fetch(`/api/advising/${advisingId}`);
        const data = await res.json();

        const record = data[0]; // If your API returns an array
        setDate(record.date);
        setLastTerm(record.last_term);
        setLastGpa(record.last_gpa);
        setCurrentTerm(record.current_term);
        setStatus(record.status);

        // Split planned_courses into dynamic rows if you stored them as CSV
        if (record.planned_courses) {
          const splitted = record.planned_courses.split(",").map((course) => {
            // e.g. "200 CS 250" if that’s how you stored it
            // or just "CS 250" => adapt accordingly
            return { level: "", name: course.trim() };
          });
          setPlannedCourses(splitted);
        }

        // 2) Freeze if status = Approved or Rejected
        if (record.status === "Approved" || record.status === "Rejected") {
          setReadOnly(true);
        }
      } catch (error) {
        console.error("Error loading record:", error);
      }
    }
    loadRecord();
  }, [advisingId]);

  // 3) Update dynamic rows, same as in "New"
  function handleCourseChange(index, field, value) {
    const newCourses = [...plannedCourses];
    newCourses[index][field] = value;
    setPlannedCourses(newCourses);
  }

  // 4) Save changes => PUT
  async function handleSubmit(e) {
    e.preventDefault();
    // if status is "Approved"/"Rejected", do nothing
    if (readOnly) {
      return;
    }

    // Convert plannedCourses to string
    const plannedCoursesString = plannedCourses
      .map((c) => (c.level ? `${c.level} ${c.name}` : c.name))
      .join(", ");

    try {
      // Possibly keep the status as "Pending"
      const res = await fetch(`/api/advising/${advisingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Pending", // or whatever new status you want
          rejectionReason: "N/A", // if you want to clear it
          // You might also want to store updated lastTerm, lastGpa, etc. if your backend supports it
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update record");
      }
      router.push("/user/dashboard/student/advising");
    } catch (error) {
      console.error("Error updating advising record:", error);
      alert("Error: Could not update record");
    }
  }

  return (
    <div className="mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">
        View / Edit Course Advising Record
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className="block font-semibold mb-1">Date</label>
            <input
              type="text"
              className="border rounded w-full p-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={readOnly}
            />
          </div>
          {/* Last Term */}
          <div>
            <label className="block font-semibold mb-1">Last Term</label>
            <input
              type="text"
              className="border rounded w-full p-2"
              value={lastTerm}
              onChange={(e) => setLastTerm(e.target.value)}
              disabled={readOnly}
            />
          </div>
          {/* Last GPA */}
          <div>
            <label className="block font-semibold mb-1">Last GPA</label>
            <input
              type="text"
              className="border rounded w-full p-2"
              value={lastGpa}
              onChange={(e) => setLastGpa(e.target.value)}
              disabled={readOnly}
            />
          </div>
          {/* Current Term */}
          <div>
            <label className="block font-semibold mb-1">Current Term</label>
            <input
              type="text"
              className="border rounded w-full p-2"
              value={currentTerm}
              onChange={(e) => setCurrentTerm(e.target.value)}
              disabled={readOnly}
            />
          </div>
        </div>

        {/* Planned Courses Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Planned Courses</h2>

          {plannedCourses.map((course, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <input
                type="text"
                className="border rounded p-2 w-1/3"
                value={course.level}
                onChange={(e) =>
                  handleCourseChange(index, "level", e.target.value)
                }
                disabled={readOnly}
              />
              <input
                type="text"
                className="border rounded p-2 w-full"
                value={course.name}
                onChange={(e) =>
                  handleCourseChange(index, "name", e.target.value)
                }
                disabled={readOnly}
              />
            </div>
          ))}
        </div>

        {/* Submit Button (only if pending) */}
        {!readOnly && (
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        )}
        {readOnly && (
          <p className="text-gray-500">
            This record is <strong>{status}</strong> and cannot be edited.
          </p>
        )}
      </form>
    </div>
  );
}
