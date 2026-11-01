import Image from "next/image";

import avatar from "@/assets/images/avatar/avatar.jpg";

const Story = () => {
  return (
    <section className="relative py-0 md:pb-12 overflow-hidden ">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* ส่วนรูปภาพ (Image Section) */}
          <div className="w-full lg:w-1/2 relative">
            {/* กรอบตกแต่งด้านหลังรูป */}
            <div className="absolute inset-0 border border-[#748062]/30 rounded-lg translate-x-4 translate-y-4 -z-10" />

            <div className="relative aspect-4/4 w-full rounded-lg overflow-hidden">
              {/* ใส่รูปจริงตรงนี้แทน div สีเทา */}
              <div className="w-full h-full bg-neutral-200 relative">
                <Image
                  src={avatar.src}
                  alt="Nitikarn, yoga instructor at Yoga By Niti"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>

            {/* กล่อง Quote ลอยๆ (Optional) */}
            <div className="absolute -bottom-6 right-0 md:-right-6 bg-[#faf9f2] p-4 md:p-6 rounded-sm border border-[#dedfd4] shadow-sm max-w-xs block">
              <p className="text-[#58634a] text-xs md:text-base font-normal italic font-serif leading-relaxed">
                I am Niti, a yoga teacher with over 12 years of experience.
              </p>
            </div>
          </div>

          {/* ส่วนเนื้อหา (Content Section) */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6 text-[#f4f3e8]">
            <div className="space-y-2">
              <span className="font-normal tracking-[0.22em] uppercase text-[10px] text-[#b6c19e]">
                About Instructor
              </span>
              <h5 className="text-4xl lg:text-5xl font-serif font-normal tracking-[-0.025em] flex flex-wrap items-baseline gap-x-3">
                <span>Nitikarn’s</span>
                <span className="italic text-[#bdc9a5]">Story</span>
              </h5>
            </div>

            <div className="text-sm md:text-base font-normal leading-[1.9] text-[#c4cbb9] space-y-4 md:space-y-6">
              <p>
                Yoga, for me, is a path of presence, love, and inner balance. It
                is not about perfect poses or strong bodies, but about gently
                connecting the body, breath, and mind — and allowing life to
                feel lighter and more peaceful.
              </p>
              <p>
                My intention is to create a safe and welcoming space, especially
                for those who come to yoga for the first time. Even one class
                can be the beginning of awareness, curiosity, and self-care.
              </p>
              <p>
                Each practice I guide is offered with loving kindness, shaped by
                real experience and a deep respect for every individual’s
                journey. Yoga begins on the mat, but its true practice continues
                in everyday life.
              </p>
            </div>

            {/* Signature (Optional) */}
            <div className="pt-4 mt-4 border-t border-[#647054]">
              <p className="font-serif text-2xl ">Nitikarn</p>
              <p className="mt-2 text-[10px] tracking-[0.14em] uppercase text-[#b6c19e]">Lead Instructor</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
