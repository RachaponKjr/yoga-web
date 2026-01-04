import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { UserPlus, Upload, X } from "lucide-react";

const AddUser = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-200 cursor-pointer">
          <UserPlus size={18} /> เพิ่มผู้ใช้ใหม่
        </button>
      </DialogTrigger>

      {/* ปรับขนาด Dialog ให้กว้างพอสำหรับฟอร์ม (max-w-lg) */}
      <DialogContent className="sm:max-w-lg bg-white p-0 gap-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">
              เพิ่มผู้ใช้ใหม่
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              กรอกข้อมูลส่วนตัวและกำหนดสิทธิ์เพื่อสร้างบัญชีใหม่
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-4">
          {/* ส่วนอัปโหลดรูปโปรไฟล์ */}
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
              <UserPlus size={24} />
            </div>
            <div>
              <button className="text-xs font-semibold px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center gap-1.5">
                <Upload size={14} /> อัปโหลดรูป
              </button>
              <p className="text-[10px] text-gray-400 mt-1">
                รองรับไฟล์ .jpg, .png (ไม่เกิน 2MB)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* ชื่อ-นามสกุล */}
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">
                ชื่อ-นามสกุล <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="เช่น สมชาย ใจดี"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* อีเมล */}
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">
                อีเมล <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="example@mail.com"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* เบอร์โทร */}
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">
                เบอร์โทรศัพท์
              </label>
              <input
                type="tel"
                placeholder="081-xxx-xxxx"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* เพศ */}
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">เพศ</label>
              <select className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all">
                <option value="">ระบุเพศ</option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>

            {/* สิทธิ์การใช้งาน */}
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">
                สิทธิ์ผู้ใช้งาน <span className="text-red-500">*</span>
              </label>
              <select className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all">
                <option value="user">User (สมาชิกทั่วไป)</option>
                <option value="instructor">Instructor (ครูสอน)</option>
                <option value="admin">Admin (ผู้ดูแลระบบ)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <DialogClose asChild>
            <button className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white hover:text-gray-800 border border-transparent hover:border-gray-200 transition-all cursor-pointer">
              ยกเลิก
            </button>
          </DialogClose>
          <button className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all cursor-pointer">
            บันทึกข้อมูล
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUser;
