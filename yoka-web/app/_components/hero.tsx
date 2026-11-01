import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowRight, Leaf } from "lucide-react";
import HeroVideo from "./hero-video";
import yogaBanner from "@/assets/images/CC__2175.jpg";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex py-12 md:py-0  md:min-h-[calc(100svh-88px)] w-full flex-col overflow-hidden bg-white text-[#30372c]"
    >
      <HeroVideo poster={yogaBanner.src} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-white/80 via-white/60 to-white/20 md:from-white/95 md:via-white/60 md:to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-white/80 to-transparent"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1320px] grow items-center px-6 py-14 sm:px-10 lg:px-12 lg:py-20">
        <div className="w-full max-w-2xl">
          <p className="mb-8 flex items-center gap-3 text-[9px] font-medium tracking-[0.24em] text-[#58634a] sm:mb-10 sm:text-[10px]">
            <span className="h-px w-9 bg-[#8c9778]" /> YOGA BY NITI{" "}
            <span className="text-[#8c9778]">/</span> RAWAI, PHUKET
          </p>
          <h1
            id="hero-heading"
            className="font-serif text-[clamp(3.5rem,7.8vw,7.5rem)] font-normal leading-[0.98] tracking-[-0.05em]"
          >
            Make space
            <br />
            <span className="italic text-[#647153]">for yourself.</span>
          </h1>
          <p className="mt-7 max-w-[360px] text-sm leading-[1.9] text-[#58634a] sm:mt-8 sm:max-w-[400px] sm:text-base">
            Mindful movement. Wholesome food. A welcoming space to slow down,
            reconnect, and find your own balance.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-5">
            <Button
              asChild
              size="lg"
              className="h-13 gap-8 rounded-sm bg-[#48533b] px-6 text-xs font-normal tracking-wide text-[#fffef5] shadow-none hover:bg-[#303c26] sm:px-7"
            >
              <Link href="/yoga-time">
                Find your class{" "}
                <ArrowUpRight className="size-4" strokeWidth={1.5} />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-13 gap-5 rounded-sm border-[#aab69a]/70 bg-white/55 px-6 text-xs font-normal tracking-wide text-[#48533b] shadow-none hover:bg-white sm:px-7"
            >
              <Link href="/signup">
                Join the studio{" "}
                <ArrowRight className="size-3.5" strokeWidth={1.5} />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-6 pb-6 sm:px-10 sm:pb-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-t border-[#738061]/25 pt-5 text-[#58634a]">
          <div className="flex items-center gap-3">
            <Leaf className="size-5" strokeWidth={1} aria-hidden="true" />
            <span className="font-serif text-lg italic">
              A little more balance.
            </span>
          </div>
          <div className="hidden md:flex flex-wrap gap-x-6 gap-y-2 text-[9px] tracking-[0.13em] sm:gap-x-10">
            <span>
              01 <span className="ml-2">MOVE MINDFULLY</span>
            </span>
            <span>
              02 <span className="ml-2">EAT WELL</span>
            </span>
            <span>
              03 <span className="ml-2">FEEL CONNECTED</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
