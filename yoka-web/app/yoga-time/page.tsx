import Calendar from "@/components/layout/calendar";
import LayoutSection from "@/components/layout/layout-section";
import calenderBanner from "@/assets/images/banner/calender_banner.png";

const page = () => {
  return (
    <LayoutSection
      title="Class Schedule"
      image={calenderBanner.src}
      description="Plan your week of wellness. Explore our daily classes and find the perfect time to practice."
    >
      <div className="w-full">
        <Calendar />
      </div>
    </LayoutSection>
  );
};

export default page;
