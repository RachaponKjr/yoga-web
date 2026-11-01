"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Two portraits on each outer column frame the four single portraits in the middle.
const columns = [
  { offset: 40, count: 2 },
  { offset: 0, count: 2 },
  { offset: 36, count: 1 },
  { offset: 8, count: 1 },
  { offset: 8, count: 1 },
  { offset: 36, count: 1 },
  { offset: 0, count: 2 },
  { offset: 40, count: 2 },
];

export default function BookingBanner() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const section = sectionRef.current;
        if (!section) return;
        const cards = section.querySelectorAll<HTMLElement>(
          "[data-banner-column]",
        );
        const content = section.querySelectorAll<HTMLElement>(
          "[data-banner-content]",
        );

        gsap.from(content, {
          y: 22,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 80%", once: true },
        });

        const float = gsap.to(cards, {
          y: (index) => (index % 2 === 0 ? -12 : 12),
          duration: 3.5,
          stagger: { each: 0.18, from: "center" },
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          paused: true,
        });
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          onToggle: ({ isActive }) => {
            if (isActive) float.play();
            else float.pause();
          },
        });
      });
      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="booking-banner-heading"
      className="w-full bg-[#f8f7f3]"
    >
      <div className="container relative isolate mx-auto w-full px-4 pb-16 pt-0 md:px-6 md:pb-24 md:pt-12">
        <div
          aria-hidden="true"
          className="pointer-events-none relative w-full pb-12"
        >
          <div className="hidden md:grid w-full grid-cols-4 items-start gap-x-3 gap-y-14 sm:gap-x-4 md:grid-cols-8 lg:gap-x-5">
            {columns.map(({ offset, count }, index) => (
              <div
                key={index}
                data-banner-column
                className="relative flex min-w-0 flex-col gap-3 sm:gap-4"
                style={{ top: offset }}
              >
                {Array.from({ length: count }, (_, cardIndex) => (
                  <div
                    key={cardIndex}
                    className={`aspect-[9/12] w-full rounded-lg border border-[#e1e4dc] bg-linear-to-br ${cardIndex === 0 ? "from-[#eceee8] to-[#dfe3d9]" : "from-[#e3e7df] to-[#edf0e9]"}`}
                  />
                ))}
                <div className="mx-auto h-8 w-px bg-linear-to-b from-[#cdd5c1]/60 to-transparent" />
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-0 flex w-full max-w-2xl md:-mt-[20%] md:max-w-[48%] flex-col items-center text-center">
          <p
            data-banner-content
            className="mb-5 rounded-full border border-[#e3e7d9] bg-[#f5f6ef] px-4 py-1.5 text-[9px] tracking-[0.18em] text-[#737b62]"
          >
            YOUR NEXT CHAPTER
          </p>
          <h2
            id="booking-banner-heading"
            data-banner-content
            className="font-serif text-4xl font-normal leading-[1.12] tracking-[-0.035em] text-[#30372c] sm:text-5xl md:text-3xl lg:text-4xl xl:text-5xl"
          >
            A little time for you.
            <br />
            <span className="italic text-[#899479]">
              A beautiful place to begin.
            </span>
          </h2>
          <p
            data-banner-content
            className="mt-5 max-w-sm text-sm leading-[1.9] text-[#73766b] sm:mt-6"
          >
            Find your class, take a breath, and join us on the mat. Your next
            moment of balance starts here.
          </p>
          <div data-banner-content className="mt-7 sm:mt-8">
            <Button
              asChild
              size="lg"
              className="h-12 gap-6 rounded-full bg-[#48533b] px-7 text-xs font-normal text-[#fffef5] shadow-none hover:bg-[#303c26]"
            >
              <Link href="/yoga-time">
                Book your next class{" "}
                <ArrowUpRight className="size-4" strokeWidth={1.5} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
