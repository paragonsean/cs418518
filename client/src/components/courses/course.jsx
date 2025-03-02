import React from "react";

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition duration-300">
      <h3 className="text-xl font-bold text-gray-800">{course.course_name}</h3>
      <p className="text-gray-600 text-sm mt-1">
        <strong>Course Level:</strong> {course.course_level}
      </p>
      <p className="text-gray-600 text-sm">
        <strong>Prerequisite:</strong> {course.prerequisite || "None"}
      </p>
      <p className="text-gray-600 text-sm">
        <strong>Level Group:</strong> {course.course_lvlGroup}
      </p>

      <div className="mt-3 flex justify-between">
        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          View Details
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
