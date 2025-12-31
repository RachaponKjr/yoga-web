import { Highlighter } from "@/components/ui/highlighter";
import React from "react";
import leafbottom from "@/assets/images/leaf-bottom-2.png";
import Image from "next/image";

const Story = () => {
  return (
    <section className="relative pt-12 pb-24 overflow-hidden">
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
                  src="https://images.unsplash.com/photo-1544367563-12123d8966cd?q=80&w=2070&auto=format&fit=crop"
                  alt="Alison"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* กล่อง Quote ลอยๆ (Optional) */}
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs hidden md:block">
              <p className="text-[#132B28] font-medium italic font-serif">
                &quot;Yoga is not just a workout, it&apos;s about working on
                yourself.&quot;
              </p>
            </div>
          </div>

          {/* ส่วนเนื้อหา (Content Section) */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="space-y-2">
              <span className="text-primary font-semibold tracking-wider uppercase text-sm">
                About Instructor
              </span>
              <h5 className="text-4xl lg:text-5xl font-serif font-bold text-[#132B28] flex flex-wrap items-baseline gap-x-3">
                <span>Alison’s</span>
                <Highlighter action="highlight" color="#87CEFA">
                  Story
                </Highlighter>
              </h5>
            </div>

            <div className="text-lg text-[#5C6155] font-medium leading-relaxed space-y-6">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit
                autem aperiam iure provident quisquam, voluptatum nostrum,
                facilis reprehenderit repellendus harum vel quibusdam molestias
                nihil possimus! Temporibus commodi illum deleniti!
              </p>
              <p>
                Aspernatur deleniti corrupti necessitatibus doloribus vero culpa
                dolore beatae molestiae repudiandae sequi. Deserunt debitis
                deleniti pariatur quaerat consectetur laboriosam. Exercitationem
                consectetur fuga corporis officiis illo non cum ducimus natus
                necessitatibus.
              </p>
              <p>
                Ipsa, debitis ipsam aspernatur nostrum aliquam est laboriosam
                dicta ad sunt, exercitationem eaque cupiditate?
              </p>
            </div>

            {/* Signature (Optional) */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <p className="font-serif text-2xl text-[#132B28]">Alison Doe</p>
              <p className="text-sm text-gray-500">Lead Instructor</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
