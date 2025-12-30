import { Icon } from "@iconify/react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  // ข้อมูลลิ้งก์ต่างๆ (แก้ไขง่ายที่จุดเดียว)
  const links = {
    company: [
      { name: "Home", href: "/" },
      { name: "About Us", href: "/about" },
      { name: "Services", href: "/services" },
      { name: "Careers", href: "/careers" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Contact", href: "/contact" },
    ],
    socials: [
      { icon: "mdi:facebook", href: "#" },
      { icon: "mdi:instagram", href: "#" },
      { icon: "mdi:twitter", href: "#" },
      { icon: "mdi:linkedin", href: "#" },
    ],
  };

  return (
    <footer className="bg-[#18281E] text-slate-300 rounded-t-[2.5rem] relative overflow-hidden font-sans">
      {/* Decorative Element (Optional: แสงจางๆ ด้านหลัง) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50"></div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Column 1: Brand & Description (4 columns wide) */}
          <div className="col-span-2 lg:col-span-4 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
                {/* Logo Placeholder */}
                <Icon icon="mdi:leaf" className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                BrandName
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit
              repudiandae mollitia excepturi adipisci aut iusto tenetur.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-3 mt-2">
              <a
                href="tel:123456789"
                className="flex items-center gap-3 hover:text-emerald-400 transition-colors group"
              >
                <div className="p-2 bg-white/5 rounded-full group-hover:bg-emerald-500/20 transition-colors">
                  <Icon icon="mdi:phone" width={20} />
                </div>
                <span>+66 12 345 6789</span>
              </a>
              <a
                href="mailto:info@example.com"
                className="flex items-center gap-3 hover:text-emerald-400 transition-colors group"
              >
                <div className="p-2 bg-white/5 rounded-full group-hover:bg-emerald-500/20 transition-colors">
                  <Icon icon="mdi:email" width={20} />
                </div>
                <span>info@example.com</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (2 columns wide) */}
          <div className="lg:col-span-2">
            <h6 className="text-white font-semibold text-lg mb-6">Company</h6>
            <ul className="flex flex-col gap-4">
              {links.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-emerald-400 hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support (2 columns wide) */}
          <div className="lg:col-span-2">
            <h6 className="text-white font-semibold text-lg mb-6">Support</h6>
            <ul className="flex flex-col gap-4">
              {links.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-emerald-400 hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter (4 columns wide) */}
          <div className="col-span-2 lg:col-span-4">
            <h6 className="text-white font-semibold text-lg mb-4">
              Stay up to date
            </h6>
            <p className="text-slate-400 mb-6 text-sm">
              Subscribe to our newsletter to get the latest updates and news.
            </p>
            <form className="flex flex-col gap-3">
              <div className="relative">
                <Icon
                  icon="mdi:email-outline"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600 text-white"
                />
              </div>
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-emerald-900/20">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom: Copyright & Socials */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500 text-center md:text-left">
            © {new Date().getFullYear()} Your Company Name. All rights reserved.
          </p>

          <div className="flex gap-4">
            {links.socials.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all duration-300 hover:-translate-y-1"
              >
                <Icon icon={social.icon} width={20} height={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
