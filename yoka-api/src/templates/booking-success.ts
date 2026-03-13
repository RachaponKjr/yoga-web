import { generateBookingPDF } from "../utils/pdfGenerator";

export interface BookingEmailData {
  customerName: string;
  courseTitle: string;
  roundDate: string; // เช่น "Monday, 20 Jan 2026"
  roundTime: string; // เช่น "09:00 - 10:30 AM"
  location?: string;
  bookingId: string;
  qrCodeUrl?: string; // (Optional) เผื่ออนาคตอยากใส่รูป QR Code
}

export const getBookingSuccessTemplate = async (data: BookingEmailData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; font-family: 'Inter', -apple-system, sans-serif; }
        .header { background-color: #4F46E5; padding: 48px 20px; text-align: center; color: white; }
        .content { padding: 40px; }
        .status-badge { display: inline-block; padding: 6px 12px; background: #ECFDF5; color: #059669; border-radius: 99px; font-size: 14px; font-weight: 600; margin-bottom: 16px; }
        .booking-details { border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid #F3F4F6; padding-bottom: 12px; }
        .detail-row:last-child { border: none; margin: 0; padding: 0; }
        .label { color: #6B7280; font-size: 14px; }
        .value { color: #111827; font-weight: 600; text-align: right; }
        .attachment-notice { display: flex; align-items: center; background: #F9FAFB; padding: 16px; border-radius: 8px; font-size: 14px; color: #4B5563; }
        .btn { display: block; text-align: center; background: #4F46E5; color: #ffffff !important; padding: 16px; border-radius: 8px; text-decoration: none; font-weight: 700; margin-top: 24px; }
      </style>
    </head>
    <body style="background-color: #F3F4F6; padding: 20px;">
      <div class="container">
        <div class="header">
          <div style="font-size: 32px; margin-bottom: 8px;">🧘‍♂️</div>
          <h1 style="margin: 0; font-size: 24px;">Your mat is ready!</h1>
          <p style="opacity: 0.9;">We've confirmed your booking at Yoga by Niti</p>
        </div>
        <div class="content">
          <div class="status-badge">Confirmed Successfully</div>
          <p>Hi ${data.customerName}, your booking is all set. We've attached your <strong>Booking Confirmation PDF</strong> to this email for your records.</p>
          
          <div class="booking-details">
            <div class="detail-row">
              <span class="label">Course</span>
              <span class="value">${data.courseTitle}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date & Time</span>
              <span class="value">${data.roundDate}<br/>${data.roundTime}</span>
            </div>
            <div class="detail-row">
              <span class="label">Booking ID</span>
              <span class="value">#${data.bookingId}</span>
            </div>
          </div>

          <div class="attachment-notice">
            <span>📎 <strong>Note:</strong> Your entry ticket is attached as a PDF. Please have it ready (on phone) when you arrive.</span>
          </div>

          <a href="https://yoka-yoga-studio.com/my-booking" class="btn">Manage My Booking</a>
        </div>
        <div style="text-align: center; padding: 24px; color: #9CA3AF; font-size: 12px;">
          © 2026 Yoga by Niti. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};
