import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
// import Cookies from "js-cookie";

interface DelUserProps {
  userId: string;
  userName?: string; // รับชื่อมาแสดงในข้อความเตือน
  onDeleteSuccess?: () => void; // ฟังก์ชัน callback เมื่อลบสำเร็จ (เพื่อให้หน้าหลักโหลดข้อมูลใหม่)
}

const DelUser: React.FC<DelUserProps> = ({
  userId,
  userName,
  onDeleteSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    // const token = Cookies.get("token");

    try {
      // 1. เรียก API ลบ User (ต้องไปเพิ่ม function นี้ใน authService)
      // await authService.deleteUser(userId, { token });

      console.log(`Deleting user ${userId}...`);

      // จำลอง Delay (ลบส่วนนี้ทิ้งได้เมื่อต่อ API จริง)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 2. แจ้งหน้าหลักว่าลบเสร็จแล้ว
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

      setOpen(false); // ปิด Dialog
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("เกิดข้อผิดพลาดในการลบผู้ใช้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="ลบผู้ใช้"
        >
          <Trash2 size={16} />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white rounded-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 text-red-600 mb-2">
            <div className="p-2 bg-red-50 rounded-full">
              <AlertTriangle size={24} />
            </div>
            <AlertDialogTitle className="text-xl font-bold">
              ยืนยันการลบ?
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="text-gray-500">
            คุณกำลังจะลบผู้ใช้{" "}
            <span className="font-bold text-gray-800">
              "{userName || "นี้"}"
            </span>
            <br />
            การกระทำนี้ไม่สามารถย้อนกลับได้
            ข้อมูลการจองและประวัติทั้งหมดจะถูกลบออกจากระบบ
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel
            disabled={loading}
            className="rounded-xl border-gray-200 cursor-pointer"
          >
            ยกเลิก
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // ป้องกัน Dialog ปิดเองทันที ต้องรอ API
              handleDelete();
            }}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md shadow-red-100 cursor-pointer w-28 flex justify-center"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "ยืนยันลบ"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DelUser;
