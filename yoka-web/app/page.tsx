import { pageMetadata } from "@/lib/seo";
import Hero from "./_components/hero";
import BookingBanner from "./_components/booking-banner";
import ProductCourse from "./_components/product-course";
import StepService from "./_components/step-service";
import DetailRestaurant from "./_components/detail-restaurant";
import Story from "./_components/story";
import About from "./_components/about";
import ReviewSection from "@/components/Review";
import VideoReview from "./_components/video-review";
import YogaSchedule from "@/components/YogaSchedule";

export const metadata = pageMetadata({
  title: "Yoga Studio & Wholesome Kitchen in Phuket",
  description:
    "Find your balance at Yoga By Niti in Rawai, Phuket. Explore yoga classes for all levels and wholesome plant-based food at Go Vegan.",
  path: "/",
  noIndex: false,
});

export default async function Home() {
  return (
    <main className="relative flex flex-col overflow-hidden bg-[#f8f7f3] text-[#30372c]">
      <Hero />
      <div className="bg-[#303a2b] flex flex-col pt-16 gap-0 relative">
        <Story />
        <div className="flex flex-col gap-4 md:gap-6 bg-[#f8f7f3] py-8 md:py-24">
          <DetailRestaurant />
          <VideoReview />
          <About />
          <ReviewSection />
          <ProductCourse />
          <YogaSchedule />
        </div>
      </div>
      <StepService />
      <BookingBanner />
    </main>
  );
}
