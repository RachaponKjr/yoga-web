import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION } from "@/lib/seo";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Yoga By Niti | Yoga Studio & Wholesome Kitchen",
    template: `%s | ${SITE_NAME}`,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/logoyoga.png",
  },
  description:
    "Practice yoga at Yoga By Niti, with classes for beginners and experienced practitioners, plus wholesome food made with carefully selected ingredients.",
  keywords: [
    "Yoga classes",
    "Healthy restaurant",
    "Yoga Studio",
    "Wholesome food",
    "Yoga for beginners",
    "yoga by niti",
    "yoga near me",
    "yoga rawai",
    "yoga phuket",
    "pilates rawai",
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
