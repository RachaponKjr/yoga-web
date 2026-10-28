import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, BookOpen, Search, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { blogService, blogImageUrl } from "@/service/blog.service";
import type { BlogInput, BlogList } from "@/service/blog.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const empty: BlogInput = { title: "", slug: "", excerpt: "", content: "", coverImage: "", published: false };
const field = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60";
function message(error: unknown) { return axios.isAxiosError(error) ? error.response?.data?.message || "เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่" : "เกิดข้อผิดพลาด กรุณาลองใหม่"; }

export default function BlogPage() {
  const [result, setResult] = useState<BlogList | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editor, setEditor] = useState<{ id?: string; input: BlogInput } | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [opening, setOpening] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<BlogList["data"][number] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    blogService.list(page, query, controller.signal).then(data => {
      setResult(data); setError(""); setLoading(false);
    }).catch(error => { if (!controller.signal.aborted) { setError(message(error)); setLoading(false); } });
    return () => controller.abort();
  }, [page, query, revision]);

  function refresh() { setLoading(true); setRevision(value => value + 1); }
  function change<K extends keyof BlogInput>(key: K, value: BlogInput[K]) {
    setEditor(current => current && ({ ...current, input: { ...current.input, [key]: value } }));
  }
  async function edit(id: string) {
    setOpening(id);
    try { const post = await blogService.get(id); setEditor({ id, input: { title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, coverImage: post.coverImage || "", published: post.published } }); }
    catch (error) { toast.error(message(error)); }
    finally { setOpening(null); }
  }
  async function save(event: FormEvent) {
    event.preventDefault(); if (!editor || busy || uploading) return;
    setBusy(true);
    try { await blogService.save(editor.id, editor.input); toast.success("บันทึกบทความเรียบร้อย"); setEditor(null); refresh(); }
    catch (error) { toast.error(message(error)); }
    finally { setBusy(false); }
  }
  async function upload(file?: File) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("รูปภาพต้องไม่เกิน 5 MB"); return; }
    setUploading(true);
    try { change("coverImage", await blogService.upload(file)); toast.success("อัปโหลดรูปภาพเรียบร้อย"); }
    catch (error) { toast.error(message(error)); }
    finally { setUploading(false); }
  }
  async function remove() {
    if (!deleting || busy) return;
    setBusy(true);
    try {
      await blogService.remove(deleting.id); toast.success("ลบบทความเรียบร้อย"); setDeleting(null);
      if (result?.data.length === 1 && page > 1) setPage(page - 1);
      refresh();
    } catch (error) { toast.error(message(error)); }
    finally { setBusy(false); }
  }

  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><p className="text-sm font-semibold text-indigo-600">CONTENT MANAGEMENT</p><h1 className="mt-1 text-3xl font-bold text-gray-900">จัดการบทความ</h1><p className="mt-2 text-gray-500">แบ่งปันเรื่องราวโยคะ สุขภาพ และแรงบันดาลใจ</p></div>
      <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700" onClick={() => setEditor({ input: { ...empty } })}><Plus size={18} />สร้างบทความ</button>
    </div>
    <form onSubmit={event => { event.preventDefault(); setLoading(true); setPage(1); setQuery(search); setRevision(value => value + 1); }} className="flex max-w-lg gap-2">
      <label className="sr-only" htmlFor="blog-search">ค้นหาบทความ</label><input id="blog-search" className={field} value={search} onChange={event => setSearch(event.target.value)} placeholder="ค้นหาชื่อบทความหรือคำโปรย…" maxLength={100} /><button aria-label="ค้นหา" className="rounded-xl border bg-white px-4"><Search size={20} /></button>
    </form>
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {loading ? <p role="status" className="p-12 text-center text-gray-500">กำลังโหลดบทความ…</p> : error ? <div role="alert" className="p-10 text-center"><p>{error}</p><button className="mt-4 text-indigo-600 underline" onClick={refresh}>ลองใหม่</button></div> : !result?.data.length ? <div className="p-16 text-center"><BookOpen className="mx-auto mb-4 text-indigo-300" size={40} /><h2 className="text-lg font-semibold">{query ? "ไม่พบบทความที่ค้นหา" : "เริ่มต้นเรื่องราวแรกของคุณ"}</h2><p className="mt-2 text-gray-500">สร้างบทความและบันทึกเป็นฉบับร่างก่อนเผยแพร่ได้</p></div> : <div className="divide-y divide-gray-100">{result.data.map(post => <div key={post.id} className="flex flex-wrap items-center gap-4 p-5">
        <div className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-50">{post.coverImage ? <img src={blogImageUrl(post.coverImage)} alt="" className="h-full w-full object-cover" /> : <BookOpen className="text-indigo-300" />}</div>
        <div className="min-w-0 flex-1"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${post.published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{post.published ? "เผยแพร่แล้ว" : "ฉบับร่าง"}</span><h2 className="mt-2 break-words font-semibold text-gray-900">{post.title}</h2><p className="mt-1 text-xs text-gray-500">แก้ไขล่าสุด {new Date(post.updatedAt).toLocaleDateString("th-TH")} · /blog/{post.slug}</p></div>
        <div className="flex gap-2"><button disabled={!!opening} onClick={() => edit(post.id)} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50">{opening === post.id ? <Loader2 size={16} className="animate-spin" /> : <Pencil size={16} />}แก้ไข</button><button onClick={() => setDeleting(post)} aria-label={`ลบ ${post.title}`} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={18} /></button></div>
      </div>)}</div>}
    </div>
    {result && result.pagination.pages > 1 && <div className="flex items-center justify-between text-sm"><span>หน้า {page} / {result.pagination.pages} · {result.pagination.total} บทความ</span><div className="flex gap-3"><button disabled={loading || page <= 1} onClick={() => { setLoading(true); setPage(page - 1); }} className="rounded-lg border px-4 py-2 disabled:opacity-40">ก่อนหน้า</button><button disabled={loading || page >= result.pagination.pages} onClick={() => { setLoading(true); setPage(page + 1); }} className="rounded-lg border px-4 py-2 disabled:opacity-40">ถัดไป</button></div></div>}

    <Dialog open={!!editor} onOpenChange={open => { if (!open && !busy && !uploading) setEditor(null); }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl"><DialogHeader><DialogTitle>{editor?.id ? "แก้ไขบทความ" : "สร้างบทความใหม่"}</DialogTitle><DialogDescription>เขียนเรื่องราวของคุณ แล้วเลือกบันทึกฉบับร่างหรือเผยแพร่บนเว็บไซต์</DialogDescription></DialogHeader>
        {editor && <form onSubmit={save} className="space-y-5"><fieldset disabled={busy || uploading} className="space-y-5 disabled:opacity-70">
          <label className="block space-y-2"><span className="text-sm font-medium">ชื่อบทความ *</span><input required maxLength={180} className={field} value={editor.input.title} onChange={event => change("title", event.target.value)} /></label>
          <label className="block space-y-2"><span className="text-sm font-medium">URL บทความ (slug) *</span><input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={180} placeholder="yoga-for-beginners" className={field} value={editor.input.slug} onChange={event => change("slug", event.target.value)} /><span className="block text-xs text-gray-500">ใช้ภาษาอังกฤษตัวเล็ก ตัวเลข และขีดกลาง เช่น yoga-for-beginners</span></label>
          <label className="block space-y-2"><span className="text-sm font-medium">คำโปรย *</span><textarea required maxLength={500} rows={3} className={field} value={editor.input.excerpt} onChange={event => change("excerpt", event.target.value)} /></label>
          <div className="space-y-3"><label className="block space-y-2"><span className="text-sm font-medium">รูปปก</span><input className={field} placeholder="https://… หรืออัปโหลดรูปภาพด้านล่าง" value={editor.input.coverImage} onChange={event => change("coverImage", event.target.value)} /></label><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm"><ImagePlus size={18} />{uploading ? "กำลังอัปโหลด…" : "อัปโหลด JPG, PNG, WebP (ไม่เกิน 5 MB)"}<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={event => { void upload(event.target.files?.[0]); event.target.value = ""; }} /></label>{editor.input.coverImage && <div className="relative"><img src={blogImageUrl(editor.input.coverImage)} alt="ตัวอย่างรูปปก" className="max-h-52 w-full rounded-xl object-cover" /><button type="button" onClick={() => change("coverImage", "")} className="mt-2 text-sm text-red-600">นำรูปปกออก</button></div>}</div>
          <label className="block space-y-2"><span className="text-sm font-medium">เนื้อหาบทความ *</span><textarea required maxLength={50000} rows={14} className={`${field} leading-relaxed`} value={editor.input.content} onChange={event => change("content", event.target.value)} /><span className="block text-xs text-gray-500">เว้นบรรทัดว่างเพื่อเริ่มย่อหน้าใหม่ เนื้อหาจะแสดงเป็นข้อความตามที่เขียน</span></label>
          <label className="flex items-center gap-3 rounded-xl bg-indigo-50 p-4"><input type="checkbox" checked={editor.input.published} onChange={event => change("published", event.target.checked)} className="size-4 accent-indigo-600" /><span className="text-sm font-medium">เผยแพร่บทความบนเว็บไซต์ (ปิดเพื่อเก็บเป็นฉบับร่าง)</span></label>
        </fieldset><div className="flex justify-end gap-3 border-t pt-4"><button type="button" disabled={busy || uploading} onClick={() => setEditor(null)} className="rounded-xl border px-5 py-2.5 disabled:opacity-50">ยกเลิก</button><button disabled={busy || uploading} className="rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white disabled:opacity-50">{busy ? "กำลังบันทึก…" : editor.input.published ? "บันทึกและเผยแพร่" : "บันทึกฉบับร่าง"}</button></div></form>}
      </DialogContent>
    </Dialog>
    <Dialog open={!!deleting} onOpenChange={open => { if (!open && !busy) setDeleting(null); }}><DialogContent><DialogHeader><DialogTitle>ลบบทความนี้?</DialogTitle><DialogDescription>“{deleting?.title}” จะถูกลบถาวร และไม่สามารถเรียกคืนได้</DialogDescription></DialogHeader><div className="flex justify-end gap-3"><button disabled={busy} onClick={() => setDeleting(null)} className="rounded-xl border px-4 py-2">ยกเลิก</button><button disabled={busy} onClick={remove} className="rounded-xl bg-red-600 px-4 py-2 text-white disabled:opacity-50">{busy ? "กำลังลบ…" : "ยืนยันลบ"}</button></div></DialogContent></Dialog>
  </div>;
}
