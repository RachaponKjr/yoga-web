import React, { useState, useRef, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface MultiImageUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
}

interface FileWithPreview extends File {
  preview: string;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  onFilesChange,
  maxFiles = 5,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper: จัดการไฟล์ที่เข้ามา (ไม่ว่าจะคลิกหรือลาก)
  const handleFiles = (incomingFiles: File[]) => {
    if (files.length >= maxFiles) return;

    const validFiles = incomingFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    const remainingSlots = maxFiles - files.length;
    const filesToAdd = validFiles.slice(0, remainingSlots).map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setFiles((prev) => {
      const updated = [...prev, ...filesToAdd];
      onFilesChange(updated);
      return updated;
    });
  };

  // 1. Event จากการคลิกเลือกไฟล์ผ่าน Input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
    // Reset input เพื่อให้เลือกไฟล์เดิมซ้ำได้ถ้าลบไปแล้ว
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 2. Event: เริ่มลากของเข้ามาในพื้นที่
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // สำคัญ! ต้องกัน Default ไม่งั้น browser จะเปิดรูปแทน
    setIsDragging(true);
  };

  // 3. Event: ลากของออกไปจากพื้นที่
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // 4. Event: ปล่อยไฟล์ลง (Drop)
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  // 5. ลบรูปภาพ
  const removeFile = (fileToRemove: FileWithPreview) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f !== fileToRemove);
      onFilesChange(updated);
      return updated;
    });
    URL.revokeObjectURL(fileToRemove.preview);
  };

  // Cleanup Memory
  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  // ฟังก์ชันจำลองการคลิก input เมื่อกดที่กล่อง div
  const triggerInputClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* --- Drop Area --- */}
      <div
        onClick={triggerInputClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 transition-colors cursor-pointer 
          flex flex-col items-center justify-center gap-3 text-center
          ${
            isDragging
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 hover:border-gray-400 bg-gray-50"
          }
          ${files.length >= maxFiles ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        {/* Hidden Input */}
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
        />

        {/* UI ภายใน */}
        <div className="p-3 bg-white rounded-full shadow-sm pointer-events-none">
          <Upload
            className={`w-6 h-6 ${
              isDragging ? "text-indigo-600" : "text-gray-400"
            }`}
          />
        </div>
        <div className="pointer-events-none">
          <p className="text-sm font-medium text-gray-700">
            {isDragging
              ? "ปล่อยรูปภาพลงที่นี่..."
              : "คลิกเพื่ออัปโหลด หรือลากรูปมาวาง"}
          </p>
          <p className="text-xs text-gray-500 mt-1">(สูงสุด {maxFiles} รูป)</p>
        </div>
      </div>

      {/* --- Preview Grid --- */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={file.preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // กันไม่ให้ไปกดโดน div ข้างหลัง
                    removeFile(file);
                  }}
                  className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition transform hover:scale-110"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* Placeholder ช่องว่าง */}
          {Array.from({ length: Math.max(0, maxFiles - files.length) }).map(
            (_, i) => (
              <div
                key={`empty-${i}`}
                className="aspect-square bg-gray-50 border border-gray-200 border-dashed rounded-lg flex items-center justify-center text-gray-300"
              >
                <ImageIcon size={20} />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
