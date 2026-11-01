import { imageUrl } from "./image-url";

export function instagramUrl(value: string): string {
  if (!value.trim()) return "";
  try {
    const url = new URL(value.trim());
    const match = url.pathname.match(/^\/(reel|reels|p|tv)\/([A-Za-z0-9_-]+)\/?(?:embed\/?)?$/);
    if (url.protocol !== "https:" || !["instagram.com", "www.instagram.com"].includes(url.hostname) || !match || url.port || url.username || url.password) return "";
    return `https://www.instagram.com/${match[1] === "reels" ? "reel" : match[1]}/${match[2]}/`;
  } catch { return ""; }
}

export const scheduleImageUrl = imageUrl;
