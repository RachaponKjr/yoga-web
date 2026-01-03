"use client";
import ProductItem from "@/components/layout/product-item";
import { courseService } from "@/service/course.service";
import { CourseType, PaginationType } from "@/types/course.type";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface CourseRes {
  data: {
    courses: CourseType[];
    pagination: PaginationType;
  };
}

const CourseBox = () => {
  const { data: courses, isLoading } = useQuery<CourseRes>({
    queryKey: ["courses"],
    queryFn: () => courseService.getCourseAll(), // ไม่ต้องส่งอะไรเพิ่ม
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(courses);
  return (
    <div className="grid grid-cols-4 gap-6 w-full">
      {courses?.data?.courses?.map((course: CourseType, index: number) => (
        <ProductItem key={index} course={course} />
      ))}
    </div>
  );
};

export default CourseBox;
