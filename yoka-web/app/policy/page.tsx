import { pageMetadata } from "@/lib/seo";
import React from "react";
import { ArrowLeft, ShieldCheck, Lock, Eye, Database } from "lucide-react";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "Privacy & Data Security Policy",
  description:
    "Learn how Yoga By Niti collects, uses, and protects your personal information, and how to exercise your privacy rights.",
  path: "/policy",
  noIndex: false,
});

const PrivacyPolicyPage = () => {
  const lastUpdated = "20 March 2026";

  return (
    <div className=" pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-500 hover:text-[#3D552F] transition-colors mb-4 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to home
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-4">
          <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck className="text-green-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 font-sans">
            Privacy Policy
          </h1>
          <p className="text-slate-500">Privacy &amp; Data Security Policy</p>
          <div className="mt-4 inline-block px-3 py-1 bg-slate-100 rounded-full text-[10px] text-slate-500 font-medium">
            Last updated: {lastUpdated}
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          {/* Section 1: ข้อมูลที่เก็บ */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-[#3D552F]" size={20} />
              <h2 className="text-xl font-semibold text-slate-800">
                1. Information we collect
              </h2>
            </div>
            <p className="text-slate-600 mb-3 leading-relaxed">
              To provide a smooth yoga booking service, we need to collect the
              following information:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 pl-2 text-sm leading-relaxed">
              <li>
                <span className="font-semibold">Identity information:</span>{" "}
                Full name, email address, and telephone number
              </li>
              <li>
                <span className="font-semibold">Booking information:</span> The
                selected course, class date and time, and booking type
                (Online/Walk-in)
              </li>
              <li>
                <span className="font-semibold">Payment information:</span>{" "}
                Transfer receipts or payment status. We do not store your credit
                card password in our system.
              </li>
            </ul>
          </section>

          {/* Section 2: การนำไปใช้ */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-[#3D552F]" size={20} />
              <h2 className="text-xl font-semibold text-slate-800">
                2. How we use your information
              </h2>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              We use your information only for the following purposes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-600">
                ✔️ To verify your identity when attending classes
              </div>
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-600">
                ✔️ To notify you of payment status and class schedule changes
              </div>
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-600">
                ✔️ To improve our teaching and services
              </div>
            </div>
          </section>

          {/* Section 3: ความปลอดภัย */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-[#3D552F]" size={20} />
              <h2 className="text-xl font-semibold text-slate-800">
                3. Security standards
              </h2>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Your information is kept confidential and stored using standard
              encryption technology. We do not sell or disclose personal
              information to third parties for marketing purposes.
            </p>
          </section>

          {/* Section 4: สิทธิ์ของผู้ใช้งาน */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 ">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              4. Your rights (PDPA)
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed ">
              You may request access to, correction of, or deletion of your
              personal information at any time by contacting our administrator
              through the main contact channels on this website.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-400">
              Note: Deleting your information may affect your booking history or
              eligibility to attend remaining classes.
            </div>
          </section>

          {/* Contact Footer */}
          <div className="text-center pt-4">
            <p className="text-xs text-slate-400 mb-1">
              Your privacy matters to us
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
