import { pageMetadata } from "@/lib/seo";
import React from "react";
import MyBooking from "./_components/my-booking";

export const metadata = pageMetadata({
  title: "My Bookings",
  description: "View and manage your Yoga By Niti class bookings.",
  path: "/my-booking",
  noIndex: true,
});

const page = () => {
  return <MyBooking />;
};

export default page;
