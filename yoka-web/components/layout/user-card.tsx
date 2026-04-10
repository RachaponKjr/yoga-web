import {
  Instagram,
  Twitter,
  Facebook,
  ArrowUpRight,
  Linkedin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const UserCardMinimal = ({
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
  const imageSrc = `https://api.yogabyniti.com/${avatar}`;
  console.log(avatar);
  return (
    <div className="group relative w-full  mx-auto h-full">
      {/* Container: พื้นขาว Solid จัดระเบียบด้วย Grid/Flex */}
      <div className="relative flex flex-col items-center bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] h-full justify-between overflow-hidden">
        <div className="flex flex-col items-center w-full pt-4">
          {/* 1. Image Area: วงกลมซ้อนวงกลม */}
          <div className="relative mb-5">
            <div className="relative w-28 h-28 rounded-full p-1 bg-white border border-gray-100 shadow-inner group-hover:border-rose-100 transition-colors duration-300">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={fullName || "Instructor"}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* 2. Text Content */}
          <div className="text-center space-y-1.5 mb-6 w-full px-2">
            <h3 className="text-lg font-bold text-gray-900 truncate leading-tight">
              {fullName || "Instructor Name"}
            </h3>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
              Yoga Instructor
            </p>
          </div>
        </div>

        {/* 3. Divider & Socials */}
        <div className="w-full pt-5 border-t border-gray-50 mt-auto">
          <div className="flex justify-center items-center gap-3">
            {facebook && (
              <SocialBtn
                href={facebook}
                icon={<Facebook size={16} />}
                label="Facebook"
                color="hover:text-blue-600 hover:bg-blue-50"
              />
            )}
            {instagram && (
              <SocialBtn
                href={instagram}
                icon={<Instagram size={16} />}
                label="Instagram"
                color="hover:text-pink-600 hover:bg-pink-50"
              />
            )}
            {twitter && (
              <SocialBtn
                href={twitter}
                icon={<Twitter size={16} />}
                label="Twitter"
                color="hover:text-sky-500 hover:bg-sky-50"
              />
            )}

            {/* Fallback ถ้าไม่มี Social */}
            {!facebook && !instagram && !twitter && (
              <Link
                href="#"
                className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors py-2"
              >
                View Full Profile <ArrowUpRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ปุ่ม Social แบบ Clean
const SocialBtn = ({
  href,
  icon,
  label,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}) => (
  <Link
    href={href}
    target="_blank"
    aria-label={label}
    className={`p-2.5 rounded-full text-gray-400 transition-all duration-200 ${color}`}
  >
    {icon}
  </Link>
);

export default UserCardMinimal;
