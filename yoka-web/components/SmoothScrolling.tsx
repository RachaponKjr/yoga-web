"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScrolling() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // ความหน่วง (ยิ่งเยอะ ยิ่งไหล)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ฟิสิกส์การลื่นไหล
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false, // ปิดบนมือถือ (ปกติมือถือสมูทอยู่แล้ว เปิดแล้วอาจจะหน่วงแปลกๆ)
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return null; // Component นี้ไม่ต้อง render อะไร แค่รัน script
}
