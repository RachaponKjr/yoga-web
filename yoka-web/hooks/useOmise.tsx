import { useState, useEffect, useCallback } from "react";

// --- Types Definitions (เหมือนเดิม) ---
export interface OmiseCardInputs {
  name: string;
  number: string;
  expiration_month: number;
  expiration_year: number;
  security_code: string;
  city?: string;
  postal_code?: string;
}

export interface OmiseTokenResponse {
  object: "token";
  id: string;
  livemode: boolean;
  location: string;
  used: boolean;
  card: {
    object: "card";
    id: string;
    livemode: boolean;
    country: string;
    city: string | null;
    postal_code: string | null;
    financing: string;
    bank: string;
    last_digits: string;
    brand: string;
    expiration_month: number;
    expiration_year: number;
    fingerprint: string;
    name: string;
    security_code_check: boolean;
    created_at: string;
  };
}

declare global {
  interface Window {
    Omise: {
      setPublicKey: (key: string) => void;
      createToken: (
        type: "card",
        card: OmiseCardInputs,
        callback: (statusCode: number, response: any) => void,
      ) => void;
    };
  }
}

// --- The Hook ---
export const useOmise = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY;

    if (!publicKey) {
      console.error("❌ Missing NEXT_PUBLIC_OMISE_PUBLIC_KEY in .env file");
      return;
    }

    // ✅ สร้างฟังก์ชัน handleLoad เพื่อใช้ซ้ำ และลดการเรียก setState ใน body หลัก
    const handleLoad = () => {
      if (window.Omise) {
        window.Omise.setPublicKey(publicKey);
        setLoading(false);
        console.log("✅ Omise Script Loaded");
      }
    };

    // 1. เช็คก่อนว่ามี Omise อยู่แล้วไหม (เช่น โหลดหน้าอื่นมาแล้ว)
    if (window.Omise) {
      handleLoad();
      return;
    }

    // 2. เช็คว่ามี Script tag อยู่ในหน้าเว็บหรือยัง (ป้องกัน Strict Mode สร้างซ้ำ)
    const existingScript = document.getElementById("omise-js-script");

    if (existingScript) {
      // ถ้ามี script อยู่แล้ว แต่ window.Omise ยังไม่มา ให้รอ event load
      existingScript.addEventListener("load", handleLoad);
      return () => existingScript.removeEventListener("load", handleLoad);
    }

    // 3. ถ้ายังไม่มีอะไรเลย ให้สร้าง Script ใหม่
    const script = document.createElement("script");
    script.id = "omise-js-script"; // ตั้ง ID เพื่อเช็คซ้ำ
    script.src = "https://cdn.omise.co/omise.js";
    script.async = true;
    script.onload = handleLoad;
    script.onerror = () => {
      console.error("❌ Failed to load Omise Script");
    };

    document.body.appendChild(script);

    // Cleanup function
    return () => {
      script.removeEventListener("load", handleLoad);
      // เรามักไม่ remove script ทิ้ง เพราะอาจใช้ต่อในหน้าอื่น
    };
  }, []);

  const createToken = useCallback(
    (card: OmiseCardInputs): Promise<OmiseTokenResponse> => {
      return new Promise((resolve, reject) => {
        if (!window.Omise) {
          reject(new Error("Omise script is not loaded yet."));
          return;
        }

        const cleanCard: OmiseCardInputs = {
          ...card,
          number: card.number.replace(/\s/g, ""),
        };

        window.Omise.createToken("card", cleanCard, (statusCode, response) => {
          if (statusCode === 200) {
            resolve(response as OmiseTokenResponse);
          } else {
            reject({
              code: response.code,
              message: response.message,
              object: response.object,
            });
          }
        });
      });
    },
    [],
  );

  return { createToken, loading };
};
