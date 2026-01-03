"use client";
import React, { useCallback, useState } from "react";
import { Course } from "./course-list";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { courseService } from "@/service/course.service";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge"; // ถ้ามี Badge component (optional)

const CourseItem = ({
  course,
  fetchCourses,
}: {
  course: Course;
  fetchCourses: () => Promise<void>;
}) => {
  const [isDelete, setIsDelete] = useState(false);

  const delCourse = useCallback(async () => {
    try {
      const delRes = await courseService.deleteCourse(course.id);
      if (delRes.success) {
        await fetchCourses();
        toast.success(delRes.message);
      }
    } catch (error) {
      toast.error("Failed to delete course");
    }
  }, [course.id, fetchCourses]);

  // คำนวณ % ส่วนลด (Optional: เพื่อความสวยงาม)
  const hasDiscount =
    course.discount_price && course.discount_price < course.price;
  const discountPercent = hasDiscount
    ? Math.round(((course.price - course.discount_price) / course.price) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col h-max bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md overflow-hidden">
      {/* --- Image Section --- */}
      <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
        {course.cover_image ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_HOST_IMAGE || "http://119.59.99.141:4001/"}${course.cover_image}`}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Icon icon="mdi:image-off-outline" width={40} />
          </div>
        )}

        {/* Action Buttons (ลอยอยู่มุมขวาบน) */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mobile:opacity-100">
          {/* ปุ่ม Edit */}
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm text-gray-700"
          >
            <Icon icon="mdi:pencil-outline" className="w-4 h-4" />
          </Button>

          {/* ปุ่ม Delete & Dialog */}
          <Dialog open={isDelete} onOpenChange={setIsDelete}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-red-50 hover:text-red-600 shadow-sm text-gray-700"
              >
                <Icon icon="mdi:delete-outline" className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Course?</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete{" "}
                  <strong>&quot;{course.title}&quot;</strong>?
                  <br />
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex gap-2 sm:justify-end">
                <DialogClose asChild>
                  <Button
                    onClick={() => setIsDelete(false)}
                    variant="outline"
                    className="flex-1 sm:flex-none"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    delCourse();
                    setIsDelete(false);
                  }}
                  variant="destructive"
                  className="flex-1 sm:flex-none"
                >
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Badge ส่วนลด (ถ้ามี) */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
            -{discountPercent}%
          </div>
        )}
      </div>

      {/* --- Content Section --- */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Title & Desc */}
        <div className="space-y-1">
          <h3
            className="font-semibold text-gray-900 line-clamp-1"
            title={course.title}
          >
            {course.title || "Untitled Course"}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
            {course.description || "No description available."}
          </p>
        </div>

        {/* Divider (ดันราคาไปล่างสุดเสมอ) */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">Price</span>
            <div className="flex items-center gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-lg font-bold text-gray-900">
                    ${course.discount_price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ${course.price.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  ${course.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* ปุ่มดูรายละเอียด (Optional) */}
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:bg-primary/5"
          >
            Details <Icon icon="mdi:chevron-right" className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseItem;
