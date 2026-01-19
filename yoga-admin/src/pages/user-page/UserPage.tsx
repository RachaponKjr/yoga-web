import { Search, Mail, Shield, Briefcase, User } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { authService } from "../../service/auth.service";
import Cookies from "js-cookie";
import type { UserInfoType, UserType } from "@/types/auth.type";
import EditUser from "./EditUser"; // Import Component ที่เราเพิ่งสร้าง
import DelUser from "./DelUser";
import RegisterUser from "./RegisterUser";

// กำหนด Base URL รูป
const BASE_IMG_URL = "http://119.59.99.141:4001/";

interface UserProps extends UserType {
  createdAt: string;
  userInfo: UserInfoType;
}

const UserPage = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const token = Cookies.get("token");

  const getUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authService.getUserAll({ token });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  // Filter Logic
  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    const firstName = user.userInfo?.firstName?.toLowerCase() || "";
    const lastName = user.userInfo?.lastName?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";
    const phone = user.userInfo?.phone_number?.toLowerCase() || "";
    const role = user.role?.toLowerCase() || "";

    return (
      firstName.includes(term) ||
      lastName.includes(term) ||
      email.includes(term) ||
      phone.includes(term) ||
      role.includes(term)
    );
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
            <Shield size={12} /> Admin
          </span>
        );
      case "Instructor":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
            <Briefcase size={12} /> Instructor
          </span>
        );
      case "Student":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
            <User size={12} /> User
          </span>
        );
      default:
        return <span className="text-gray-500">{role}</span>;
    }
  };

  const getGenderBadge = (gender: string) => {
    switch (gender) {
      case "Male":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-600 border border-sky-100">
            ชาย
          </span>
        );
      case "Female":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-pink-50 text-pink-600 border border-pink-100">
            หญิง
          </span>
        );
      default:
        return <span className="text-gray-400 text-xs">-</span>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-50/50 min-h-max font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            จัดการผู้ใช้ (User Management)
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            กำหนดสิทธิ์การใช้งาน: Admin, Instructor, User
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4 items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, สิทธิ์, เบอร์ หรืออีเมล..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <RegisterUser getUser={() => getUser()} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  ชื่อ-นามสกุล
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  สิทธิ์ (Role)
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  เพศ
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  เบอร์โทร
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  วันที่สมัคร
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.userInfo.avatar
                              ? `${BASE_IMG_URL}${user.userInfo.avatar}`
                              : `https://ui-avatars.com/api/?name=${
                                  user.userInfo.firstName || "User"
                                }`
                          }
                          alt="avatar"
                          className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {user.userInfo.firstName} {user.userInfo.lastName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Mail size={10} /> {user.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">{getRoleBadge(user.role)}</td>
                    <td className="py-4 px-6">
                      {getGenderBadge(user?.userInfo?.sex || "")}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                      {user?.userInfo?.phone_number || "ไม่ระบุ"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* ✅ ปุ่ม Edit อยู่ตรงนี้ (ส่ง user เข้าไป) */}
                        <EditUser user={user} onSuccess={getUser} />

                        <DelUser
                          userId={user.id}
                          userName={
                            user.userInfo.firstName +
                            " " +
                            user.userInfo.lastName
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    ไม่พบข้อมูลที่ค้นหา "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>แสดง {filteredUsers.length} รายการ</span>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
