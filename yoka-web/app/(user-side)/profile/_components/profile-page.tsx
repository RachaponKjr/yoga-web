"use client";

import { AvatarUploader } from "@/components/AvatarUploader";
import CountrySelect from "@/components/CountrySelect";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // อย่าลืม import Textarea
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authService } from "@/service/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { UserInfoType } from "@/types/auth.type";
import { Icon } from "@iconify/react";
import {
  Loader2,
  User,
  Phone,
  MapPin,
  Briefcase,
  Globe,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [userInfo, setUserInfo] = useState<UserInfoType | undefined>(undefined);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log(user);
  // ฟังก์ชันสำหรับบันทึกข้อมูล
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      // Helper function to append only if value exists
      const appendIfExist = (key: string, value: string | undefined) => {
        if (value) formData.append(key, value);
      };

      appendIfExist("firstName", userInfo?.firstName || "");
      appendIfExist("lastName", userInfo?.lastName || "");
      appendIfExist("facebook", userInfo?.facebook || "");
      appendIfExist("instagram", userInfo?.instagram || "");
      appendIfExist("twitter", userInfo?.twitter || "");
      appendIfExist("experience", userInfo?.experience || "");
      appendIfExist("sex", userInfo?.sex || "");
      appendIfExist("country", userInfo?.country || "");
      appendIfExist("phone_number", userInfo?.phone_number || "");

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const resUpdate = await authService.updateProfile(formData);
      if (!resUpdate.success) {
        toast.error("Failed to update profile");
        return;
      }
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while saving.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserInfoType, value: string) => {
    if (!userInfo) return;
    setUserInfo((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (user && user.userInfo) {
      setUserInfo(user.userInfo);
    }
  }, [user]);

  // Loading State แบบ Skeleton (ดูดีกว่า Text ธรรมดา)
  if (!user && !userInfo) {
    return (
      <div className="min-h-screen py-10 container mx-auto px-4 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="bg-white rounded-2xl p-8 border border-gray-100 h-[600px]">
          <div className="flex gap-6 items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-10 w-full bg-gray-200 rounded"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24">
      <div className="container max-w-5xl mx-auto flex flex-col gap-6 px-4">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 overflow-hidden">
          {/* Cover/Header Background (Optional aesthetic touch) */}
          <div className="h-32 bg-linear-to-r from-slate-100 to-gray-50 border-b border-gray-100"></div>

          <div className="px-8 pb-8 -mt-12">
            {/* Profile Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-10">
              <div className="relative">
                <AvatarUploader
                  userInfo={userInfo as UserInfoType}
                  onUpload={(file) => setAvatar(file)}
                />
                {/* Status Indicator (Optional) */}
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
              </div>

              <div className="flex flex-col pb-2 space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {userInfo?.firstName && userInfo?.lastName
                      ? `${userInfo.firstName} ${userInfo.lastName}`
                      : user?.email?.split("@")[0] || "User"}
                  </h1>
                  {userInfo?.sex && userInfo.sex !== "NotSpecify" && (
                    <div className="p-1 bg-gray-100 rounded-full">
                      <Icon
                        icon={
                          userInfo.sex === "Male"
                            ? "fluent-emoji-flat:male-sign"
                            : "fluent-emoji-flat:female-sign"
                        }
                        width={20}
                        height={20}
                      />
                    </div>
                  )}
                </div>
                <p className="text-gray-500 font-medium flex items-center gap-1">
                  {user?.role || "Member"}
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-400">{user?.email}</span>
                </p>
              </div>

              {/* Save Button (Desktop Position) */}
              <div className="hidden md:block pb-2">
                <Button
                  onClick={handleSave}
                  variant={"outline"}
                  disabled={isLoading}
                  size={isLoading ? "icon" : "default"}
                  className="rounded-full cursor-pointer transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>

            {/* Form Section */}
            <div className="space-y-10 max-w-4xl">
              {/* Personal Information Group */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <User className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <Input
                      value={userInfo?.firstName || ""}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="e.g. John"
                      className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-gray-400 transition-all rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <Input
                      value={userInfo?.lastName || ""}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="e.g. Doe"
                      className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-gray-400 transition-all rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Phone Number
                    </label>
                    <Input
                      value={userInfo?.phone_number || ""}
                      onChange={(e) =>
                        handleInputChange("phone_number", e.target.value)
                      }
                      placeholder="+66 XX XXX XXXX"
                      className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-gray-400 transition-all rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Country
                    </label>
                    {/* ส่งค่า value เข้าไปเพื่อให้แสดงค่าเดิม */}
                    {/* <CountrySelect
                      value={userInfo?.country}
                      onChange={(val: any) => handleInputChange("country", val)} // ปรับตาม Type ของ CountrySelect ของคุณ ถ้ามัน return event ให้ใช้ e.target.value
                    /> */}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <Select
                      value={userInfo?.sex || "NotSpecify"}
                      onValueChange={(value) => handleInputChange("sex", value)}
                    >
                      <SelectTrigger className="w-full h-11 rounded-xl bg-gray-50/50 border-gray-200">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="NotSpecify">
                            Prefer not to say
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> Bio / Experience
                    </label>
                    <Textarea
                      disabled={user?.role === "Student"}
                      value={userInfo?.experience || ""}
                      onChange={(e) =>
                        handleInputChange("experience", e.target.value)
                      }
                      placeholder="Tell us a little bit about yourself..."
                      className="min-h-[120px] bg-gray-50/50 border-gray-200 focus:bg-white focus:border-gray-400 transition-all rounded-xl resize-none p-4"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Group */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Social Profiles
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Facebook className="w-4 h-4 text-blue-600" /> Facebook
                    </label>
                    <Input
                      value={userInfo?.facebook || ""}
                      onChange={(e) =>
                        handleInputChange("facebook", e.target.value)
                      }
                      placeholder="Username or URL"
                      className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-gray-400 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-pink-600" /> Instagram
                    </label>
                    <Input
                      value={userInfo?.instagram || ""}
                      onChange={(e) =>
                        handleInputChange("instagram", e.target.value)
                      }
                      placeholder="Username or URL"
                      className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-gray-400 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Twitter className="w-4 h-4 text-sky-500" /> Twitter (X)
                    </label>
                    <Input
                      value={userInfo?.twitter || ""}
                      onChange={(e) =>
                        handleInputChange("twitter", e.target.value)
                      }
                      placeholder="Username or URL"
                      className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-gray-400 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Action Button */}
              <div className="pt-4 md:hidden">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="w-full h-12 rounded-full bg-gray-900 hover:bg-gray-800 text-white font-medium shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
