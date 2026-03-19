/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link, { LinkProps } from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Image from "next/image";
// import { authService } from "@/service/auth.service";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";

interface UserProps {
  user: {
    role: string;
    email: string;
    userInfo: {
      firstName: string;
      lastName: string;
      email: string;
      avatar: string;
    };
  };
}

const Navbar = () => {
  const pathname = usePathname();
  const { user, checkAuth, logout, isLoading } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ตรวจจับการ Scroll
  useEffect(() => {
    const handleScroll = () => {
      // เริ่ม effect เมื่อ scroll ลงมามากกว่า 10px
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const navLinks = [
    { href: "/", label: "Home", icon: "mdi:home" },
    {
      href: "/instructors",
      label: "Instructors",
      icon: "mdi:account-multiple",
    },
    {
      href: "/yoga-time",
      label: "Yoga Timetable",
      icon: "mdi:calendar-blank-outline",
    },
    { href: "/about", label: "About Us", icon: "mdi:information-outline" },
    { href: "/contact", label: "Contact Us", icon: "mdi:phone-outline" },
  ];

  // Component ย่อยสำหรับ Link
  const NavItem = ({
    link,
    mobile = false,
  }: {
    link: LinkProps & { label: string; icon: string };
    mobile?: boolean;
  }) => {
    const isActive = pathname === link.href;
    return (
      <Link
        href={link.href}
        onClick={() => mobile && setIsMobileMenuOpen(false)}
        className={`relative transition-colors flex items-center gap-2 hover:text-primary font-medium
          ${mobile ? "text-base block w-full" : "text-sm lg:text-base"}
          ${isActive ? "text-primary font-semibold" : "text-foreground/60"}
        `}
      >
        <Icon icon={link.icon} width={20} height={20} />
        {link.label}
        {!mobile && (
          <span
            className={`absolute left-0 -bottom-2 h-[3px] bg-tertiary rounded-full transition-all duration-300 ease-out origin-left
            ${isActive ? "w-[40%]" : "w-0 group-hover:w-[40%]"}
            `}
          />
        )}
      </Link>
    );
  };

  return (
    <header
      className={`relative top-0 left-0 right-0 z-999 transition-all duration-300 ease-in-out border-b border-transparent shadow-sm
      ${
        isScrolled
          ? "bg-secondary/80 backdrop-blur-md shadow-sm py-3 border-gray-200/20"
          : "bg-secondary py-2 md:py-3"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="z-50 relative ">
          <Image
            src={"/tlogo.png"}
            alt="Logo"
            width={100}
            height={100}
            className="md:scale-200 scale-150 relative left-5 top-2"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <div key={link.href} className="group relative">
              <NavItem link={link} />
            </div>
          ))}
        </nav>

        {/* Right Side: Auth & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            {!user ? (
              <div className="flex items-center  gap-3">
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-full hover:bg-white/20 hover:text-primary"
                >
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            ) : (
              <UserDropdown user={user as any} />
            )}
          </div>
          <div className="md:hidden flex items-center gap-3">
            {user && <UserDropdown user={user as any} />}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground/80 hover:text-primary transition-colors focus:outline-none"
            >
              <Icon
                icon={isMobileMenuOpen ? "mdi:close" : "mdi:menu"}
                width={28}
                height={28}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-secondary/95 backdrop-blur-xl border-t border-white/10 shadow-xl overflow-hidden transition-all duration-300 ease-in-out
        ${
          isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-6 py-6 flex flex-col gap-6">
          {navLinks.map((link) => (
            <NavItem key={link.href} link={link} mobile />
          ))}

          {!user && (
            <>
              <div className="h-px bg-foreground/10" />
              <div className="flex flex-row max-w-full gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="w-[50%] justify-center text-sm font-semibold rounded-full h-[44px] border-primary/20"
                >
                  <Link
                    href="/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-[50%] justify-center text-sm font-semibold rounded-full h-[44px] bg-[#3D552F] hover:bg-[#3D552F]/90 text-white"
                >
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

// Component Dropdown (เหมือนเดิม)
const UserDropdown = ({ user }: UserProps) => {
  const { logout } = useAuthStore();

  const displayName =
    user?.userInfo?.firstName && user?.userInfo?.lastName
      ? `${user?.userInfo?.firstName} ${user?.userInfo?.lastName}`
      : user?.email;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex min-w-max items-center gap-3 pl-4 pr-1.5 py-1 rounded-full border border-gray-200 bg-white/50 backdrop-blur-sm hover:bg-white transition-all cursor-pointer group shadow-sm">
          <div className="flex-col items-end flex w-full">
            <span className="text-xs md:text-sm font-semibold text-foreground/90 max-w-full truncate">
              {displayName || "ไม่พบข้อมูล"}
            </span>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-bold">
              {user?.role || "ไม่พบข้อมูล"}
            </span>
          </div>
          <Avatar className="size-9 ring-2 ring-white group-hover:ring-primary/20 transition-all">
            <AvatarImage
              src={
                user?.userInfo?.avatar
                  ? `${process.env.NEXT_PUBLIC_HOST_IMAGE || "https://api.yogabyniti.com/"}${user?.userInfo?.avatar}`
                  : "https://github.com/shadcn.png"
              }
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user.userInfo?.firstName?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2 z-999">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my-booking" className="cursor-pointer">
            My Booking
          </Link>
        </DropdownMenuItem>

        {user.role !== "Student" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-primary">
              Instructor Panel
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/my-course" className="cursor-pointer">
                Manage Courses
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/my-timetable" className="cursor-pointer">
                Timetable
              </Link>
            </DropdownMenuItem>
          </>
        )}
        {user.role === "Admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-primary">
              Admin Panel
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link
                href="https://admin.yogabyniti.com"
                className="cursor-pointer"
              >
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            onClick={async () => {
              await logout();
            }}
            variant={"outline"}
            className="w-full cursor-pointer"
          >
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Navbar;
