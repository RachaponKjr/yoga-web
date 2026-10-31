import type { Metadata } from "next";
import { cache } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowRight,
  Clock3,
  Leaf,
} from "lucide-react";
import { blogService, blogDate, blogImageUrl } from "@/service/blog.service";
import BlogCover from "@/components/blog/blog-cover";
import ArticleContent, {
  MARKDOWN_PREFIX,
} from "@/components/blog/article-content";

import yoga from "@/assets/images/yoga.jpg";

export const dynamic = "force-dynamic";
const getPost = cache(async (slug: string) => {
  try {
    return await blogService.get(slug);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) notFound();
    throw error;
  }
});
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return {
    title: `${post.title} | Yoga By Niti`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      ...(post.coverImage ? { images: [blogImageUrl(post.coverImage)] } : {}),
    },
  };
}
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const [post, latest] = await Promise.all([
    getPost(slug),
    blogService.list().catch(() => null),
  ]);
  const related =
    latest?.data.filter((item) => item.slug !== slug).slice(0, 3) || [];
  const readingMinutes = Math.max(
    1,
    Math.ceil(post.content.replace(MARKDOWN_PREFIX, "").length / 900),
  );

  return (
    <main className="bg-[#fafaf6] px-5 pb-16 pt-8 text-[#233528] sm:px-8 md:pb-24 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <nav
          aria-label="เส้นทางบทความ"
          className="flex items-center justify-between"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[#68765c] transition-colors hover:text-[#233528]"
          >
            <ArrowLeft size={16} />
            บทความทั้งหมด
          </Link>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#7c866f]">
            <span className="font-medium text-[#48583e]">Yoga By Niti</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.publishedAt || undefined}>
              {blogDate(post.publishedAt)}
            </time>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={13} />
              อ่านประมาณ {readingMinutes} นาที
            </span>
          </div>
        </nav>
        <article>
          <header className="mx-auto pb-10 pt-12 text-center md:pb-14 md:pt-16">
            <p className="mb-5 flex items-center justify-center gap-2 text-[10px] font-medium tracking-[0.22em] text-[#788765]">
              <Leaf size={14} strokeWidth={1.4} /> A MOMENT FOR YOURSELF
            </p>
            <h1 className="break-words text-3xl  font-medium leading-[1.5] tracking-tight md:text-5xl md:leading-[1.45]">
              {post.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#78816f]">
              {post.excerpt}
            </p>
          </header>
          <div className="w-full overflow-hidden rounded-2xl">
            <BlogCover
              src={post.coverImage ? blogImageUrl(post.coverImage) : undefined}
              title={post.title}
              priority
            />
          </div>
          <div className="py-12 md:py-16">
            <ArticleContent content={post.content} />
            <div className="mt-12 flex items-center gap-4 border-t border-[#dfe4d8] pt-7">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#eaf0df]">
                <Leaf size={20} strokeWidth={1.2} />
              </span>
              <div>
                <p className="text-sm font-medium">Yoga By Niti</p>
                <p className="mt-1 text-xs leading-6 text-[#7b866e]">
                  พื้นที่สำหรับโยคะ การดูแลตัวเอง และจังหวะชีวิตที่สมดุล
                </p>
              </div>
            </div>
          </div>
        </article>

        <section
          aria-labelledby="booking-invitation"
          className="grid overflow-hidden rounded-3xl bg-[#eaf0e3] md:grid-cols-[1.1fr_1fr]"
        >
          <div className="flex flex-col items-start justify-center px-7 py-10 sm:p-12 md:p-14">
            <p className="mb-5 text-[10px] font-medium tracking-[0.25em] text-[#738262]">
              FROM READING TO PRACTICE
            </p>
            <h2
              id="booking-invitation"
              className="text-3xl font-medium leading-relaxed tracking-tight md:text-4xl md:leading-relaxed"
            >
              ให้เวลาตัวเอง
              <br />
              ได้กลับมาสมดุล
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#6a795f]">
              จากแรงบันดาลใจเล็ก ๆ สู่เวลาบนเสื่อโยคะ
              <br className="hidden sm:block" />
              เลือกคลาสและช่วงเวลาที่เหมาะกับคุณ แล้วมาฝึกไปด้วยกัน
            </p>
            <div className="flex flex-row gap-8 items-center mt-4">
              <Link
                href="/yoga-time"
                className="inline-flex items-center gap-6 rounded-full bg-[#344b2c] px-6 py-3.5 text-sm text-white transition-colors hover:bg-[#21351b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#344b2c]"
              >
                ดูตารางและจองคลาส
                <ArrowUpRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="text-xs text-[#6a795f] underline underline-offset-4"
              >
                ครั้งแรกกับโยคะ? สอบถามเราได้
              </Link>
            </div>
          </div>
          <div className="relative min-h-64 md:min-h-96">
            <Image
              src={yoga.src}
              alt="บรรยากาศการฝึกโยคะร่วมกันที่ Yoga By Niti"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </section>

        <section
          aria-labelledby="more-stories"
          className="mt-16 border-t border-[#dfe4d8] pt-10 md:mt-24 md:pt-14"
        >
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-[10px] tracking-[0.24em] text-[#7b866e]">
                A LITTLE MORE INSPIRATION
              </p>
              <h2
                id="more-stories"
                className="text-2xl font-medium md:text-3xl"
              >
                เรื่องราวให้อ่านต่อ
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 text-sm text-[#68765c] hover:text-[#233528]"
            >
              ดูบทความทั้งหมด
              <ArrowRight size={17} />
            </Link>
          </div>
          {related.length ? (
            <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <article key={item.id} className="group min-w-0">
                  <Link
                    href={`/blog/${item.slug}`}
                    className="block rounded-2xl outline-offset-4"
                  >
                    <div className="overflow-hidden rounded-2xl">
                      <BlogCover
                        src={
                          item.coverImage
                            ? blogImageUrl(item.coverImage)
                            : undefined
                        }
                        title={item.title}
                      />
                    </div>
                    <div className="pt-5">
                      <time
                        dateTime={item.publishedAt || undefined}
                        className="text-xs text-[#86917c]"
                      >
                        {blogDate(item.publishedAt)}
                      </time>
                      <h3 className="mt-2 break-words text-lg font-medium leading-8 group-hover:text-[#748660]">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-7 text-[#7b866e]">
                        {item.excerpt}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-xs text-[#526749]">
                        อ่านเรื่องราว
                        <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="py-5 text-sm leading-7 text-[#7b866e]">
              ติดตามเรื่องราวและแรงบันดาลใจใหม่ ๆ ได้ที่หน้าบทความของเรา
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
