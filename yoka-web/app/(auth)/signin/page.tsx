import { pageMetadata } from "@/lib/seo";
import React from "react";
import SignInPage from "./_components/signin-page";

export const metadata = pageMetadata({
  title: "Sign In",
  description:
    "Sign in to your Yoga By Niti account to manage bookings and continue your yoga practice.",
  path: "/signin",
  noIndex: true,
});

const page = () => {
  return <SignInPage />;
};

export default page;
