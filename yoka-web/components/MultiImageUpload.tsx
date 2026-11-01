"use client";

import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { X, UploadCloud, Image as ImageIcon } from "lucide-react";
// 1. Import uuid เข้ามา
import { v4 as uuidv4 } from "uuid";

export interface UploadableFile extends File {
  preview: string;
  id: string;
}

interface MultiImageUploadProps {
  onFilesChange: (files: UploadableFile[]) => void;
  maxFiles?: number;
  maxSizeInMB?: number;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  onFilesChange,
  maxFiles = 5,
  maxSizeInMB = 2,
}) => {
  const [files, setFiles] = useState<UploadableFile[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setErrorMessage(null);

      if (fileRejections.length > 0) {
        const errors = fileRejections.map((rejection) => {
          if (rejection.errors[0].code === "file-too-large") {
            return `File ${rejection.file.name} is larger than ${maxSizeInMB}MB`;
          }
          if (rejection.errors[0].code === "too-many-files") {
            return `Select up to ${maxFiles} File`;
          }
          return rejection.errors[0].message;
        });
        setErrorMessage(errors.join(", "));
      }

      if (files.length + acceptedFiles.length > maxFiles) {
        setErrorMessage(`Select up to ${maxFiles} File`);
        return;
      }

      // สร้าง Preview URL
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          // 2. แก้ไขตรงนี้: ใช้ uuidv4() แทน crypto.randomUUID()
          id: uuidv4(),
        })
      );

      setFiles((prevFiles) => {
        const updatedFiles = [...prevFiles, ...newFiles];
        onFilesChange(updatedFiles);
        return updatedFiles;
      });
    },
    [files, maxFiles, maxSizeInMB, onFilesChange]
  );

  const removeFile = (idToRemove: string) => {
    setFiles((prevFiles) => {
      // ค้นหาไฟล์ที่จะลบ เพื่อคืน Memory เฉพาะตัวนี้
      const fileToRemove = prevFiles.find((f) => f.id === idToRemove);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      const updatedFiles = prevFiles.filter((file) => file.id !== idToRemove);
      onFilesChange(updatedFiles);
      return updatedFiles;
    });
  };

  const clearAll = () => {
    // คืน Memory ทั้งหมดเมื่อกดล้าง
    files.forEach((file) => URL.revokeObjectURL(file.preview));
    setFiles([]);
    onFilesChange([]);
    setErrorMessage(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxSize: maxSizeInMB * 1024 * 1024,
    maxFiles: maxFiles,
  });

  return (
    <div className="w-full space-y-4">
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors 
            ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }
            ${errorMessage ? "border-red-500 bg-red-50" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
          <UploadCloud
            className={`w-10 h-10 ${
              isDragActive ? "text-blue-500" : "text-gray-400"
            }`}
          />
          {isDragActive ? (
            <p className="text-blue-600 font-medium">Drop files here...</p>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-700">
                Click to choose images or drag files here
              </p>
              <p className="text-sm">(JPG, PNG, WebP, up to {maxFiles} images)</p>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded animate-pulse">
          {errorMessage}
        </p>
      )}

      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="bg-white rounded-lg border p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Selected images ({files.length}/{maxFiles})
            </h4>
            <button
              onClick={clearAll}
              type="button"
              className="text-sm text-red-500 hover:text-red-700"
            >
              Remove all
            </button>
          </div>

          <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file) => (
              <li
                key={file.id}
                className="relative group rounded-lg overflow-hidden border aspect-square bg-gray-100"
              >
                {/* Image Preview */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-full h-full object-cover block"
                />

                {/* ปุ่มลบ */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-start justify-end p-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="bg-white/90 hover:bg-white text-gray-600 hover:text-red-600 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    title="Remove this image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* File Name */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 truncate px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {file.name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
