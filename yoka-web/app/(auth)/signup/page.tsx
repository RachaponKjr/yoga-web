import { pageMetadata } from "@/lib/seo";
import SignUpPage from "./_components/signup-page";

export const metadata = pageMetadata({
  title: "Create an Account",
  description:
    "Join Yoga By Niti. Create your account to book yoga classes and manage your practice.",
  path: "/signup",
  noIndex: true,
});

const page = () => {
  return <SignUpPage />;
};

export default page;
