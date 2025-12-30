"use client";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { authService } from "@/service/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthSchema } from "@/types/auth.type";
import { setAuthToken } from "@/utils/cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const SignInPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
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
        localStorage.setItem("token", response.data.token);
      }
      setUser(response.data.user);
      toast.success("Login success", {
        duration: 5000,
        icon: "✅",
        className: "!text-green-500",
      });
      router.push("/");
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
    <div className="h-max md:h-[calc(100vh-6rem)] container mx-auto my-24 md:my-0 px-4 md:px-0 flex items-center">
      <div className="bg-white w-full max-w-6xl mx-auto p-6 rounded-2xl shadow-md md:shadow-2xl flex gap-4">
        <div className="flex-1 py-8 flex flex-col  gap-8 items-center justify-between">
          <div className="flex flex-col gap-8 items-center">
            <div className="flex flex-col items-center gap-4">
              <h5 className="text-4xl font-semibold">Welcome Back!</h5>
              <p className="text-center text-sm text-[#666666] max-w-sm">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est,
                mollitia.
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="max-w-sm flex flex-col gap-4 w-full"
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
              <Link
                href="/signup"
                className="text-primary cursor-pointer font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
        <div className="flex-1 aspect-square bg-primary/80 rounded-2xl hidden md:block"></div>
      </div>
    </div>
  );
};

export default SignInPage;
