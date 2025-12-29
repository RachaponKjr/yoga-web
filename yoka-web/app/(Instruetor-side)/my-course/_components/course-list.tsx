"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { courseService } from "@/service/course.service";
import { useAuthStore } from "@/store/useAuthStore";
import React, { useCallback, useEffect, useState } from "react";
import CourseItem from "./course-item";
import { Loader2 } from "lucide-react"; // แนะนำให้ลง lucide-react ถ้ายังไม่มี

// Interface เดิมของคุณ
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price: number;
  cover_image: string;
  images: string[];
  status: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationProps {
  totalPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const CourseList = () => {
  const { user } = useAuthStore();

  // State
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1); // เก็บหน้าปัจจุบัน

  // Default Pagination State
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPage: 1,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchCourses = useCallback(async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const res = await courseService.getMyCourse(user.id, page);
      setCourses(res.data.courses || []);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, page]);
  // Fetch Data Function
  useEffect(() => {
    fetchCourses();
  }, [user?.id, page, fetchCourses]); // ทำงานเมื่อ user หรือ page เปลี่ยน

  // Function เปลี่ยนหน้า
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" }); // เลื่อนขึ้นบนสุดเมื่อเปลี่ยนหน้า
    }
  };

  // Logic สำหรับ Render เลขหน้า (กรณีหน้าเยอะๆ ให้มี ...)
  const renderPaginationItems = () => {
    const items = [];
    const total = pagination.totalPages;
    const current = page;

    // ถ้าจำนวนหน้าน้อยกว่า 7 ให้โชว์หมดเลย
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={current === i}
              onClick={() => handlePageChange(i)}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      return items;
    }

    // กรณีหน้าเยอะ: โชว์หน้า 1, ..., ปัจจุบัน-1, ปัจจุบัน, ปัจจุบัน+1, ..., หน้าสุดท้าย
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          isActive={current === 1}
          onClick={() => handlePageChange(1)}
          className="cursor-pointer"
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (current > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Loop หน้าใกล้เคียง (Before, Current, After)
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={current === i}
            onClick={() => handlePageChange(i)}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (current < total - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    items.push(
      <PaginationItem key={total}>
        <PaginationLink
          isActive={current === total}
          onClick={() => handlePageChange(total)}
          className="cursor-pointer"
        >
          {total}
        </PaginationLink>
      </PaginationItem>
    );

    return items;
  };

  // --- Render Sections ---

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isLoading && courses.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
        ไม่พบคอร์สเรียนของคุณ
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-14rem)] flex flex-col gap-6">
      {/* Grid Course */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseItem
            fetchCourses={fetchCourses}
            key={course.id}
            course={course}
          />
        ))}
      </div>

      {/* Pagination (แสดงเฉพาะเมื่อมีมากกว่า 1 หน้า) */}
      {pagination.totalPages > 1 && (
        <Pagination className="mt-auto py-4">
          <PaginationContent>
            {/* ปุ่มย้อนกลับ */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(page - 1)}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {/* เลขหน้า */}
            {renderPaginationItems()}

            {/* ปุ่มถัดไป */}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(page + 1)}
                className={
                  page === pagination.totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default CourseList;
