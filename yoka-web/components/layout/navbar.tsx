"use client";

import { imageUrl } from "@/lib/image-url";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/instructors", label: "Instructors" },
  { href: "/yoga-time", label: "Yoga Timetable" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
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
          let compact = false;
          const update = (initial = false) => {
            const next = window.scrollY > (compact ? 32 : 80);
            if (!initial && next === compact) return;
            compact = next;
            setIsScrolled(next);
            gsap.to(headerRef.current, {
              "--nav-inset": next ? "16px" : "0px",
              "--nav-width": next ? "1240px" : "100%",
              "--nav-height": next ? "68px" : "88px",
              "--nav-radius": next ? "12px" : "0px",
              y: next ? 12 : 0,
              duration: context.conditions?.reduce || initial ? 0 : 0.55,
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
    checkAuth();
  }, [checkAuth]);

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

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <div className="h-[88px]">
      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-[env(safe-area-inset-top,0px)] z-40 mx-auto w-[calc(100%-var(--nav-inset)*2)] max-w-(--nav-width) rounded-(--nav-radius) border text-[#454d39] [--nav-inset:0px] [--nav-width:100%] [--nav-height:88px] [--nav-radius:0px] transition-[background-color,box-shadow,border-color] duration-300 motion-reduce:transition-none",
          isScrolled
            ? "border-[#dedfd4] bg-[#faf9f5]/95 shadow-[0_8px_30px_-12px_#30372c26] backdrop-blur-xl"
            : "border-transparent border-b-[#e3e4d9] bg-[#f8f7f3]",
        )}
      >
        <div className="mx-auto flex h-(--nav-height) max-w-[1296px] items-center justify-between gap-5 px-5 sm:px-7">
          <Link
            href="/"
            aria-label="Yoga By Niti home"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex shrink-0 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#687552]"
          >
            <Image
              src="/tlogo.png"
              alt="Yoga By Niti"
              width={88}
              height={68}
              priority
              className="h-[64px] w-[84px] object-contain"
            />
            <span
              aria-hidden="true"
              className="hidden border-l border-[#d8dccd] pl-4 text-[8px] leading-[1.8] tracking-[0.24em] text-[#7c846f] min-[1400px]:block"
            >
              MOVEMENT
              <br />& MINDFULNESS
            </span>
          </Link>
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 min-[1200px]:flex"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative py-3 text-[12px] tracking-[0.025em] transition-colors after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:bg-[#788361] after:transition-transform hover:text-[#38432e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#687552]",
                  isActive(link.href)
                    ? "text-[#38432e] after:scale-x-100"
                    : "text-[#7b806f] after:scale-x-0 hover:after:scale-x-100",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <UserDropdown user={user} />
            ) : (
              <div className="hidden items-center gap-3 min-[1200px]:flex">
                <Button
                  asChild
                  variant="ghost"
                  className="text-xs font-normal text-[#626b56] hover:bg-[#eeefe6] hover:text-[#38432e]"
                >
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="h-10 rounded-sm bg-[#48533b] px-5 text-xs font-normal text-[#fffef5] shadow-none hover:bg-[#303c26]"
                >
                  <Link href="/signup">
                    Join the studio <ArrowUpRight className="ml-2 size-3.5" />
                  </Link>
                </Button>
              </div>
            )}
            <Button
              ref={toggleRef}
              variant="ghost"
              size="icon"
              aria-label={
                isMobileMenuOpen ? "Close navigation" : "Open navigation"
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="size-11 rounded-full text-[#48533b] hover:bg-[#e9ecdf] min-[1200px]:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          inert={!isMobileMenuOpen}
          aria-hidden={!isMobileMenuOpen}
          className={cn(
            "absolute inset-x-0 top-[calc(100%+8px)] max-h-[calc(100dvh-120px)] overflow-y-auto rounded-xl border border-[#dedfd4] bg-[#faf9f5] p-6 shadow-[0_16px_40px_-16px_#30372c33] transition-[opacity,transform,visibility] duration-200 motion-reduce:transition-none min-[1200px]:hidden",
            isMobileMenuOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0",
          )}
        >
          <p className="mb-4 text-[9px] tracking-[0.24em] text-[#848c76]">
            EXPLORE THE STUDIO
          </p>
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "flex items-center gap-4 border-b border-[#e5e7db] py-4 text-base focus-visible:outline-2 focus-visible:outline-[#687552]",
                isActive(link.href) ? "text-[#38432e]" : "text-[#7b806f]",
              )}
            >
              <span className="text-[9px] text-[#969d88]">0{index + 1}</span>
              {link.label}
              <ArrowUpRight className="ml-auto size-4" strokeWidth={1} />
            </Link>
          ))}
          {!user && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-sm border-[#d8dccd] bg-transparent font-normal hover:bg-[#eeefe6]"
              >
                <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button
                asChild
                className="h-11 rounded-sm bg-[#48533b] font-normal text-[#fffef5] hover:bg-[#303c26]"
              >
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  Join the studio
                </Link>
              </Button>
            </div>
          )}
        </nav>
      </header>
    </div>
  );
}

function UserDropdown({
  user,
}: {
  user: NonNullable<ReturnType<typeof useAuthStore.getState>["user"]>;
}) {
  const { logout } = useAuthStore();
  const displayName =
    [user.userInfo?.firstName, user.userInfo?.lastName]
      .filter(Boolean)
      .join(" ") || user.email;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-11 max-w-[190px] gap-2 rounded-full px-1.5 text-[#48533b] hover:bg-[#eeefe6]"
        >
          <Avatar className="size-8">
            <AvatarImage
              src={
                user.userInfo?.avatar
                  ? imageUrl(user.userInfo.avatar)
                  : undefined
              }
              alt={displayName}
              className="object-cover"
            />
            <AvatarFallback className="bg-[#e5e8db] text-xs text-[#48533b]">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[105px] truncate text-xs font-normal sm:block">
            {displayName}
          </span>
          <ChevronDown className="size-3" />
          <span className="sr-only">Open account menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="z-50 rounded-lg border-[#dedfd4] bg-[#fffefa] p-2 text-[#48533b] shadow-lg [&_[data-slot=dropdown-menu-item]]:py-2.5 [&_[data-slot=dropdown-menu-item]]:text-xs [&_[data-slot=dropdown-menu-item]]:focus:bg-[#eef0e5] [&_[data-slot=dropdown-menu-separator]]:bg-[#e4e7da]"
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my-booking">My Booking</Link>
        </DropdownMenuItem>
        {user.role !== "Student" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Instructor Panel</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/my-course">Manage Courses</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/my-timetable">Timetable</Link>
            </DropdownMenuItem>
          </>
        )}
        {user.role === "Admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="https://admin.yogabyniti.com">Admin Dashboard</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            void logout();
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
