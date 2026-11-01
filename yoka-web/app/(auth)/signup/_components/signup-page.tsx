"use client";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import Link from "next/link";
import React, { useState } from "react";
import { authService } from "@/service/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AuthSchema, AuthType } from "@/types/auth.type";

import bgyoga from "@/assets/images/CC__2194-2.jpg";
import Image from "next/image";

interface SignUpPageProps extends AuthType {
  confirmPassword: string;
}

const SignUpPage = () => {
  const [signupData, setSignupData] = useState<SignUpPageProps>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (signupData.password !== signupData.confirmPassword) {
        toast.error("Password not match", {
          duration: 5000,
          icon: "❌",
          className: "!text-red-500",
        });
        return;
      }
      const payload = AuthSchema.safeParse(signupData);
      if (!payload.success) {
        toast.error("Register failed", {
          duration: 5000,
          icon: "❌",
          className: "!text-red-500",
        });
        return;
      }
      const response = await authService.register(payload.data);
      if (response.success) {
        toast.success("Register success", {
          duration: 5000,
          icon: "✅",
          className: "!text-green-500",
        });
        router.push("/signin?callbackUrl=/profile");
      }
    } catch {
      toast.error("Register failed", {
        duration: 5000,
        icon: "❌",
        className: "!text-red-500",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-88px)] bg-[#f8f7f3] px-5 py-12 sm:px-7 md:py-20 flex items-center justify-center">
      <div className="bg-[#fffefa] w-full max-w-5xl mx-auto rounded-lg border border-[#dedfd4] flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Form */}
        <div className="flex-1 min-w-0 py-10 px-6 md:py-14 md:px-12 flex flex-col gap-6 items-center justify-center">
          <div className="flex flex-col gap-6 w-full max-w-sm">
            {/* Header */}
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="mb-3 text-[9px] tracking-[0.24em] text-[#737b62]">A BEAUTIFUL PLACE TO BEGIN</p>
              <h1 className="text-4xl font-serif font-normal tracking-[-0.025em] text-[#30372c]">
                Join the studio.
              </h1>
              <p className="text-sm text-[#73766b]">
                Join us today! Please enter your details below.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSignup}
              className="flex flex-col gap-4 w-full"
            >
              <label htmlFor="email" className="-mb-2 text-xs font-medium text-[#58634a]">Email address</label>
              <Input
                  className="h-12 rounded-sm! border! border-[#d5dcc7] bg-[#fafbf6]! text-sm text-[#454d39] shadow-none focus:border-[#788461] focus:ring-2 focus:ring-[#788461]/15"
                  required
                type="email"
                placeholder="Email Address"
                id="email"
                  autoComplete="email"
                  name="email"
                onChange={handleChange}
              />

              <label htmlFor="password" className="-mb-2 text-xs font-medium text-[#58634a]">Password <span className="font-normal text-[#858d79]">(at least 6 characters)</span></label>
              <Input
                  className="h-12 rounded-sm! border! border-[#d5dcc7] bg-[#fafbf6]! text-sm text-[#454d39] shadow-none focus:border-[#788461] focus:ring-2 focus:ring-[#788461]/15"
                  required
                type="password"
                placeholder="Password"
                id="password"
                  minLength={6}
                  autoComplete="new-password"
                  name="password"
                onChange={handleChange}
              />

              <label htmlFor="confirmPassword" className="-mb-2 text-xs font-medium text-[#58634a]">Confirm password</label>
              <Input
                  className="h-12 rounded-sm! border! border-[#d5dcc7] bg-[#fafbf6]! text-sm text-[#454d39] shadow-none focus:border-[#788461] focus:ring-2 focus:ring-[#788461]/15"
                  required
                type="password"
                placeholder="Confirm Password"
                id="confirmPassword"
                minLength={6}
                autoComplete="new-password"
                name="confirmPassword"
                onChange={handleChange}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-sm bg-[#48533b] text-[#fffef5] font-normal shadow-none hover:bg-[#303c26]"
                size={"lg"}
                variant="default"
              >
                {isSubmitting ? "Creating account…" : "Create account"}
              </Button>
            </form>

            {/* Divider (Optional) */}
            <div className="relative flex items-center w-full">
              <div className="grow border-t border-[#dedfd4]"></div>
              <span className="mx-4 text-[#858d79] text-xs">OR</span>
              <div className="grow border-t border-[#dedfd4]"></div>
            </div>

            {/* Footer Link */}
            <div className="w-full flex items-center justify-center">
              <p className="text-sm text-[#73766b]">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-[#48533b] font-medium underline underline-offset-4"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Image / Decoration */}
        {/* เปลี่ยนเป็น flex-col บนมือถือ และซ่อนรูปภาพเมื่อจอเล็กเพื่อให้ฟอร์มเด่นชัด */}
        <div className="flex-1 min-h-[640px] bg-[#303a2b] hidden md:block overflow-hidden relative">
          <Image src={bgyoga.src} alt="Mindful movement at Yoga By Niti" fill sizes="50vw" className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-[#273123]/85 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-[#fffdf2]"><p className="mb-4 text-[9px] tracking-[0.22em] text-[#d4dcc8]">YOGA BY NITI</p><p className="font-serif text-4xl leading-tight">Your next chapter.<br /><span className="italic text-[#d4dcc8]">A little more balance.</span></p></div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
