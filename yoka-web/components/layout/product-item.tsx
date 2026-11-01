import { imageUrl } from "@/lib/image-url";
import { CourseType } from "@/types/course.type";
import { Button } from "../ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProductItem = ({ course }: { course: CourseType }) => {
  const router = useRouter();
  return (
    <div className="w-full h-auto flex flex-col gap-4 p-5 rounded-md bg-[#fffefa] border border-[#dedfd4] transition-colors hover:border-[#b9c3a6] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"></div>

      <div className="w-full aspect-16/14 bg-[#e9ecdf] rounded-sm z-10 relative overflow-hidden">
        <Image
          src={imageUrl(course?.cover_image)}
          alt={course?.title}
          fill
          className="object-cover object-center"
        />
      </div>
      <div className="flex flex-col gap-2 z-10 relative">
        <span className="text-base line-clamp-1 font-medium text-[#454d39]">
          {course?.title}
        </span>
        <p className="text-[#73766b] line-clamp-2 text-sm leading-relaxed">
          {course?.description}
        </p>
      </div>
      <div className="flex flex-wrap gap-3 justify-between items-center z-10 relative border-t border-[#e5e8dc] pt-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* เช็กว่ามีราคาลดไหม ถ้ามีให้โชว์ราคาเต็มแบบขีดฆ่า */}
          {course?.discount_price > 0 ? (
            <>
              <span className="text-2xl font-serif font-normal text-[#454d39]">
                {course.discount_price.toLocaleString()} ฿
              </span>
              <span className="text-xs text-[#858d79] line-through mt-1">
                {course.price.toLocaleString()} ฿
              </span>
              {/* แถม Badge เปอร์เซ็นต์ส่วนลดให้ด้วย */}
              <span className="bg-[#eef1e5] text-[#737f5f] text-[10px] font-normal px-1.5 py-0.5 rounded ml-1">
                -
                {Math.round(
                  ((course.price - course.discount_price) / course.price) * 100,
                )}
                %
              </span>
            </>
          ) : (
            /* ถ้าไม่มีส่วนลด โชว์ราคาปกติธรรมดา */
            <span className="text-2xl font-serif font-normal text-[#454d39]">
              {course?.price?.toLocaleString()} ฿
            </span>
          )}
        </div>
        <Button
          onClick={() => router.push(`/course?courseId=${course?.id}`)}
          className="rounded-sm text-xs font-normal text-[#fffef5] bg-[#48533b] hover:bg-[#303c26] shadow-none"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default ProductItem;
