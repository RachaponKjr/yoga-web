import { pageMetadata } from "@/lib/seo";
import React from "react";
import { ArrowLeft, RefreshCcw, ShieldCheck, Clock } from "lucide-react"; // ใช้ lucide-react สำหรับ icon สวยๆ
import Link from "next/link";

export const metadata = pageMetadata({
  title: "Refund & Cancellation Policy",
  description:
    "Read the Yoga By Niti refund and cancellation policy, including cancellation deadlines, refund processing times, and class schedule changes.",
  path: "/refund",
  noIndex: false,
});

const RefundPolicyPage = () => {
  return (
    <div className="min-h-screen pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-500 hover:text-[#3D552F] transition-colors mb-4 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to home
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-4 text-center">
          <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <RefreshCcw className="text-[#3D552F]" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Refund Policy
          </h1>
          <p className="text-slate-500">Refund &amp; Cancellation Policy</p>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          {/* Section 1: การยกเลิก */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-[#3D552F]" size={20} />
              <h2 className="text-xl font-semibold text-slate-800">
                1. Booking cancellations
              </h2>
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-3 pl-2 leading-relaxed">
              <li>
                Bookings may be cancelled at least{" "}
                <span className="font-bold text-slate-900">24 hours</span>{" "}
                before the class begins
              </li>
              <li>
                Cancellations made less than 24 hours in advance are not
                eligible for a refund.
              </li>
              <li>
                Walk-in bookings are not refundable once payment has been
                completed.
              </li>
            </ul>
          </section>

          {/* Section 2: การคืนเงิน */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-[#3D552F]" size={20} />
              <h2 className="text-xl font-semibold text-slate-800">
                2. Refund conditions
              </h2>
            </div>
            <p className="text-slate-600 mb-4 leading-relaxed">
              For cancellations that meet the stated conditions, refunds will be
              issued through the original payment method as follows:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
                <p className="text-sm font-bold text-slate-800 mb-1 font-sans">
                  Bank transfer
                </p>
                <p className="text-xs text-slate-500">
                  Refunds are processed within 3–5 business days
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
                <p className="text-sm font-bold text-slate-800 mb-1 font-sans">
                  Credit / debit card
                </p>
                <p className="text-xs text-slate-500">
                  Refunds are processed within 7–14 business days, depending on
                  your card issuer
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: หมายเหตุ */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 font-sans">
              3. Changes to scheduled classes
            </h2>
            <p className="text-slate-600 leading-relaxed">
              If the studio needs to cancel a class due to circumstances beyond
              our control, participants may
              <span className="text-[#3D552F] font-medium italic">
                {" "}
                choose a new class date
              </span>{" "}
              or
              <span className="text-[#3D552F] font-medium italic">
                {" "}
                receive a full refund (100%)
              </span>{" "}
              immediately
            </p>
          </section>

          {/* Contact Footer */}
          <div className="text-center pt-4">
            <p className="text-sm text-slate-400 mb-2 font-sans">
              Please contact us if you have any further questions
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
