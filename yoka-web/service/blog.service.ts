import { imageUrl } from "@/lib/image-url";
import http from "@/lib/http";

export interface BlogPost {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
  noIndex: boolean;
  coverAlt: string;
  author: string;
  views: number;
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
export const blogImageUrl = imageUrl;
export function blogDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Bangkok" }) : "";
}
