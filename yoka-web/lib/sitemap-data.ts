import type { MetadataRoute } from "next";

type PublicPost = {
  slug: string;
  published?: boolean;
  publishedAt?: string | null;
  updatedAt?: string;
};
type PublicCourse = {
  id: string;
  isShow?: boolean;
  status?: string;
  updatedAt?: string;
};

function validDate(value?: string | null): string | undefined {
  return value && Number.isFinite(Date.parse(value))
    ? new Date(value).toISOString()
    : undefined;
}

/** Read every public API page; fail instead of caching a misleading partial sitemap. */
export async function contentSitemap(
  apiBase: string,
  siteUrl: string,
  request: typeof fetch = fetch,
): Promise<MetadataRoute.Sitemap> {
  async function getPage(endpoint: string, page: number) {
    const url = `${apiBase.replace(/\/+$/, "")}/${endpoint}?page=${page}&limit=50`;
    const response = await request(url, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok)
      throw new Error(
        `Sitemap API returned ${response.status} for ${endpoint}`,
      );
    return response.json();
  }

  async function articles(): Promise<MetadataRoute.Sitemap> {
    const entries = new Map<string, MetadataRoute.Sitemap[number]>();
    let page = 1;
    let pages = 1;
    do {
      const response = await getPage("blog", page);
      if (
        !Array.isArray(response.data) ||
        !Number.isInteger(response.pagination?.pages) ||
        response.pagination.pages < 0
      )
        throw new Error("Invalid blog sitemap response");
      pages = response.pagination.pages;
      for (const post of response.data as PublicPost[]) {
        if (!post.slug || post.published === false) continue;
        const url = new URL(`/blog/${encodeURIComponent(post.slug)}`, siteUrl)
          .href;
        entries.set(url, {
          url,
          lastModified: validDate(post.updatedAt || post.publishedAt),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
      page += 1;
    } while (page <= pages);
    return [...entries.values()];
  }

  async function courses(): Promise<MetadataRoute.Sitemap> {
    const entries = new Map<string, MetadataRoute.Sitemap[number]>();
    let page = 1;
    let pages = 1;
    do {
      const response = await getPage("course", page);
      if (
        !Array.isArray(response.data?.courses) ||
        !Number.isInteger(response.data?.pagination?.totalPages) ||
        response.data.pagination.totalPages < 0
      )
        throw new Error("Invalid course sitemap response");
      pages = response.data.pagination.totalPages;
      for (const course of response.data.courses as PublicCourse[]) {
        if (!course.id || course.isShow === false || course.status !== "Open")
          continue;
        const url = new URL(
          `/course?courseId=${encodeURIComponent(course.id)}`,
          siteUrl,
        ).href;
        entries.set(url, {
          url,
          lastModified: validDate(course.updatedAt),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
      page += 1;
    } while (page <= pages);
    return [...entries.values()];
  }

  const [posts, classes] = await Promise.all([articles(), courses()]);
  return [...posts, ...classes];
}
