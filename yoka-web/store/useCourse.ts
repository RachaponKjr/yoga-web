import { Course } from "@/app/(Instruetor-side)/my-course/_components/course-list";
import { courseService } from "@/service/course.service";
import { create } from "zustand";

interface CourseStore {
  courses: Course[]; // เปลี่ยนจาก null เป็น [] เพื่อลดปัญหา map error
  isLoading: boolean; // เพิ่มตัวเช็คสถานะโหลด
  error: string | null; // เพิ่มตัวเก็บ error
  setCourses: (courses: Course[]) => void;
  resetCourses: () => void;
  // เปลี่ยน return type เป็น Promise<void> เพื่อให้ component รู้ว่าจบเมื่อไหร่
  getCourses: ({ userId }: { userId: string }) => Promise<void>;
}

export const useCourseStore = create<CourseStore>((set) => ({
  courses: [], // เริ่มต้นเป็น array ว่าง
  isLoading: false,
  error: null,

  setCourses: (courses: Course[]) => set({ courses }),
  resetCourses: () => set({ courses: [], error: null }),

  getCourses: async ({ userId }: { userId: string }) => {
    set({ isLoading: true, error: null });

    try {
      const res = await courseService.getMyCourse(userId);

      const coursesData = res.data?.courses || res.data || [];

      set({ courses: coursesData });
    } catch (error: any) {
      console.error("Get Course Error:", error);
      set({ error: error.message || "Failed to fetch courses" });
    } finally {
      // 3. โหลดเสร็จแล้ว (ไม่ว่าจะ fail หรือ success)
      set({ isLoading: false });
    }
  },
}));
