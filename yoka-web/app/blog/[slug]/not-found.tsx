import Link from "next/link";
export default function NotFound() {
  return <main className="px-6 py-28 text-center"><p className="text-sm tracking-widest text-muted-foreground">404 · JOURNAL</p><h1 className="mt-4 text-3xl font-medium">Article not found</h1><p className="mt-4 text-muted-foreground">This article may not be published yet or may have been removed</p><Link href="/blog" className="mt-7 inline-block rounded-full bg-primary px-6 py-3 text-white">View all articles</Link></main>;
}
