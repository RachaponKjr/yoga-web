import nodemailer, { Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kjrrachapon@gmail.com",
        pass: "mlyg acjw uoyb ikbp",
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    attachments?: Mail.Attachment[],
  ) {
    const mailOptions: Mail.Options = {
      from: `"Yoka by Niti" <${process.env.MAIL_USER}>`,
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
