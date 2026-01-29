import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  User as UserIcon,
  UserCheck,
  Pencil,
  X,
  Save,
  Plus,
  Loader2,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { format, addDays, setHours, setMinutes } from "date-fns";
import { courseService } from "@/service/course.service";
import { toast } from "sonner";
import type { Round } from "@/types/round.type";
import type { UserType } from "@/types/auth.type";
import { authService } from "@/service/auth.service";

const RoundEdit = ({
  courseId,
  teacherId,
}: {
  courseId: string;
  teacherId: string;
}) => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false); // ✅ State สำหรับโหมดเพิ่ม
  const [teachers, setTeachers] = useState<UserType[]>([]);

  console.log(rounds);
  // Fetch Data
  const getRoundByCourseId = useCallback(async () => {
    try {
      const res = await courseService.getRoundByCourseId(courseId);
      if (res.success) {
        setRounds(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [courseId]);

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
    void getInstructor(); // ดึงข้อมูลเมื่อเปิด Dialog
  }, [getInstructor]);

  useEffect(() => {
    getRoundByCourseId();
  }, [courseId, getRoundByCourseId]);

  // ✅ Handle Create
  const handleCreate = async (data: any) => {
    console.log("Creating new round:", data);
    // TODO: ต่อ API createRound ตรงนี้
    // await courseService.createRound(data);

    setIsAdding(false);
    toast.success("เพิ่มรอบเรียนเรียบร้อย");
    // getRoundByCourseId(); // Refresh list
  };

  // ✅ Handle Update
  const handleUpdate = async (id: string, data: any) => {
    console.log("Updating round:", id, data);
    // TODO: ต่อ API updateRound ตรงนี้

    setEditingId(null);
    toast.success("บันทึกการแก้ไขเรียบร้อย");
    // getRoundByCourseId(); // Refresh list
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 cursor-pointer text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition">
          <Calendar size={18} />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl! max-h-[calc(100vh-10rem)] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            จัดการรอบเรียน (Course Rounds)
          </DialogTitle>

          {/* ปุ่มเพิ่มรอบเรียน */}
          {!isAdding && (
            <Button
              onClick={() => {
                setEditingId(null); // ปิดการแก้ไขอื่นก่อน
                setIsAdding(true);
              }}
              className="ml-auto bg-green-600 hover:bg-green-700 text-white gap-2"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              เพิ่มรอบเรียน
            </Button>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-2 pr-4 space-y-4 mt-2">
          {/* ✅ ส่วนฟอร์มเพิ่มรอบเรียน (แสดงเมื่อ isAdding = true) */}
          {isAdding && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="mb-2 flex items-center gap-2 text-green-700 font-semibold">
                <Plus size={18} /> สร้างรอบเรียนใหม่
              </div>
              <RoundForm
                teachers={teachers}
                courseId={courseId}
                teacherId={teacherId}
                mode="create"
                initialData={null}
                onCancel={() => setIsAdding(false)}
                onSave={handleCreate}
              />
            </div>
          )}

          {/* รายการรอบเรียนเดิม */}
          {rounds.map((round, index) => (
            <div key={index}>
              {editingId === round.id ? (
                <RoundForm
                  mode="edit"
                  teacherId={teacherId}
                  teachers={teachers as UserType[]}
                  initialData={round}
                  courseId={courseId}
                  onCancel={() => setEditingId(null)}
                  onSave={(data) => handleUpdate(round.id || "", data)}
                />
              ) : (
                <RoundCard
                  round={round}
                  teacherId={teacherId}
                  teachers={teachers}
                  onEdit={() => {
                    setIsAdding(false); // ปิดโหมดเพิ่มก่อน
                    setEditingId(round.id || "");
                  }}
                />
              )}
            </div>
          ))}

          {!isAdding && rounds.length === 0 && (
            <div className="text-center text-gray-500 py-10 border-2 border-dashed rounded-xl">
              <p>ยังไม่มีรอบเรียนสำหรับคอร์สนี้</p>
              <Button
                variant="link"
                onClick={() => setIsAdding(true)}
                className="text-indigo-600"
              >
                + เพิ่มรอบแรกเลย
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- Component แสดงผลการ์ด (Read Only) ---
const RoundCard = ({
  round,
  onEdit,
  teachers,
  teacherId,
}: {
  round: Round;
  onEdit: () => void;
  teachers: UserType[];
  teacherId: string;
}) => {
  const hasSub = !!round.subTeacher;

  return (
    <div
      className={`border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition-all relative overflow-hidden ${round.status === "Cancelled" ? "opacity-60 bg-gray-50" : ""}`}
    >
      {/* Status Strip */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
          round.status === "Open"
            ? "bg-green-500"
            : round.status === "Full"
              ? "bg-red-500"
              : round.status === "Cancelled"
                ? "bg-gray-400"
                : "bg-orange-400"
        }`}
      />

      <div className="flex flex-col md:flex-row justify-between gap-4 pl-3">
        {/* Time */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant={round.status === "Open" ? "default" : "secondary"}
              className={round.status === "Open" ? "bg-green-600" : ""}
            >
              {round.status}
            </Badge>
            <span className="text-sm font-semibold text-gray-700">
              {format(new Date(round.startDateTime), "EEE, dd MMM yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <Clock className="w-5 h-5 text-gray-400" />
            {format(new Date(round.startDateTime), "HH:mm")} -{" "}
            {format(new Date(round.endDateTime), "HH:mm")}
          </div>
        </div>

        {/* Teacher */}
        <div className="flex-1 flex flex-col justify-center md:border-l md:pl-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <UserIcon size={16} />
            <span
              className={hasSub ? "line-through text-gray-400" : "font-medium"}
            >
              {teachers.find((teacher) => teacher.id === teacherId)?.userInfo
                .firstName +
                " " +
                teachers.find((teacher) => teacher.id === teacherId)?.userInfo
                  .lastName || "No Teacher"}
            </span>
          </div>
          {hasSub && (
            <div className="flex items-center gap-2 text-sm text-indigo-600 font-semibold bg-indigo-50 w-fit px-2 py-1 rounded">
              <UserCheck size={16} />
              <span>Sub: {round.subTeacher?.name}</span>
            </div>
          )}
        </div>

        {/* Stats & Edit */}
        <div className="flex-1 flex flex-col items-end justify-between gap-2">
          <div className="flex gap-4 text-sm">
            <div className="flex flex-col items-end">
              <span className="text-gray-500 text-xs">Online</span>
              <span className="font-mono font-medium">
                {round.current_online}/{round.max_online}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-gray-500 text-xs">Walk-in</span>
              <span className="font-mono font-medium">
                {round.current_walk_in}/{round.max_walk_in}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="gap-2 h-8"
          >
            <Pencil size={14} /> แก้ไข
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- ✅ Reusable Form (ใช้ทั้ง Add และ Edit) ---
interface RoundFormProps {
  mode: "create" | "edit";
  initialData?: Round | null;
  courseId: string;
  teacherId: string;
  teachers: UserType[];
  onCancel: () => void;
  onSave: (data: any) => void;
}

const RoundForm = ({
  mode,
  teacherId,
  initialData,
  courseId,
  teachers,
  onCancel,
  onSave,
}: RoundFormProps) => {
  // สร้างค่า Default สำหรับโหมด Create (เช่น พรุ่งนี้ 09:00 - 10:30)
  const defaultDate = addDays(new Date(), 1);
  const defaultStart = setMinutes(setHours(defaultDate, 9), 0);
  const defaultEnd = setMinutes(setHours(defaultDate, 10), 30);

  // State สำหรับ Form (แบบบ้านๆ ไม่ใช้ Library เพื่อความง่ายในการ demo)
  const [formData, setFormData] = useState<Round>({
    startDateTime: initialData
      ? String(new Date(initialData.startDateTime))
      : String(defaultStart),
    endDateTime: initialData
      ? String(new Date(initialData.endDateTime))
      : String(defaultEnd),
    max_online: initialData?.max_online || 10,
    max_walk_in: initialData?.max_walk_in || 5,
    current_online: initialData?.current_online || 0,
    current_walk_in: initialData?.current_walk_in || 0,
    teacherId: teacherId || "", // Default teacher
    subTeacherId: initialData?.subTeacherId || "none",
    status: initialData?.status || "Open",
    courseId: courseId || "c1",
  });

  const handleSubmit = async () => {
    if (formData.startDateTime >= formData.endDateTime) {
      toast.error("เวลาจบต้องอยู่หลังเวลาเริ่ม");
      return;
    }
    await courseService
      .createRound(formData)
      .then(() => {
        toast.success("เพิ่มรอบเรียนสำเร็จ");
      })
      .catch((error) => {
        toast.error("เพิ่มรอบเรียนไม่สำเร็จ");
      });
    onSave(formData);
  };

  const borderClass =
    mode === "create"
      ? "border-green-200 bg-green-50/30"
      : "border-indigo-200 bg-indigo-50/30";

  return (
    <div className={`border rounded-xl p-4 ${borderClass}`}>
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`font-semibold ${mode === "create" ? "text-green-900" : "text-indigo-900"}`}
        >
          {mode === "create" ? "รายละเอียดรอบใหม่" : "แก้ไขข้อมูล"}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="h-8 w-8 text-gray-400 hover:text-red-500"
        >
          <X size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500">
            เวลาเริ่ม - จบ
          </label>
          <div className="flex gap-2">
            <Input
              type="datetime-local"
              value={format(formData.startDateTime, "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  startDateTime: String(new Date(e.target.value)),
                })
              }
            />
            <Input
              type="datetime-local"
              value={format(formData.endDateTime, "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  endDateTime: String(new Date(e.target.value)),
                })
              }
            />
          </div>
        </div>

        {/* Capacity */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">
              Max Online
            </label>
            <Input
              type="number"
              value={formData.max_online}
              onChange={(e) =>
                setFormData({ ...formData, max_online: Number(e.target.value) })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">
              Max Walk-in
            </label>
            <Input
              type="number"
              value={formData.max_walk_in}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  max_walk_in: Number(e.target.value),
                })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">
              Current Online
            </label>
            <Input
              type="number"
              value={formData.current_online}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  current_online: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">
              Current Walk-in
            </label>
            <Input
              type="number"
              value={formData.current_walk_in}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  current_walk_in: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        {/* Teacher */}
        <div className="flex gap-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">
              ครูประจำคอร์ส
            </label>
            <Select
              value={formData.teacherId}
              onValueChange={(val) =>
                setFormData({ ...formData, teacherId: val })
              }
            >
              <SelectTrigger disabled={true} className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  กรุณาเลือกครูประจำคอร์สก่อน
                </SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.userInfo.firstName} {teacher.userInfo.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sub Teacher */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-indigo-600">
              ครูสอนแทน (Substitute)
            </label>
            <Select
              value={formData.subTeacherId}
              onValueChange={(val) =>
                setFormData({ ...formData, subTeacherId: val })
              }
            >
              <SelectTrigger className="bg-white border-indigo-200">
                <SelectValue placeholder="เลือกครูสอนแทน" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  กรุณาเลือกครูประจำคอร์สก่อน
                </SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.userInfo.firstName} {teacher.userInfo.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">สถานะ</label>
          <Select
            value={formData.status}
            onValueChange={(val: any) =>
              setFormData({ ...formData, status: val })
            }
          >
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Open">เปิดรับสมัคร (Open)</SelectItem>
              <SelectItem value="Full">เต็ม (Full)</SelectItem>
              <SelectItem value="Closed">ปิด (Closed)</SelectItem>
              <SelectItem value="Cancelled">ยกเลิก (Cancelled)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
        <Button variant="ghost" onClick={onCancel}>
          ยกเลิก
        </Button>
        <Button
          onClick={handleSubmit}
          className={`text-white gap-2 ${mode === "create" ? "bg-green-600! hover:bg-green-70!" : "bg-indigo-600! hover:bg-indigo-70!"}`}
        >
          <Save size={16} />{" "}
          {mode === "create" ? "ยืนยันสร้างรอบเรียน" : "บันทึกการเปลี่ยนแปลง"}
        </Button>
      </div>
    </div>
  );
};

export default RoundEdit;
