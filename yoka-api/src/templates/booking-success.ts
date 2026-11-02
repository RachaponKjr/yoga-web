export interface BookingEmailData {
  customerName: string;
  courseTitle: string;
  roundDate: string;
  roundTime: string;
  bookingId: string;
  quantity: number;
  totalAmount: number;
  contactEmail: string;
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]!,
  );

export const getBookingSuccessTemplate = (data: BookingEmailData): string => {
  const rows: Array<[string, string]> = [
    ["Course", data.courseTitle],
    ["Date", data.roundDate],
    ["Time", data.roundTime],
    ["Seats", String(data.quantity)],
    ["Amount paid", `฿${data.totalAmount.toLocaleString("en-US")}`],
    ["Booking ID", data.bookingId],
  ];

  return `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
  <body style="margin:0;background:#f8f7f3;color:#30372c;font-family:Arial,sans-serif;padding:24px">
    <main style="max-width:600px;margin:auto;background:#fffefa;border:1px solid #dedfd4;padding:32px">
      <p style="color:#737b62;font-size:12px;letter-spacing:2px">YOGA BY NITI</p>
      <h1 style="font:normal 30px Georgia,serif">Your booking is confirmed</h1>
      <p>Dear ${escapeHtml(data.customerName)},</p>
      <p>Thank you for your purchase. Your payment was successful, and your yoga class is booked.</p>
      <table style="width:100%;border-collapse:collapse">${rows.map(([label, value]) => `<tr><th style="padding:12px 0;border-bottom:1px solid #e4e7db;text-align:left;font-weight:normal;color:#737b62">${label}</th><td style="padding:12px 0;border-bottom:1px solid #e4e7db;text-align:right">${escapeHtml(value)}</td></tr>`).join("")}</table>
      <p style="margin-top:28px">If you have any questions, reply to this email or contact <a href="mailto:${escapeHtml(data.contactEmail)}" style="color:#48533b">${escapeHtml(data.contactEmail)}</a>.</p>
      <p>We look forward to seeing you,<br>Yoga By Niti</p>
    </main>
  </body>
</html>`;
};
