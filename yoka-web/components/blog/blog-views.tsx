"use client";
import { useEffect } from "react";
import { Eye } from "lucide-react";
import http from "@/lib/http";

// Delay until a reader is actually on the page; never count server renders/prefetches.
export default function BlogViews({ slug, initialViews }: { slug: string; initialViews: number }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (document.visibilityState === "visible") {
        void http.post(`/blog/${encodeURIComponent(slug)}/view`, {}, { withCredentials: true }).catch(() => {});
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [slug]);
  return <span className="inline-flex items-center gap-1.5"><Eye size={14} />{initialViews.toLocaleString()} views</span>;
}
