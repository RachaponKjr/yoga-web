import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Leaf } from "lucide-react";

export default function StudioPageLayout({ children, title, eyebrow, image, description }: {
  children: ReactNode;
  title: string;
  eyebrow: string;
  image: string;
  description: string;
}) {
  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#30372c]">
      <header className="relative isolate overflow-hidden bg-[#303a2b]">
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover object-center opacity-45" />
        <div className="absolute inset-0 bg-linear-to-r from-[#273123]/85 via-[#303a2b]/45 to-[#303a2b]/15" />
        <div className="relative mx-auto max-w-[1240px] px-5 pb-14 pt-7 sm:px-7 md:pb-20">
          <Link href="/" className="inline-flex items-center gap-2 rounded-sm text-[11px] text-[#dde2d2] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d7debc]"><ArrowLeft className="size-3.5" /> Home</Link>
          <div className="mt-12 flex items-end justify-between gap-8 md:mt-20">
            <div className="max-w-3xl">
              <p className="mb-5 flex items-center gap-3 text-[9px] tracking-[0.24em] text-[#c7d2b4]"><span className="h-px w-7 bg-[#b3c19c]" />{eyebrow}</p>
              <h1 className="font-serif text-4xl font-normal leading-[1.1] tracking-[-0.035em] text-[#fffdf2] sm:text-5xl md:text-7xl">{title}</h1>
              <p className="mt-6 max-w-xl text-sm leading-[1.9] text-[#d4dcc8] md:text-base">{description}</p>
            </div>
            <Leaf className="mb-2 hidden size-12 shrink-0 text-[#c7d2b4]/70 sm:block" strokeWidth={0.8} aria-hidden="true" />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-7 md:py-16">{children}</div>
    </main>
  );
}
