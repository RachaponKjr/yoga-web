import MultiImageUpload from "@/components/share/MultiImageUpload";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react"; // เพิ่ม Loader icon
import { useCallback, useEffect, useState } from "react";
import { authService } from "@/service/auth.service";
import type { UserType } from "@/types/auth.type";
import { courseService } from "@/service/course.service";

// 1. กำหนด Interface ให้ชัดเจน
interface CourseFormState {
  title: string;
  description: string;
  about: string;
  price: string; // ใช้ string ก่อนใน input เพื่อกันปัญหาเรื่องเลข 0
  discount_price: string;
  teacherId: string;
}

const initialFormState: CourseFormState = {
  title: "",
  description: "",
  about: "",
  price: "",
  discount_price: "",
  teacherId: "",
};

const AddCourse = ({ getCourses }: { getCourses: () => void }) => {
  const [teachers, setTeachers] = useState<UserType[]>([]);
  const [images, setImages] = useState<File[]>([]); // ระบุ Type เป็น File[]
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // เพิ่ม Loading State
  // State สำหรับเก็บข้อมูล Form
  const [course, setCourse] = useState<CourseFormState>(initialFormState);

  // ดึงข้อมูลครูผู้สอน
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

  useEffect(() => {
    if (open) {
      void getInstructor(); // ดึงข้อมูลเมื่อเปิด Dialog
    }
  }, [getInstructor, open]);

  // ฟังก์ชันรีเซ็ตฟอร์ม
  const resetForm = () => {
    setCourse(initialFormState);
    setImages([]);
    setOpen(false);
  };

  // ฟังก์ชันบันทึกข้อมูล
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
      await courseService.createCourse(formData);
      resetForm(); // ปิดและล้างค่า
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการสร้างคอร์ส");
    } finally {
      setIsLoading(false);
      getCourses();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="capitalize cursor-pointer">
          <Plus size={16} className="mr-2" /> สร้างคอร์สใหม่
        </Button>
      </DialogTrigger>

      {/* เพิ่ม overflow-y-auto เพื่อให้ scroll ได้ถ้าจอเล็ก */}
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>สร้างคอร์สใหม่</DialogTitle>
          <DialogDescription>
            กรุณากรอกรายละเอียดของคอร์สใหม่ให้ครบถ้วน
          </DialogDescription>
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
            <Button variant="outline" type="button" disabled={isLoading}>
              ยกเลิก
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            variant={"outline"}
            className="cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังสร้าง...
              </>
            ) : (
              "สร้างคอร์ส"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourse;
