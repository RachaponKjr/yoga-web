import { CourseType } from "@/types/course.type";
import { Button } from "../ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProductItem = ({ course }: { course: CourseType }) => {
  const router = useRouter();
  console.log(course, "course");
  return (
    <div className="w-full flex flex-col gap-4 p-5 rounded-3xl bg-secondary backdrop-blur-lg border border-white/30 shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-white/60 to-transparent opacity-50 pointer-events-none"></div>

      <div className="w-full aspect-16/14 bg-tertiary/20 rounded-2xl z-10 relative overflow-hidden">
        <Image
          src={`${process.env.NEXT_PUBLIC_HOST_IMAGE || "http://119.59.99.141:4001/"}${course?.cover_image}`}
          alt={course?.title}
          fill
          className="object-cover object-center"
        />
      </div>
      <div className="flex flex-col gap-2 z-10 relative">
        <span className="text-lg font-semibold">{course?.title}</span>
        <p className="text-neutral-700 line-clamp-2 text-sm">
          {course?.description}
        </p>
      </div>
      <div className="flex justify-between items-center z-10 relative">
        <span className="text-xl font-semibold">{course?.price}$</span>
        <Button
          onClick={() => router.push(`/course?courseId=${course?.id}`)}
          className="rounded-full text-white bg-[#3D552F] hover:bg-[#3D552F] cursor-pointer shadow-md"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default ProductItem;
