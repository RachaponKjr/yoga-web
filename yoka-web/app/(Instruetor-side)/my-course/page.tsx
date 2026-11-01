import { pageMetadata } from "@/lib/seo";
import React from "react";
import CoursePage from "./_components/course-page";

export const metadata = pageMetadata({
  title: "Manage Courses",
  description: "Manage your courses and class sessions at Yoga By Niti.",
  path: "/my-course",
  noIndex: true,
});

const page = () => {
  return <CoursePage />;
};

export default page;
