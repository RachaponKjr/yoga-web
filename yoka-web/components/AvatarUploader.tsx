import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // ปรับ path ตามโปรเจกต์คุณ
import { Camera, Loader2 } from "lucide-react"; // ไอคอนจาก lucide-react
import { UserInfoType } from "@/types/auth.type";

// สมมติ Interface ของ UserInfo (เพื่อให้ TypeScript ไม่บ่น)
// interface UserInfo {
//   firstName?: string;
//   avatar?: string;
// }

interface AvatarUploaderProps {
  userInfo: UserInfoType | null;
  onUpload?: (file: File) => void; // prop สำหรับส่งไฟล์ไปหลังบ้าน (Optional)
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  userInfo,
  onUpload,
}) => {
  // State สำหรับเก็บ URL รูปที่ user เลือกมาใหม่ (Preview)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // State สำหรับแสดงสถานะกำลังอัปโหลด
  const [isUploading, setIsUploading] = useState(false);

  // Ref สำหรับอ้างอิงไปยัง input type="file" ที่ซ่อนอยู่
  const fileInputRef = useRef<HTMLInputElement>(null);
  console.log(userInfo);
  // ฟังก์ชันเมื่อมีการคลิกที่ Avatar ให้ไปกระตุ้นการคลิกที่ input ที่ซ่อนอยู่
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  // ฟังก์ชันเมื่อ User เลือกไฟล์เสร็จแล้ว
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1. สร้าง Preview URL ทันทีเพื่อให้ UX รู้สึกเร็ว
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // 2. ถ้ามีฟังก์ชัน onUpload ส่งมา ให้เรียกใช้เพื่อส่งไฟล์ไป Server
    if (onUpload) {
      try {
        setIsUploading(true);
        // จำลองการอัปโหลด (หรือเรียก API จริงตรงนี้)
        await onUpload(file);
        console.log("Upload success!");
      } catch (error) {
        console.error("Upload failed:", error);
        // อาจจะแสดง Toast error ตรงนี้
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Cleanup object URL เพื่อป้องกัน memory leak เมื่อ component unmount หรือเปลี่ยนรูป
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Logic การเลือกรูป: ถ้ามี preview ใหม่ใช้ preview, ถ้าไม่มีใช้ของเดิม, ถ้าไม่มีเลยใช้ default github
  const currentAvatarSrc =
    previewUrl ||
    `${process.env.NEXT_PUBLIC_HOST_IMAGE || "http://119.59.99.141:4001/"}${userInfo?.avatar}` ||
    "https://github.com/shadcn.png";

  return (
    <div className="relative group inline-block">
      {/* 1. ตัว Avatar หลัก */}
      <Avatar className="size-32 border-4 border-white shadow-md bg-gray-100">
        <AvatarImage
          src={currentAvatarSrc}
          alt={userInfo?.firstName || "User"}
          className={isUploading ? "opacity-50" : ""} // ทำให้รูปจางลงตอนกำลังอัปโหลด
        />
        <AvatarFallback className="text-4xl font-bold bg-slate-200 text-slate-600">
          {userInfo?.firstName?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      {/* 2. Layer Overlay - แสดงเมื่อ Hover หรือกำลัง Upload */}
      <div
        onClick={handleAvatarClick}
        className={`absolute inset-0 flex items-center justify-center bg-black/40 bg-opacity-0 rounded-full transition-all duration-200 cursor-pointer
          ${
            isUploading
              ? "bg-opacity-50 cursor-not-allowed"
              : "group-hover:bg-opacity-40"
          }
        `}
      >
        {isUploading ? (
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        ) : (
          <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        )}
        {/* Input ที่ซ่อนอยู่ */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg, image/gif" // จำกัดประเภทไฟล์
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </div>
  );
};
