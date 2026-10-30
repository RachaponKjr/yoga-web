import nodemailer, { Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

class MailService {
  private transporter: Transporter;
  private mailUser: string;

  constructor() {
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASS?.replace(/\s+/g, "");

    if (!user || !pass) {
      throw new Error("Missing MAIL_USER or MAIL_PASS");
    }

    this.mailUser = user;

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    attachments?: Mail.Attachment[],
  ) {
    const mailOptions: Mail.Options = {
      from: `"Yoka by Niti" <${this.mailUser}>`,
      to,
      subject,
      html,
      attachments,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("✅ Email sent: %s", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Error sending email:", error);
      throw error;
    }
  }
}

export const mailService = new MailService();
