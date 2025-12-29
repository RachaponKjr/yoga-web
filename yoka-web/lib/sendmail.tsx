"use server";

import { Resend } from "resend";
import { EmailTemplate } from "@/components/template/email-template";
import { render } from "@react-email/render"; // 1. เพิ่มบรรทัดนี้

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  const senderName = formData.get("senderName") as string;
  const senderEmail = formData.get("senderEmail") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  try {
    // 2. แปลง React Component เป็น HTML String ก่อน
    const emailHtml = await render(
      <EmailTemplate
        senderName={senderName}
        senderEmail={senderEmail}
        subject={subject}
        message={message}
      />
    );

    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: ["rachapon.dev@gmail.com"],
      replyTo: senderEmail, // ใช้ replyTo (camelCase) ตาม API Doc จะชัวร์สุด
      subject: `New Message: ${subject || "No Subject"}`,
      html: emailHtml, // 3. ส่งเป็น html แทน react
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Server Error:", error);
    return { success: false, error: "Something went wrong" };
  }
}
