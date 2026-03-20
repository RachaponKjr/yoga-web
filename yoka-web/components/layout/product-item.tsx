import { CourseType } from "@/types/course.type";
import { Button } from "../ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProductItem = ({ course }: { course: CourseType }) => {
  const router = useRouter();
  return (
    <div className="w-full h-auto flex flex-col gap-4 p-5 rounded-3xl bg-[#FDFCF8] backdrop-blur-lg border border-white/30 shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-white/60 to-transparent opacity-50 pointer-events-none"></div>

      <div className="w-full aspect-16/14 bg-tertiary/20 rounded-2xl z-10 relative overflow-hidden">
        <Image
          src={`${process.env.NEXT_PUBLIC_HOST_IMAGE || "https://api.yogabyniti.com/"}${course?.cover_image}`}
          alt={course?.title}
          fill
          className="object-cover object-center"
        />
      </div>
      <div className="flex flex-col gap-2 z-10 relative">
        <span className="text-base line-clamp-1 font-semibold">
          {course?.title}
        </span>
        <p className="text-neutral-700 line-clamp-2 text-sm">
          {course?.description}
        </p>
      </div>
      <div className="flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
          {/* เช็กว่ามีราคาลดไหม ถ้ามีให้โชว์ราคาเต็มแบบขีดฆ่า */}
          {course?.discount_price > 0 ? (
            <>
              <span className="text-2xl font-bold text-black">
                {course.discount_price.toLocaleString()} ฿
              </span>
              <span className="text-sm text-slate-400 line-through mt-1">
                {course.price.toLocaleString()} ฿
              </span>
              {/* แถม Badge เปอร์เซ็นต์ส่วนลดให้ด้วย */}
              <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">
                -
                {Math.round(
                  ((course.price - course.discount_price) / course.price) * 100,
                )}
                %
              </span>
            </>
          ) : (
            /* ถ้าไม่มีส่วนลด โชว์ราคาปกติธรรมดา */
            <span className="text-2xl font-bold text-slate-900">
              {course?.price?.toLocaleString()} ฿
            </span>
          )}
        </div>
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
