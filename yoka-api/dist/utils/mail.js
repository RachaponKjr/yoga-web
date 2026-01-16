"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class MailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }
    async sendEmail(to, subject, html, attachments) {
        const mailOptions = {
            from: `"My App" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
            attachments,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("✅ Email sent: %s", info.messageId);
            return { success: true, messageId: info.messageId };
        }
        catch (error) {
            console.error("❌ Error sending email:", error);
            throw error;
        }
    }
}
exports.mailService = new MailService();
