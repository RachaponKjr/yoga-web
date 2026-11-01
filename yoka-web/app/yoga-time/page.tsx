import Calendar from "@/components/layout/calendar";
import StudioPageLayout from "@/components/layout/studio-page-layout";
import calendarBanner from "@/assets/images/banner/calender_banner.png";

export default function YogaTimetablePage() {
  return (
    <StudioPageLayout title="Find your moment." eyebrow="YOGA TIMETABLE" image={calendarBanner.src} description="Plan your week of wellness. Explore our daily classes and find the perfect time to practice.">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-4 border-b border-[#dedfd4] pb-6">
        <div><p className="mb-3 text-[9px] tracking-[0.22em] text-[#737b62]">A LITTLE TIME FOR YOURSELF</p><h2 className="text-xl font-normal text-[#454d39] sm:text-2xl">ตารางเรียนโยคะ</h2></div>
        <p className="text-xs text-[#737b62]">เลือกวันที่ เพื่อดูคลาสและรอบเวลาที่เหมาะกับคุณ</p>
      </div>
      <Calendar />
    </StudioPageLayout>
  );
}
