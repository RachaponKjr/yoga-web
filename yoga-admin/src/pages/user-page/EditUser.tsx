/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Edit,
  User as UserIcon,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  Briefcase,
  Loader2,
  Camera,
} from "lucide-react";
import React, { useState } from "react";
import type { UserInfoType, UserType } from "@/types/auth.type";
import { authService } from "../../service/auth.service"; // อย่าลืม Import Service
import { Button } from "@/components/ui/button";
import CountrySelect from "@/components/CountrySelect";

const BASE_IMG_URL = "https://api.yogabyniti.com/";

interface EditUserProps {
  user: UserType & {
    userInfo: UserInfoType | null;
  };
  onSuccess?: () => void; // เพิ่ม Callback เมื่อบันทึกสำเร็จ
}

const EditUser: React.FC<EditUserProps> = ({ user, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  // 2. State สำหรับ Form Data (Controlled Inputs)
  const [userEdit, setUserEdit] = useState({
    id: user.id,
    firstName: user.userInfo?.firstName || "",
    lastName: user.userInfo?.lastName || "",
    sex: user.userInfo?.sex || "NotSpecify",
    phone_number: user.userInfo?.phone_number || "",
    country: user.userInfo?.country || "",
    facebook: user.userInfo?.facebook || "",
    instagram: user.userInfo?.instagram || "",
    twitter: user.userInfo?.twitter || "",
    role: user.role,
    experience: user.userInfo?.experience || "",
  });
  // URL รูปเดิมจากฐานข้อมูล
  const originalAvatarUrl = user.userInfo?.avatar
    ? `${BASE_IMG_URL}${user.userInfo.avatar}`
    : null;

  // 3. Handle Change ทั่วไป (Input, Select, Textarea)
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setUserEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  console.log(avatar);
  // 5. Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", userEdit.firstName);
      formData.append("lastName", userEdit.lastName);
      formData.append("sex", userEdit.sex);
      formData.append("phone_number", userEdit.phone_number);
      formData.append("country", userEdit.country);
      formData.append("facebook", userEdit.facebook);
      formData.append("instagram", userEdit.instagram);
      formData.append("twitter", userEdit.twitter);
      formData.append("role", userEdit.role);
      formData.append("experience", userEdit.experience);
      if (avatar) {
        formData.append("avatar", avatar);
      }
      const res = await authService.updateUser(formData, userEdit.id);
      console.log(res);
      setOpen(false); // ปิด Dialog
      if (onSuccess) onSuccess(); // แจ้งหน้าหลักให้โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Update failed:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
          title={`แก้ไขข้อมูล ${user.email}`}
        >
          <Edit size={16} />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-0 gap-0 rounded-2xl">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">
                แก้ไขข้อมูลผู้ใช้
              </DialogTitle>
              <DialogDescription className="text-gray-500 text-sm">
                แก้ไขข้อมูลของบัญชี:{" "}
                <span className="text-indigo-600 font-medium">
                  {user.email}
                </span>
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Body Form */}
          <div className="p-6 space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-5">
              <div className="relative group w-20 h-20">
                {/* 1. ย้าย label มาครอบส่วนแสดงผลเพื่อให้คลิกได้ทั้งวงกลม */}
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer block w-full h-full relative"
                >
                  {/* Container ของรูปภาพ */}
                  <div className="w-full h-full rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 overflow-hidden relative">
                    {/* Logic การแสดงรูปภาพ */}
                    {avatar ? (
                      <img
                        src={URL.createObjectURL(avatar)}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : originalAvatarUrl ? (
                      <img
                        src={originalAvatarUrl}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon size={32} />
                    )}

                    {/* 2. เพิ่ม Overlay เมื่อ Hover (เพื่อให้รู้ว่ากดเปลี่ยนรูปได้) */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Camera size={24} className="text-white" />
                    </div>
                  </div>
                </label>

                {/* 3. Input file (ซ่อนไว้ แต่ทำงานผ่าน id) */}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAvatar(file);
                    }
                  }}
                />
              </div>
            </div>

            <div className="border-t border-gray-100 my-4"></div>

            {/* Personal Info */}
            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <UserIcon size={16} className="text-indigo-600" /> ข้อมูลส่วนตัว
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  ชื่อจริง
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={userEdit.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  นามสกุล
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={userEdit.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  เพศ
                </label>
                <select
                  name="sex"
                  value={userEdit.sex}
                  onChange={handleChange}
                  className="w-full px-3 py-2 h-10 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all"
                >
                  <option value="NotSpecify">ไม่ระบุ</option>
                  <option value="Male">ชาย</option>
                  <option value="Female">หญิง</option>
                  <option value="Other">อื่นๆ</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  ประเทศ
                </label>
                <CountrySelect
                  value={userEdit?.country || ""}
                  onChange={(val) =>
                    setUserEdit((prev: any) => ({
                      ...prev,
                      country: val,
                    }))
                  }
                />
              </div>
            </div>

            <div className="border-t border-gray-100 my-4"></div>

            {/* Account Info */}
            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Briefcase size={16} className="text-indigo-600" /> ข้อมูลบัญชี
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  อีเมล
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  สิทธิ์การใช้งาน
                </label>
                <select
                  name="role"
                  value={userEdit.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 h-10 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all"
                >
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  เบอร์โทรศัพท์
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="tel"
                    name="phone_number"
                    value={userEdit.phone_number}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 my-4"></div>

            {/* Social */}
            <h4 className="text-sm font-bold text-gray-800 mb-3">
              โซเชียลมีเดีย
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                  <Facebook size={12} /> Facebook
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={userEdit.facebook}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                  <Instagram size={12} /> Instagram
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={userEdit.instagram}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                  <Twitter size={12} /> Twitter
                </label>
                <input
                  type="text"
                  name="twitter"
                  value={userEdit.twitter}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-gray-600">
                ประสบการณ์
              </label>
              <textarea
                name="experience"
                value={userEdit.experience}
                onChange={handleChange}
                rows={5}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 sticky bottom-0 z-10">
            <DialogClose asChild>
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white hover:text-gray-800 border border-transparent hover:border-gray-200 transition-all cursor-pointer"
              >
                ยกเลิก
              </button>
            </DialogClose>
            <Button
              type="submit"
              variant={"outline"}
              disabled={isLoading}
              // className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;
