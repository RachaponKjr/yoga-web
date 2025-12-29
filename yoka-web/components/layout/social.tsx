import { Icon } from "@iconify/react";
import Link from "next/link";
import React from "react";

const Social = () => {
  return (
    <div className="fixed hidden md:flex top-1/2 -translate-y-1/2 right-4 z-100 flex-col gap-2 p-3 rounded-full bg-neutral-900/80 backdrop-blur-md border border-white/10 shadow-2xl">
      {/* Facebook */}
      <Link
        href="#"
        className="group relative flex items-center justify-center p-2 transition-all duration-300 hover:scale-110"
      >
        <div className="absolute inset-0 bg-[#DDA15E]/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
        <Icon
          icon="mdi:facebook"
          width={28}
          height={28}
          className="text-gray-400 group-hover:text-[#DDA15E] transition-colors duration-300 z-10"
        />
      </Link>

      {/* Divider เส้นคั่นบางๆ */}
      <div className="h-px w-full bg-white/10 mx-auto" />

      {/* Instagram */}
      <Link
        href="#"
        className="group relative flex items-center justify-center p-2 transition-all duration-300 hover:scale-110"
      >
        <div className="absolute inset-0 bg-[#DDA15E]/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
        <Icon
          icon="mdi:instagram"
          width={28}
          height={28}
          className="text-gray-400 group-hover:text-[#DDA15E] transition-colors duration-300 z-10"
        />
      </Link>
    </div>
  );
};

export default Social;
