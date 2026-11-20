"use server";

import { Resend } from "resend";
import { EmailTemplate } from "@/components/template/email-template";
import { render } from "@react-email/render";
import { z } from "zod";

const contactSchema = z.object({
  senderName: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[^\r\n]+$/),
  senderEmail: z.string().trim().email().max(254),
  subject: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[^\r\n]+$/),
  message: z.string().trim().min(1).max(5000),
});

export async function sendEmail(formData: FormData) {
  const parsed = contactSchema.safeParse({
    senderName: formData.get("senderName"),
    senderEmail: formData.get("senderEmail"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error:
        "Please enter a valid name, email, subject and message (up to 5,000 characters).",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_EMAIL_FROM;
  const to = process.env.CONTACT_EMAIL_TO || "Yogabyniti@gmail.com";

  if (!apiKey || !from) {
    console.error(
      "Contact email requires RESEND_API_KEY and CONTACT_EMAIL_FROM.",
    );
    return {
      success: false,
      error:
        "Email is temporarily unavailable. Please contact us at Yogabyniti@gmail.com.",
    };
  }

  const { senderName, senderEmail, subject, message } = parsed.data;

  try {
    const resend = new Resend(apiKey);
    const emailHtml = await render(<EmailTemplate {...parsed.data} />);
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: senderEmail,
      subject: `Website inquiry: ${subject}`,
      html: emailHtml,
      text: `Name: ${senderName}\nEmail: ${senderEmail}\nSubject: ${subject}\n\n${message}`,
    });

    if (error || !data?.id) {
      console.error(
        "Contact email delivery failed:",
        error?.name || "Missing message ID",
      );
      return {
        success: false,
        error:
          "Failed to send message. Please try again or email Yogabyniti@gmail.com.",
      };
    }

    return { success: true };
  } catch {
    console.error("Contact email request failed.");
    return {
      success: false,
      error:
        "Failed to send message. Please try again or email Yogabyniti@gmail.com.",
    };
  }
}
