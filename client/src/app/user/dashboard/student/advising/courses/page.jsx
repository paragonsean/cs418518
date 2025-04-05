"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

// UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Hooks & Utils
import useProfile from "@/hooks/use_profile";
import { fetchAdvisingRecords, createAdvisingRecord } from "@/utils/advising_api";
import { useAdvisingFormLogic } from "@/hooks/use_advising_form";
import CoursePlanTable from "@/components/courses/course_table";

// Common components
import HistoryFields from "@/components/courses/history_fields";
import  LoadingIndicator  from "@/components/LoadingIndicater";

const AdvisingForm = () => {
  // 1) Profile & Email
  const { getProfile } = useProfile();
  const [email, setEmail] = useState(null);
  const [typedStudentName, setTypedStudentName] = useState("");

  // 2) Advising Records (if needed)
  const [advisingRecords, setAdvisingRecords] = useState([]);

  // 3) History fields
  const [history, setHistory] = useState({
    lastTerm: "",
    lastGPA: "",
    currentTerm: "",
  });

  // 4) “Date” in YYYY-MM-DD format
  const todaysDate = new Date().toISOString().split("T")[0];

  // 5) Predefined Terms
  const availableTerms = [
    "Spring 2024", "Summer 2024", "Fall 2024",
    "Spring 2025", "Summer 2025", "Fall 2025",
  ];

  // 6) Use the custom hook for Course Plan Logic
  const {
    coursePlan,
    setCoursePlan,
    courseLevels,
    availableCourses,
    completedCourses,
    coursePrerequisites,
    handleAddCourse,
    handleCourseChange,
    filterAvailableCourses,
    formatPlannedCourses,
    formatPrerequisites,
  } = useAdvisingFormLogic();

  // 7) Fetch Profile & Email
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

  // 8) Fetch Advising Records Once We Have Email
  useEffect(() => {
    if (!email) return;
    (async () => {
      try {
        const records = await fetchAdvisingRecords();
        setAdvisingRecords(records || []);
      } catch (error) {
        console.error("Error fetching advising records:", error);
      }
    })();
  }, [email]);

  // 9) Handle Form Submission
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

      // Reset fields
      setHistory({ lastTerm: "", lastGPA: "", currentTerm: "" });
      setCoursePlan([]);
      setTypedStudentName("");
    } catch (error) {
      console.error("Error submitting advising form:", error);
      alert("Submission failed.");
    }
  };

  const removeCourseRow = (rowIndex) => {
    setCoursePlan((prev) => prev.filter((_, i) => i !== rowIndex));
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
          {/* Show loading indicator if needed */}
          {availableCourses.length === 0 ? (
            <LoadingIndicator />
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                newRecord();
              }}
            >
              <h3 className="text-md font-semibold mb-2">History</h3>
              
              {/* Use HistoryFields for common Term/GPA inputs */}
              <HistoryFields
                availableTerms={availableTerms}
                history={history}
                setHistory={setHistory}
              />

              <h3 className="text-md font-semibold mb-2">Course Plan</h3>
              <CoursePlanTable
                coursePlan={coursePlan}
                courseLevels={courseLevels}
                availableCourses={availableCourses}
                completedCourses={completedCourses}
                coursePrerequisites={coursePrerequisites}
                filterAvailableCourses={filterAvailableCourses}
                handleCourseChange={handleCourseChange}
                removeCourseRow={removeCourseRow}
                onAddCourse={handleAddCourse}
              />

              <Button type="submit" className="mt-4">
                Submit
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvisingForm;