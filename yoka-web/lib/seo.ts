import type { Metadata } from "next";

export const SITE_NAME = "Yoga By Niti";
export const SITE_URL = new URL(
  process.env.SITE_URL || "https://yogabyniti.com",
).origin;
export const DEFAULT_DESCRIPTION =
  "Find your balance at Yoga By Niti in Rawai, Phuket. Explore yoga classes for all levels and wholesome plant-based food at Go Vegan.";
export const publicPages = [
  "/",
  "/about",
  "/contact",
  "/instructors",
  "/yoga-time",
  "/blog",
  "/policy",
  "/refund",
] as const;

export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = new URL(path, SITE_URL).href;
  const socialImage = image || new URL("/opengraph-image", SITE_URL).href;
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: !noIndex, follow: true },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_GB",
      url,
      title: fullTitle,
      description,
      images: [{ url: socialImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [socialImage],
    },
  };
}
