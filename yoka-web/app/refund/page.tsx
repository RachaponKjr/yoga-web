import React from "react";
import { ArrowLeft, RefreshCcw, ShieldCheck, Clock } from "lucide-react"; // ใช้ lucide-react สำหรับ icon สวยๆ
import Link from "next/link";

const RefundPolicyPage = () => {
  return (
    <div className="min-h-screen pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-500 hover:text-[#3D552F] transition-colors mb-4 text-sm font-medium"
        >
          <ArrowLeft size={16} /> กลับสู่หน้าหลัก
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-4 text-center">
          <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <RefreshCcw className="text-[#3D552F]" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Refund Policy
          </h1>
          <p className="text-slate-500">นโยบายการคืนเงินและการยกเลิกการจอง</p>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          {/* Section 1: การยกเลิก */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-[#3D552F]" size={20} />
              <h2 className="text-xl font-semibold text-slate-800">
                1. การยกเลิกการจอง
              </h2>
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-3 pl-2 leading-relaxed">
              <li>
                สามารถยกเลิกการจองได้ล่วงหน้าอย่างน้อย{" "}
                <span className="font-bold text-slate-900">24 ชั่วโมง</span>{" "}
                ก่อนเริ่มคลาสเรียน
              </li>
              <li>
                กรณีแจ้งยกเลิกน้อยกว่า 24 ชั่วโมง
                ทางเราขอสงวนสิทธิ์ในการคืนเงินทุกกรณี
              </li>
              <li>
                สำหรับการจองแบบ Walk-in
                ไม่สามารถขอคืนเงินได้หากชำระเงินเรียบร้อยแล้ว
              </li>
            </ul>
          </section>

          {/* Section 2: การคืนเงิน */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-[#3D552F]" size={20} />
              <h2 className="text-xl font-semibold text-slate-800">
                2. เงื่อนไขการคืนเงิน
              </h2>
            </div>
            <p className="text-slate-600 mb-4 leading-relaxed">
              เมื่อทำการยกเลิกตามเงื่อนไขที่กำหนด
              ระบบจะดำเนินการคืนเงินตามช่องทางเดิมที่ชำระมา ดังนี้:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
                <p className="text-sm font-bold text-slate-800 mb-1 font-sans">
                  โอนเงินผ่านธนาคาร
                </p>
                <p className="text-xs text-slate-500">
                  ดำเนินการคืนภายใน 3-5 วันทำการ
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
                <p className="text-sm font-bold text-slate-800 mb-1 font-sans">
                  บัตรเครดิต/เดบิต
                </p>
                <p className="text-xs text-slate-500">
                  ดำเนินการคืนภายใน 7-14 วันทำการ (ขึ้นอยู่กับธนาคารเจ้าของบัตร)
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: หมายเหตุ */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 font-sans">
              3. กรณีเลื่อนคลาสเรียน
            </h2>
            <p className="text-slate-600 leading-relaxed">
              หากทางสถาบันมีความจำเป็นต้องยกเลิกคลาสเรียนเนื่องจากเหตุสุดวิสัย
              ผู้สมัครจะได้รับสิทธิ์ในการ
              <span className="text-[#3D552F] font-medium italic">
                {" "}
                เลือกวันเรียนใหม่
              </span>{" "}
              หรือ
              <span className="text-[#3D552F] font-medium italic">
                {" "}
                รับเงินคืนเต็มจำนวน (100%)
              </span>{" "}
              ทันที
            </p>
          </section>

          {/* Contact Footer */}
          <div className="text-center pt-4">
            <p className="text-sm text-slate-400 mb-2 font-sans">
              หากมีข้อสงสัยเพิ่มเติมกรุณาติดต่อเรา
            </p>
            <Link
              href="mailto:yogabyniti@gmail.com"
              className="text-[#3D552F] font-bold font-sans tracking-wide"
            >
              yogabyniti@gmail.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
