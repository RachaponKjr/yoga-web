import Link from "next/link";
export default function NotFound() {
  return <main className="px-6 py-28 text-center"><p className="text-sm tracking-widest text-muted-foreground">404 · JOURNAL</p><h1 className="mt-4 text-3xl font-medium">ไม่พบบทความนี้</h1><p className="mt-4 text-muted-foreground">บทความอาจยังไม่เผยแพร่หรือถูกนำออกแล้ว</p><Link href="/blog" className="mt-7 inline-block rounded-full bg-primary px-6 py-3 text-white">ดูบทความทั้งหมด</Link></main>;
}
