export function instagramUrl(value: string): string {
  if (!value.trim()) return "";
  try {
    const url = new URL(value.trim());
    const match = url.pathname.match(/^\/(reel|reels|p|tv)\/([A-Za-z0-9_-]+)\/?(?:embed\/?)?$/);
    if (url.protocol !== "https:" || !["instagram.com", "www.instagram.com"].includes(url.hostname) || !match || url.port || url.username || url.password) return "";
    return `https://www.instagram.com/${match[1] === "reels" ? "reel" : match[1]}/${match[2]}/`;
  } catch { return ""; }
}

export function scheduleImageUrl(value: string | null | undefined): string {
  if (!value) return "";
  const base = import.meta.env.VITE_HOST_IMAGE || new URL(import.meta.env.VITE_API_URL || "https://api.yogabyniti.com/api/v1").origin;
  try {
    const url = new URL(value.replace(/\\/g, "/"), `${base.replace(/\/$/, "")}/`);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch { return ""; }
}
