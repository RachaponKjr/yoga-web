import Image from "next/image";
import CourseBox from "./course-box";

import leftLeft from "@/assets/images/leaf-left.png";

const ProductCourse = () => {
  return (
    <div className="relative bg-[#283618] md:pt-20 pt-12 px-4 md:px-0">
      <Image
        width={500}
        height={500}
        src={leftLeft}
        alt="leftLeft"
        className="absolute top-0 left-0 z-100 hidden md:block"
      />
      <div className="container mx-auto flex flex-col justify-between gap-6 items-center w-full">
        <div className="flex flex-col justify-center items-center gap-2 w-full">
          <div className="border border-white/60 rounded-full p-2">
            <div className="w-3 aspect-square rounded-full bg-white animate-pulse"></div>
          </div>
          <div className="w-px h-4 bg-white/60" />
        </div>
        <div className="flex flex-col items-center justify-center gap-8 w-full">
          <div className="flex flex-col items-center gap-2 max-w-4xl w-full">
            <span className="text-4xl font-semibold text-secondary! text-center">
              Yoga Memberships & Class Passes
            </span>
            <p className="text-secondary/80! text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
              maxime quibusdam praesentium recusandae tempora sunt, ipsa
              delectus facere modi nisi!
            </p>
          </div>
          <CourseBox />
        </div>
      </div>
    </div>
  );
};

export default ProductCourse;
