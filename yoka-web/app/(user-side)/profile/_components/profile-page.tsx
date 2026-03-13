"use client";

import { AvatarUploader } from "@/components/AvatarUploader";
import CountrySelect from "@/components/CountrySelect"; // Import ที่เราสร้าง
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authService } from "@/service/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { UserInfoType } from "@/types/auth.type";
import {
  Loader2,
  User,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [userInfo, setUserInfo] = useState<UserInfoType | undefined>(undefined);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันสำหรับบันทึกข้อมูล
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // ส่งข้อมูลตาม Prisma Model
      formData.append("firstName", userInfo?.firstName || "");
      formData.append("lastName", userInfo?.lastName || "");
      formData.append("phone_number", userInfo?.phone_number || "");
      formData.append("country", userInfo?.country || "");
      formData.append("sex", userInfo?.sex || "NotSpecify");
      formData.append("experience", userInfo?.experience || "");
      formData.append("facebook", userInfo?.facebook || "");
      formData.append("instagram", userInfo?.instagram || "");
      formData.append("twitter", userInfo?.twitter || "");

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const resUpdate = await authService.updateProfile(formData);
      if (resUpdate.success) {
        toast.success("บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว!");
      } else {
        toast.error("ไม่สามารถอัปเดตโปรไฟล์ได้");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserInfoType, value: string) => {
    setUserInfo((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  useEffect(() => {
    if (user?.userInfo) {
      setUserInfo(user.userInfo);
    }
  }, [user]);

  if (!user && !userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 bg-gray-50/30">
      <div className="container max-w-5xl mx-auto flex flex-col gap-6 px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 overflow-hidden">
          <div className="h-32 bg-linear-to-r from-indigo-50 to-slate-50 border-b border-gray-100"></div>

          <div className="px-8 pb-8 -mt-12">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-10">
              <div className="relative">
                <AvatarUploader
                  userInfo={userInfo as UserInfoType}
                  onUpload={(file) => setAvatar(file)}
                />
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
              </div>

              <div className="flex flex-col pb-2 space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {userInfo?.firstName} {userInfo?.lastName}
                  </h1>
                </div>
                <p className="text-gray-500 font-medium">
                  {user?.role} <span className="text-gray-300 mx-2">•</span>{" "}
                  {user?.email}
                </p>
              </div>

              <div className="hidden md:block pb-2">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  variant={"outline"}
                  className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white hover:text-white px-6"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-10 max-w-4xl">
              {/* ข้อมูลส่วนตัว */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <User className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-lg font-bold">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400">
                      First Name
                    </label>
                    <Input
                      value={userInfo?.firstName || ""}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="rounded-xl bg-gray-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400">
                      Last Name
                    </label>
                    <Input
                      value={userInfo?.lastName || ""}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="rounded-xl bg-gray-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400">
                      Phone Number
                    </label>
                    <Input
                      value={userInfo?.phone_number || ""}
                      onChange={(e) =>
                        handleInputChange("phone_number", e.target.value)
                      }
                      className="rounded-xl bg-gray-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400">
                      Country
                    </label>
                    <CountrySelect
                      value={userInfo?.country || ""}
                      onChange={(val) => handleInputChange("country", val)}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400">
                      Gender
                    </label>
                    <Select
                      value={userInfo?.sex || "NotSpecify"}
                      onValueChange={(v) => handleInputChange("sex", v)}
                    >
                      <SelectTrigger className="rounded-xl bg-gray-50/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="NotSpecify">Not Specify</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400">
                      Bio / Experience
                    </label>
                    <Textarea
                      value={userInfo?.experience || ""}
                      onChange={(e) =>
                        handleInputChange("experience", e.target.value)
                      }
                      className="rounded-xl bg-gray-50/50 min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Globe className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-lg font-bold">Social Profiles</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400">
                      <Facebook size={14} className="text-blue-600" /> Facebook
                    </label>
                    <Input
                      value={userInfo?.facebook || ""}
                      onChange={(e) =>
                        handleInputChange("facebook", e.target.value)
                      }
                      className="rounded-xl bg-gray-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400">
                      <Instagram size={14} className="text-pink-600" />{" "}
                      Instagram
                    </label>
                    <Input
                      value={userInfo?.instagram || ""}
                      onChange={(e) =>
                        handleInputChange("instagram", e.target.value)
                      }
                      className="rounded-xl bg-gray-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400">
                      <Twitter size={14} className="text-sky-400" /> Twitter
                    </label>
                    <Input
                      value={userInfo?.twitter || ""}
                      onChange={(e) =>
                        handleInputChange("twitter", e.target.value)
                      }
                      className="rounded-xl bg-gray-50/50"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 md:hidden">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="w-full h-12 rounded-2xl bg-indigo-600"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
