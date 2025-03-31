"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getCoursePlanData } from "@/utils/api";
import Cookies from "js-cookie";

const AdvisingHistory = () => {
  const [advisingRecords, setAdvisingRecords] = useState([]);
  const token = Cookies.get("jwt-token");
  const router = useRouter();

  useEffect(() => {
    fetchAdvisingRecords();
  }, []);

  const fetchAdvisingRecords = async () => {
    const response = await getCoursePlanData(Cookies.get("user-email"), "currentTerm");
    if (response.status === "success") {
      setAdvisingRecords(response.data);
    } else {
      console.error("Error fetching advising records:", response.message);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Course Advising History</CardTitle>
        </CardHeader>
        <CardContent>
          {advisingRecords.length === 0 ? (
            <p className="text-center text-gray-500">No Records Found</p>
          ) : (
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
                    <TableCell>{record.currentTerm}</TableCell>
                    <TableCell>{record.lastGPA}</TableCell>
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
