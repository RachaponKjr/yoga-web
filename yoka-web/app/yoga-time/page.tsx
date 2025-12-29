import Calendar from "@/components/layout/calendar";
import LayoutSection from "@/components/layout/layout-section";
import calenderBanner from "@/assets/images/banner/calender_banner.png";

const page = () => {
  return (
    <LayoutSection
      title="Yoga Time"
      image={calenderBanner.src}
      description="lorem ipsum dolor sit amet consectetur adipisicing elit"
    >
      <div className="w-full px-4 md:px-0">
        <Calendar />
      </div>
    </LayoutSection>
  );
};

export default page;
