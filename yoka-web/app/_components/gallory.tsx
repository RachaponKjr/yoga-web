"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; // เพิ่ม icon X
import { Highlighter } from "@/components/ui/highlighter";

import image1 from "@/assets/images/gallory/CC__2033.jpg";
import image2 from "@/assets/images/gallory/CC__2039.jpg";
import image3 from "@/assets/images/gallory/CC__2048.jpg";
import image4 from "@/assets/images/gallory/CC__2063.jpg";
import image5 from "@/assets/images/gallory/CC__2066.jpg";
import image6 from "@/assets/images/gallory/CC__2070.jpg";
import image7 from "@/assets/images/gallory/CC__2091.jpg";
import image8 from "@/assets/images/gallory/CC__2096.jpg";
import image9 from "@/assets/images/gallory/CC__2117.jpg";
import image10 from "@/assets/images/gallory/CC__2137.jpg";
import image11 from "@/assets/images/gallory/CC__2145.jpg";
import image12 from "@/assets/images/gallory/CC__2152.jpg";
import image13 from "@/assets/images/gallory/CC__2195.jpg";
import image14 from "@/assets/images/gallory/CC__2231.jpg";
import image15 from "@/assets/images/gallory/CC__2244.jpg";
import image16 from "@/assets/images/gallory/CC__2245.jpg";
import image17 from "@/assets/images/gallory/CC__2346.jpg";
import image18 from "@/assets/images/gallory/CC__2427.jpg";
import image19 from "@/assets/images/gallory/CC__2467.jpg";

// 1. ข้อมูลรูปภาพ (เหมือนเดิม)

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", bounce: 0.3, duration: 0.6 },
  },
};

// Type Definitions
// type GalleryItem = (typeof galleryItems)[0];

export default function PortfolioGallery() {
  // State สำหรับเก็บรูปที่กำลังเปิดอยู่
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const images = [
    "/gallory/CC__2033.jpg",
    "/gallory/CC__2039.jpg",
    "/gallory/CC__2048.jpg",
    "/gallory/CC__2063.jpg",
    "/gallory/CC__2066.jpg",
    "/gallory/CC__2070.jpg",
    "/gallory/CC__2091.jpg",
    "/gallory/CC__2096.jpg",
    "/gallory/CC__2117.jpg",
    "/gallory/CC__2137.jpg",
    "/gallory/CC__2145.jpg",
    "/gallory/CC__2152.jpg",
    "/gallory/CC__2195.jpg",
    "/gallory/CC__2231.jpg",
    "/gallory/CC__2244.jpg",
    "/gallory/CC__2245.jpg",
    "/gallory/CC__2346.jpg",
    "/gallory/CC__2427.jpg",
    "/gallory/CC__2467.jpg",
  ];

  return (
    <section className="relative mt-12 mb-24">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="space-y-2 mb-8 text-center sm:text-left">
          <span className="text-primary font-semibold tracking-wider uppercase text-2xl md:text-4xl">
            Gallery
          </span>
          <p className="text-sm md:text-lg text-[#5C6155] font-medium leading-relaxed">
            A glimpse into our vibrant community and the beautiful space we
            share.
          </p>
        </div>

        {/* Masonry Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="columns-2 sm:columns-2 lg:columns-3 gap-3 md:gap-6 space-y-3 md:space-y-6"
        >
          {images.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants as any}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-zoom-in"
              onClick={() => setSelectedItem(item)} // กดแล้ว set state
            >
              {/* Image Container with layoutId for transition */}
              <motion.div
                layoutId={`image-container-${index}`}
                className="relative w-full"
              >
                <Image
                  src={item}
                  alt={"image"}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index <= 3}
                />

                {/* Overlay */}
                {/* <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <span className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-2 inline-block">
                      {item.category}
                    </span>
                    <h3 className="text-white text-2xl font-bold tracking-tight">
                      {item.title}
                    </h3>
                  </motion.div>
                </div> */}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* --- Lightbox Modal Section --- */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
            onClick={() => setSelectedItem(null)} // คลิกพื้นหลังเพื่อปิด
          >
            {/* ปิดด้วยปุ่ม X */}
            <button
              className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-50"
              onClick={() => setSelectedItem(null)}
            >
              <X size={32} />
            </button>

            {/* กล่องรูปภาพขยายใหญ่ */}
            <motion.div
              layoutId={`image-container-${selectedItem.id}`} // layoutId ตรงกันกับตัว Grid เพื่อให้เกิด Animation เชื่อมกัน
              className="relative w-full max-w-5xl max-h-[90vh] rounded-xl overflow-hidden bg-zinc-900 shadow-2xl"
              onClick={(e) => e.stopPropagation()} // คลิกที่รูปแล้วไม่ปิด
            >
              <Image
                src={selectedItem.src}
                alt={"image"}
                width={1200}
                height={800}
                className="w-full h-full object-contain max-h-[85vh]"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
