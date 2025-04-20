"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Card, CardHeader, CardTitle, CardContent,
} from "@/components/ui/card";
import {
    Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
    Dialog, DialogTrigger, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogClose,
} from "@/components/ui/dialog";
import { getToken } from "@/lib/token_utils";
import publicRequest from "@/utils/public_request";
import {
    fetchCompletedCoursesByStudentEmail,
    updateCoursesFromAdvising,
} from "@/utils/advising_api";
import urlJoin from "url-join";

const AdminAdvisingList = () => {
    const router = useRouter();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmail, setSelectedEmail] = useState("All");

    const [viewingEmail, setViewingEmail] = useState(null);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const fetchAllAdvising = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const url = urlJoin(process.env.NEXT_PUBLIC_SERVER_URL, "/api/admin/advising");
            const data = await publicRequest(url, "GET", null, token);
            if (Array.isArray(data)) setRecords(data);
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

    const uniqueEmails = useMemo(() => {
        const set = new Set();
        records.forEach((r) => r.student_email && set.add(r.student_email));
        return ["All", ...Array.from(set)];
    }, [records]);

    const filteredRecords = useMemo(() => {
        const sorted = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));
        return selectedEmail === "All"
            ? sorted
            : sorted.filter((r) => r.student_email === selectedEmail);
    }, [records, selectedEmail]);

    const handleViewCourses = async (email) => {
        setViewingEmail(email);
        setCompletedCourses([]);
        setLoadingCourses(true);
        setOpenDialog(true);

        try {
            const courses = await fetchCompletedCoursesByStudentEmail(email);
            setCompletedCourses(courses);
        } catch (error) {
            console.error("Failed to load completed courses:", error);
        } finally {
            setLoadingCourses(false);
        }
    };

    const handleUpdateCourses = async (advisingId) => {
        try {
            const result = await updateCoursesFromAdvising(advisingId);
            alert(result.message || "Courses added to completed list.");
            fetchAllAdvising();
        } catch (error) {
            console.error("Failed to update courses from advising:", error);
            alert("Error updating courses.");
        }
    };

    return (
        <div className="container mx-auto mt-6 p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">All Student Advising Records</CardTitle>
                    <div className="mt-4 w-full max-w-sm">
                        <label className="block text-sm font-medium mb-1">Filter by Student Email</label>
                        <Select value={selectedEmail} onValueChange={setSelectedEmail}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a student" />
                            </SelectTrigger>
                            <SelectContent>
                                {uniqueEmails.map((email) => (
                                    <SelectItem key={email} value={email}>
                                        {email}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : filteredRecords.length === 0 ? (
                        <p className="text-center text-gray-500">No advising records found.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Student Email</TableHead>
                                    <TableHead>Term</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRecords.map((r, idx) => (
                                    <TableRow key={r.id || r._id || `${r.student_email}-${idx}`}>
                                        <TableCell>{formatDate(r.date)}</TableCell>
                                        <TableCell>{r.student_email || "Unknown"}</TableCell>
                                        <TableCell>{r.term || "N/A"}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-white ${
                                                r.status === "Approved"
                                                    ? "bg-green-600"
                                                    : r.status === "Rejected"
                                                    ? "bg-red-500"
                                                    : "bg-yellow-500"
                                            }`}>
                                                {r.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="space-x-2">
                                            <Button
                                                size="sm"
                                                variant="default"
                                                onClick={() =>
                                                    router.push(`/user/dashboard/admin/advising/${r.id || r._id}`)
                                                }
                                            >
                                                Review
                                            </Button>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleViewCourses(r.student_email)}
                                                    >
                                                        View Courses
                                                    </Button>
                                                </DialogTrigger>
                                            </Dialog>

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-blue-600"
                                                onClick={() => handleUpdateCourses(r.id || r._id)}
                                                disabled={r.status !== "Approved"}
                                            >
                                                ⬇ Add Courses
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* ✅ Course Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Completed Courses</DialogTitle>
                        <DialogDescription>
                            {viewingEmail && `Courses for ${viewingEmail}`}
                        </DialogDescription>
                    </DialogHeader>

                    {loadingCourses ? (
                        <p className="text-center text-gray-500 py-4">Loading courses...</p>
                    ) : completedCourses.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No completed courses found.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course Name</TableHead>
                                    <TableHead>Term</TableHead>
                                    <TableHead>Grade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {completedCourses.map((course, idx) => (
                                    <TableRow key={course.id || course._id || idx}>
                                        <TableCell>{course.course_name}</TableCell>
                                        <TableCell>{course.term}</TableCell>
                                        <TableCell>{course.grade}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    <DialogClose asChild>
                        <Button className="mt-4 w-full" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminAdvisingList;
