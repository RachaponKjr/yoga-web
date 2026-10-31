import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { blogImageUrl } from "@/service/blog.service";
import "./article-content.css";

export const MARKDOWN_PREFIX = "<!-- yoka:markdown:v1 -->\n";

export default function ArticleContent({ content }: { content: string }) {
  if (!content.startsWith(MARKDOWN_PREFIX)) {
    return <div className="article-content">{content.split(/\r?\n\s*\r?\n/).map((text, index) => <p key={index} className="article-plain">{text}</p>)}</div>;
  }
  return <div className="article-content"><Markdown remarkPlugins={[remarkGfm]} skipHtml components={{
    h1: ({ children }) => <h2>{children}</h2>,
    a: ({ href, children }) => <a href={href} rel="noopener noreferrer">{children}</a>,
    img: ({ src, alt, title }) => typeof src === "string" && src ? <img src={blogImageUrl(src)} alt={alt || ""} title={title} loading="lazy" /> : null,
    table: ({ children }) => <div className="article-table"><table>{children}</table></div>,
  }}>{content.slice(MARKDOWN_PREFIX.length)}</Markdown></div>;
}
