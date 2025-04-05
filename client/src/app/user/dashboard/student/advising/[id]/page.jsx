"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchAdvisingRecordById, updateAdvisingRecord } from "@/utils/advisingActions";
import { useAdvisingFormLogic } from "@/hooks/useAdvisingForm";
import CoursePlanTable from "@/components/courses/CourseTable";
import HistoryFields from "@/components/courses/HistoryFields";

const EditAdvisingForm = () => {
  const router = useRouter();
  const { id } = useParams();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  // Local form fields
  const [history, setHistory] = useState({
    lastTerm: "",
    lastGPA: "",
    currentTerm: "",
  });
  const [typedStudentName, setTypedStudentName] = useState("");

  const {
    availableCourses,
    courseLevels,
    coursePlan,
    setCoursePlan,
    coursePrerequisites,
    completedCourses,
    handleAddCourse,
    handleCourseChange,
    filterAvailableCourses,
    formatPlannedCourses,
    formatPrerequisites,
  } = useAdvisingFormLogic();

  const availableTerms = [
    "Spring 2024",
    "Summer 2024",
    "Fall 2024",
    "Spring 2025",
    "Summer 2025",
    "Fall 2025",
  ];
  const todaysDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      try {
        const data = await fetchAdvisingRecordById(id);
        setRecord(data);
      } catch (error) {
        console.error("Error fetching advising record:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  // Pre-fill local states once record and courses are loaded
  useEffect(() => {
    if (record && availableCourses.length > 0) {
      setHistory({
        lastTerm: record.last_term || "",
        lastGPA: record.last_gpa || "",
        currentTerm: record.current_term || "",
      });
      setTypedStudentName(record.student_name || "");

      if (record.planned_courses) {
        const plannedLevels = record.planned_courses.split(",").map((s) => s.trim());
        const prepopulatedPlan = plannedLevels.map((levelVal) => {
          const found = availableCourses.find((c) => c.course_level === levelVal);
          if (found) {
            return {
              level: found.course_lvlGroup,
              courseLevel: found.course_level,
              name: found.course_name,
            };
          }
          return { level: "", courseLevel: levelVal, name: "" };
        });
        setCoursePlan(prepopulatedPlan);
      }
    }
  }, [record, availableCourses, setCoursePlan]);

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
      student_email: record?.student_email,
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
          <p className="text-gray-600">
            Editing record for: {record.student_email}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <h3 className="text-md font-semibold mb-2">Update Course Plan</h3>

            {/* Use HistoryFields for common inputs */}
            <HistoryFields
              availableTerms={availableTerms}
              history={history}
              setHistory={setHistory}
            />

            {/* Student Name */}
            <div className="mb-4">
              <Input
                placeholder="Student Name"
                value={typedStudentName}
                onChange={(e) => setTypedStudentName(e.target.value)}
                required
              />
            </div>

            {/* Course Plan Table */}
            <CoursePlanTable
              coursePlan={coursePlan}
              courseLevels={courseLevels}
              availableCourses={availableCourses}
              completedCourses={completedCourses}
              coursePrerequisites={coursePrerequisites}
              filterAvailableCourses={filterAvailableCourses}
              handleCourseChange={handleCourseChange}
              removeCourseRow={(idx) => setCoursePlan(coursePlan.filter((_, i) => i !== idx))}
              onAddCourse={handleAddCourse}
            />

            <Button type="submit" className="mt-4">
              Update Record
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditAdvisingForm;
