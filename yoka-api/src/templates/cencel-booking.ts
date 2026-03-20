export const getCancellationEmailTemplate = (
  courseName: string,
  bookingDate: Date,
  supportLink: string,
) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("th-TH", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // เป็น AM/PM
    });
  };
  return `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #333333;
    "
  >
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 16px 10px">
          <table
            width="100%"
            style="
              background-color: #ffffff;
              border: 1px solid #eeeeee;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            "
          >
            <!-- Header Section -->
            <tr>
              <td align="center" style="padding: 16px 16px 16px 16px">
                <div
                  style="
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    display: inline-block;
                    line-height: 64px;
                    font-size: 32px;
                  "
                >
                  🚫
                </div>
                <h1
                  style="
                    margin: 20px 0 0 0;
                    font-size: 24px;
                    font-weight: 700;
                    color: #991b1b;
                  "
                >
                  Booking Cancelled
                </h1>
                <p style="color: #666666; font-size: 14px; margin-top: 8px;">
                  รายการจองของคุณถูกยกเลิกเรียบร้อยแล้ว
                </p>
              </td>
            </tr>

            <!-- Content Section -->
            <tr>
              <td style="padding: 16px 16px 16px 16px; line-height: 1.6; text-align: left;">
                <p style="margin: 0 0 16px 0; font-size: 16px">
                  เรียนคุณลูกค้า,
                </p>
                <p style="margin: 0 0 24px 0; font-size: 16px; color: #4b5563;">
                  เราได้รับคำร้องขอยกเลิกการจองคลาสเรียนของคุณ ข้อมูลสรุปรายการที่ยกเลิกมีดังนี้:
                </p>

                <!-- Course Detail Box -->
                <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; border: 1px solid #f3f4f6; margin-bottom: 24px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="font-size: 14px; color: #6b7280; padding-bottom: 8px;">Class Name:</td>
                      <td style="font-size: 14px; font-weight: 700; color: #111827; text-align: right; padding-bottom: 8px;">${courseName}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 14px; color: #6b7280;">Scheduled Date:</td>
                      <td style="font-size: 14px; font-weight: 700; color: #111827; text-align: right;">${formatDate(bookingDate)}</td>
                    </tr>
                  </table>
                </div>

                <!-- Refund Notice -->
                <p style="margin: 0 0 16px 0; font-size: 14px; color: #4b5563; border-left: 4px solid #ef4444; padding-left: 16px;">
                  <strong>เกี่ยวกับการคืนเงิน:</strong><br/>
                  หากคุณชำระเงินมาแล้ว และการยกเลิกเป็นไปตามเงื่อนไข (ล่วงหน้า 24 ชม.) เจ้าหน้าที่จะดำเนินการคืนเงินให้ตามนโยบายของทางสถาบันภายใน 3-7 วันทำการ
                </p>
              </td>
            </tr>

            <!-- Action Button -->
            <tr>
              <td align="center" style="padding: 0 40px 40px 40px;">
                <a
                  href="${supportLink}"
                  target="_blank"
                  style="
                    font-size: 15px;
                    color: #4b5563;
                    text-decoration: none;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    padding: 10px 24px;
                    display: inline-block;
                    font-weight: 600;
                  "
                >
                  Contact Support / ดูนโยบายคืนเงิน
                </a>
              </td>
            </tr>

            <!-- Footer Section -->
            <tr>
              <td style="padding: 30px 40px; background-color: #f9fafb; text-align: center;">
                <p style="margin: 0; font-size: 13px; color: #9ca3af">
                  หวังว่าจะได้ร่วมฝึกโยคะกับคุณในโอกาสถัดไป
                </p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #111827">
                  Best Regards,<br /><strong>Yoka by Niti Team</strong>
                </p>
              </td>
            </tr>
          </table>

          <table
            width="100%"
            style="max-width: 600px; margin-top: 20px"
          >
            <tr>
              <td align="center" style="font-size: 12px; color: #aaaaaa">
                &copy; 2026 Yoka by Niti. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
};
