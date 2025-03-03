import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CourseCard = ({ course }) => {
  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {course.course_name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Level: {course.course_level}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm">
          <strong>Prerequisite:</strong> {course.prerequisite || "None"}
        </p>
        <p className="text-sm">
          <strong>Level Group:</strong> {course.course_lvlGroup}
        </p>
        <Button variant="default" className="w-full mt-3">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
