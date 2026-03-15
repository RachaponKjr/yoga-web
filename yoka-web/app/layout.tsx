import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import ScrollTop from "@/components/layout/scroll-top";
import TanstackProvider from "@/providers/TanstackProvider";
import { Toaster } from "sonner";
import AuthHydrator from "@/components/AuthHydrator";
import { headers } from "next/headers";
import Footer from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yoga By Niti | สอนโยคะ และอาหารเพื่อสุขภาพ",
  description:
    "ฝึกโยคะเพื่อสุขภาพกับ Yoga By Niti คลาสสำหรับมือใหม่และผู้เชี่ยวชาญ พร้อมบริการอาหารคลีน อาหารเพื่อสุขภาพที่คัดสรรวัตถุดิบอย่างดี",
  keywords: [
    "สอนโยคะ",
    "ร้านอาหารสุขภาพ",
    "Yoga Studio",
    "อาหารคลีน",
    "ฝึกโยคะมือใหม่",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const userStr = headersList.get("x-user-profile");

  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error("Parse user error", e);
    }
  }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F5F5F5]`}
      >
        <TanstackProvider>
          <AuthHydrator user={user} />
          <Navbar />
          {children}
          <ScrollTop />
          <Toaster />
          <Footer />
        </TanstackProvider>
      </body>
    </html>
  );
}
