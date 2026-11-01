/** Resolve API upload paths without depending on a trailing slash in the host. */
export function imageUrl(value: string | null | undefined): string {
  const path = value?.trim().replace(/\\/g, "/");
  if (!path) return "";

  try {
    // Already absolute URLs must not have the image host prepended again.
    if (/^https?:\/\//i.test(path)) return new URL(path).href;
    if (/^[a-z][a-z\d+.-]*:/i.test(path) || path.startsWith("//")) return "";

    const base = process.env.NEXT_PUBLIC_HOST_IMAGE?.trim() ||
      new URL(process.env.NEXT_PUBLIC_API_URL || "https://api.yogabyniti.com/api/v1").origin;
    const url = new URL(path.replace(/^\/+/, ""), `${base.replace(/\/+$/, "")}/`);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}
