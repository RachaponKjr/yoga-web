import React, { useEffect, useState, useCallback } from "react";
import { Settings, Link as LinkIcon, X, Loader2 } from "lucide-react";
import { videoService } from "@/service/video.service";
import { toast } from "sonner"; // หรือใช้ alert ปกติก็ได้ครับ

const VideoPage = () => {
  const [videoData, setVideoData] = useState({
    id: "",
    url_1: "",
    url_2: "",
    url_3: "",
    url_4: "",
    url_5: "",
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempUrls, setTempUrls] = useState({ ...videoData });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  console.log(videoData.url_5);
  // ดึงข้อมูลวิดีโอ
  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await videoService.getAll();
      if (res) {
        const newData = {
          id: res.id || "", // เก็บ id ไว้
          url_1: res.url_1 || "",
          url_2: res.url_2 || "",
          url_3: res.url_3 || "",
          url_4: res.url_4 || "",
          url_5: res.url_5 || "",
        };
        setVideoData(newData);
        setTempUrls(newData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // เปิด Modal พร้อม Reset ค่า temp ตามข้อมูลปัจจุบัน
  const openEditModal = () => {
    setTempUrls({ ...videoData });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      // ตรวจสอบว่าใน tempUrls มี id หรือไม่
      if (tempUrls.id) {
        const formData = new FormData();
        formData.append("id", tempUrls.id);
        formData.append("url_1", tempUrls.url_1);
        formData.append("url_2", tempUrls.url_2);
        formData.append("url_3", tempUrls.url_3);
        formData.append("url_4", tempUrls.url_4);
        if (coverImage) {
          formData.append("cover_image", coverImage);
        }
        // ถ้ามี id ให้เรียก update และส่ง tempUrls ไปทั้งหมดได้เลย
        await videoService.update(formData);
        toast.success("Updated successfully");
      } else {
        // ถ้าไม่มี id (กรณีข้อมูลชุดแรกสุด) ให้เรียก create
        await videoService.create(tempUrls);
        toast.success("Created successfully");
      }

      await fetchVideos();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Process failed");
    }
  };

  const VideoCard = ({ url }: { url: string }) => (
    <div className="relative w-full aspect-12/16 bg-black rounded-3xl overflow-hidden shadow-xl border border-gray-100 group">
      {url ? (
        <>
          <iframe
            src={`${url}${url.endsWith("/") ? "" : "/"}embed/`}
            className="absolute top-1/2 left-1/2 w-full h-[150%] border-none pointer-events-none"
            style={{ transform: "translate(-50%, -50%) scale(1.7)" }}
            frameBorder="0"
            scrolling="no"
          />
          <div className="absolute inset-0 bg-transparent" />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
          <LinkIcon size={32} className="opacity-20" />
          <p className="text-xs uppercase tracking-widest opacity-50">
            No Video URL
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Video Showcase
            </h1>
            <p className="text-gray-500 mt-2">
              จัดการวิดีโอรีวิวจาก Instagram สำหรับหน้าแรก
            </p>
          </div>
          <button
            onClick={openEditModal}
            className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-2xl shadow-sm hover:shadow-md transition-all font-semibold text-gray-700 active:scale-95"
          >
            <Settings size={18} />
            Manage Content
          </button>
        </div>

        {/* Video Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
              <VideoCard url={videoData.url_1} />
              <VideoCard url={videoData.url_2} />
              <VideoCard url={videoData.url_3} />
              <VideoCard url={videoData.url_4} />
            </div>
            <div className="w-full flex flex-col gap-4 ">
              <h6 className="text-xl font-bold text-gray-800">ภาพตารางสอน</h6>
              <div className="max-w-xl aspect-square">
                <img
                  className="w-full h-full object-cover"
                  src={`http://localhost:3001/${videoData.url_5}`}
                  alt=""
                />
              </div>
            </div>
          </div>
        )}

        {/* Dialog / Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-800">
                  Video Settings
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-5">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                      Instagram Reel URL {num}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={tempUrls[`url_${num}` as keyof typeof tempUrls]}
                        onChange={(e) =>
                          setTempUrls({
                            ...tempUrls,
                            [`url_${num}`]: e.target.value,
                          })
                        }
                        placeholder="https://www.instagram.com/reel/..."
                        className="w-full pl-4 pr-4 py-3 bg-gray-100 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                ))}
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                    ตารางสอน
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={(e) =>
                        setCoverImage(e.target.files?.[0] || null)
                      }
                      className="w-full pl-4 pr-4 py-3 bg-gray-100 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 pt-0 flex gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  className="flex-[2] py-3.5 bg-blue-600 text-white font-bold hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPage;
