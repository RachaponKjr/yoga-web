import http from "@/lib/http";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  publishedAt: string | null;
  updatedAt: string;
}
export interface BlogList {
  data: Omit<BlogPost, "content">[];
  pagination: { page: number; pages: number; total: number };
}
export const blogService = {
  list: async (page = 1, search = ""): Promise<BlogList> => (await http.get("/blog", { params: { page, search, limit: 9 } })).data,
  get: async (slug: string): Promise<BlogPost> => (await http.get(`/blog/${encodeURIComponent(slug)}`)).data.data,
};
export function blogImageUrl(value: string) {
  if (!value.startsWith("/uploads/")) return value;
  const base = process.env.NEXT_PUBLIC_HOST_IMAGE || new URL(process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "production" ? "https://api.yogabyniti.com/api/v1" : "http://localhost:3001/api/v1")).origin;
  return `${base.replace(/\/$/, "")}${value}`;
}
export function blogDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Bangkok" }) : "";
}
