import { Button } from "@/components/ui/button";
import { ArrowUpRight, Leaf } from "lucide-react";
import HeroVideo from "./hero-video";
import yogaBanner from "@/assets/images/CC__2175.jpg";
import Link from "next/link";

export default function Hero() {
  return (
    <div>
      <section
        aria-labelledby="hero-heading"
        className="relative isolate flex min-h-[calc(100svh-88px)] w-full items-center overflow-hidden bg-white text-[#30372c]"
      >
        <HeroVideo poster={yogaBanner.src} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-white/70 via-white/50 to-white/15"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 py-16 sm:px-7 lg:py-24">
          <div className="max-w-xl">
            <p className="mb-6 flex items-center gap-3 text-[9px] tracking-[0.24em] text-[#58634a]">
              <span className="h-px w-8 bg-[#8c9778]" /> YOGA STUDIO & WHOLESOME
              KITCHEN
            </p>
            <h1
              id="hero-heading"
              className="font-serif text-[clamp(3.5rem,7vw,6.5rem)] font-normal leading-[1.02] tracking-[-0.045em]"
            >
              Yoga by Niti<span className="text-[#788461]">.</span>
            </h1>
            <p className="mt-5 font-serif text-2xl italic leading-relaxed text-[#58634a] sm:text-3xl">
              A little more balance.
            </p>
            <p className="mt-6 max-w-md text-sm leading-[1.9] text-[#58634a] md:text-base">
              Experience a complete wellness journey. Join Niti for expert-led
              yoga sessions and nourish your body afterwards with our signature
              clean food, crafted for your health.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 gap-5 rounded-sm bg-[#48533b] px-6 text-sm font-normal text-[#fffef5] shadow-none hover:bg-[#303c26]"
              >
                <Link href="/yoga-time">
                  Book a class{" "}
                  <ArrowUpRight className="size-4" strokeWidth={1.5} />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-sm border-[#aab69a] bg-white/70 px-6 text-sm font-normal text-[#48533b] shadow-none hover:bg-white hover:text-[#30372c]"
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-3 border-t border-[#aab69a]/50 pt-5 text-[10px] tracking-[0.1em] text-[#58634a]">
              <Leaf
                className="size-4 shrink-0"
                strokeWidth={1.2}
                aria-hidden="true"
              />
              <span>MINDFUL MOVEMENT · NOURISHING FOOD · RAWAI, PHUKET</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
