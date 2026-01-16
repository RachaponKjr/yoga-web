"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; // เพิ่ม icon X
import { Highlighter } from "@/components/ui/highlighter";

// 1. ข้อมูลรูปภาพ (เหมือนเดิม)
const galleryItems = [
  {
    id: 1,
    title: "Serene Yoga Session",
    category: "Photography",
    src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Modern Architecture",
    category: "Design",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    link: "#",
  },
  {
    id: 3,
    title: "Minimalist Interior",
    category: "Interior",
    src: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800&auto=format&fit=crop",
    link: "#",
  },
  {
    id: 4,
    title: "Nature Retreat",
    category: "Travel",
    src: "https://images.unsplash.com/photo-1587578479040-e5fb305dd25e?q=80&w=800&auto=format&fit=crop",
    link: "#",
  },
  {
    id: 5,
    title: "Abstract Art",
    category: "Art",
    src: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=800&auto=format&fit=crop",
    link: "#",
  },
  {
    id: 6,
    title: "Urban Lifestyle",
    category: "Photography",
    src: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format&fit=crop",
    link: "#",
  },
  {
    id: 7,
    title: "Culinary Delight",
    category: "Food",
    src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
    link: "#",
  },
  {
    id: 8,
    title: "Tech Workspace",
    category: "Technology",
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
    link: "#",
  },
  {
    id: 9,
    title: "Fashion Portrait",
    category: "Fashion",
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    link: "#",
  },
  {
    id: 10,
    title: "Mountain Adventure",
    category: "Travel",
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    link: "#",
  },
];

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
type GalleryItem = (typeof galleryItems)[0];

export default function PortfolioGallery() {
  // State สำหรับเก็บรูปที่กำลังเปิดอยู่
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <section className="relative mb-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="space-y-2 mb-8 text-center sm:text-left">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">
            Gallery
          </span>
          <p className="text-2xl text-[#5C6155] font-medium leading-relaxed">
            Lorem ipsum dolor sit amet.
          </p>
        </div>

        {/* Masonry Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          {galleryItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants as any}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-zoom-in"
              onClick={() => setSelectedItem(item)} // กดแล้ว set state
            >
              {/* Image Container with layoutId for transition */}
              <motion.div
                layoutId={`image-container-${item.id}`}
                className="relative w-full"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={item.id <= 3}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
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
                </div>
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
                alt={selectedItem.title}
                width={1200}
                height={800}
                className="w-full h-full object-contain max-h-[85vh]"
                priority
              />
              {/* ข้อมูลใต้ภาพในโหมดขยาย */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/90 to-transparent"
              >
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-blue-400 text-sm font-bold uppercase tracking-widest">
                      {selectedItem.category}
                    </span>
                    <h2 className="text-white text-2xl sm:text-3xl font-bold mt-2">
                      {selectedItem.title}
                    </h2>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
