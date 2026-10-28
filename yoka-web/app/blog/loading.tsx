export default function Loading() {
  return <main aria-busy="true" aria-label="กำลังโหลดบทความ" className="mx-auto min-h-[60vh] max-w-6xl space-y-8 px-6 py-20"><div className="h-10 w-64 animate-pulse rounded-xl bg-[#e9ecdf]" /><div className="h-5 max-w-lg animate-pulse rounded bg-[#e9ecdf]" /><div className="grid gap-6 md:grid-cols-3">{[1, 2, 3].map(item => <div key={item} className="aspect-[4/3] animate-pulse rounded-3xl bg-[#e9ecdf]" />)}</div><p role="status" className="text-sm text-gray-500">กำลังโหลดเรื่องราว…</p></main>;
}
