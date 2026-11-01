import { pageMetadata } from "@/lib/seo";
import { authService } from "@/service/auth.service";
import InstructorsPage from "./_components/instructors-page";
import { UserInfoType } from "@/types/auth.type";

type Instructor = {
  id: string;
  role: string;
  email: string;
  userInfo: UserInfoType;
};

export const metadata = pageMetadata({
  title: "Our Yoga Instructors",
  description:
    "Meet the instructors at Yoga By Niti. Explore their experience and teaching approach, and find a guide for your yoga practice in Phuket.",
  path: "/instructors",
  noIndex: false,
});

const page = async () => {
  const instructors = await authService.getInstructor();
  return <InstructorsPage instructors={instructors as Instructor[]} />;
};

export default page;
