"use client";
export default function BlogError({ reset }: { reset: () => void }) {
  return <main className="px-6 py-28 text-center"><h1 className="text-2xl font-medium">โหลดบทความไม่สำเร็จ</h1><p className="mt-4 text-muted-foreground">กรุณาลองอีกครั้งในสักครู่</p><button onClick={reset} className="mt-7 rounded-full bg-primary px-6 py-3 text-white">ลองใหม่</button></main>;
}
