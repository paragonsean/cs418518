"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import useProfile from "@/hooks/useProfile"; // Assuming useProfile provides student profile data
import { fetchAdvisingRecordsByEmail } from "@/utils/advisingActions"; // Ensure the API function is available
import Cookies from "js-cookie";

const AdvisingHistory = () => {
  const router = useRouter();
  const { getProfile } = useProfile();
  const [advisingRecords, setAdvisingRecords] = useState([]);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch student profile and set email
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        if (profile?.user?.u_email) {
          setEmail(profile.user.u_email);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [getProfile]);

  // Fetch advising records based on the student's email
  useEffect(() => {
    if (!email) return;

    const fetchAdvisingRecords = async () => {
      try {
        setLoading(true);
        const records = await fetchAdvisingRecordsByEmail(email);
        setAdvisingRecords(records || []);
      } catch (error) {
        console.error("Error fetching advising records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisingRecords();
  }, [email]);

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
                  <TableHead>Term</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advisingRecords.map((record) => (
                  <TableRow key={record.id}>
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
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => router.push(`/advising/${record.id}`)}
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
