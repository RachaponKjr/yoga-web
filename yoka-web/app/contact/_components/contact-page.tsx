"use client";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import leafRight from "@/assets/images/leaf-right.png";
import Image from "next/image";
import { sendEmail } from "@/lib/sendmail";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

const ContactPage = () => {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <div className="min-h-screen w-full bg-[#f8f7f3] flex items-center justify-center py-12 md:py-20 px-5 sm:px-7">
      {/* Container Layout: Mobile=Column, Desktop=Row (ขนานกัน) */}
      <div className="w-full max-w-[1240px] flex flex-col lg:flex-row bg-[#fffefa] rounded-lg border border-[#dedfd4] overflow-hidden relative">
        {/* --- Left Side: Info --- */}
        {/* เปลี่ยนจาก basis-2xl เป็น w-full lg:w-5/12 เพื่อให้สัดส่วนขนานกันพอดีบนจอใหญ่ */}
        <div className="w-full lg:w-6/12 bg-[#303a2b] p-6 sm:p-12 flex flex-col gap-8 z-10 relative">
          <div className="flex flex-col items-start gap-4">
            <p className="text-[9px] tracking-[0.24em] text-[#bdc9a5]">LET’S CONNECT</p>
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl font-serif font-normal tracking-[-0.025em] text-[#fffdf2] leading-tight">
                Get in touch with us
              </h1>
              <p className="pt-4 text-sm text-[#c4cbb9] font-normal leading-[1.9]">
                Whether you&apos;re interested in yoga classes, private
                sessions, or just want to say hello, we&apos;d love to hear from
                you.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Phone */}
            <div className="flex flex-row gap-5 items-start">
              <div className="w-10 h-10 rounded-full border border-[#68765a] flex justify-center items-center shrink-0">
                <Icon icon="mdi:phone" className="text-[#bdc9a5] w-4 h-4" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xs font-normal text-[#f4f3e8]">
                  Call Us (09:00 - 21:00)
                </h3>
                <p className="text-sm font-normal text-[#c4cbb9] leading-7">
                  <a href="tel:+66611754399" className="hover:text-white hover:underline underline-offset-4">+66 61 175 4399</a><br /><a href="tel:+66994494951" className="hover:text-white hover:underline underline-offset-4">+66 99 449 4951</a>
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-row gap-5 items-start">
              <div className="w-10 h-10 rounded-full border border-[#68765a] flex justify-center items-center shrink-0">
                <Icon icon="mdi:email" className="text-[#bdc9a5] w-4 h-4" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xs font-normal text-[#f4f3e8]">Email Us</h3>
                <p className="text-sm font-normal text-[#c4cbb9] break-all">
                  <a href="mailto:Yogabyniti@gmail.com" className="hover:text-white hover:underline underline-offset-4">Yogabyniti@gmail.com</a>
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-row gap-5 items-start">
              <div className="w-10 h-10 rounded-full border border-[#68765a] flex justify-center items-center shrink-0">
                <Icon icon="mdi:map-marker" className="text-[#bdc9a5] w-4 h-4" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xs font-normal text-[#f4f3e8]">Visit Us</h3>
                <p className="text-sm font-normal text-[#c4cbb9] leading-7">
                  39/6 Moo 1, Rawai<br />Mueang Phuket 83130
                </p>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="relative w-full h-48 rounded-sm overflow-hidden border border-[#68765a] mt-auto">
            <iframe
              title="Yoga By Niti studio location in Rawai, Phuket"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.80375258081!2d98.32157788483991!3d7.791349598877547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30502f5295ff53db%3A0xda161d49bc788348!2sYoga%20by%20Niti!5e0!3m2!1sth!2sth!4v1769008361859!5m2!1sth!2sth"
              width="600"
              height="450"
              style={{ border: "0" }}
              loading="lazy"
              className="w-full h-full saturate-50 hover:saturate-100 transition-[filter]"
            ></iframe>
          </div>
        </div>

        {/* --- Right Side: Form --- */}
        <div className="w-full lg:w-6/12 bg-[#fffefa] flex items-center relative p-6 sm:p-12">
          <Image
            src={leafRight}
            alt=""
            className="absolute bottom-0 right-0 z-0 opacity-[0.08] pointer-events-none hidden xl:block"
            width={500}
            height={500}
          />

          <div className="max-w-xl mx-auto w-full z-10">
            <div className="mb-10 flex flex-col gap-3 text-center md:text-left">
              <p className="text-[9px] tracking-[0.22em] text-[#737b62]">WE’RE HERE TO HELP</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#30372c] tracking-[-0.025em]">
                Send a Message
              </h2>
              <p className="text-[#73766b] text-sm leading-relaxed">
                Feel free to ask about our schedules or pricing.
              </p>
            </div>

            <form
              action={async (formData) => {
                // Client-side validation เพิ่มเติม (เผื่อไว้)
                const name = formData.get("senderName");
                const email = formData.get("senderEmail");
                const message = formData.get("message");
                const subject = formData.get("subject");

                if (!name || !email || !message || !subject) {
                  toast.error("Please fill in all required fields", {
                    className: "bg-red-500 text-white border-none",
                  });
                  return;
                }

                try {
                const result = await sendEmail(formData);

                if (result.success) {
                  toast.success("Message sent successfully!", {
                    duration: 5000,
                    className: "bg-[#132b28] text-white border-none",
                  });
                  ref.current?.reset();
                } else {
                  toast.error("Failed to send message. Please try again.", {
                    duration: 5000,
                    className: "bg-red-600 text-white border-none",
                  });
                }
                } catch {
                  toast.error("Failed to send message. Please try again.");
                }
              }}
              ref={ref}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="senderName" className="text-xs font-medium text-[#58634a]">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    id="senderName"
                    required
                    autoComplete="name"
                    name="senderName"
                    placeholder="John Doe"
                    className="h-12 rounded-sm! border! border-[#d5dcc7] bg-[#fafbf6]! px-4 text-sm focus:border-[#788461] focus:ring-2 focus:ring-[#788461]/15 shadow-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="senderEmail" className="text-xs font-medium text-[#58634a]">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    id="senderEmail"
                    required
                    autoComplete="email"
                    name="senderEmail"
                    placeholder="john@example.com"
                    className="h-12 rounded-sm! border! border-[#d5dcc7] bg-[#fafbf6]! px-4 text-sm focus:border-[#788461] focus:ring-2 focus:ring-[#788461]/15 shadow-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-xs font-medium text-[#58634a]">
                  Subject
                </label>
                <Input
                  type="text"
                  id="subject"
                    required
                    name="subject"
                  placeholder="Class Inquiry / Private Session"
                  className="h-12 rounded-sm! border! border-[#d5dcc7] bg-[#fafbf6]! px-4 text-sm focus:border-[#788461] focus:ring-2 focus:ring-[#788461]/15 shadow-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs font-medium text-[#58634a]">
                  Message
                </label>
                <Textarea
                  id="message"
                    required
                    name="message"
                  placeholder="How can we help you today?"
                  className="min-h-[160px] rounded-sm border border-[#d5dcc7] bg-[#fafbf6] p-4 text-sm focus-visible:border-[#788461] focus-visible:ring-[#788461]/20 shadow-none resize-y"
                />
              </div>

              <ContactSubmitButton />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

function ContactSubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending} className="mt-2 h-12 w-full rounded-sm bg-[#48533b] text-sm font-normal text-[#fffef5] shadow-none hover:bg-[#303c26]">
    {pending ? "Sending message…" : "Send Message"}
    <Icon icon="ph:arrow-up-right" className="ml-2 size-4" />
  </Button>;
}

export default ContactPage;
