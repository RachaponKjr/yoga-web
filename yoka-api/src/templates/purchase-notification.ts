export interface PurchaseNotice {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  courseTitle: string;
  sessionDate: string;
  sessionTime: string;
  quantity: number;
  totalAmount: number;
}

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]!,
  );

export function ownerPurchaseEmail(notice: PurchaseNotice): string {
  const rows: Array<[string, string]> = [
    ["Course", notice.courseTitle],
    ["Customer", notice.customerName || notice.customerEmail],
    ["Customer email", notice.customerEmail],
    ["Class date", notice.sessionDate],
    ["Class time", notice.sessionTime],
    ["Seats", String(notice.quantity)],
    ["Amount paid", `฿${notice.totalAmount.toLocaleString("en-US")}`],
    ["Booking ID", notice.bookingId],
  ];
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"></head><body style="margin:0;background:#f8f7f3;color:#30372c;font-family:Arial,sans-serif;padding:32px"><main style="max-width:600px;margin:auto;background:#fffefa;border:1px solid #dedfd4;padding:32px"><p style="color:#737b62;font-size:12px;letter-spacing:2px">YOGA BY NITI</p><h1 style="font:normal 30px Georgia,serif">A new class booking</h1><p>A customer has paid for a yoga class. Here are the booking details:</p><table style="width:100%;border-collapse:collapse">${rows.map(([label, value]) => `<tr><th style="padding:12px 0;border-bottom:1px solid #e4e7db;text-align:left;font-weight:normal;color:#737b62">${label}</th><td style="padding:12px 0;border-bottom:1px solid #e4e7db;text-align:right">${escapeHtml(value)}</td></tr>`).join("")}</table><p style="margin-top:28px"><a href="https://admin.yogabyniti.com/bookings" style="color:#48533b">View bookings in Admin</a></p></main></body></html>`;
}
