import Hero from "./_components/hero";
import Social from "@/components/layout/social";
import ProductCourse from "./_components/product-course";
import Banner from "./_components/banner";
import Instructors from "./_components/instructor";
import StepService from "./_components/step-service";
import DetailRestaurant from "./_components/detail-restaurant";
import Story from "./_components/story";
import { authService } from "@/service/auth.service";
import { UserInfoType, UserType } from "@/types/auth.type";

interface InstructorProps extends UserType {
  userInfo: UserInfoType;
}

export default async function Home() {
  const data = (await authService.getInstructor()) as InstructorProps[];
  return (
    <main className="relative flex flex-col">
      <Social />
      <Hero />
      <ProductCourse />
      <Banner />
      <Instructors data={data} />
      <StepService />
      <DetailRestaurant />
      <Story />
    </main>
  );
}
