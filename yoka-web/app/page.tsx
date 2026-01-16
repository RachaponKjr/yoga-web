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
import PortfolioGallery from "./_components/gallory";

interface InstructorProps extends UserType {
  userInfo: UserInfoType;
}

export default async function Home() {
  const data = (await authService.getInstructor()) as InstructorProps[];
  return (
    <main className="relative flex flex-col">
      <Social />
      <Hero />
      <div className="py-12 bg-[#283618] md:py-20 flex flex-col gap-6">
        <ProductCourse />
        <Banner />
        <Instructors data={data} />
      </div>
      <StepService />
      {/* <div className="w-full aspect-16/6 bg-amber-500 relative">
        <video
          src="/yoga.mp4"
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-30" />
      </div> */}
      <DetailRestaurant />
      <Story />
      <PortfolioGallery />
    </main>
  );
}
