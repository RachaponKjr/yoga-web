import {
  Search,
  Filter,
  Mail,
  Edit,
  Trash2,
  Shield,
  Briefcase,
  User,
} from "lucide-react";
import AddUser from "./AddUser";

const UserPage = () => {
  // 1. Mock Data: ข้อมูลผู้ใช้งาน
  const users = [
    {
      id: 1,
      name: "คุณแอดมิน สูงสุด",
      email: "admin@yoga.com",
      phone: "081-111-2222",
      avatar: "https://i.pravatar.cc/150?u=1",
      role: "Admin",
      gender: "Male", // เพิ่มข้อมูลเพศ
      joinedDate: "01 ม.ค. 2022",
    },
    {
      id: 2,
      name: "ครูพี่แอน โยคะ",
      email: "anne.teach@yoga.com",
      phone: "089-555-4444",
      avatar: "https://i.pravatar.cc/150?u=20",
      role: "Instructor",
      gender: "Female",
      joinedDate: "15 ก.พ. 2022",
    },
    {
      id: 3,
      name: "พิมพ์มาดา รักสุขภาพ",
      email: "pim.m@example.com",
      phone: "090-999-8888",
      avatar: "https://i.pravatar.cc/150?u=10",
      role: "User",
      gender: "Female",
      joinedDate: "10 ม.ค. 2023",
    },
    {
      id: 4,
      name: "สมชาย ใจดี",
      email: "somchai@example.com",
      phone: "081-444-5555",
      avatar: "https://i.pravatar.cc/150?u=25",
      role: "User",
      gender: "Male",
      joinedDate: "20 พ.ค. 2023",
    },
    {
      id: 5,
      name: "John Smith",
      email: "john@example.com",
      phone: "082-333-7777",
      avatar: "https://i.pravatar.cc/150?u=12",
      role: "Instructor",
      gender: "Male",
      joinedDate: "05 มี.ค. 2023",
    },
  ];

  // Helper: Role Badge (แสดงสีตามสิทธิ์)
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
      case "User":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
            <User size={12} /> User
          </span>
        );
      default:
        return <span className="text-gray-500">{role}</span>;
    }
  };

  // Helper: Gender Badge (แสดงสีตามเพศ)
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

  return (
    <div className="bg-gray-50/50 min-h-max font-sans">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            จัดการผู้ใช้ (User Management)
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            กำหนดสิทธิ์การใช้งาน: Admin, Instructor, User
          </p>
        </div>
        <AddUser />
      </div>

      {/* 2. Main Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4 items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, สิทธิ์ หรืออีเมล..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors border border-gray-200 hover:border-gray-300">
            <Filter size={18} /> ตัวกรอง
          </button>
        </div>

        {/* Table */}
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
                {/* เปลี่ยนจาก สถานะ เป็น เพศ */}
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
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="group hover:bg-gray-50 transition-colors"
                >
                  {/* Name & Contact Info */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {user.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Mail size={10} /> {user.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role (สิทธิ์) */}
                  <td className="py-4 px-6">{getRoleBadge(user.role)}</td>

                  {/* Gender (เพศ) - เปลี่ยนตรงนี้ */}
                  <td className="py-4 px-6">{getGenderBadge(user.gender)}</td>

                  {/* Phone */}
                  <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                    {user.phone}
                  </td>

                  {/* Joined Date */}
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {user.joinedDate}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="แก้ไขสิทธิ์"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="ลบผู้ใช้"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-center">
          <button className="text-sm text-gray-500 hover:text-indigo-600 font-medium transition-colors">
            โหลดข้อมูลเพิ่มเติม...
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
