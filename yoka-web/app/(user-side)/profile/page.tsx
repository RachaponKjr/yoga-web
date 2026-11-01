import { pageMetadata } from "@/lib/seo";
import React from "react";
import ProfilePage from "./_components/profile-page";

export const metadata = pageMetadata({
  title: "My Profile",
  description: "Manage your Yoga By Niti profile and contact details.",
  path: "/profile",
  noIndex: true,
});

const page = () => {
  return <ProfilePage />;
};

export default page;
