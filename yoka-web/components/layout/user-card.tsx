import { Instagram, Twitter, Linkedin, Facebook, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const UserCardGlass = ({
  fullName,
  avatar,
  facebook,
  instagram,
  twitter,
}: {
  fullName: string;
  avatar?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}) => {
  // สร้าง URL รูปภาพ หรือใช้ Placeholder ถ้าไม่มีรูป
  const imageSrc = avatar
    ? `${process.env.NEXT_PUBLIC_HOST_IMAGE}${avatar}`
    : "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=2069&auto=format&fit=crop"; // รูป Default แนวโยคะ

  return (
    <div className="group relative w-full max-w-sm mx-auto flex flex-col items-center p-8 rounded-[32px] bg-white/60 backdrop-blur-xl border border-white/40 shadow-md shadow-gray-200/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
      {/* 1. Background Glow (แสงฟุ้งๆ ตกแต่ง) */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-green-300/40 transition-colors duration-500"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 group-hover:bg-orange-200/50 transition-colors duration-500"></div>

      {/* 2. Image Container */}
      <div className="relative z-10 mb-5">
        <div className="w-28 h-28 p-[3px] rounded-full bg-gradient-to-br from-[#132b28]/20 to-transparent">
          <div className="w-full h-full rounded-full p-[3px] bg-white">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src={imageSrc}
                alt={fullName || "Instructor"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Text Info */}
      <div className="text-center z-10 mb-6 space-y-1">
        <h3 className="text-xl font-bold text-[#132b28]">
          {fullName || "Unknown Instructor"}
        </h3>
        <p className="text-sm text-[#666666] font-medium tracking-wide uppercase">
          Yoga Instructor
        </p>
      </div>

      {/* 4. Socials */}
      <div className="flex gap-3 z-10">
        {facebook && (
          <SocialLink
            href={facebook}
            icon={<Facebook size={18} />}
            color="hover:text-blue-600 hover:bg-blue-50"
          />
        )}
        {instagram && (
          <SocialLink
            href={instagram}
            icon={<Instagram size={18} />}
            color="hover:text-pink-600 hover:bg-pink-50"
          />
        )}
        {twitter && (
          <SocialLink
            href={twitter}
            icon={<Twitter size={18} />}
            color="hover:text-sky-500 hover:bg-sky-50"
          />
        )}
        {/* ถ้าไม่มี Social เลยให้โชว์ปุ่ม View Profile แทน (Optional) */}
        {!facebook && !instagram && !twitter && (
          <button className="text-sm font-semibold text-[#132b28] hover:underline">
            View Profile
          </button>
        )}
      </div>
    </div>
  );
};

// Component ย่อยสำหรับปุ่ม Social เพื่อลดโค้ดซ้ำ
const SocialLink = ({
  href,
  icon,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  color: string;
}) => (
  <Link
    href={href}
    target="_blank"
    className={`p-3 rounded-full bg-white border border-gray-100 text-gray-500 shadow-sm transition-all duration-300 hover:scale-110 ${color}`}
  >
    {icon}
  </Link>
);

export default UserCardGlass;
