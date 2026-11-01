import { pageMetadata } from "@/lib/seo";
import Calendar from "@/components/layout/calendar";
import StudioPageLayout from "@/components/layout/studio-page-layout";
import calendarBanner from "@/assets/images/banner/calender_banner.png";

export const metadata = pageMetadata({
  title: "Yoga Class Timetable",
  description:
    "Explore the Yoga By Niti class timetable in Rawai, Phuket. Choose a date, check session times and availability, and book your next yoga class.",
  path: "/yoga-time",
  noIndex: false,
});

export default function YogaTimetablePage() {
  return (
    <StudioPageLayout
      title="Find your moment."
      eyebrow="YOGA TIMETABLE"
      image={calendarBanner.src}
      description="Plan your week of wellness. Explore our daily classes and find the perfect time to practice."
    >
      <div className="mb-9 flex flex-wrap items-end justify-between gap-4 border-b border-[#dedfd4] pb-6">
        <div>
          <p className="mb-3 text-[9px] tracking-[0.22em] text-[#737b62]">
            A LITTLE TIME FOR YOURSELF
          </p>
          <h2 className="text-xl font-normal text-[#454d39] sm:text-2xl">
            Yoga timetable
          </h2>
        </div>
        <p className="text-xs text-[#737b62]">
          Choose a date to find the right class and time for you
        </p>
      </div>
      <Calendar />
    </StudioPageLayout>
  );
}
