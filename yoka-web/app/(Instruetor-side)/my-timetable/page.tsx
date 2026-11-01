import { pageMetadata } from "@/lib/seo";
import React from "react";
import TimeTableList from "./_components/timetable-list";

export const metadata = pageMetadata({
  title: "My Teaching Timetable",
  description: "View and manage your Yoga By Niti teaching schedule.",
  path: "/my-timetable",
  noIndex: true,
});

const page = () => {
  return <TimeTableList />;
};

export default page;
