import React from "react";
import Link from "next/link"; // หรือใช้ 'react-router-dom' ถ้าไม่ได้ใช้ Next.js
import { CheckCircle, Calendar, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentSuccessPage = () => {
  // ข้อมูลสมมติ (ของจริงรับมาจาก Props หรือ URL Params)
  const mockData = {
    amount: 1500.0,
    refId: "INV-2024001",
    date: new Date().toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    courseName: "Yoga Flow - Morning Session",
  };

  return (
    // เปลี่ยน Container หลัก: เอา bg-gray-50 ออก, ใช้ flex-col เพื่อจัด footer, พื้นหลังขาวสะอาด
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Content Container: จำกัดความกว้างให้อ่านง่าย แต่ไม่มีกรอบ Card */}
      <main className="max-w-2xl w-full text-center grow flex flex-col justify-center">
        {/* Success Icon Section: ขยายขนาดไอคอนให้ใหญ่ขึ้น */}
        <div className="bg-white! border border-gray-200 rounded-4xl shadow-lg p-8">
          <div className="relative inline-flex items-center justify-center self-center">
            {/* Ping effect ใหญ่ขึ้น */}
            {/* วงกลมพื้นหลังใหญ่ขึ้น */}
            <div className="relative p-6 rounded-full">
              {/* ไอคอนใหญ่ขึ้นจาก w-12 เป็น w-20 */}
              <CheckCircle
                className="w-20 h-20 text-green-600!"
                color="green"
                strokeWidth={2.5}
              />
            </div>
          </div>

          {/* Main Title & Description: ขยาย font size */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#333333] tracking-tight">
            ชำระเงินสำเร็จ!
          </h1>
          <p className="text-lg text-[#666666] leading-relaxed">
            ขอบคุณที่จองคลาสเรียนกับเรา
            <br className="hidden md:block" />
            การจองของคุณได้รับการยืนยันเรียบร้อยแล้ว
          </p>

          {/* Receipt Section: เอา Card/Border ออก เปลี่ยนเป็น Divider เรียบๆ */}
          <div className="py-8  border-gray-100">
            {/* Amount เน้นๆ ตรงกลาง */}
            <div className="flex flex-col items-center mb-8">
              <span className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                จำนวนเงินที่ชำระ
              </span>
              <span className="text-5xl font-bold text-gray-900">
                ฿{mockData.amount.toLocaleString()}
              </span>
            </div>

            {/* Details: จัดให้อยู่ตรงกลาง แต่อ่านง่าย */}
            <div className="max-w-md mx-auto space-y-4 text-base">
              <div className="flex justify-between pb-2 border-b border-gray-50">
                <span className="text-gray-500">หมายเลขอ้างอิง</span>
                <span className="text-gray-900 font-medium font-mono">
                  {mockData.refId}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-50">
                <span className="text-gray-500">วันที่ทำรายการ</span>
                <span className="text-gray-900 font-medium">
                  {mockData.date}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-500 whitespace-nowrap mr-4">
                  รายการ
                </span>
                <span className="text-gray-900 font-medium text-right">
                  {mockData.courseName}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: ปรับให้ใหญ่ขึ้น และวางคู่กันในจอใหญ่ */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto w-full">
            <Link
              href="/my-booking"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-[#333333] px-8 py-4 rounded-full text-lg font-medium border-2 border-gray-200 hover:border-gray-900 transition-all duration-200 hover:scale-[1.02]"
            >
              <Calendar className="w-5 h-5" />
              ดูรายการจอง
            </Link>

            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-[#333333] px-8 py-4 rounded-full text-lg font-medium border-2 border-gray-200 hover:border-gray-900 transition-all duration-200 hover:scale-[1.02]"
            >
              <Home className="w-5 h-5" />
              กลับหน้าหลัก
            </Link>
          </div>
          {/* Footer: วางติดพื้นด้านล่าง */}
          <footer className="py-8 text-center text-sm text-gray-400">
            มีปัญหาการใช้งาน?{" "}
            <Link
              href="/contact"
              className="underline hover:text-gray-600 transition-colors"
            >
              ติดต่อฝ่ายบริการลูกค้า
            </Link>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccessPage;
