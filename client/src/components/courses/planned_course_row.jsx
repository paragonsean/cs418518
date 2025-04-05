import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";

const PlannedCourseRow = ({ course, missingPrerequisites }) => {
  return (
    <TableRow>
      <TableCell>{course}</TableCell>
      <TableCell>
        {missingPrerequisites[course]?.length > 0 ? (
          <span className="text-red-500">
            {missingPrerequisites[course].join(", ")}
          </span>
        ) : (
          <span className="text-green-500">All prerequisites met ✅</span>
        )}
      </TableCell>
    </TableRow>
  );
};

export default PlannedCourseRow;
