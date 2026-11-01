import assert from "node:assert/strict";
import { test } from "node:test";
import { contentSitemap } from "../lib/sitemap-data.ts";
import { pageMetadata, publicPages, SITE_URL } from "../lib/seo.ts";

test("sitemap includes all blog and course pages, excluding drafts and hidden courses", async () => {
  const calls = [];
  const request = async (input) => {
    const url = new URL(input);
    const page = Number(url.searchParams.get("page"));
    calls.push(`${url.pathname}:${page}`);
    return Response.json(url.pathname.endsWith("/blog") ? {
      data: page === 1 ? [
        { slug: "first-post", published: true, updatedAt: "2026-10-01T00:00:00Z" },
        { slug: "draft", published: false },
      ] : [{ slug: "second post", published: true }, { slug: "first-post", published: true, updatedAt: "2026-10-01T00:00:00Z" }],
      pagination: { pages: 2 },
    } : {
      data: { courses: page === 1 ? [
        { id: "visible", status: "Open", isShow: true },
        { id: "hidden", status: "Open", isShow: false },
        { id: "closed", status: "Closed", isShow: true },
      ] : [{ id: "second", status: "Open", isShow: true }], pagination: { totalPages: 2 } },
    });
  };
  const entries = await contentSitemap("https://api.example.com/api/v1/", "https://example.com", request);
  assert.equal(calls.length, 4);
  assert.deepEqual(entries.map(e => e.url), [
    "https://example.com/blog/first-post", "https://example.com/blog/second%20post",
    "https://example.com/course?courseId=visible", "https://example.com/course?courseId=second",
  ]);
  assert.equal(entries[0].lastModified, "2026-10-01T00:00:00.000Z");
  assert.equal(entries[1].lastModified, undefined);
});

test("API failures do not silently publish an incomplete sitemap", async () => {
  await assert.rejects(contentSitemap("https://api.example.com", "https://example.com", async () => new Response(null, { status: 503 })), /503/);
  await assert.rejects(contentSitemap("https://api.example.com", "https://example.com", async () => Response.json({ data: [] })), /Invalid/);
});

test("metadata has canonical and social URLs, with private routes excluded from indexing", () => {
  const metadata = pageMetadata({ title: "Our Story", description: "Studio story", path: "/about" });
  assert.equal(metadata.alternates.canonical, `${SITE_URL}/about`);
  assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
  assert.equal(metadata.twitter.card, "summary_large_image");
  assert.equal(metadata.title, "Our Story");
  assert.equal(metadata.robots.index, true);
  assert.equal(pageMetadata({ title: "Sign In", description: "Account", path: "/signin", noIndex: true }).robots.index, false);
  for (const route of ["/signin", "/signup", "/profile", "/course/booking", "/payment/success", "/my-booking"]) assert.equal(publicPages.includes(route), false);
  assert.equal(publicPages.includes("/blog"), true);
});
