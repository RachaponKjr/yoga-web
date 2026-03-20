import React from "react";
import { ArrowLeft, ShieldCheck, Lock, Eye, Database } from "lucide-react";
import Link from "next/link";

const PrivacyPolicyPage = () => {
  const lastUpdated = "20 มีนาคม 2026";

  return (
    <div className=" pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-500 hover:text-[#3D552F] transition-colors mb-4 text-sm font-medium"
        >
          <ArrowLeft size={16} /> กลับสู่หน้าหลัก
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-4">
          <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck className="text-green-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 font-sans">
            Privacy Policy
          </h1>
          <p className="text-slate-500">
            นโยบายความเป็นส่วนตัวและความปลอดภัยของข้อมูล
          </p>
          <div className="mt-4 inline-block px-3 py-1 bg-slate-100 rounded-full text-[10px] text-slate-500 font-medium">
            อัปเดตล่าสุด: {lastUpdated}
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          {/* Section 1: ข้อมูลที่เก็บ */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-[#3D552F]" size={20} />
              <h2 className="text-xl font-semibold text-slate-800">
                1. ข้อมูลที่เราจัดเก็บ
              </h2>
            </div>
            <p className="text-slate-600 mb-3 leading-relaxed">
              เพื่อให้การให้บริการจองคอร์สโยคะเป็นไปอย่างราบรื่น
              เรามีความจำเป็นต้องจัดเก็บข้อมูลดังต่อไปนี้:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 pl-2 text-sm leading-relaxed">
              <li>
                <span className="font-semibold">ข้อมูลระบุตัวตน:</span>{" "}
                ชื่อ-นามสกุล, ที่อยู่อีเมล, หมายเลขโทรศัพท์
              </li>
              <li>
                <span className="font-semibold">ข้อมูลการจอง:</span>{" "}
                รายละเอียดคอร์สที่เลือก, วันและเวลาเรียน, ประเภทการจอง
                (Online/Walk-in)
              </li>
              <li>
                <span className="font-semibold">ข้อมูลการชำระเงิน:</span>{" "}
                หลักฐานการโอนเงิน (Slip) หรือสถานะการจ่ายเงิน
                (เราไม่เก็บรหัสผ่านบัตรเครดิตของคุณในระบบ)
              </li>
            </ul>
          </section>

          {/* Section 2: การนำไปใช้ */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-[#3D552F]" size={20} />
              <h2 className="text-xl font-semibold text-slate-800">
                2. การนำข้อมูลไปใช้งาน
              </h2>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              เราจะใช้ข้อมูลของคุณเพื่อวัตถุประสงค์ดังนี้เท่านั้น:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-600">
                ✔️ ใช้ยืนยันตัวตนในการเข้าคลาสเรียน
              </div>
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-600">
                ✔️ แจ้งเตือนสถานะการชำระเงินและแจ้งเลื่อนคลาส
              </div>
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-600">
                ✔️ ปรับปรุงคุณภาพการสอนและการให้บริการ
              </div>
            </div>
          </section>

          {/* Section 3: ความปลอดภัย */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-[#3D552F]" size={20} />
              <h2 className="text-xl font-semibold text-slate-800">
                3. มาตรฐานความปลอดภัย
              </h2>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              ข้อมูลของคุณจะถูกเก็บรักษาเป็นความลับ
              และถูกจัดเก็บด้วยเทคโนโลยีการเข้ารหัส (Encryption) ที่ได้มาตรฐาน
              เราไม่มีนโยบายการขายหรือเผยแพร่ข้อมูลส่วนตัวให้แก่บุคคลภายนอกเพื่อวัตถุประสงค์ทางการตลาดอย่างเด็ดขาด
            </p>
          </section>

          {/* Section 4: สิทธิ์ของผู้ใช้งาน */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 ">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              4. สิทธิ์ของคุณ (PDPA)
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed ">
              คุณมีสิทธิ์ในการขอตรวจสอบ แก้ไข
              หรือขอลบข้อมูลส่วนตัวของคุณออกจากระบบของเราได้ตลอดเวลา
              โดยสามารถติดต่อแอดมินผ่านช่องทางติดต่อหลักของเว็บไซต์
            </p>
            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-400">
              หมายเหตุ:
              การลบข้อมูลอาจส่งผลกระทบต่อประวัติการจองหรือสิทธิ์การเข้าเรียนในคลาสที่ยังเหลืออยู่
            </div>
          </section>

          {/* Contact Footer */}
          <div className="text-center pt-4">
            <p className="text-xs text-slate-400 mb-1">
              ยินดีที่ได้ดูแลความเป็นส่วนตัวของคุณ
            </p>
            <p className="text-slate-800 font-bold font-sans tracking-wide">
              YogabyNiti Security Team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
