import { authService } from "@/service/auth.service";
import InstructorsPage from "./_components/instructors-page";
import { UserInfoType } from "@/types/auth.type";

type Instructor = {
  id: string;
  role: string;
  email: string;
  userInfo: UserInfoType;
};

const page = async () => {
  const instructors = await authService.getInstructor();
  console.log(instructors, "DATA");
  return <InstructorsPage instructors={instructors as Instructor[]} />;
};

export default page;
