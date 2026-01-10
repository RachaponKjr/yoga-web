import React, { useState } from "react";
import Button from "../../components/share/Button";
import { authService } from "../../service/auth.service";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

const SignInPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await authService.login(formData);
      console.log(res);
      if (res.success && res.data.token) {
        setUser(res.data.user);
        Cookies.set("token", res.data.token);
        localStorage.setItem("token", res.data.token);
        toast.success("Login successfully");
        navigate("/");
        window.location.reload();
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Login failed");
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* ส่วนซ้าย: รูปภาพ (จะซ่อนเมื่อจอเล็ก) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 justify-center items-center relative overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop"
          alt="Yoga Meditation"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="relative z-10 px-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Yoga Admin</h2>
          <p className="text-gray-200 text-lg">
            บริหารจัดการสตูดิโอของคุณได้อย่างราบรื่น
            <br />
            ทุกที่ ทุกเวลา
          </p>
        </div>
      </div>

      {/* ส่วนขวา: ฟอร์ม Login */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-8 py-12 lg:px-16 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo เล็กๆ (ถ้ามี) */}
          <div className="h-10 w-10 bg-indigo-600 rounded-lg mx-auto flex items-center justify-center mb-6">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>

          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            ยินดีต้อนรับกลับ
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            กรุณาลงชื่อเข้าใช้เพื่อจัดการข้อมูล
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input with Icon */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                อีเมล
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  {/* Icon Email */}
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Password Input with Icon */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  รหัสผ่าน
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
                  >
                    ลืมรหัสผ่าน?
                  </a>
                </div>
              </div>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  {/* Icon Lock */}
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                // className="flex w-full justify-center rounded-lg bg-indigo-600! px-3 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-500 hover:shadow-xl focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                เข้าสู่ระบบ
              </Button>
            </div>
          </form>

          {/* Divider */}
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
