import LayoutSection from "@/components/layout/layout-section";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { UserInfoType } from "@/types/auth.type";
import instructorBanner from "@/assets/images/banner/lnstructors_banner.png";
import Image from "next/image";
import { Mail, Award, Facebook, Instagram, Twitter, X } from "lucide-react";

type Instructor = {
  id: string;
  role: string;
  email: string;
  userInfo: UserInfoType;
};

const InstructorsPage = ({ instructors }: { instructors: Instructor[] }) => {
  console.log(instructors);
  return (
    <LayoutSection
      image={instructorBanner.src}
      title="Instructors"
      description="lorem ipsum dolor sit amet consectetur adipisicing elit"
    >
      <div className="grid grid-cols-2 px-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full">
        {instructors.map((instructor, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div className="group cursor-pointer">
                <div className="relative w-full aspect-3/4 bg-linear-to-br from-primary/20 via-primary/10 to-primary/5 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ease-out">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_HOST_IMAGE}${instructor.userInfo.avatar}`}
                    alt={`${instructor.userInfo.firstName} ${instructor.userInfo.lastName}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <h3 className="text-white font-semibold text-lg text-balance leading-tight">
                      {instructor.userInfo.firstName}{" "}
                      {instructor.userInfo.lastName}
                    </h3>
                    <p className="text-white/80 text-sm mt-1">View Profile</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h4 className="font-semibold text-base text-foreground">
                    {instructor.userInfo.firstName}{" "}
                    {instructor.userInfo.lastName}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {instructor.role}
                  </p>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="sm:max-w-5xl max-h-max p-0 z-1000 overflow-hidden border-0 shadow-2xl bg-white rounded-2xl md:rounded-3xl gap-0"
            >
              <DialogClose
                asChild
                className="absolute top-4 right-4 cursor-pointer z-20"
              >
                <X className="w-6 h-6" />
              </DialogClose>
              <div className="flex flex-col md:grid md:grid-cols-5 h-[90vh] md:h-auto md:max-h-[65vh]">
                {/* --- ส่วนรูปภาพ (Left / Top) --- */}
                <div className="relative w-full md:h-full md:col-span-2 bg-gray-100 overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-10 md:hidden" />{" "}
                  {/* Gradient สำหรับมือถือเพื่อให้ text อ่านง่าย */}
                  {instructor.userInfo.avatar ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_HOST_IMAGE}${instructor.userInfo.avatar}`}
                      alt={`${instructor.userInfo.firstName} ${instructor.userInfo.lastName}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      <Award className="w-20 h-20 opacity-20" />
                    </div>
                  )}
                  {/* Social Media Overlay (แสดงบนรูปสำหรับ Desktop หรือซ่อนก็ได้ตามดีไซน์) */}
                  <div className="hidden md:flex absolute bottom-6 left-0 right-0 justify-center gap-4 z-20">
                    {/* ถ้าอยากเอา social มาไว้ตรงนี้ก็ทำได้ */}
                  </div>
                </div>

                {/* --- ส่วนเนื้อหา (Right / Bottom) --- */}
                <div className="flex-1 md:col-span-3 flex flex-col bg-white overflow-hidden">
                  {/* Header Section */}
                  <DialogHeader className="p-4 md:p-8 shrink-0 text-lef border-b shadow-2xs">
                    <div className="flex flex-row items-center justify-between gap-3">
                      <div>
                        <DialogTitle className="text-2xl md:text-3xl font-bold text-gray-900">
                          {instructor.userInfo.firstName}{" "}
                          {instructor.userInfo.lastName}
                        </DialogTitle>
                        {/* <p className="text-gray-500 font-medium mt-1">
                          Yoga Instructor
                        </p> */}
                      </div>
                      <div className="inline-flex self-start h-full items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase">
                        <Award className="w-4 h-4" />
                        {instructor.role}
                      </div>
                    </div>
                  </DialogHeader>

                  {/* Scrollable Content Area */}
                  <div className="flex-1 overflow-y-auto p-4 pt-2 md:p-8 md:pt-0 space-y-8 custom-scrollbar">
                    {/* About / Experience Section */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-primary rounded-full"></span>
                        About & Experience
                      </h4>

                      {/* *** จุดสำคัญ: whitespace-pre-line ทำให้เว้นบรรทัดตามที่พิมพ์มา *** */}
                      <div className="text-gray-600 leading-loose whitespace-pre-line text-base/7 font-light">
                        {instructor.userInfo.experience ? (
                          instructor.userInfo.experience
                        ) : (
                          <span className="text-gray-400 italic">
                            ไม่มีข้อมูลประสบการณ์
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contact & Social Info */}
                    <div className="border-t border-gray-100 pt-6 space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                        Contact
                      </h4>

                      <div className="flex flex-wrap gap-4">
                        {/* Email */}
                        <a
                          href={`mailto:${instructor.email}`}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-primary/5 hover:text-primary border border-gray-100 transition-all group"
                        >
                          <div className="p-2 bg-white rounded-full shadow-sm group-hover:shadow-md transition-all">
                            <Mail className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                          </div>
                          <span className="text-sm font-medium">
                            {instructor.email}
                          </span>
                        </a>

                        {/* Social Links (ถ้ามี) */}
                        {instructor.userInfo.facebook && (
                          <a
                            href={instructor.userInfo.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 border border-gray-100 transition-all"
                          >
                            <Facebook className="w-5 h-5" />
                          </a>
                        )}
                        {instructor.userInfo.instagram && (
                          <a
                            href={instructor.userInfo.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-gray-50 hover:bg-pink-50 hover:text-pink-600 border border-gray-100 transition-all"
                          >
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                        {instructor.userInfo.twitter && (
                          <a
                            href={instructor.userInfo.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-gray-50 hover:bg-sky-50 hover:text-sky-500 border border-gray-100 transition-all"
                          >
                            <Twitter className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </LayoutSection>
  );
};

export default InstructorsPage;
