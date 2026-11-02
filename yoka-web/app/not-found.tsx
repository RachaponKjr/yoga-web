import Link from "next/link";
import { ArrowRight, Home, Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-[calc(100svh-88px)] items-center overflow-hidden bg-[#f8f7f3] px-5 py-20 text-[#30372c] sm:px-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full border border-[#dfe3d5] sm:size-[34rem]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-52 -left-32 size-96 rounded-full border border-[#dfe3d5] sm:size-[36rem]"
      />

      <div className="relative mx-auto w-full max-w-[900px] text-center">
        <div className="mb-8 flex items-center justify-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-[#788565]">
          <span className="h-px w-9 bg-[#a8b499]" />
          A mindful pause
          <span className="h-px w-9 bg-[#a8b499]" />
        </div>

        <div className="relative mx-auto w-fit">
          <span
            aria-hidden="true"
            className="font-serif text-[clamp(8rem,28vw,19rem)] leading-[0.85] tracking-[-0.09em] text-[#e5e9dd]"
          >
            404
          </span>
          <Leaf
            aria-hidden="true"
            strokeWidth={0.8}
            className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rotate-[-25deg] text-[#849576] sm:size-24"
          />
        </div>

        <h1 className="mt-8 font-serif text-4xl font-normal tracking-[-0.035em] sm:text-5xl md:text-6xl">
          This path has wandered away.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-[1.9] text-[#737b6c] sm:text-base">
          The page you&apos;re looking for may have moved or no longer exists.
          Take a breath, then find your way back to what matters.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#394733] px-7 text-sm text-white transition-colors hover:bg-[#536447] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#687552] sm:w-auto"
          >
            <Home size={16} aria-hidden="true" />
            Back to home
          </Link>
          <Link
            href="/yoga-time"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#cbd2c1] px-7 text-sm text-[#394733] transition-colors hover:bg-[#eef1e8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#687552] sm:w-auto"
          >
            Explore yoga classes
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}
