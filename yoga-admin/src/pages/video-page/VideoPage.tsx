import { useEffect, useState, useCallback } from "react";
import { Settings, X, Loader2 } from "lucide-react";
import { isAxiosError } from "axios";
import { videoService } from "@/service/video.service";
import type { VideoContent } from "@/service/video.service";
import { instagramUrl, scheduleImageUrl } from "@/lib/video-content";
import { toast } from "sonner";

const empty: VideoContent = {
  id: "",
  url_1: "",
  url_2: "",
  url_3: "",
  url_4: "",
  url_5: "",
};
const fields = ["url_1", "url_2", "url_3", "url_4"] as const;
function errorMessage(error: unknown) {
  return isAxiosError(error)
    ? error.response?.data?.message || "เชื่อมต่อไม่สำเร็จ กรุณาลองอีกครั้ง"
    : "บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง";
}

export default function VideoPage() {
  const [data, setData] = useState<VideoContent>(empty);
  const [draft, setDraft] = useState<VideoContent>(empty);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const fetchContent = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setData((await videoService.getAll()) || empty);
    } catch (error) {
      setLoadError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void fetchContent();
  }, [fetchContent]);
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const startEdit = () => {
    setDraft({ ...data });
    setFile(null);
    setPreview("");
    setRemoveImage(false);
    setSaveError("");
    setOpen(true);
  };
  const save = async () => {
    if (saving) return;
    const body = new FormData();
    for (const field of fields) {
      const value = draft[field] || "";
      const normalized = instagramUrl(value);
      if (value.trim() && !normalized) {
        setSaveError(
          `ลิงก์วิดีโอ ${fields.indexOf(field) + 1} ต้องเป็น Instagram Reel หรือโพสต์ เช่น https://www.instagram.com/reel/ABC/`,
        );
        return;
      }
      body.append(field, normalized);
    }
    if (draft.id) body.append("id", draft.id);
    if (file) body.append("cover_image", file);
    if (removeImage) body.append("remove_image", "true");
    setSaving(true);
    setSaveError("");
    try {
      const result = draft.id
        ? await videoService.update(body)
        : await videoService.create(body);
      setData(result);
      setImageFailed(false);
      setOpen(false);
      setFile(null);
      setPreview("");
      toast.success("บันทึกวิดีโอและภาพตารางเรียนแล้ว");
    } catch (error) {
      setSaveError(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };
  const currentImage = scheduleImageUrl(data.url_5);
  const draftImage = removeImage
    ? ""
    : file
      ? preview
      : scheduleImageUrl(draft.url_5);

  return (
    <div className="min-h-screen p-6 sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">จัดการวิดีโอและตารางเรียน</h1>
          <p className="text-gray-500 mt-2">
            วิดีโอ Instagram สูงสุด 4 รายการ และภาพตารางเรียนสำหรับหน้าเว็บ
          </p>
        </div>
        <button
          disabled={loading || !!loadError}
          onClick={startEdit}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white disabled:opacity-50"
        >
          <Settings size={18} />
          แก้ไขเนื้อหา
        </button>
      </div>
      {loading ? (
        <div role="status" className="p-12">
          <Loader2 className="animate-spin" />
          กำลังโหลด…
        </div>
      ) : loadError ? (
        <div role="alert" className="rounded-xl bg-red-50 p-6 text-red-700">
          {loadError}
          <button
            onClick={() => void fetchContent()}
            className="ml-4 underline"
          >
            ลองอีกครั้ง
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {fields.map((field, index) => {
              const url = instagramUrl(data[field] || "");
              return (
                <section
                  key={field}
                  className="bg-white rounded-2xl border overflow-hidden"
                >
                  <h2 className="font-semibold p-4">วิดีโอ {index + 1}</h2>
                  {url ? (
                    <>
                      <iframe
                        title={`Instagram วิดีโอ ${index + 1}`}
                        src={`${url}embed/`}
                        loading="lazy"
                        allow="autoplay; encrypted-media; fullscreen"
                        className="w-full h-[440px] border-0"
                      />
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 text-blue-600 underline"
                      >
                        เปิดบน Instagram
                      </a>
                    </>
                  ) : (
                    <p className="p-10 text-gray-500">ยังไม่มีวิดีโอ</p>
                  )}
                </section>
              );
            })}
          </div>
          <section className="bg-white rounded-2xl border p-6">
            <h2 className="text-xl font-bold mb-4">ภาพตารางเรียน</h2>
            {currentImage && !imageFailed ? (
              <a href={currentImage} target="_blank" rel="noopener noreferrer">
                <img
                  src={currentImage}
                  onError={() => setImageFailed(true)}
                  alt="ตารางเรียนโยคะ"
                  className="max-w-full max-h-[800px] object-contain"
                />
              </a>
            ) : (
              <p className="text-gray-500">
                {imageFailed
                  ? "โหลดภาพไม่สำเร็จ กรุณาอัปโหลดภาพใหม่หรือตรวจสอบเซิร์ฟเวอร์ไฟล์"
                  : "ยังไม่มีภาพตารางเรียน"}
              </p>
            )}
          </section>
        </div>
      )}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="content-title"
            className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 id="content-title" className="text-xl font-bold">
                แก้ไขวิดีโอและตารางเรียน
              </h2>
              <button
                aria-label="ปิด"
                disabled={saving}
                onClick={() => setOpen(false)}
              >
                <X />
              </button>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void save();
              }}
              className="space-y-4"
            >
              <fieldset disabled={saving} className="space-y-4">
                <p className="text-sm text-gray-500">
                  ใช้ลิงก์ Instagram ที่เปิดสาธารณะ
                  เว้นว่างเพื่อลบวิดีโอออกจากหน้าเว็บ
                  การเล่นวิดีโอขึ้นอยู่กับสิทธิ์การฝังของ Instagram
                </p>
                {fields.map((field, index) => (
                  <label key={field} className="block text-sm font-medium">
                    Instagram วิดีโอ {index + 1}
                    <input
                      type="url"
                      value={draft[field] || ""}
                      onChange={(event) =>
                        setDraft({ ...draft, [field]: event.target.value })
                      }
                      placeholder="https://www.instagram.com/reel/..."
                      className="block w-full border rounded-xl p-3 mt-2"
                    />
                  </label>
                ))}
                <label className="block text-sm font-medium">
                  ภาพตารางเรียน (JPG, PNG, WebP ไม่เกิน 5 MB)
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="block w-full border rounded-xl p-3 mt-2"
                    onChange={(event) => {
                      const selected = event.target.files?.[0];
                      if (!selected) return;
                      if (
                        !["image/jpeg", "image/png", "image/webp"].includes(
                          selected.type,
                        ) ||
                        selected.size > 5 * 1024 * 1024
                      ) {
                        setSaveError(
                          "เลือกภาพ JPG, PNG หรือ WebP ขนาดไม่เกิน 5 MB",
                        );
                        event.target.value = "";
                        return;
                      }
                      setFile(selected);
                      setRemoveImage(false);
                      setSaveError("");
                    }}
                  />
                </label>
                {draftImage && (
                  <img
                    src={draftImage}
                    alt="ตัวอย่างภาพตารางเรียน"
                    className="w-full max-h-80 object-contain rounded-lg bg-gray-50"
                  />
                )}
                {(draft.url_5 || file) && (
                  <label className="flex gap-2 items-center text-sm">
                    <input
                      type="checkbox"
                      checked={removeImage}
                      onChange={(event) => {
                        setRemoveImage(event.target.checked);
                        if (event.target.checked) {
                          setFile(null);
                          setPreview("");
                        }
                      }}
                    />
                    ลบภาพตารางเรียน
                  </label>
                )}
                <p className="text-sm text-gray-500">
                  หากไม่เลือกภาพใหม่ ระบบจะเก็บภาพเดิมไว้
                </p>
              </fieldset>
              {saveError && (
                <p
                  role="alert"
                  className="text-red-700 bg-red-50 rounded-lg p-3"
                >
                  {saveError}
                </p>
              )}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setOpen(false)}
                  className="px-5 py-3 rounded-xl border"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 rounded-xl bg-blue-600 text-white disabled:opacity-50"
                >
                  {saving ? "กำลังบันทึก…" : "บันทึกการเปลี่ยนแปลง"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
