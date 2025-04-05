import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"; // Add TableCell import
import PlannedCourseRow from "./PlannedCourseRow";

const PrerequisiteTable = ({ plannedCourses, missingPrerequisites }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-200">
          <TableHead>Planned Course</TableHead>
          <TableHead>Missing Prerequisites</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plannedCourses.length > 0 ? (
          plannedCourses.map((course, index) => (
            <PlannedCourseRow
              key={index}
              course={course}
              missingPrerequisites={missingPrerequisites}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={2} className="text-center text-gray-500">
              No planned courses found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default PrerequisiteTable;
