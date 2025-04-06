"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getToken } from "@/lib/token_utils"; // Helper to get JWT
import publicRequest  from "@/utils/public_request";
import urlJoin from "url-join";

const AdminAdvisingList = () => {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllAdvising = async () => {
    setLoading(true);
    try {
      const token = getToken(); // from js-cookie or helper
      const url = urlJoin(process.env.NEXT_PUBLIC_SERVER_URL, "/api/admin/advising");
      const data = await publicRequest(url, "GET", null, token);
      if (Array.isArray(data)) setRecords(data);
      else console.error("Unexpected response:", data);
    } catch (err) {
      console.error("Failed to fetch admin advising records", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdvising();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  return (
    <div className="container mx-auto mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">All Student Advising Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading...</p>}
          {!loading && records.length === 0 && <p>No advising records found.</p>}
          {!loading && records.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
             <TableBody>
  {records.map((r) => (
    <TableRow key={r._id || r.id || `${r.student_email}-${r.term}`}>
      <TableCell>{formatDate(r.date)}</TableCell>
      <TableCell>{r.student_name || r.student_email}</TableCell>
      <TableCell>{r.term}</TableCell>
      <TableCell>
        <span
          className={`px-2 py-1 rounded ${
            r.status === "Approved"
              ? "bg-green-500 text-white"
              : r.status === "Rejected"
              ? "bg-red-500 text-white"
              : "bg-yellow-500 text-white"
          }`}
        >
          {r.status}
        </span>
      </TableCell>
      <TableCell>
        <Button onClick={() => router.push(`/user/dashboard/admin/advising/${r._id || r.id}`)}>
          Review
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAdvisingList;
