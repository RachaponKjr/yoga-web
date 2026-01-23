import { Icon } from "@iconify/react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  // ข้อมูล Social Media
  const socials = [
    { icon: "mdi:facebook", href: "#" },
    { icon: "mdi:instagram", href: "#" },
    { icon: "mdi:line", href: "#" },
  ];

  // ข้อมูล Link ตาม Navbar
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/instructors", label: "Instructors" },
    { href: "/yoga-time", label: "Yoga Timetable" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <footer className="bg-[#18281E] text-slate-300 rounded-t-[2.5rem] relative overflow-hidden font-sans mt-12">
      {/* Decorative Gradient Top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50"></div>

      <div className="container mx-auto px-6 py-12 md:py-16">
        {/* Grid 4 คอลัมน์สำหรับ Desktop */}
        <div className="flex flex-col md:flex-row justify-between gap-10 lg:gap-2 items-start">
          {/* --- Column 1: Brand & Description --- */}
          <div className="flex flex-col gap-6 max-w-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20 text-white">
                <Icon icon="mdi:lotus" width={28} height={28} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white tracking-tight leading-none">
                  Yoga by Niti
                </span>
                <span className="text-xs text-emerald-400 uppercase tracking-widest font-medium mt-1">
                  Studio & Kitchen
                </span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">
              Your sanctuary for holistic wellness. Join us for expert-led yoga
              sessions and nourish your body with our signature organic clean
              food.
            </p>
          </div>

          {/* --- Column 2: Quick Links (New) --- */}
          <div className="flex flex-row justify-between md:justify-evenly w-full">
            <div>
              <h6 className="text-white font-medium mb-5 text-lg">
                Quick Links
              </h6>
              <ul className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-emerald-400 hover:translate-x-1 transition-all duration-300 inline-flex items-center gap-2 text-sm"
                    >
                      <span className="h-px w-3 bg-emerald-500/50"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* --- Column 3: Contact Info --- */}
            <div>
              <h6 className="text-white font-medium mb-5 text-lg">
                Contact Us
              </h6>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="mdi:map-marker"
                    className="text-emerald-400 mt-1 shrink-0"
                    width={20}
                  />
                  <p className="text-slate-400 text-sm leading-relaxed">
                    39/6 Moo 1 Rawai
                    <br />
                    Maung Phuket 83130
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Icon
                    icon="mdi:phone"
                    className="text-emerald-400 shrink-0"
                    width={20}
                  />
                  <a
                    href="tel:0812345678"
                    className="text-slate-400 text-sm hover:text-white transition-colors"
                  >
                    +66 61 175 4399 | +66 99 449 4951
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Icon
                    icon="mdi:clock-outline"
                    className="text-emerald-400 shrink-0"
                    width={20}
                  />
                  <p className="text-slate-400 text-sm">
                    Call Us (09:00 - 21:00)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Icon
                    icon="ic:outline-email"
                    className="text-emerald-400 shrink-0"
                    width={20}
                  />
                  <p className="text-slate-400 text-sm">
                    Email : Yogabyniti@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- Column 4: Google Map --- */}
          <div className="max-w-md w-full h-full min-h-[200px] lg:h-auto bg-white/5 rounded-2xl overflow-hidden p-2 border border-white/10 relative group">
            <div className="w-full h-full relative rounded-xl overflow-hidden z-10 aspect-video">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.80375258081!2d98.32157788483991!3d7.791349598877547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30502f5295ff53db%3A0xda161d49bc788348!2sYoga%20by%20Niti!5e0!3m2!1sth!2sth!4v1769008361859!5m2!1sth!2sth"
                width="600"
                height="450"
                style={{ border: "0" }}
                loading="lazy"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>

        {/* --- Footer Bottom --- */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Yoga by Niti. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4">
            {socials.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all duration-300 hover:-translate-y-1"
              >
                <Icon icon={social.icon} width={22} height={22} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
