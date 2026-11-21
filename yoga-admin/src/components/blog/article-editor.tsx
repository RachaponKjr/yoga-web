import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { blogService } from "@/service/blog.service";
import ArticleContent, { MARKDOWN_PREFIX } from "./article-content";

const MAX = 50000 - MARKDOWN_PREFIX.length;
export default function ArticleEditor({ value, onChange, disabled, onUploading }: {
  value: string; onChange: (value: string) => void; disabled: boolean; onUploading: (busy: boolean) => void;
}) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const source = value.startsWith(MARKDOWN_PREFIX) ? value.slice(MARKDOWN_PREFIX.length) : value;
  async function upload(file?: File) {
    if (!file || disabled) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error("เลือกรูป JPG, PNG หรือ WebP ขนาดไม่เกิน 5 MB"); return;
    }
    onUploading(true);
    try {
      const url = await blogService.upload(file);
      const next = `${source}\n\n![คำอธิบายรูปภาพ](${url})\n`;
      if (next.length > MAX) { toast.error("เนื้อหายาวเกิน 50,000 ตัวอักษร"); return; }
      onChange(MARKDOWN_PREFIX + next);
    } catch { toast.error("อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่"); }
    finally { onUploading(false); }
  }
  return <div className="space-y-3" data-color-mode="light">
    <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-sm font-medium">เนื้อหาบทความ *</span><div className="flex gap-2">{([['edit', 'เขียนบทความ'], ['preview', 'ดูตัวอย่าง']] as const).map(([key, label]) => <button type="button" key={key} aria-pressed={mode === key} onClick={() => setMode(key)} className={`rounded-lg px-3 py-2 text-sm ${mode === key ? 'bg-indigo-100 text-indigo-900' : 'bg-gray-100'}`}>{label}</button>)}</div></div>
    {mode === "edit" ? <MDEditor value={source} onChange={next => { if ((next || '').length <= MAX) onChange(MARKDOWN_PREFIX + (next || '')); }} components={{ preview: markdown => <ArticleContent content={MARKDOWN_PREFIX + markdown} /> }} height={500} preview="edit" extraCommands={[]} disabled={disabled} textareaProps={{ 'aria-label': 'เนื้อหาบทความ', maxLength: MAX, placeholder: 'เริ่มต้นเรื่องราวของคุณ…' }} /> : <div className="min-h-96 rounded-xl border bg-[#fafaf6] p-6"><ArticleContent content={value} /></div>}
    <div className="flex flex-wrap items-center justify-between gap-3"><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm"><ImagePlus size={16} />แทรกรูปท้ายบทความ<input disabled={disabled} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={e => { void upload(e.target.files?.[0]); e.target.value = ''; }} /></label><span className="text-sm text-gray-500">{source.length.toLocaleString()} / {MAX.toLocaleString()}</span></div>
    <p className="text-sm leading-6 text-gray-500">ใช้แถบเครื่องมือเพิ่มหัวข้อ ตัวหนา ลิงก์ รายการ และตาราง · Ctrl/⌘ Z เพื่อย้อนกลับ · แก้ข้อความใน [ ] ของรูปเพื่อใส่ Alt text</p>
  </div>;
}
