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

const SignInPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();
  // 2. เรียกใช้ hook ดึงค่า query param
  const searchParams = useSearchParams();
  // ดึงค่า callbackUrl ถ้าไม่มีให้เป็น "/" (หน้าแรก)
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = AuthSchema.safeParse({ email, password });
      if (!payload.success) {
        console.log(payload.error);
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
    }
  };

  return (
    <div className="h-max md:h-[calc(100vh-6rem)] min-h-screen container mx-auto my-24 md:my-0 px-4 md:px-0 flex items-center">
      <div className="bg-white w-full max-w-6xl mx-auto p-6 rounded-2xl shadow-md md:shadow-2xl flex gap-4">
        <div className="flex-1 py-8 flex flex-col  gap-8 items-center justify-between">
          <div className="flex flex-col gap-8 items-center w-full">
            <div className="flex flex-col items-center gap-4">
              <h5 className="text-4xl font-semibold">Welcome Back!</h5>
              <p className="text-center text-sm text-[#666666] max-w-sm">
                Login to continue to your course booking.
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="max-w-sm  flex flex-col gap-4 w-full"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Please enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-semibold">
                  Password <span className="text-red-500">*</span>
                </label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Please enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-primary text-end"
              >
                Forgot Password?
              </Link>
              <Button
                type="submit"
                className="w-full text-white cursor-pointer rounded-full"
                size={"lg"}
                variant="default"
              >
                Sign In
              </Button>
            </form>
            <div className="relative flex items-center w-full">
              <div className="grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-400 text-xs">OR</span>
              <div className="grow border-t border-gray-200"></div>
            </div>
          </div>

          <div className="w-full flex items-center justify-center">
            <p className="text-sm text-[#666666]">
              Don&apos;t have an account?{" "}
              {/* ส่ง callbackUrl ไปที่หน้า signup ด้วย เผื่อเขาสมัครเสร็จจะได้เด้งกลับถูก */}
              <Link
                href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="text-primary cursor-pointer font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
        <div className="flex-1 aspect-14/16 bg-primary/80 rounded-2xl hidden md:block"></div>
      </div>
    </div>
  );
};

export default SignInPage;
