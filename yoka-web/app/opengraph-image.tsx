import { ImageResponse } from "next/og";

export const alt =
  "Yoga By Niti — Yoga Studio & Wholesome Kitchen in Rawai, Phuket";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#f8f7f3",
        color: "#30372c",
        padding: "80px",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 20,
          letterSpacing: 5,
          color: "#737b62",
          marginBottom: 40,
        }}
      >
        RAWAI, PHUKET
      </div>
      <div style={{ display: "flex", fontSize: 100, letterSpacing: -4 }}>
        Yoga By Niti
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 38,
          color: "#647153",
          marginTop: 24,
        }}
      >
        Make space for yourself.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 22,
          marginTop: 64,
          borderTop: "1px solid #cdd5c1",
          paddingTop: 28,
          color: "#737b62",
        }}
      >
        Yoga Studio & Wholesome Kitchen
      </div>
    </div>,
    size,
  );
}
