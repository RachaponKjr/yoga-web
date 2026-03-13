"use client";

import React from "react";
import Link from "next/link";
import { Check, Calendar, Home, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion"; // แนะนำให้ลงเพิ่ม: npm install framer-motion

const PaymentSuccessPage = () => {
  const mockData = {
    amount: 1500.0,
    refId: "INV-20260313",
    date: new Date().toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    courseName: "Vinyasa Yoga Flow - Morning Bliss",
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center p-6 font-sans">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl w-full"
      >
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12 relative overflow-hidden">
          {/* Decorative Background Element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-50 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50" />

          {/* Success Animated Icon */}
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200"
            >
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </motion.div>
          </div>

          {/* Header Texts */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              ชำระเงินเรียบร้อยแล้ว
            </h1>
            <p className="text-gray-500 text-lg">
              เราเตรียมเสื่อไว้รอคุณแล้วที่{" "}
              <span className="text-indigo-600 font-semibold">
                Yoga by Niti
              </span>
            </p>
          </div>

          {/* Receipt Content */}
          <div className="bg-gray-50/50 rounded-3xl p-6 mb-10 border border-gray-50">
            <div className="text-center mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">
                Total Paid
              </p>
              <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                <span className="text-2xl font-medium mr-1">฿</span>
                {mockData.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h2>
            </div>

            <div className="space-y-4 pt-6 border-t border-dashed border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">คลาสเรียน</span>
                <span className="text-gray-900 font-semibold">
                  {mockData.courseName}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">หมายเลขอ้างอิง</span>
                <span className="text-gray-900 font-mono">
                  {mockData.refId}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">วันที่ทำรายการ</span>
                <span className="text-gray-900">{mockData.date}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-4">
            <Link href="/my-booking" className="w-full">
              <Button className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-black text-white text-lg font-semibold transition-all hover:shadow-xl hover:-translate-y-1">
                <Calendar className="w-5 h-5 mr-2" />
                เช็คตารางเรียนของคุณ
              </Button>
            </Link>

            <div className="grid grid-cols-2 gap-4">
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full h-14 rounded-2xl border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <Home className="w-5 h-5 mr-2" />
                  หน้าหลัก
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full h-14 rounded-2xl border-gray-200 text-indigo-600 hover:bg-indigo-50 border-indigo-100"
                onClick={() => window.print()} // หรือเรียกฟังก์ชันโหลด PDF ที่เราทำตะกี้
              >
                <Download className="w-5 h-5 mr-2" />
                ใบเสร็จ PDF
              </Button>
            </div>
          </div>

          {/* Helpful Footer */}
          <p className="text-center mt-10 text-gray-400 text-sm">
            ระบบได้ส่งใบยืนยันการจองไปที่อีเมลของคุณเรียบร้อยแล้ว <br />
            ต้องการความช่วยเหลือ?{" "}
            <Link
              href="/contact"
              className="text-indigo-500 font-medium hover:underline"
            >
              ติดต่อเรา
            </Link>
          </p>
        </div>
      </motion.main>
    </div>
  );
};

export default PaymentSuccessPage;
