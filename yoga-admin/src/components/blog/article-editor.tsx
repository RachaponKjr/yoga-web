import { useId, useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { blogService } from "@/service/blog.service";
import ArticleContent, { MARKDOWN_PREFIX } from "./article-content";

const LIMIT = 50000;
const tools = [
  { label: "หัวข้อใหญ่", prefix: "\n\n## ", suffix: "\n\n", sample: "หัวข้อของคุณ" },
  { label: "หัวข้อย่อย", prefix: "\n\n### ", suffix: "\n\n", sample: "หัวข้อย่อย" },
  { label: "ตัวหนา", prefix: "**", suffix: "**", sample: "ข้อความสำคัญ" },
  { label: "ตัวเอียง", prefix: "*", suffix: "*", sample: "ข้อความ" },
  { label: "ขีดฆ่า", prefix: "~~", suffix: "~~", sample: "ข้อความ" },
  { label: "อ้างอิง", prefix: "\n\n> ", suffix: "\n\n", sample: "ถ้อยคำที่อยากแบ่งปัน" },
  { label: "รายการ •", prefix: "\n\n- ", suffix: "\n\n", sample: "รายการแรก\n- รายการถัดไป" },
  { label: "รายการ 1.", prefix: "\n\n1. ", suffix: "\n\n", sample: "รายการแรก\n2. รายการถัดไป" },
  { label: "เส้นคั่น", prefix: "\n\n---\n\n", suffix: "", sample: "" },
  { label: "ตาราง", prefix: "\n\n", suffix: "\n\n", sample: "| หัวข้อ | รายละเอียด |\n| --- | --- |\n| รายการ | ข้อมูล |\n| รายการ | ข้อมูล |" },
];

export default function ArticleEditor({ value, onChange, disabled, onUploading }: {
  value: string; onChange: (value: string) => void; disabled: boolean; onUploading: (busy: boolean) => void;
}) {
  const id = useId();
  const textarea = useRef<HTMLTextAreaElement>(null);
  const selection = useRef({ start: 0, end: 0 });
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const source = value.startsWith(MARKDOWN_PREFIX) ? value.slice(MARKDOWN_PREFIX.length) : value;
  const maxLength = LIMIT - MARKDOWN_PREFIX.length;

  function insert(prefix: string, suffix = "", sample = "") {
    const { start, end } = selection.current;
    const selected = source.slice(start, end) || sample;
    const next = source.slice(0, start) + prefix + selected + suffix + source.slice(end);
    if (next.length > maxLength) { toast.error("เนื้อหายาวเกิน 50,000 ตัวอักษร"); return; }
    onChange(MARKDOWN_PREFIX + next);
    setMode("write");
    requestAnimationFrame(() => {
      textarea.current?.focus();
      textarea.current?.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    });
  }

  async function upload(file?: File) {
    if (!file || uploading) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error("เลือกรูป JPG, PNG หรือ WebP ขนาดไม่เกิน 5 MB"); return;
    }
    setUploading(true); onUploading(true);
    try {
      const image = await blogService.upload(file);
      insert("\n\n![", `](${image})\n\n`, "คำอธิบายรูปภาพ");
    } catch { toast.error("อัปโหลดรูปไม่สำเร็จ กรุณาลองอีกครั้ง"); }
    finally { setUploading(false); onUploading(false); }
  }

  function addLink() {
    const clean = url.trim();
    if (!/^(https?:\/\/|mailto:)/i.test(clean)) { toast.error("ใส่ลิงก์ที่ขึ้นต้นด้วย https://, http:// หรือ mailto:"); return; }
    const safeUrl = clean.replace(/\s/g, "%20").replace(/\(/g, "%28").replace(/\)/g, "%29");
    insert("[", `](${safeUrl})`, linkText.replaceAll("[", "").replaceAll("]", "") || "อ่านเพิ่มเติม");
    setLinkOpen(false); setUrl(""); setLinkText("");
  }

  return <div className="space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-3"><label htmlFor={id} className="text-sm font-medium">เนื้อหาบทความ *</label>
      <div className="flex rounded-lg bg-gray-100 p-1" role="group" aria-label="โหมดเขียนบทความ">{([['write', 'เขียนบทความ'], ['preview', 'ดูตัวอย่าง']] as const).map(([key, label]) => <button key={key} type="button" aria-pressed={mode === key} onClick={() => setMode(key)} className={`rounded-md px-3 py-1.5 text-xs ${mode === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>{label}</button>)}</div>
    </div>
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {mode === "write" && <>
        <div className="flex flex-wrap gap-1 border-b bg-gray-50 p-2" role="group" aria-label="เครื่องมือจัดรูปแบบ">
          {tools.map(tool => <button key={tool.label} type="button" disabled={disabled} onClick={() => insert(tool.prefix, tool.suffix, tool.sample)} className="rounded-md px-2.5 py-2 text-xs text-gray-600 hover:bg-white hover:text-gray-950 disabled:opacity-40">{tool.label}</button>)}
          <button type="button" disabled={disabled} onClick={() => setLinkOpen(!linkOpen)} aria-expanded={linkOpen} className="rounded-md px-2.5 py-2 text-xs text-gray-600 hover:bg-white">ลิงก์</button>
          <label className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-xs text-gray-600 hover:bg-white ${disabled ? 'opacity-40' : 'cursor-pointer'}`}>{uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}แทรกรูป<input type="file" disabled={disabled} accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={event => { void upload(event.target.files?.[0]); event.target.value = ""; }} /></label>
        </div>
        {linkOpen && <div className="flex flex-wrap gap-2 border-b bg-gray-50 p-3"><input aria-label="ข้อความลิงก์" placeholder="ข้อความลิงก์" value={linkText} onChange={e => setLinkText(e.target.value)} className="min-w-0 flex-1 rounded-lg border bg-white p-2 text-sm" /><input aria-label="URL ลิงก์" type="url" placeholder="https://…" value={url} onChange={e => setUrl(e.target.value)} className="min-w-0 flex-1 rounded-lg border bg-white p-2 text-sm" /><button type="button" disabled={disabled || !url.trim()} onClick={addLink} className="rounded-lg bg-gray-900 px-3 text-sm text-white disabled:opacity-40">แทรก</button></div>}
      </>}
      {mode === "write" ? <textarea ref={textarea} id={id} disabled={disabled} value={source} maxLength={maxLength} rows={18} placeholder="เริ่มต้นเรื่องราวของคุณ… เลือกข้อความแล้วกดเครื่องมือด้านบนเพื่อจัดรูปแบบ" onSelect={e => { selection.current = { start: e.currentTarget.selectionStart, end: e.currentTarget.selectionEnd }; }} onChange={e => onChange(MARKDOWN_PREFIX + e.target.value)} onKeyDown={e => {
        if ((e.ctrlKey || e.metaKey) && ['b', 'i'].includes(e.key.toLowerCase())) { e.preventDefault(); const mark = e.key.toLowerCase() === 'b' ? '**' : '*'; insert(mark, mark, 'ข้อความ'); }
      }} className="block min-h-96 w-full resize-y border-0 bg-transparent p-5 text-sm leading-8 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400 sm:p-7" /> : <div className="min-h-96 bg-[#fafaf6] p-5 sm:p-8">{source.trim() ? <ArticleContent content={value} /> : <p className="py-20 text-center text-sm text-gray-400">เริ่มเขียน แล้วกลับมาดูตัวอย่างได้ที่นี่</p>}</div>}
      <div className="flex justify-between gap-4 border-t px-4 py-3 text-xs text-gray-400"><span>เลือกข้อความเพื่อจัดรูปแบบ · Ctrl/⌘ B ตัวหนา · Ctrl/⌘ I ตัวเอียง</span><span className="shrink-0">{source.length.toLocaleString()} / {maxLength.toLocaleString()}</span></div>
    </div>
    <p className="text-xs leading-6 text-gray-500">ใช้ปุ่มเพื่อแทรกรูปแบบ แล้วกด “ดูตัวอย่าง” เพื่อดูหน้าตาจริง เว้นบรรทัดว่างเพื่อขึ้นย่อหน้าใหม่ เปลี่ยนข้อความใน [ ] ใต้รูปเพื่อใส่คำอธิบายรูปภาพได้</p>
  </div>;
}
