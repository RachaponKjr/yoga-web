import MultiImageUpload from "@/components/share/MultiImageUpload";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import type { CourseFormState } from "./AddCourse";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authService } from "@/service/auth.service";
import type { UserType } from "@/types/auth.type";
import type { CourseType } from "@/types/booking.type";
import { courseService } from "@/service/course.service";
import { toast } from "sonner";

const EditCourse = ({
  courseData,
  getCourses,
}: {
  courseData: CourseType;
  getCourses: () => void;
}) => {
  const [course, setCourse] = useState<CourseFormState>({
    title: courseData.title,
    description: courseData.description || "",
    about: courseData.about || "",
    price: String(courseData.price) || "",
    discount_price: String(courseData.discount_price) || "",
    teacherId: courseData.teacherId,
  });
  const [images, setImages] = useState<File[]>([]); // ระบุ Type เป็น File[]
  const [teachers, setTeachers] = useState<UserType[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // เพิ่ม Loading State

  const getInstructor = useCallback(async () => {
    try {
      const response = await authService.getInstructor();
      if (response) {
        setTeachers(response);
      }
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  }, []);

  const handleSubmit = async () => {
    // Validation เบื้องต้น
    if (!course.title || !course.teacherId || !course.price) {
      alert("กรุณากรอกข้อมูลที่จำเป็น (ชื่อคอร์ส, ครูผู้สอน, ราคา)");
      return;
    }

    setIsLoading(true);
    try {
      // 2. เตรียม FormData สำหรับส่งไป Backend (เพราะมีรูปภาพ)
      const formData = new FormData();
      formData.append("title", course.title);
      formData.append("description", course.description);
      formData.append("about", course.about);
      formData.append("price", course.price);
      formData.append("discount_price", course.discount_price || "0");
      formData.append("teacherId", course.teacherId);

      // ใส่รูปภาพเข้าไปใน FormData

      if (images.length !== 0) {
        formData.append("course_poster", images[0]);
        images.slice(1).forEach((image) => {
          formData.append("image_course", image);
        });
      }
      await courseService
        .updateCourse(formData, courseData.id)
        .then(() => {
          toast.success("อัปเดตคอร์สเรียนสำเร็จ");
          setOpen(false);
        })
        .catch((error) => {
          console.error(error);
          toast.error("เกิดข้อผิดพลาดในการอัปเดตคอร์สเรียน");
        })
        .finally(() => {
          setIsLoading(false);
          getCourses();
        });
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการอัปเดตคอร์สเรียน");
    } finally {
      setIsLoading(false);
      getCourses();
    }
  };

  console.log(course);

  useEffect(() => {
    if (open) {
      void getInstructor(); // ดึงข้อมูลเมื่อเปิด Dialog
    }
  }, [getInstructor, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 cursor-pointer text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition">
          <Edit size={18} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl! max-h-[calc(100vh-10rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>แก้ไขคอร์สเรียน</DialogTitle>
          <DialogDescription>แก้ไขข้อมูลคอร์สเรียน</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {/* ชื่อคอร์ส */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              ชื่อคอร์ส <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="ชื่อคอร์สเรียน"
              value={course.title}
              onChange={(e) => setCourse({ ...course, title: e.target.value })}
            />
          </div>

          {/* ครูผู้สอน */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              ครูผู้สอน <span className="text-red-500">*</span>
            </label>
            <Select
              value={course.teacherId}
              onValueChange={(value) =>
                setCourse({ ...course, teacherId: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือกครูผู้สอน" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.userInfo?.firstName} {teacher.userInfo?.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* คำอธิบายสั้น */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              คำอธิบาย (Description)
            </label>
            <Textarea
              placeholder="คำอธิบายสั้นๆ เกี่ยวกับคอร์ส"
              value={course.description}
              onChange={(e) =>
                setCourse({ ...course, description: e.target.value })
              }
            />
          </div>

          {/* รายละเอียด */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              รายละเอียดเพิ่มเติม (About)
            </label>
            <Textarea
              placeholder="รายละเอียดเนื้อหาหลักสูตร..."
              className="h-32"
              value={course.about}
              onChange={(e) => setCourse({ ...course, about: e.target.value })}
            />
          </div>

          {/* ราคา */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                ราคาปกติ <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="0.00"
                min="0"
                value={course.price}
                onChange={(e) =>
                  setCourse({ ...course, price: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">ราคาลด (ถ้ามี)</label>
              <Input
                type="number"
                placeholder="0.00"
                min="0"
                value={course.discount_price}
                onChange={(e) =>
                  setCourse({ ...course, discount_price: e.target.value })
                }
              />
            </div>
          </div>

          {/* รูปภาพ */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              รูปภาพประกอบ (สูงสุด 5 รูป)
            </label>
            <MultiImageUpload
              onFilesChange={(files) => setImages(files)} // รับค่าจาก Component ลูก
              maxFiles={5}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <button
              disabled={isLoading}
              onClick={handleSubmit}
              className="bg-blue-500! text-white px-4 py-2 cursor-pointer rounded"
            >
              {isLoading ? "กำลังอัปเดต..." : "บันทึก"}
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourse;
