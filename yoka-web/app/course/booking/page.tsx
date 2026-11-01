import { pageMetadata } from "@/lib/seo";
import PaymentPage from "./_components/payment-page";

export const metadata = pageMetadata({
  title: "Booking & Payment",
  description:
    "Review your selected class and complete your Yoga By Niti booking.",
  path: "/course/booking",
  noIndex: true,
});

const page = () => {
  return <PaymentPage />;
};

export default page;
