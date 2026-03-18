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
    } catch (error) {
      toast.error("Register failed", {
        duration: 5000,
        icon: "❌",
        className: "!text-red-500",
      });
    }
  };

  return (
    <div className="h-max md:h-[calc(100vh-6rem)] md:min-h-screen container mx-auto my-12 md:my-0 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl mx-auto p-2 md:p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Form */}
        <div className="flex-1 py-6 px-4 md:px-8 flex flex-col gap-6 items-center justify-center">
          <div className="flex flex-col gap-6 w-full max-w-sm">
            {/* Header */}
            <div className="flex flex-col items-center gap-2 text-center">
              <h5 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-primary to-tertiary bg-clip-text text-transparent">
                Create Account
              </h5>
              <p className="text-sm text-[#666666]">
                Join us today! Please enter your details below.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSignup}
              className="flex flex-col gap-4 w-full"
            >
              {/* Email */}
              <Input
                type="email"
                placeholder="Email Address"
                name="email"
                onChange={handleChange}
              />

              {/* Password */}
              <Input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
              />

              {/* Confirm Password */}
              <Input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                onChange={handleChange}
              />

              <Button
                type="submit"
                className="w-full text-white cursor-pointer rounded-full"
                size={"lg"}
                variant="default"
              >
                Sign Up
              </Button>
            </form>

            {/* Divider (Optional) */}
            <div className="relative flex items-center w-full">
              <div className="grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-400 text-xs">OR</span>
              <div className="grow border-t border-gray-200"></div>
            </div>

            {/* Footer Link */}
            <div className="w-full flex items-center justify-center">
              <p className="text-sm text-[#666666]">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-primary cursor-pointer font-bold hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Image / Decoration */}
        {/* เปลี่ยนเป็น flex-col บนมือถือ และซ่อนรูปภาพเมื่อจอเล็กเพื่อให้ฟอร์มเด่นชัด */}
        <div className="flex-1 aspect-12/16 bg-primary/80 rounded-2xl hidden md:block overflow-hidden relative">
          <Image src={bgyoga.src} alt="" fill objectFit="cover" />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
