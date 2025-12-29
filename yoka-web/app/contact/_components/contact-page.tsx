"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import leafRight from "@/assets/images/leaf-right.png";
import Image from "next/image";
import { sendEmail } from "@/lib/sendmail";
import { useRef } from "react";
import { toast } from "sonner";

const ContactPage = () => {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <div className="min-h-screen w-full flex items-center justify-center my-24 md:my-6 px-4 sm:px-6">
      {/* Container Layout: Mobile=Column, Desktop=Row (ขนานกัน) */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row bg-white rounded-[20px] md:rounded-[40px] overflow-hidden shadow-2xl relative">
        {/* --- Left Side: Info --- */}
        {/* เปลี่ยนจาก basis-2xl เป็น w-full lg:w-5/12 เพื่อให้สัดส่วนขนานกันพอดีบนจอใหญ่ */}
        <div className="w-full lg:w-6/12 bg-[#132b28] p-6 sm:p-14 flex flex-col gap-4 z-10 relative">
          <div className="flex flex-col items-start gap-4">
            <Badge className="px-4 py-1 text-sm bg-white/10 text-white hover:bg-white/20 border-none rounded-full backdrop-blur-md">
              Contact Us
            </Badge>
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Get in touch with us
              </h2>
              <p className="text-base text-[#F5F1ED]/80 font-light leading-relaxed">
                Whether you&apos;re interested in yoga classes, private
                sessions, or just want to say hello, we&apos;d love to hear from
                you.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Phone */}
            <div className="flex flex-row gap-5 items-start">
              <div className="w-12 h-12 rounded-full bg-white/10 flex justify-center items-center shadow-sm backdrop-blur-sm shrink-0">
                <Icon icon="mdi:phone" className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-medium text-white/90">
                  Call Us (09:00 - 21:00)
                </h3>
                <p className="text-base font-semibold text-[#F5F1ED]/80 hover:text-[#FFFFFF] tracking-wide">
                  +66 61 175 4399 <br /> +66 99 449 4951
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-row gap-5 items-start">
              <div className="w-12 h-12 rounded-full bg-white/10 flex justify-center items-center shadow-sm backdrop-blur-sm shrink-0">
                <Icon icon="mdi:email" className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-medium text-white/90">Email Us</h3>
                <p className="text-base font-semibold text-[#F5F1ED]/80 hover:text-[#FFFFFF] break-all">
                  Yogabyniti@gmail.com
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-row gap-5 items-start">
              <div className="w-12 h-12 rounded-full bg-white/10 flex justify-center items-center shadow-sm backdrop-blur-sm shrink-0">
                <Icon icon="mdi:map-marker" className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-medium text-white/90">Visit Us</h3>
                <p className="text-base font-semibold text-[#F5F1ED]/80 hover:text-[#FFFFFF] leading-snug">
                  39/6 Moo 1 Rawai
                  {/* <br /> */}
                  Maung Phuket 83130
                </p>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg mt-auto">
            <iframe
              src="https://maps.google.com/maps?q=Rawai%20Phuket&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>

        {/* --- Right Side: Form --- */}
        <div className="w-full lg:w-7/12 bg-white flex items-center relative p-6 sm:p-14">
          <Image
            src={leafRight}
            alt="leaf-right"
            className="absolute bottom-0 right-0 z-0 opacity-40 pointer-events-none hidden xl:block"
            width={500}
            height={500}
          />

          <div className="max-w-xl mx-auto w-full z-10">
            <div className="mb-10 flex flex-col gap-3 text-center md:text-left">
              <h6 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] tracking-tight">
                Send a Message
              </h6>
              <p className="text-[#666666] text-lg">
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
              }}
              ref={ref}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    name="senderName"
                    placeholder="John Doe"
                    className="h-12 rounded-2xl border-2 border-gray-100 bg-gray-50 px-4 focus:bg-white focus:border-[#132b28] transition-all shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    name="senderEmail"
                    placeholder="john@example.com"
                    className="h-12 rounded-2xl border-2 border-gray-100 bg-gray-50 px-4 focus:bg-white focus:border-[#132b28] transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Subject
                </label>
                <Input
                  type="text"
                  name="subject"
                  placeholder="Class Inquiry / Private Session"
                  className="h-12 rounded-2xl border-2 border-gray-100 bg-gray-50 px-4 focus:bg-white focus:border-[#132b28] transition-all shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Message
                </label>
                <Textarea
                  name="message"
                  placeholder="How can we help you today?"
                  className="min-h-[160px] rounded-2xl border-2 border-gray-100 bg-gray-50 p-4 focus:bg-white focus:border-[#132b28] transition-all shadow-sm resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 cursor-pointer rounded-full bg-[#132b28] hover:bg-[#0f2220] text-white text-lg font-bold transition-all shadow-lg hover:shadow-xl active:scale-[0.98] mt-2"
              >
                Send Message
                <Icon
                  icon="ph:paper-plane-tilt-bold"
                  className="ml-2 w-5 h-5"
                />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
