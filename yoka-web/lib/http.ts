import axios from "axios";

const http = axios.create({
  baseURL:
    // process.env.NEXT_PUBLIC_API_URL || "http://119.59.99.141:4001/api/v1",
    "http://localhost:3001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // <--- เอาออก หรือใส่ไว้ก็ได้ แต่มันจะไม่ช่วยอะไรถ้ายิงข้าม HTTP
  timeout: 10000,
});

// *** เพิ่มท่อนนี้ครับ ***
// ก่อนยิง request ทุกครั้ง ให้ดึง token จาก localStorage มาแปะใส่ Header
http.interceptors.request.use(
  (config) => {
    // ดึง token จาก storage (ต้องเช็คว่ารันบน Browser ไหม)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized / Token Expired");
      // เสริม: ถ้า Token หมดอายุ ให้ลบทิ้งแล้วเด้งไปหน้า Login
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default http;
