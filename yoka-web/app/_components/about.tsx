import Image from "next/image";
import React from "react";

import banner from "@/assets/images/about/CC__2447.jpg";
import banner2 from "@/assets/images/about/CC__2084.jpg";
import banner3 from "@/assets/images/about/CC__2341.jpg";

const About = () => {
  // ข้อมูลสำหรับ Grid 3 อัน (แก้ไขรูปและข้อความตรงนี้ได้เลย)
  const items = [
    {
      id: 1,
      title: "Find Balance & Inner Peace.",
      description:
        "In a world overflowing with stress and unrest, we offer a refuge where you can nourish your mind, body, and spirit, allowing you to find equilibrium and the freedom to be your most authentic self. Our suite of wellness services, including Hypnotherapy, Yoga, Psychology, and Remedial Massage, are carefully tailored to meet your unique needs and aspirations.",
      image: banner.src,
      style: "left",
    },
    {
      id: 2,
      title: "Empowering your Present.",
      description:
        "Our approach centres on nurturing your mindfulness practice, emphasising living in the present and focusing on what lies within your control. We go beyond traditional wellness services by equipping you with the skills, tools, and knowledge needed to foster positive changes and sustainable wellbeing in your life.",
      image: banner2.src,
      style: "top-[20%]",
    },
    {
      id: 3,
      title: "Building Community.",
      description:
        "At Alasana®, we believe in the transformative power of community, empathy, and support. We are committed to fostering a nurturing and inclusive space where like-minded individuals can come together to share, learn, and grow. Here, you can forge meaningful connections and receive the encouragement and understanding needed to navigate your wellbeing journey.",
      image: banner3.src,
    },
  ];

  return (
    <section className="py-4">
      <div className="container mx-auto px-6 md:px-12 space-y-2">
        {/* หัวข้อหลัก (Optional) */}
        <div className="mb-6 text-center flex flex-col gap-4">
          <h2 className="text-4xl md:text-6xl font-serif font-medium leading-none text-[#132B28]">
            About Niti Studio
          </h2>
          <span className="text-xl text-primary/80">Yoka Wellness</span>
        </div>

        {/* Grid 3 Columns */}
        <div className="grid gap-16 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="group flex flex-col items-start">
              {/* Image Container with subtle hover effect */}
              <div className="mb-6 w-full aspect-16/14 overflow-hidden rounded-lg relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  quality={100}
                  fill
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ objectPosition: item.style }}
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>

              {/* Text Content */}
              <h3 className="text-xl font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-gray-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
