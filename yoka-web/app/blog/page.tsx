import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, ArrowRight, Search, BookOpen } from "lucide-react";
import { blogService, blogDate, blogImageUrl } from "@/service/blog.service";
import BlogCover from "@/components/blog/blog-cover";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Blog | Yoga By Niti", description: "เรื่องราวโยคะ การดูแลสุขภาพ และแรงบันดาลใจในการใช้ชีวิตอย่างสมดุลจาก Yoga By Niti" };

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string | string[]; search?: string | string[] }> }) {
  const params = await searchParams;
  const page = Math.min(100000, Math.max(1, Number.parseInt(typeof params.page === "string" ? params.page : "1", 10) || 1));
  const search = (typeof params.search === "string" ? params.search : "").slice(0, 100).trim();
  const result = await blogService.list(page, search);
  const pageUrl = (value: number) => `/blog?${new URLSearchParams({ page: String(value), ...(search ? { search } : {}) })}`;
  return <main className="min-h-[70vh] bg-[#fafaf6] pb-20 text-[#233528]">
    <section className="relative overflow-hidden border-b border-[#dfe5d7] bg-[#eff1e7] px-6 py-16 md:py-24">
      <div aria-hidden="true" className="absolute -right-24 -top-28 size-96 rounded-full border border-[#d5ddc9]" />
      <div aria-hidden="true" className="absolute -right-12 -top-16 size-72 rounded-full border border-[#d5ddc9]" />
      <div className="relative mx-auto max-w-6xl"><p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#71815d]">The Niti Journal</p><h1 className="max-w-3xl font-serif text-5xl leading-tight md:text-7xl">A little pause.<br /><span className="italic text-[#748660]">A healthier you.</span></h1><p className="mt-7 max-w-xl text-base leading-8 text-[#697361]">พื้นที่เล็ก ๆ สำหรับเรื่องราวโยคะ การดูแลตัวเอง และแรงบันดาลใจ<br className="hidden md:block" /> ให้ทุกวันของคุณมีสมดุลมากขึ้น</p></div>
    </section>
    <section className="mx-auto max-w-6xl px-6 pt-12">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6"><div><p className="mb-2 text-xs tracking-[0.2em] text-[#7b866e]">READ · BREATHE · GROW</p><h2 className="text-2xl font-medium">{search ? `ผลการค้นหา “${search}”` : "บทความล่าสุด"}</h2><p className="mt-2 text-sm text-[#7b866e]">{result.pagination.total} เรื่องราวเพื่อวันดี ๆ ของคุณ</p></div><form action="/blog" className="flex w-full items-center rounded-full border border-[#d9e0d0] bg-white p-1.5 sm:w-80"><label htmlFor="search-blog" className="sr-only">ค้นหาบทความ</label><input id="search-blog" name="search" defaultValue={search} maxLength={100} placeholder="ค้นหาเรื่องที่สนใจ…" className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary" /><button aria-label="ค้นหา" className="rounded-full bg-[#3d552f] p-3 text-white"><Search size={18} /></button></form></div>
      {result.data.length ? <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">{result.data.map((post, index) => <article key={post.id} className="group"><Link href={`/blog/${post.slug}`} className="block rounded-3xl outline-offset-4"><div className="overflow-hidden rounded-3xl"><BlogCover src={post.coverImage ? blogImageUrl(post.coverImage) : undefined} title={post.title} priority={index === 0} /></div><div className="pt-5"><p className="mb-3 text-xs tracking-wide text-[#839175]">WELLNESS JOURNAL <span className="mx-2">·</span><time dateTime={post.publishedAt || undefined}>{blogDate(post.publishedAt)}</time></p><h3 className="break-words text-xl font-medium leading-relaxed transition-colors group-hover:text-[#718452]">{post.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-7 text-[#78816f]">{post.excerpt}</p><span className="mt-5 inline-flex items-center gap-2 border-b border-[#becab0] pb-1 text-sm font-medium">อ่านเรื่องราว<ArrowUpRight size={17} /></span></div></Link></article>)}</div> : <div className="rounded-3xl border border-dashed border-[#cbd5bf] px-6 py-20 text-center"><BookOpen className="mx-auto mb-5 text-[#91a17f]" size={36} strokeWidth={1.3} /><h3 className="text-xl">{search ? "ยังไม่พบเรื่องราวที่คุณค้นหา" : "เรื่องราวดี ๆ กำลังจะเริ่มต้น"}</h3><p className="mt-3 text-sm text-[#78816f]">{search ? "ลองเปลี่ยนคำค้นหา หรือกลับไปดูบทความทั้งหมด" : "กลับมาอ่านเรื่องราวและแรงบันดาลใจจาก Yoga By Niti ได้เร็ว ๆ นี้"}</p>{(search || page > 1) && <Link className="mt-6 inline-block text-sm underline" href="/blog">ดูบทความทั้งหมด</Link>}</div>}
      {result.pagination.pages > 1 && <nav aria-label="หน้าบทความ" className="mt-14 flex items-center justify-center gap-6 text-sm">{page > 1 && <Link href={pageUrl(page - 1)} className="flex items-center gap-2 rounded-full border px-4 py-3"><ArrowLeft size={16} />ก่อนหน้า</Link>}<span>หน้า {page} / {result.pagination.pages}</span>{page < result.pagination.pages && <Link href={pageUrl(page + 1)} className="flex items-center gap-2 rounded-full border px-4 py-3">ถัดไป<ArrowRight size={16} /></Link>}</nav>}
    </section>
  </main>;
}
