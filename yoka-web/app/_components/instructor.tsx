import UserCardGlass from "@/components/layout/user-card";
import { Button } from "@/components/ui/button";
import { UserInfoType, UserType } from "@/types/auth.type";
import Link from "next/link";
import React from "react";

interface InstructorProps extends UserType {
  userInfo: UserInfoType;
}

const Instructors = ({ data }: { data: InstructorProps[] }) => {
  return (
    <div className="bg-[#283618] pb-20">
      <div className="flex flex-col gap-8 items-center container mx-auto">
        <div className="flex items-center gap-12 w-full">
          <div className="flex flex-col gap-2 max-w-2xl text-nowrap w-max ">
            <h4 className="text-4xl font-semibold text-secondary">
              Yoga Instructors
            </h4>
            <p className="text-secondary/80 font-medium">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
          <div className="flex flex-row justify-center items-center gap-8 w-full">
            <div className="w-[80%] h-px bg-white/60" />
            <div className="border border-white/60 rounded-full p-2">
              <div className="w-3 aspect-square rounded-full bg-white animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 w-full">
          {data.map((item) => (
            <UserCardGlass
              fullName={item.userInfo.firstName + " " + item.userInfo.lastName}
              avatar={item.userInfo.avatar || ""}
              facebook={item.userInfo.facebook || ""}
              instagram={item.userInfo.instagram || ""}
              twitter={item.userInfo.twitter || ""}
              key={item.id}
            />
          ))}
        </div>
        <Button
          className="text-white rounded-full cursor-pointer bg-[#3D552F] hover:bg-[#3D552F]"
          size={"lg"}
        >
          <Link href="/instructors" className="w-full h-full flex items-center">
            View All
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Instructors;
