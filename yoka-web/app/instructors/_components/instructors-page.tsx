import { imageUrl } from "@/lib/image-url";
import StudioPageLayout from "@/components/layout/studio-page-layout";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { UserInfoType } from "@/types/auth.type";
import instructorBanner from "@/assets/images/banner/lnstructors_banner.png";
import Image from "next/image";
import { Mail, Leaf, Facebook, Instagram, Twitter, ArrowUpRight } from "lucide-react";

type Instructor = { id: string; role: string; email: string; userInfo: UserInfoType };

export default function InstructorsPage({ instructors }: { instructors: Instructor[] }) {
  return (
    <StudioPageLayout image={instructorBanner.src} title="Meet our instructors." eyebrow="THE PEOPLE BEHIND YOUR PRACTICE" description="Dedicated professionals ready to guide your practice with expertise and compassion.">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-4 border-b border-[#dedfd4] pb-6">
        <div><p className="mb-3 text-[9px] tracking-[0.22em] text-[#737b62]">YOUR GUIDES TO BALANCE</p><h2 className="text-xl font-normal text-[#454d39] sm:text-2xl">รู้จักผู้สอนของคุณ</h2></div>
        <p className="text-xs text-[#737b62]">เลือกผู้สอนเพื่ออ่านเรื่องราวและประสบการณ์</p>
      </div>
      <div className="grid w-full grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4 xl:grid-cols-5">
        {instructors.map((instructor) => {
          const name = [instructor.userInfo?.firstName, instructor.userInfo?.lastName].filter(Boolean).join(" ") || "Yoga By Niti";
          const avatar = instructor.userInfo?.avatar;
          const socials = [
            { href: instructor.userInfo?.facebook, label: "Facebook", Icon: Facebook },
            { href: instructor.userInfo?.instagram, label: "Instagram", Icon: Instagram },
            { href: instructor.userInfo?.twitter, label: "Twitter", Icon: Twitter },
          ];
          return (
            <Dialog key={instructor.id}>
              <DialogTrigger asChild>
                <button type="button" aria-label={`ดูประวัติ ${name}`} className="group min-w-0 cursor-pointer rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#788461]">
                  <span className="relative block aspect-3/4 w-full overflow-hidden rounded-md border border-[#dedfd4] bg-[#e9ecdf]">
                    {avatar ? <Image src={imageUrl(avatar)} alt={name} fill sizes="(min-width: 1280px) 220px, (min-width: 768px) 30vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transform-none" /> : <span className="flex h-full items-center justify-center"><Leaf className="size-12 text-[#9aa786]" strokeWidth={1} /></span>}
                    <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full border border-[#f8f7f3]/70 bg-[#faf9f2]/95 text-[#58634a] transition-colors group-hover:bg-[#48533b] group-hover:text-[#fffef5]"><ArrowUpRight className="size-4" strokeWidth={1.5} /></span>
                  </span>
                  <span className="mt-4 block break-words font-serif text-lg font-normal leading-snug text-[#454d39]">{name}</span>
                  <span className="mt-2 block text-[10px] tracking-[0.12em] text-[#737b62]">{instructor.role}</span>
                </button>
              </DialogTrigger>
              <DialogContent aria-describedby={undefined} className="max-h-[90dvh] gap-0 overflow-y-auto rounded-lg border-[#dedfd4] bg-[#fffefa] p-0 text-[#454d39] sm:max-w-4xl [&>button]:z-20 [&>button]:rounded-full [&>button]:bg-[#fffefa] [&>button]:p-2 [&>button]:opacity-100">
                <div className="grid md:grid-cols-5">
                  <div className="relative min-h-64 overflow-hidden bg-[#e9ecdf] md:col-span-2 md:min-h-[520px]">
                    {avatar ? <Image src={imageUrl(avatar)} alt={name} fill sizes="(min-width: 768px) 360px, 90vw" className="object-cover object-top" /> : <div className="absolute inset-0 flex items-center justify-center"><Leaf className="size-16 text-[#9aa786]" strokeWidth={1} /></div>}
                  </div>
                  <div className="min-w-0 p-6 md:col-span-3 md:p-10">
                    <p className="mb-4 text-[9px] tracking-[0.22em] text-[#737b62]">MEET YOUR INSTRUCTOR</p>
                    <DialogTitle className="break-words pr-5 font-serif text-3xl font-normal leading-tight">{name}</DialogTitle>
                    <p className="mt-3 text-xs text-[#7d8867]">{instructor.role}</p>
                    <div className="my-7 h-px bg-[#dedfd4]" />
                    <h3 className="mb-4 text-[10px] tracking-[0.16em] text-[#737b62]">ABOUT & EXPERIENCE</h3>
                    <p className="whitespace-pre-line break-words text-sm leading-[1.9] text-[#73766b]">{instructor.userInfo?.experience || "ยังไม่มีข้อมูลประสบการณ์ของผู้สอน"}</p>
                    <div className="mt-8 border-t border-[#dedfd4] pt-6">
                      <h3 className="mb-4 text-[10px] tracking-[0.16em] text-[#737b62]">CONNECT</h3>
                      {instructor.email && <a href={`mailto:${instructor.email}`} className="inline-flex max-w-full items-center gap-3 text-xs leading-relaxed text-[#58634a] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#788461]"><Mail className="size-4 shrink-0" strokeWidth={1.5} /><span className="break-all">{instructor.email}</span></a>}
                      <div className="mt-5 flex flex-wrap gap-3">{socials.filter((social) => social.href).map(({ href, label, Icon }) => <Button key={label} asChild variant="outline" size="icon" className="rounded-full border-[#d5dcc7] bg-transparent text-[#737f5f] shadow-none hover:bg-[#eef0e5]"><a href={href!} target="_blank" rel="noopener noreferrer" aria-label={`${name} on ${label}`}><Icon className="size-4" strokeWidth={1.5} /></a></Button>)}</div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
      {instructors.length === 0 && <p className="rounded-md border border-[#dedfd4] bg-[#fffefa] px-6 py-16 text-center text-sm text-[#73766b]">ยังไม่มีข้อมูลผู้สอนในขณะนี้</p>}
    </StudioPageLayout>
  );
}
