"use client";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { authService } from "@/service/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthSchema } from "@/types/auth.type";
import Link from "next/link";
// 1. เพิ่ม useSearchParams
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import cc2063 from "@/assets/images/yoga/cc2063.jpg";
import Image from "next/image";

const SignInPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  // 2. เรียกใช้ hook ดึงค่า query param
  const searchParams = useSearchParams();
  // ดึงค่า callbackUrl ถ้าไม่มีให้เป็น "/" (หน้าแรก)
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = AuthSchema.safeParse({ email, password });
      if (!payload.success) {
        toast.error(payload.error.issues[0]?.message || "Please check your details");
        return;
      }
      const response = await authService.login(payload.data);
      if (!response.success) {
        toast.error("Login failed", {
          duration: 5000,
          icon: "❌",
          className: "!text-red-500",
        });
        return;
      }
      if (response.data.token) {
        document.cookie = `token=${response.data.token}; path=/`;
      }
      setUser(response.data.user);
      toast.success("Login success", {
        duration: 5000,
        icon: "✅",
        className: "!text-green-500",
      });

      // 3. เปลี่ยนจาก "/" เป็น callbackUrl ที่เตรียมไว้
      router.push(callbackUrl);
      router.refresh();
      return;
    } catch (error) {
      console.log(error);
      toast.error("Login failed", {
        duration: 5000,
        icon: "❌",
        className: "!text-red-500",
      });
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-88px)] bg-[#f8f7f3] px-5 py-12 sm:px-7 md:py-20 flex items-center">
      <div className="bg-[#fffefa] w-full max-w-5xl items-stretch mx-auto rounded-lg border border-[#dedfd4] overflow-hidden flex">
        <div className="flex-1 min-w-0 px-6 py-10 md:px-12 md:py-14 flex flex-col items-center gap-8 justify-between">
          <div className="flex flex-col gap-8 items-center w-full">
            <div className="flex flex-col items-center gap-4">
              <p className="text-[9px] tracking-[0.24em] text-[#737b62]">YOUR PRACTICE CONTINUES</p>
              <h1 className="font-serif text-4xl font-normal tracking-[-0.025em] text-[#30372c]">Welcome back.</h1>
              <p className="text-center text-sm text-[#73766b] max-w-sm">
                Login to continue to your course booking.
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="max-w-sm  flex flex-col gap-4 w-full"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-medium text-[#58634a]">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  className="h-12 rounded-sm! border! border-[#d5dcc7] bg-[#fafbf6]! text-sm text-[#454d39] shadow-none focus:border-[#788461] focus:ring-2 focus:ring-[#788461]/15"
                  required
                  type="email"
                  id="email"
                  autoComplete="email"
                  name="email"
                  placeholder="Please enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-xs font-medium text-[#58634a]">
                  Password <span className="text-red-500">*</span>
                </label>
                <Input
                  className="h-12 rounded-sm! border! border-[#d5dcc7] bg-[#fafbf6]! text-sm text-[#454d39] shadow-none focus:border-[#788461] focus:ring-2 focus:ring-[#788461]/15"
                  required
                  type="password"
                  id="password"
                  minLength={6}
                  autoComplete="current-password"
                  name="password"
                  placeholder="Please enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Link
                href="/forgot-password"
                className="text-xs text-[#737f5f] text-end underline-offset-4 hover:underline"
              >
                Forgot Password?
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-sm bg-[#48533b] text-[#fffef5] font-normal shadow-none hover:bg-[#303c26]"
                size={"lg"}
                variant="default"
              >
                {isSubmitting ? "Signing in…" : "Sign In"}
              </Button>
            </form>
            <div className="relative flex items-center w-full">
              <div className="grow border-t border-[#dedfd4]"></div>
              <span className="mx-4 text-[#858d79] text-xs">OR</span>
              <div className="grow border-t border-[#dedfd4]"></div>
            </div>
            <div className="w-full flex items-center justify-center">
              <p className="text-sm text-[#73766b]">
                Don&apos;t have an account?{" "}
                {/* ส่ง callbackUrl ไปที่หน้า signup ด้วย เผื่อเขาสมัครเสร็จจะได้เด้งกลับถูก */}
                <Link
                  href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                  className="text-[#48533b] font-medium underline underline-offset-4"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-[600px] bg-[#303a2b] hidden md:block relative overflow-hidden">
          <Image src={cc2063} alt="A moment of yoga practice at Niti studio" fill sizes="50vw" className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-[#273123]/85 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-[#fffdf2]"><p className="mb-4 text-[9px] tracking-[0.22em] text-[#d4dcc8]">YOGA BY NITI</p><p className="font-serif text-4xl leading-tight">Return to balance.<br /><span className="italic text-[#d4dcc8]">Return to yourself.</span></p></div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
