import Hero from "./_components/hero";
import Social from "@/components/layout/social";
import ProductCourse from "./_components/product-course";
import Instructors from "./_components/instructor";
import StepService from "./_components/step-service";
import DetailRestaurant from "./_components/detail-restaurant";
import Story from "./_components/story";
import { authService } from "@/service/auth.service";
import { UserInfoType, UserType } from "@/types/auth.type";
import PortfolioGallery from "./_components/gallory";
import About from "./_components/about";

interface InstructorProps extends UserType {
  userInfo: UserInfoType;
}

export default async function Home() {
  const data = (await authService.getInstructor()) as InstructorProps[];
  return (
    <main className="relative flex flex-col">
      <Social />
      <Hero />
      <div className="bg-[#283618] py-4 flex flex-col gap-8 relative">
        <Story />
        <div className="flex flex-col gap-4 md:gap-12 bg-[#FDFCF8] py-8 md:py-24">
          <DetailRestaurant />
          <About />
        </div>
        <Instructors data={data} />
      </div>
      <StepService />
      {/* <Banner /> */}
      <ProductCourse />
      <PortfolioGallery />
    </main>
  );
}
