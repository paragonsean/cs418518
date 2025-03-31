"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const AdvisingCard = ({ record, isSelected, onSelect }) => {
  const router = useRouter();

  // Handle Click (Redirects to Edit or View page)
  const handleClick = () => {
    if (record.status === "Pending") {
      router.push(`/user/dashboard/student/advising/edit?id=${record.id}`);
    } else {
      alert(`This advising record is ${record.status} and cannot be edited.`);
    }
  };

  return (
    <Card
      className={`cursor-pointer border-2 p-4 transition ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onClick={() => onSelect(record)}
    >
      <CardHeader>
        <CardTitle className="text-md font-bold">
          {record.current_term} Advising Plan
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p><strong>Date:</strong> {record.date}</p>
        <p><strong>Status:</strong> <span className={
          record.status === "Approved" ? "text-green-500" :
          record.status === "Rejected" ? "text-red-500" :
          "text-yellow-500"
        }>
          {record.status}
        </span></p>
        <p><strong>Planned Courses:</strong> {record.planned_courses}</p>

        <Button
          className="mt-3 w-full"
          variant={record.status === "Pending" ? "default" : "outline"}
          onClick={handleClick}
        >
          {record.status === "Pending" ? "Edit" : "View"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdvisingCard;
