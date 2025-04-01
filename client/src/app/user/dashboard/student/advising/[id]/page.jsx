"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchAdvisingRecordById, updateAdvisingRecord } from "@/utils/advisingActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EditAdvisingRecord = () => {
    const router = useRouter();
    const { id } = useParams(); //Get the advising record ID from the URL
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatedData, setUpdatedData] = useState({});

    // Fetch the advising record by ID when the page loads
    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const data = await fetchAdvisingRecordById(id);
                setRecord(data);
                setUpdatedData(data); //Initialize form fields with existing data
            } catch (error) {
                console.error("Error fetching advising record:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchRecord();
    }, [id]);

    // Handle form updates
    const handleChange = (e) => {
        setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
    };

    // Submit the updated advising record
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateAdvisingRecord(id, updatedData);
            alert("Advising record updated successfully!");
            router.push("/advising"); //Redirect back to advising history page
        } catch (error) {
            console.error("Error updating advising record:", error);
            alert("Failed to update record.");
        }
    };

    if (loading) return <p className="text-center">Loading...</p>;
    if (!record) return <p className="text-center">Record not found</p>;

    return (
        <div className="container mx-auto mt-8 p-4">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Edit Advising Record</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <label>Current Term:</label>
                        <Input name="current_term" value={updatedData.current_term} onChange={handleChange} required />

                        <label>Last GPA:</label>
                        <Input name="last_gpa" type="number" step="0.01" value={updatedData.last_gpa} onChange={handleChange} required />

                        <label>Planned Courses:</label>
                        <Input name="planned_courses" value={updatedData.planned_courses} onChange={handleChange} required />

                        <label>Status:</label>
                        <select name="status" value={updatedData.status} onChange={handleChange} className="border p-2 rounded-md">
                            <option value="Pending">Pending</option>
                          
                        </select>

                        <Button type="submit" className="mt-4 bg-green-500 text-white">Save Changes</Button>
                        <Button type="button" className="mt-4 bg-gray-500 text-white ml-4" onClick={() => router.back()}>
                            Cancel
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditAdvisingRecord;
