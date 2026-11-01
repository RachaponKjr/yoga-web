import { pageMetadata } from "@/lib/seo";
import React from "react";

export const metadata = pageMetadata({
  title: "Booking History",
  description: "Review your Yoga By Niti booking history.",
  path: "/history",
  noIndex: true,
});

const page = () => {
  return <div>page</div>;
};

export default page;
