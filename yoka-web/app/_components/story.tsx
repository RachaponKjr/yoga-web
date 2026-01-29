import { Highlighter } from "@/components/ui/highlighter";
import Image from "next/image";

import avatar from "@/assets/images/avatar/avatar.jpg";

const Story = () => {
  return (
    <section className="relative py-0 md:py-12 overflow-hidden ">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* ส่วนรูปภาพ (Image Section) */}
          <div className="w-full lg:w-1/2 relative">
            {/* กรอบตกแต่งด้านหลังรูป */}
            <div className="absolute inset-0 bg-[#132B28]/5 rounded-4xl translate-x-4 translate-y-4 -z-10" />

            <div className="relative aspect-4/4 w-full rounded-4xl overflow-hidden shadow-2xl">
              {/* ใส่รูปจริงตรงนี้แทน div สีเทา */}
              <div className="w-full h-full bg-neutral-200 relative">
                <Image
                  src={avatar.src}
                  alt="Alison"
                  fill
                  objectPosition="top"
                  className="object-cover"
                />
              </div>
            </div>

            {/* กล่อง Quote ลอยๆ (Optional) */}
            <div className="absolute -bottom-6 right-0 md:-right-6 bg-white p-4 md:p-6 rounded-2xl shadow-xl max-w-xs block">
              <p className="text-[#132B28] text-xs md:text-base font-medium italic font-serif">
                I am Niti, a yoga teacher with over 12 years of experience.
              </p>
            </div>
          </div>

          {/* ส่วนเนื้อหา (Content Section) */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6 text-white">
            <div className="space-y-2">
              <span className="font-semibold tracking-wider uppercase text-sm">
                About Instructor
              </span>
              <h5 className="text-4xl lg:text-5xl font-serif font-bold  flex flex-wrap items-baseline gap-x-3">
                <span>Nitikarn’s</span>
                <Highlighter action="highlight" color="#87CEFA">
                  <span className="text-[#132B28]">Story</span>
                </Highlighter>
              </h5>
            </div>

            <div className="text-sm md:text-base  font-medium leading-relaxed space-y-4 md:space-y-6">
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
            <div className="pt-4 mt-4 border-t border-gray-200">
              <p className="font-serif text-2xl ">Alison Doe</p>
              <p className="text-sm text-[#f2f2f2]">Lead Instructor</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
