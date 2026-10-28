import type { Metadata } from "next";
import { cache } from "react";
import axios from "axios";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { blogService, blogDate, blogImageUrl } from "@/service/blog.service";
import BlogCover from "@/components/blog/blog-cover";

export const dynamic = "force-dynamic";
const getPost = cache(async (slug: string) => {
  try { return await blogService.get(slug); }
  catch (error) { if (axios.isAxiosError(error) && error.response?.status === 404) notFound(); throw error; }
});
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return { title: `${post.title} | Yoga By Niti`, description: post.excerpt, openGraph: { title: post.title, description: post.excerpt, type: "article", ...(post.coverImage ? { images: [blogImageUrl(post.coverImage)] } : {}) } };
}
export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  return <main className="bg-[#fafaf6] px-6 py-12 text-[#233528] md:py-16"><article className="mx-auto max-w-4xl"><Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#748467] hover:text-primary"><ArrowLeft size={16} />กลับไปหน้า Blog</Link><header className="mx-auto max-w-3xl py-10 text-center md:py-14"><p className="mb-5 text-xs tracking-[0.25em] text-[#839175]">THE NITI JOURNAL</p><h1 className="break-words text-3xl font-medium leading-relaxed md:text-5xl md:leading-snug">{post.title}</h1><p className="mt-6 text-base leading-8 text-[#78816f]">{post.excerpt}</p><div className="mt-6 flex justify-center gap-3 text-xs text-[#839175]"><span>Yoga By Niti</span><span>·</span><time dateTime={post.publishedAt || undefined}>{blogDate(post.publishedAt)}</time></div></header><div className="overflow-hidden rounded-[2rem]"><BlogCover src={post.coverImage ? blogImageUrl(post.coverImage) : undefined} title={post.title} priority /></div><div className="mx-auto max-w-2xl space-y-7 py-12 text-base leading-9 text-[#4d5b47] md:py-16 md:text-lg">{post.content.split(/\r?\n\s*\r?\n/).map((paragraph, index) => <p key={index} className="whitespace-pre-wrap break-words">{paragraph}</p>)}</div><aside className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-5 rounded-3xl bg-[#edf0e4] p-7"><div><p className="font-medium">ให้การดูแลตัวเองเริ่มต้นวันนี้</p><p className="mt-2 text-sm text-[#78816f]">พบคลาสโยคะที่เหมาะกับคุณและก้าวไปด้วยกัน</p></div><Link href="/yoga-time" className="inline-flex items-center gap-2 rounded-full bg-[#3d552f] px-5 py-3 text-sm text-white">ดูตารางคลาส<ArrowUpRight size={16} /></Link></aside></article></main>;
}
