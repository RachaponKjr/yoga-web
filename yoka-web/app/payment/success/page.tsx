import { pageMetadata } from "@/lib/seo";
import React from "react";
import PaymentSuccessPage from "./_components/payment-success";

export const metadata = pageMetadata({
  "title": "Payment Confirmation",
  "description": "Check the payment status and confirmation details for your Yoga By Niti booking.",
  "path": "/payment/success",
  "noIndex": true
});

const page = () => {
  return <PaymentSuccessPage />;
};

export default page;
