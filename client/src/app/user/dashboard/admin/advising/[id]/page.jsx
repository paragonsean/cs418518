"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import publicRequest from "@/utils/public_request";
import urlJoin from "url-join";
import { getToken } from "@/lib/token_utils";
import { useAdminAdvisingComparison } from "@/hooks/use_admin_advising_form"; // Import the correct hook

const ReviewAdvisingRecord = () => {
  const { id } = useParams();
  const router = useRouter();

  const { availableCourses, coursePlan, setCoursePlan, loading, record } = useAdminAdvisingComparison(id);
  const [status, setStatus] = useState("Pending");
  const [feedback, setFeedback] = useState("");

  // Update status and feedback when record changes (in case of initial load)
  useEffect(() => {
    if (record) {
      setStatus(record.status || "Pending");
      setFeedback(record.feedback || "");
    }
  }, [record]);

  const handleSubmit = async () => {
    try {
      const token = getToken();
      const url = urlJoin(process.env.NEXT_PUBLIC_SERVER_URL, `/api/admin/advising/${id}`);
      const payload = { status, feedback };
      const result = await publicRequest(url, "PUT", payload, token);
      if (result.status === "error") {
        alert("Failed to update record.");
      } else {
        alert("Decision submitted!");
        router.push("/user/dashboard/admin/view-students");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Something went wrong.");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!record) return <p className="text-center">Advising record not found.</p>;

  return (
    <div className="container mx-auto mt-8 p-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Review Advising Submission — {record.student_name || record.student_email}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* History Section */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label>Last Term</label>
              <input className="w-full border px-2 py-1 rounded bg-gray-100" value={record.last_term || ""} disabled />
            </div>
            <div>
              <label>Last GPA</label>
              <input className="w-full border px-2 py-1 rounded bg-gray-100" value={record.last_gpa || ""} disabled />
            </div>
            <div>
              <label>Advising Term</label>
              <input className="w-full border px-2 py-1 rounded bg-gray-100" value={record.term || ""} disabled />
            </div>
          </div>

          {/* Course Plan Section */}
          <h3 className="font-semibold mb-2">Planned Courses</h3>
          {Array.isArray(coursePlan) && coursePlan.length > 0 ? (
            <div className="space-y-2 mb-6">
              {coursePlan.map((course, idx) => (
                <div key={`${course.courseLevel}-${idx}`} className="grid grid-cols-3 gap-4">
                  <input value={course.level} disabled className="border px-2 py-1 rounded bg-gray-100" />
                  <input value={course.courseLevel} disabled className="border px-2 py-1 rounded bg-gray-100" />
                  <input value={course.name} disabled className="border px-2 py-1 rounded bg-gray-100" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No planned courses submitted.</p>
          )}

          {/* Admin Controls */}
          <div className="grid grid-cols-2 gap-4 my-4">
            <div>
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border px-2 py-1 rounded">
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label>Message</label>
              <input
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full border px-2 py-1 rounded"
                placeholder="Feedback to student"
              />
            </div>
          </div>

          <Button onClick={handleSubmit}>Submit</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewAdvisingRecord;
