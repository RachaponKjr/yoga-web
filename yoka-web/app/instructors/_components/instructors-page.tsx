import LayoutSection from "@/components/layout/layout-section";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { UserInfoType } from "@/types/auth.type";
import instructorBanner from "@/assets/images/banner/lnstructors_banner.png";
import Image from "next/image";
import { Mail, Award } from "lucide-react";

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
            <DialogContent className="sm:max-w-4xl! w-full">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold">
                  ข้อมูลอาจารย์ผู้สอน
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col md:flex-row gap-8 mt-4">
                <div className="w-full md:w-80 shrink-0">
                  <div className="relative aspect-3/4 overflow-hidden bg-linear-to-br from-primary/20 to-primary/5 rounded-2xl shadow-xl">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_HOST_IMAGE}${instructor.userInfo.avatar}`}
                      alt={`${instructor.userInfo.firstName} ${instructor.userInfo.lastName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-6">
                  <div>
                    <h5 className="text-3xl font-bold text-foreground mb-2">
                      {instructor.userInfo.firstName}{" "}
                      {instructor.userInfo.lastName}
                    </h5>
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                      <Award className="w-4 h-4" />
                      {instructor.role}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          อีเมล
                        </p>
                        <a
                          href={`mailto:${instructor.email}`}
                          className="text-foreground hover:text-primary transition-colors"
                        >
                          {instructor.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          ประสบการณ์
                        </p>
                        <p className="text-foreground leading-relaxed">
                          {instructor.userInfo.experience ||
                            "ไม่มีข้อมูลประสบการณ์"}
                        </p>
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
