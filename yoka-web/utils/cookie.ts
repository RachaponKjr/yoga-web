import Cookies from "js-cookie";

// 1. SET: บันทึก Token (ใช้ตอน Login สำเร็จ)
export const setAuthToken = (token: string) => {
  Cookies.set("token", token, {
    expires: 1, // หมดอายุใน 1 วัน (ใส่เป็นจำนวนวัน)
    path: "/", // ให้เข้าถึงได้ทุกหน้าในเว็บ (สำคัญมาก!)
    secure: process.env.NODE_ENV === "production", // true ถ้าเป็น https (Production)
    sameSite: "strict", // ป้องกัน CSRF
  });
};

// 2. GET: ดึง Token มาใช้ (เช่น เอาไปแนบ axios ใน Client)
export const getAuthToken = () => {
  return Cookies.get("token");
};

// 3. REMOVE: ลบ Token (ใช้ตอน Logout)
export const removeAuthToken = () => {
  Cookies.remove("token", { path: "/" }); // ต้องใส่ path ให้ตรงกับตอน set ด้วย
};
