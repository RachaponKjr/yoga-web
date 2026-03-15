/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Check,
  Calendar,
  Home,
  Download,
  AlertCircle,
  RefreshCw,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import http from "@/lib/http";
import { BookingType } from "@/types/booking.type";

const PaymentSuccessPage = () => {
  const [status, setStatus] = useState<"loading" | "success" | "timeout">(
    "loading",
  );
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [seconds, setSeconds] = useState(0);
  const [booking, setBooking] = useState<BookingType | null>(null);

  const formatThaiDate = (date: string | Date, showTime = true) => {
    return new Date(date).toLocaleString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...(showTime && { hour: "2-digit", minute: "2-digit" }),
    });
  };

  const formatTime = (dateTime: string | Date) => {
    return new Date(dateTime).toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const checkPaymentStatus = useCallback(async () => {
    if (!bookingId) return;
    try {
      const { data } = await http.get("/booking/check-status", {
        params: { bookingId },
      });
      if (data.data.status === "PAID") {
        setBooking(data.data);
        setStatus("success");
      }
    } catch (error) {
      console.error("Verification failed", error);
    }
  }, [bookingId]);

  useEffect(() => {
    if (status !== "loading") return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        const nextValue = prev + 5;
        if (nextValue >= 30) {
          clearInterval(interval);
          setStatus("timeout");
          return nextValue;
        }
        checkPaymentStatus();
        return nextValue;
      });
    }, 5000);

    checkPaymentStatus();
    return () => clearInterval(interval);
  }, [status, checkPaymentStatus]);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-50/30 flex flex-col items-center justify-center p-4 md:p-6 font-sans">
      <AnimatePresence mode="wait">
        {/* --- 1. Loading State --- */}
        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              กำลังตรวจสอบยอดชำระ
            </h2>
            <p className="text-gray-500 text-sm">
              กรุณารอสักครู่ ระบบกำลังดึงข้อมูลการจองของคุณ...
            </p>
          </motion.div>
        )}

        {/* --- 2. Success State --- */}
        {status === "success" && booking && (
          <motion.main
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg w-full"
          >
            <div className="bg-white border border-gray-100 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden">
              {/* Top Section: Icon & Headline */}
              <div className="pt-10 pb-6 px-8 text-center relative">
                <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-green-50/50 to-transparent -z-10" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-100 mx-auto mb-6"
                >
                  <Check className="w-10 h-10 text-white" strokeWidth={3} />
                </motion.div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                  ชำระเงินสำเร็จ
                </h1>
                <p className="text-gray-500">จองคลาสเรียนของคุณเรียบร้อยแล้ว</p>
              </div>

              {/* Main Content Card */}
              <div className="px-8 pb-10">
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 mb-8">
                  {/* Amount Section */}
                  <div className="text-center pb-6 mb-6 border-b border-dashed border-gray-200">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">
                      ยอดชำระรวม
                    </p>
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                      <span className="text-xl font-medium mr-1 text-gray-500">
                        ฿
                      </span>
                      {booking.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </h2>
                  </div>

                  {/* Details List */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-start text-sm">
                      <span className="text-gray-400 shrink-0">คลาสเรียน</span>
                      <span className="text-gray-900 font-semibold text-right leading-tight">
                        {booking.round.course.title}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">หมายเลขอ้างอิง</span>
                      <span className="text-gray-900 font-mono text-[12px]">
                        {booking.id}
                      </span>
                    </div>

                    {/* Schedule Row: Clean Minimalist Style */}
                    <div className="pt-4 mt-2 border-t flex justify-between border-gray-100">
                      <span className="text-gray-400">วันเวลาเรียน</span>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <Calendar className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatThaiDate(booking.round.startDateTime, false)}
                          </p>
                          <p className="text-[13px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTime(booking.round.startDateTime)} -{" "}
                            {formatTime(booking.round.endDateTime)} น.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4">
                  <Link href="/my-booking">
                    <Button className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-black text-white text-base font-semibold shadow-lg shadow-gray-200 transition-all active:scale-95">
                      <Calendar className="w-4 h-4 mr-2" />
                      เช็คตารางเรียนทั้งหมด
                    </Button>
                  </Link>
                  <div className="grid grid-cols-ๅ gap-3">
                    <Link href="/">
                      <Button
                        variant="outline"
                        className="w-full h-12 rounded-2xl border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        <Home className="w-4 h-4 mr-2" /> หน้าหลัก
                      </Button>
                    </Link>
                  </div>
                </div>

                <p className="text-center mt-8 text-xs text-gray-400 leading-relaxed">
                  ระบบได้ส่งอีเมลยืนยันการจองไปให้คุณเรียบร้อยแล้ว
                  <br />
                  หากมีข้อสงสัย{" "}
                  <Link
                    href="/contact"
                    className="text-indigo-600 hover:underline"
                  >
                    ติดต่อเรา
                  </Link>
                </p>
              </div>
            </div>
          </motion.main>
        )}

        {/* --- 3. Timeout State --- */}
        {status === "timeout" && (
          <motion.div
            key="timeout"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-xl text-center"
          >
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              ไม่พบข้อมูลการชำระเงิน
            </h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              เรายังไม่ได้รับการยืนยันรายการในเวลาที่กำหนด
              หากคุณมั่นใจว่าชำระเงินเรียบร้อยแล้ว
              กรุณากดตรวจสอบอีกครั้งหรือเตรียมหลักฐานเพื่อติดต่อเจ้าหน้าที่
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => {
                  setStatus("loading");
                  setSeconds(0);
                }}
                className="w-full h-14 rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> ตรวจสอบอีกครั้ง
              </Button>
              <Link
                href="/contact"
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors pt-2"
              >
                ต้องการความช่วยเหลือ?
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentSuccessPage;
