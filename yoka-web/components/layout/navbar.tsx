/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
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
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./navbar.module.css";

gsap.registerPlugin(useGSAP);
import Image from "next/image";
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
  const { user, checkAuth } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        { reduce: "(prefers-reduced-motion: reduce)", all: "(min-width: 0px)" },
        (context) => {
          const reduced = context.conditions?.reduce;
          let compact = false;
          const update = (initial = false) => {
            // Separate thresholds keep the island stable near the transition.
            const next = window.scrollY > (compact ? 32 : 80);
            if (!initial && next === compact) return;
            compact = next;
            setIsScrolled(next);
            gsap.to(headerRef.current, {
              "--island-inset": next ? "16px" : "0px",
              "--island-width": next ? "1160px" : "100vw",
              "--island-height": next ? "68px" : "100px",
              "--island-radius": next ? "36px" : "0px",
              "--island-logo": next ? "72px" : "100px",
              y: next ? 12 : 0,
              duration: reduced || initial ? 0 : 0.65,
              ease: "power3.inOut",
              overwrite: "auto",
            });
          };
          const onScroll = () => update();
          update(true);
          window.addEventListener("scroll", onScroll, { passive: true });
          return () => {
            window.removeEventListener("scroll", onScroll);
            gsap.killTweensOf(headerRef.current);
          };
        },
      );
      return () => media.revert();
    },
    { scope: headerRef },
  );

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node))
        setIsMobileMenuOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1200px)");
    const resize = () => {
      if (desktop.matches) setIsMobileMenuOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    desktop.addEventListener("change", resize);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
      desktop.removeEventListener("change", resize);
    };
  }, [isMobileMenuOpen]);

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
    {
      href: "/blog",
      label: "Blog",
      icon: "mdi:book-open-page-variant-outline",
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
    const isActive =
      pathname === link.href ||
      (link.href === "/blog" && pathname.startsWith("/blog/"));
    return (
      <Link
        href={link.href}
        aria-current={isActive ? "page" : undefined}
        onClick={() => mobile && setIsMobileMenuOpen(false)}
        className={`relative transition-colors flex items-center gap-2 hover:text-primary font-medium
          ${mobile ? "text-base block w-full" : "text-sm whitespace-nowrap"}
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
    <div className={styles.placeholder}>
      <header
        ref={headerRef}
        data-scrolled={isScrolled}
        className={styles.header}
      >
        <div className={styles.bar}>
          {/* Logo */}
          <Link href="/" aria-label="Yoga By Niti home" className={styles.logo}>
            <Image
              src={"/tlogo.png"}
              alt="Yoga By Niti"
              width={100}
              height={100}
              className="h-full w-full object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden min-[1200px]:flex items-center gap-4"
          >
            {navLinks.map((link) => (
              <div key={link.href} className="group relative">
                <NavItem link={link} />
              </div>
            ))}
          </nav>

          {/* Right Side: Auth & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden min-[1200px]:block">
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
            <div className="min-[1200px]:hidden flex items-center gap-3">
              {user && <UserDropdown user={user as any} />}
              <button
                ref={toggleRef}
                aria-label={
                  isMobileMenuOpen ? "Close navigation" : "Open navigation"
                }
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-foreground/80 hover:text-primary transition-colors rounded-full focus-visible:outline-2 focus-visible:outline-primary"
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
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          inert={!isMobileMenuOpen}
          aria-hidden={!isMobileMenuOpen}
          data-open={isMobileMenuOpen}
          className={styles.mobileMenu}
        >
          <div className="container mx-auto px-6 py-6 flex flex-col gap-10">
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
        </nav>
      </header>
    </div>
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
        <button
          type="button"
          aria-label="Open account menu"
          className="flex max-w-[190px] items-center gap-1 md:gap-3 pl-4 pr-1.5 py-1 rounded-full border border-gray-200 bg-white/50 backdrop-blur-sm hover:bg-white transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex-col items-end flex w-full">
            <span className="text-[10px] md:text-sm font-semibold text-foreground/90 max-w-[110px] truncate">
              {displayName || "ไม่พบข้อมูล"}
            </span>
            <span className="text-[8px] uppercase tracking-wide text-muted-foreground font-bold">
              {user?.role || "ไม่พบข้อมูล"}
            </span>
          </div>
          <Avatar className="size-8 md:size-9 ring-2 ring-white group-hover:ring-primary/20 transition-all">
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
        </button>
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
