/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Textarea } from "@/components/ui/textarea";
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
  Info,
  AlignLeft,
  Trash2, // เพิ่มไอคอนถังขยะ
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
  teacherId: defaultTeacherId,
}: {
  courseId: string;
  teacherId: string;
}) => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [teachers, setTeachers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null); // State สำหรับสถานะการลบ

  const getRoundByCourseId = useCallback(async () => {
    setLoading(true);
    try {
      const res = await courseService.getRoundByCourseId(courseId);
      if (res.success) {
        setRounds(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const getInstructor = useCallback(async () => {
    try {
      const response = await authService.getInstructor();
      if (response) setTeachers(response);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  }, []);

  // ✅ ฟังก์ชันลบรอบเรียน
  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "คุณแน่ใจหรือไม่ที่จะลบรอบเรียนนี้? ข้อมูลการจองอาจได้รับผลกระทบ",
      )
    )
      return;

    setDeletingId(id);
    try {
      const res = await courseService.deleteRound(id); // มั่นใจว่าใน courseService มี method นี้
      if (res.success) {
        toast.success("ลบรอบเรียนเรียบร้อยแล้ว");
        getRoundByCourseId(); // โหลดข้อมูลใหม่
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "ลบไม่สำเร็จ");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    void getInstructor();
    void getRoundByCourseId();
  }, [getInstructor, getRoundByCourseId]);

  const handleSuccess = () => {
    setIsAdding(false);
    setEditingId(null);
    getRoundByCourseId();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 cursor-pointer text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition">
          <Calendar size={18} />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl! max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            จัดการรอบเรียน (Course Rounds)
          </DialogTitle>
          {!isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" /> เพิ่มรอบใหม่
            </Button>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {loading && rounds.length === 0 && (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-green-600" />
            </div>
          )}

          {isAdding && (
            <RoundForm
              teachers={teachers}
              courseId={courseId}
              teacherId={defaultTeacherId}
              mode="create"
              onCancel={() => setIsAdding(false)}
              onSaveSuccess={handleSuccess}
            />
          )}

          {rounds.map((round) => (
            <div
              key={round.id}
              className={
                deletingId === round.id ? "opacity-50 pointer-events-none" : ""
              }
            >
              {editingId === round.id ? (
                <RoundForm
                  mode="edit"
                  teacherId={defaultTeacherId}
                  teachers={teachers}
                  initialData={round}
                  courseId={courseId}
                  onCancel={() => setEditingId(null)}
                  onSaveSuccess={handleSuccess}
                />
              ) : (
                <RoundCard
                  round={round}
                  teachers={teachers}
                  isDeleting={deletingId === round.id}
                  onEdit={() => setEditingId(round.id || null)}
                  onDelete={() => handleDelete(round.id || "")}
                />
              )}
            </div>
          ))}

          {!isAdding && rounds.length === 0 && !loading && (
            <div className="text-center text-gray-400 py-16 border-2 border-dashed rounded-2xl bg-white">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>ยังไม่มีการสร้างรอบเรียนสำหรับคอร์สนี้</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- Form Component (เหมือนเดิม) ---
const RoundForm = ({
  mode,
  initialData,
  courseId,
  teacherId,
  teachers,
  onCancel,
  onSaveSuccess,
}: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    courseId: courseId,
    teacherId: initialData?.teacherId || teacherId,
    subTeacherId: initialData?.subTeacherId || "none",
    startDateTime: initialData
      ? format(new Date(initialData.startDateTime), "yyyy-MM-dd'T'HH:mm")
      : format(addDays(setHours(new Date(), 9), 1), "yyyy-MM-dd'T'HH:mm"),
    endDateTime: initialData
      ? format(new Date(initialData.endDateTime), "yyyy-MM-dd'T'HH:mm")
      : format(addDays(setHours(new Date(), 10), 30), "yyyy-MM-dd'T'HH:mm"),
    max_online: initialData?.max_online || 10,
    max_walk_in: initialData?.max_walk_in || 5,
    current_online: initialData?.current_online || 0,
    current_walk_in: initialData?.current_walk_in || 0,
    description: initialData?.description || "",
    about: initialData?.about || "",
    status: initialData?.status || "Open",
  });

  const handleSubmit = async () => {
    if (formData.startDateTime >= formData.endDateTime) {
      return toast.error("เวลาจบต้องอยู่หลังเวลาเริ่ม");
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        startDateTime: new Date(formData.startDateTime).toISOString(),
        endDateTime: new Date(formData.endDateTime).toISOString(),
        subTeacherId:
          formData.subTeacherId === "none" ? null : formData.subTeacherId,
        description: formData.description || null,
        about: formData.about || null,
        max_online: Number(formData.max_online),
        max_walk_in: Number(formData.max_walk_in),
      };

      if (mode === "create") {
        await courseService.createRound(payload);
        toast.success("สร้างรอบเรียนเรียบร้อย");
      } else {
        await courseService.updateRound(initialData.id, payload);
        toast.success("แก้ไขข้อมูลเรียบร้อย");
      }
      onSaveSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "บันทึกไม่สำเร็จ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`p-6 border-2 rounded-2xl mb-6 shadow-sm animate-in fade-in slide-in-from-top-2 ${mode === "create" ? "border-green-200 bg-white" : "border-blue-200 bg-white"}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg flex items-center gap-2">
          {mode === "create" ? (
            <Badge className="bg-green-600">NEW ROUND</Badge>
          ) : (
            <Badge className="bg-blue-600">EDIT ROUND</Badge>
          )}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="h-8 w-8 text-gray-400"
        >
          <X size={18} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-gray-400 flex items-center gap-1">
                <Clock size={12} /> เวลาเริ่ม
              </label>
              <Input
                type="datetime-local"
                value={formData.startDateTime}
                onChange={(e) =>
                  setFormData({ ...formData, startDateTime: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-gray-400 flex items-center gap-1">
                <Clock size={12} /> เวลาจบ
              </label>
              <Input
                type="datetime-local"
                value={formData.endDateTime}
                onChange={(e) =>
                  setFormData({ ...formData, endDateTime: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-gray-400">
                สถานะ
              </label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Open", "Full", "Closed", "Cancelled"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-gray-400">
                ผู้สอนหลัก
              </label>
              <Select
                value={formData.teacherId}
                onValueChange={(v) =>
                  setFormData({ ...formData, teacherId: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.userInfo.firstName} {t.userInfo.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-blue-500">
                Max Online
              </label>
              <Input
                type="number"
                value={formData.max_online}
                onChange={(e) =>
                  setFormData({ ...formData, max_online: +e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-orange-500">
                Max Walk-in
              </label>
              <Input
                type="number"
                value={formData.max_walk_in}
                onChange={(e) =>
                  setFormData({ ...formData, max_walk_in: +e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-indigo-500 flex items-center gap-1">
              <UserCheck size={12} /> ครูสอนแทน (Substitute)
            </label>
            <Select
              value={formData.subTeacherId || "none"}
              onValueChange={(v) =>
                setFormData({ ...formData, subTeacherId: v })
              }
            >
              <SelectTrigger className="border-indigo-100 bg-indigo-50/30">
                <SelectValue placeholder="เลือกครูสอนแทน" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">-- ไม่มีครูสอนแทน --</SelectItem>
                {teachers.map((t: any) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.userInfo.firstName} {t.userInfo.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4 border-t pt-4 mt-2">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-gray-400 flex items-center gap-1">
              <AlignLeft size={12} /> รายละเอียดสั้น
            </label>
            <Input
              placeholder="เช่น ปรับพื้นฐานสำหรับผู้เริ่มต้น..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-gray-400 flex items-center gap-1">
              <Info size={12} /> ข้อมูลเพิ่มเติม
            </label>
            <Textarea
              placeholder="เช่น สิ่งที่ต้องเตรียมมา..."
              value={formData.about}
              onChange={(e) =>
                setFormData({ ...formData, about: e.target.value })
              }
              className="h-24 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          ยกเลิก
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={
            mode === "create"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin w-4 h-4 mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {mode === "create" ? "ยืนยันสร้างรอบเรียน" : "บันทึกการแก้ไข"}
        </Button>
      </div>
    </div>
  );
};

// --- Card Component (เพิ่มปุ่มลบ) ---
const RoundCard = ({ round, onEdit, onDelete, teachers, isDeleting }: any) => {
  const teacher = teachers.find((t: any) => t.id === round.teacherId);
  const subTeacher = teachers.find((t: any) => t.id === round.subTeacherId);

  return (
    <div className="border rounded-2xl p-4 bg-white flex justify-between items-center shadow-sm hover:shadow-md transition-all border-l-4 border-l-green-500">
      <div className="flex gap-5 items-center">
        <div className="text-center min-w-[60px] py-2 bg-gray-50 rounded-xl border">
          <div className="text-[10px] font-bold text-gray-400 uppercase">
            {format(new Date(round.startDateTime), "MMM")}
          </div>
          <div className="text-2xl font-black text-gray-800">
            {format(new Date(round.startDateTime), "dd")}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-800">
              {format(new Date(round.startDateTime), "HH:mm")} -{" "}
              {format(new Date(round.endDateTime), "HH:mm")}
            </span>
            <Badge
              className={
                round.status === "Open" ? "bg-green-500" : "bg-gray-400"
              }
            >
              {round.status}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <UserIcon size={12} /> {teacher?.userInfo?.firstName || "Unknown"}{" "}
              (Main)
            </div>
            {subTeacher && (
              <div className="text-indigo-600 font-bold flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-md">
                <UserCheck size={12} /> Sub: {subTeacher.userInfo.firstName}
              </div>
            )}
          </div>
          {round.description && (
            <p className="text-xs text-gray-400 italic line-clamp-1 max-w-[300px]">
              {round.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden md:block mr-3">
          <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">
            Capacity
          </p>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="font-mono text-[10px] border-blue-200 text-blue-600"
            >
              ON: {round.current_online}/{round.max_online}
            </Badge>
            <Badge
              variant="outline"
              className="font-mono text-[10px] border-orange-200 text-orange-600"
            >
              WK: {round.current_walk_in}/{round.max_walk_in}
            </Badge>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onEdit}
          className="h-9 w-9 p-0 md:w-auto md:px-4 rounded-xl"
        >
          <Pencil size={14} className="md:mr-2" />{" "}
          <span className="hidden md:inline">แก้ไข</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          disabled={isDeleting}
          className="h-9 w-9 p-0 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default RoundEdit;
