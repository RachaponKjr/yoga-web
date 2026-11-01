import { pageMetadata } from "@/lib/seo";
import ContactPage from "./_components/contact-page";

export const metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Contact Yoga By Niti for yoga classes, private sessions, and studio enquiries. Find our location, opening hours, and contact details in Rawai, Phuket.",
  path: "/contact",
  noIndex: false,
});

const page = () => {
  return <ContactPage />;
};

export default page;
