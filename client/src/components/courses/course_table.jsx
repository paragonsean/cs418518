"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

function CoursePlanTable({
  coursePlan,
  courseLevels,
  availableCourses,
  completedCourses,
  coursePrerequisites,
  filterAvailableCourses,
  handleCourseChange,
  removeCourseRow,
  onAddCourse,
}) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-200">
            <TableHead>Level</TableHead>
            <TableHead>Course Level</TableHead>
            <TableHead>Course Name</TableHead>
            <TableHead>Prerequisite</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {coursePlan.map((course, index) => (
            <TableRow key={index}>
              {/* 1) Level Dropdown */}
              <TableCell>
                <select
                  className="border p-2 rounded-md"
                  value={course.level}
                  onChange={(e) =>
                    handleCourseChange(index, "level", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Select Level
                  </option>
                  {courseLevels.map((lvl) => (
                    <option key={`lvl-${lvl}`} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </TableCell>

              {/* 2) Course Level Dropdown */}
              <TableCell>
                <select
                  className="border p-2 rounded-md"
                  value={course.courseLevel}
                  onChange={(e) =>
                    handleCourseChange(index, "courseLevel", e.target.value)
                  }
                  disabled={!course.level}
                >
                  <option value="" disabled>
                    Select Course Level
                  </option>
                  {filterAvailableCourses(course.level).map((c) => (
                    <option key={`level-${c.course_level}`} value={c.course_level}>
                      {c.course_level}
                    </option>
                  ))}
                </select>
              </TableCell>

              {/* 3) Course Name Dropdown */}
              <TableCell>
                <select
                  className="border p-2 rounded-md"
                  value={course.name}
                  onChange={(e) =>
                    handleCourseChange(index, "name", e.target.value)
                  }
                  disabled={!course.courseLevel}
                >
                  <option value="" disabled>
                    Select Course
                  </option>
                  {availableCourses
                    .filter((c) => c.course_level === course.courseLevel)
                    .map((c) => {
                      const isCompleted = completedCourses.some(
                        (comp) => comp.course_name === c.course_level
                      );
                      return (
                        <option
                          key={`courseName-${c.course_name}`}
                          value={c.course_name}
                          disabled={isCompleted}
                        >
                          {c.course_name}
                          {isCompleted ? " (Completed)" : ""}
                        </option>
                      );
                    })}
                </select>
              </TableCell>

              {/* 4) Prerequisite Display */}
              <TableCell>
                {(coursePrerequisites[course.name] || []).join(", ") || "None"}
              </TableCell>

              {/* 5) Remove Button */}
              <TableCell>
                <Button variant="destructive" onClick={() => removeCourseRow(index)}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Course Button */}
      <Button type="button" onClick={onAddCourse} className="mt-4">
        ➕ Add Course
      </Button>
    </>
  );
}

export default CoursePlanTable;