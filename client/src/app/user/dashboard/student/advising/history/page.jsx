"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { fetchAdvisingRecords } from "@/utils/advisingActions";
import Cookies from "js-cookie";

const AdvisingHistory = () => {
  const router = useRouter();
  const [advisingRecords, setAdvisingRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch advising records on mount
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const records = await fetchAdvisingRecords();
        setAdvisingRecords(records || []);
      } catch (error) {
        console.error("Error fetching advising records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []); // Only runs on mount

  // A helper to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    // E.g., convert "2025-03-31T12:34:56Z" to "03/31/2025"
    const dateObj = new Date(dateString);
    return (
      (dateObj.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      dateObj.getDate().toString().padStart(2, "0") +
      "/" +
      dateObj.getFullYear()
    );
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Course Advising History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-center text-gray-500">Loading...</p>}
          {!loading && advisingRecords.length === 0 && (
            <p className="text-center text-gray-500">No Records Found</p>
          )}
          {!loading && advisingRecords.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-200">
                  <TableHead>Date</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advisingRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{formatDate(record.date)}</TableCell>
                    <TableCell>{record.current_term}</TableCell>
                    <TableCell>{record.last_gpa}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded ${
                          record.status === "Approved"
                            ? "bg-green-500 text-white"
                            : record.status === "Rejected"
                            ? "bg-red-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {record.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => router.push(`/user/dashboard/student//advising/${record.id}`)}
                      >
                        View / Edit
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

export default AdvisingHistory;