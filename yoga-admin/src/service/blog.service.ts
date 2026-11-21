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
  published: boolean;
  publishedAt: string | null;
  updatedAt: string;
}
export type BlogInput = Pick<BlogPost, "title" | "slug" | "excerpt" | "content" | "published" | "seoTitle" | "seoDescription" | "seoKeywords" | "canonicalUrl" | "noIndex" | "coverAlt" | "author"> & { coverImage: string };
export interface BlogList {
  data: Omit<BlogPost, "content">[];
  pagination: { page: number; total: number; pages: number };
}
export const blogService = {
  list: async (page: number, search: string, signal?: AbortSignal, status = "all", sort = "recent"): Promise<BlogList> => (await http.get("/blog/admin", { params: { page, search, status, sort, limit: 10 }, signal })).data,
  get: async (id: string): Promise<BlogPost> => (await http.get(`/blog/admin/${id}`)).data.data,
  save: async (id: string | undefined, input: BlogInput) => id ? http.put(`/blog/${id}`, input) : http.post("/blog", input),
  remove: async (id: string) => http.delete(`/blog/${id}`),
  upload: async (file: File): Promise<string> => {
    const form = new FormData(); form.append("image", file);
    return (await http.post("/blog/upload", form, { headers: { "Content-Type": "multipart/form-data" } })).data.data.url;
  },
};
export function blogImageUrl(value: string) {
  return value.startsWith("/uploads/") ? `${new URL(http.defaults.baseURL!).origin}${value}` : value;
}
