"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CourseAdvisingPage() {
  const router = useRouter();
  const [advisingRecords, setAdvisingRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1) Fetch history from your backend
  async function loadHistory() {
    try {
      setLoading(true);
      // Example: if your backend route is GET /api/advising?studentName=XYZ
      // or it could be /api/advising/:name
      const res = await fetch("/api/advising"); 
      const data = await res.json();
      setAdvisingRecords(data);
    } catch (error) {
      console.error("Error fetching advising history:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  // 2) Render table with columns: Date, Term, Status
  //    Clicking a row => navigate to a form page with that record ID
  return (
    <div className="mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Course Advising</h1>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Advising History</h2>
        <button
          onClick={() => router.push("/user/dashboard/student/advising/new")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create New Advising Entry
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && advisingRecords.length === 0 && (
        <p className="text-gray-500">No advising records found.</p>
      )}

      {!loading && advisingRecords.length > 0 && (
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border-b">Date</th>
              <th className="p-2 border-b">Term</th>
              <th className="p-2 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {advisingRecords.map((record) => (
              <tr
                key={record.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  router.push(`/user/dashboard/student/advising/${record.id}`)
                }
              >
                <td className="p-2 border-b">{record.date}</td>
                <td className="p-2 border-b">{record.current_term}</td>
                <td className="p-2 border-b">{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
