import { Edit, Trash2, Calendar, User as UserIcon } from "lucide-react";
import AddCourse from "./AddCourse";
import type { CourseType } from "@/types/course.type";
import { useEffect, useState } from "react";
import { courseService } from "@/service/course.service";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import EditCourse from "./EditCourse";
import RoundEdit from "./RoundEdit";

// Helper: จัด Format วันที่และเวลา
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  }).format(date);
};

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const CoursePage = () => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  console.log(courses);
  const getCourses = async () => {
    const res = await courseService.getCourseAll();
    console.log(res);
    setCourses(res.data.courses);
  };

  const deleteCourse = async (id: string) => {
    await courseService.deleteCourse(id);
    getCourses();
  };

  const updateCourseStatus = async (id: string, isShow: boolean) => {
    try {
      const res = await courseService.updateCourseStatus(id, isShow);
      if (res.success) {
        toast.success("Update course status successfully");
        getCourses();
      } else {
        toast.error("Update course status failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    void getCourses();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          จัดการคอร์สเรียน (Courses)
        </h1>
        <AddCourse getCourses={getCourses} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <th className="px-6 py-4">คอร์สเรียน</th>
                <th className="px-6 py-4">ผู้สอน (Teacher)</th>
                <th className="px-6 py-4">ราคา</th>
                <th className="px-6 py-4">แสดงหน้าเเรก</th>
                <th className="px-6 py-4 text-center">สถานะ</th>
                <th className="px-6 py-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map((course: CourseType) => (
                <tr
                  key={course.id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  {/* 1. ข้อมูลคอร์ส + รูปภาพ */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 shrink-0 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                        {course?.cover_image ? (
                          <img
                            src={`https://api.yogabyniti.com/${course?.cover_image}`}
                            alt={course?.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Calendar size={24} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 line-clamp-1">
                          {course?.title}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {course?.description || "ไม่มีรายละเอียด"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* 2. ผู้สอน */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <UserIcon size={16} />
                      </div>
                      <span>
                        {course.teacher?.userInfo?.firstName}{" "}
                        {course.teacher?.userInfo?.lastName}
                      </span>
                    </div>
                  </td>

                  {/* 3. ราคา (Handle ส่วนลด) */}
                  <td className="px-6 py-4">
                    {course?.discount_price ? (
                      <div className="flex flex-col">
                        <span className="text-red-600 font-bold">
                          ฿{course?.discount_price.toLocaleString()}
                        </span>
                        <span className="text-gray-400 text-xs line-through">
                          ฿{course?.price.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="font-medium text-gray-900">
                        ฿{course?.price.toLocaleString()}
                      </span>
                    )}
                  </td>

                  {/* 4. รอบเรียน (Loop แสดงรายการรอบ) */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 max-h-28 overflow-y-auto custom-scrollbar">
                      <Switch
                        id={course.id}
                        value={course.isShow ? "true" : "false"}
                        checked={course.isShow}
                        onCheckedChange={(value) =>
                          updateCourseStatus(course.id, value)
                        }
                      />
                    </div>
                  </td>

                  {/* 5. สถานะ */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        course.status === "Draft" || course.status === "Open"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {course.status === "Draft" ? "Open" : "Published"}
                    </span>
                  </td>

                  {/* 6. ปุ่ม Action */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <RoundEdit
                        courseId={course.id}
                        teacherId={course.teacherId}
                      />
                      <EditCourse
                        getCourses={getCourses}
                        courseData={course as CourseType}
                      />
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="p-2 cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition">
                            <Trash2 size={18} />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>ลบคอร์ส</DialogTitle>
                            <DialogDescription>
                              คุณต้องการลบคอร์สนี้หรือไม่?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="flex flex-row gap-4">
                            <DialogClose className="cursor-pointer">
                              ยกเลิก
                            </DialogClose>
                            <DialogClose asChild>
                              <button
                                onClick={() => deleteCourse(course.id)}
                                className="bg-red-500! text-white! px-4 py-2 cursor-pointer rounded"
                              >
                                ลบ
                              </button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination (Optional) */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-right text-sm text-gray-500">
          Showing 2 courses
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
