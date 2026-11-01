import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Leaf,
  Instagram,
  Facebook,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Home" },
  { href: "/instructors", label: "Our instructors" },
  { href: "/yoga-time", label: "Yoga timetable" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "Our story" },
  { href: "/contact", label: "Contact us" },
];
const linkStyle =
  "transition-colors hover:text-[#fffdf2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d7debc]";

export default function Footer() {
  return (
    <footer className="bg-[#303a2b] px-5 text-[#bdc5b1] sm:px-7 [&_a]:focus-visible:rounded-sm">
      <div className="mx-auto max-w-[1240px]">
        {/* <div className="flex flex-col justify-between gap-8 border-b border-[#56614a] py-12 sm:py-16 md:flex-row md:items-center">
          <div>
            <p className="mb-5 flex items-center gap-3 text-[9px] tracking-[0.25em] text-[#b7c29e]"><Leaf className="size-4" strokeWidth={1} /> MAKE SPACE FOR YOURSELF</p>
            <h2 className="font-serif text-4xl leading-[1.2] tracking-[-0.025em] text-[#f5f3e8] sm:text-5xl">A little pause.<br /><span className="italic text-[#bdc9a5]">A new beginning.</span></h2>
            <p className="mt-5 text-xs leading-7 text-[#b5bfaa] sm:text-sm">ให้การดูแลตัวเอง เริ่มต้นจากช่วงเวลาเล็ก ๆ ในทุกวัน</p>
          </div>
          <Button asChild variant="outline" className="h-12 w-fit gap-10 rounded-sm border-[#a0ad8d] bg-transparent px-6 text-xs font-normal tracking-wide text-[#f5f3e8] shadow-none hover:border-[#f5f3e8] hover:bg-[#f5f3e8] hover:text-[#303a2b]"><Link href="/yoga-time">Find your next class <ArrowRight className="size-4" strokeWidth={1.5} /></Link></Button>
        </div> */}

        <div className="grid gap-x-10 gap-y-12 py-12 sm:grid-cols-2 lg:grid-cols-[1.15fr_.65fr_1fr_1fr] lg:py-14">
          <div>
            <Link
              href="/"
              aria-label="Yoga By Niti home"
              className="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d7debc]"
            >
              <Image
                src="/tlogo.png"
                alt="Yoga By Niti"
                width={150}
                height={140}
                className="scale-125 object-contain"
              />
            </Link>
            <p className="mt-6 max-w-[270px] text-xs leading-7 text-[#b5bfaa]">
              A space for movement and balance
              <br />
              Mindful yoga and thoughtfully prepared food
              <br />
              at Yoga By Niti, Phuket
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                asChild
                variant="outline"
                size="icon"
                className="size-10 rounded-full border-[#657158] bg-transparent text-[#d1d9c3] shadow-none hover:bg-[#e6eadb] hover:text-[#303a2b]"
              >
                <a
                  href="https://www.facebook.com/yogabyniti"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Yoga By Niti on Facebook"
                >
                  <Facebook className="size-4" strokeWidth={1.5} />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="icon"
                className="size-10 rounded-full border-[#657158] bg-transparent text-[#d1d9c3] shadow-none hover:bg-[#e6eadb] hover:text-[#303a2b]"
              >
                <a
                  href="https://www.instagram.com/yoga_by_niti/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Yoga By Niti on Instagram"
                >
                  <Instagram className="size-4" strokeWidth={1.5} />
                </a>
              </Button>
            </div>
          </div>
          <nav aria-label="Footer navigation">
            <h3 className="mb-6 text-[9px] tracking-[0.22em] text-[#e0e5d4]">
              EXPLORE
            </h3>
            <ul className="space-y-4">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`inline-block py-0.5 text-xs ${linkStyle}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h3 className="mb-6 text-[9px] tracking-[0.22em] text-[#e0e5d4]">
              GET IN TOUCH
            </h3>
            <address className="space-y-5 text-xs leading-7 not-italic">
              <p>
                39/6 Moo 1, Rawai
                <br />
                Mueang Phuket 83130
              </p>
              <div>
                <a
                  href="tel:+66611754399"
                  className={`block w-fit ${linkStyle}`}
                >
                  +66 61 175 4399
                </a>
                <a
                  href="tel:+66994494951"
                  className={`block w-fit ${linkStyle}`}
                >
                  +66 99 449 4951
                </a>
                <p className="mt-1 text-[10px] text-[#a7b39b]">
                  Call us · 09:00 – 21:00
                </p>
              </div>
              <a
                href="mailto:Yogabyniti@gmail.com"
                className={`inline-block break-all ${linkStyle}`}
              >
                Yogabyniti@gmail.com
              </a>
            </address>
          </div>
          <div>
            <h3 className="mb-6 text-[9px] tracking-[0.22em] text-[#e0e5d4]">
              OUR LITTLE SANCTUARY
            </h3>
            <div className="overflow-hidden rounded-sm border border-[#657158] bg-[#e5e8db]">
              <iframe
                title="Yoga By Niti studio location in Rawai, Phuket"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.80375258081!2d98.32157788483991!3d7.791349598877547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30502f5295ff53db%3A0xda161d49bc788348!2sYoga%20by%20Niti!5e0!3m2!1sth!2sth!4v1769008361859!5m2!1sth!2sth"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[180px] w-full border-0 opacity-85 saturate-50 transition-[filter,opacity] hover:opacity-100 hover:saturate-100 motion-reduce:transition-none"
              />
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Yoga+by+Niti+Rawai+Phuket"
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 flex items-center gap-2 text-[11px] ${linkStyle}`}
            >
              <MapPin className="size-3.5" strokeWidth={1.5} /> Rawai, Phuket{" "}
              <ArrowUpRight className="ml-auto size-4" strokeWidth={1.5} />
              <span className="sr-only">Open directions in Google Maps</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-5 border-t border-[#56614a] py-7 text-[10px] leading-6 text-[#aab59c] md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Yoga By Niti. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/policy" className={linkStyle}>
              Privacy Policy
            </Link>
            <Link href="/refund" className={linkStyle}>
              Refund Policy
            </Link>
          </div>
          <p>
            Crafted by{" "}
            <a
              href="https://nocturadigital.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`ml-1 underline decoration-[#79876a] underline-offset-4 ${linkStyle}`}
            >
              Noctura Digital Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
