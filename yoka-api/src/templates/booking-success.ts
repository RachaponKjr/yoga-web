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
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #333333;
    "
  >
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 40px 10px">
          <table
            width="100%"
            style="
              background-color: #ffffff;
              border: 1px solid #eeeeee;
              border-radius: 12px;
              overflow: hidden;
            "
          >
            <tr>
              <td style="padding: 30px 40px 0 40px">
                <h1
                  style="
                    margin: 0;
                    font-size: 24px;
                    font-weight: 700;
                    color: #1a1a1a;
                  "
                >
                  Thank you for your booking!
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding: 20px 40px 20px 40px; line-height: 1.6">
                <p style="margin: 0 0 16px 0; font-size: 16px">
                  Dear ${data.customerName},
                </p>
                <p style="margin: 0 0 24px 0; font-size: 16px">
                  We're excited to confirm your booking. Below are your session
                  details:
                </p>

                <div
                  style="
                    background-color: #fcfcfc;
                    border: 1px solid #f0f0f0;
                    border-radius: 8px;
                    padding: 20px;
                  "
                >
                  <table
                    width="100%"
                    border="0"
                    cellspacing="0"
                    cellpadding="8"
                  >
                    <tr>
                      <td
                        width="35%"
                        style="
                          font-size: 14px;
                          color: #666666;
                          font-weight: 600;
                        "
                      >
                        Course
                      </td>
                      <td style="font-size: 14px; color: #1a1a1a">
                        ${data.courseTitle}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          font-size: 14px;
                          color: #666666;
                          font-weight: 600;
                        "
                      >
                        Date
                      </td>
                      <td style="font-size: 14px; color: #1a1a1a">
                        ${data.roundDate}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          font-size: 14px;
                          color: #666666;
                          font-weight: 600;
                        "
                      >
                        Time
                      </td>
                      <td style="font-size: 14px; color: #1a1a1a">
                        ${data.roundTime}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          font-size: 14px;
                          color: #666666;
                          font-weight: 600;
                        "
                      >
                        Booking ID
                      </td>
                      <td style="font-size: 14px; color: #1a1a1a">
                        #${data.bookingId}
                      </td>
                    </tr>
                  </table>
                </div>

                <div
                  style="
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #f0f0f0;
                  "
                >
                  <p
                    style="
                      margin: 0 0 12px 0;
                      font-size: 14px;
                      font-weight: 700;
                      color: #1a1a1a;
                    "
                  >
                    Need help or have questions?
                  </p>
                  <table
                    width="100%"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
                  >
                    <tr>
                      <td style="padding-bottom: 8px">
                        <span style="font-size: 14px; color: #666666"
                          >📞 Phone:</span
                        >
                        <a
                          href="tel:0812345678"
                          style="
                            font-size: 14px;
                            color: #1a1a1a;
                            text-decoration: none;
                            margin-left: 5px;
                          "
                          >081-234-5678</a
                        >
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 8px">
                        <span style="font-size: 14px; color: #666666"
                          >💬 Line ID:</span
                        >
                        <span
                          style="
                            font-size: 14px;
                            color: #1a1a1a;
                            margin-left: 5px;
                          "
                          >@yokaniti</span
                        >
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span style="font-size: 14px; color: #666666"
                          >✉️ Email:</span
                        >
                        <a
                          href="mailto:support@yokaniti.com"
                          style="
                            font-size: 14px;
                            color: #1a1a1a;
                            text-decoration: none;
                            margin-left: 5px;
                          "
                          >support@yokaniti.com</a
                        >
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 40px 40px 40px">
                <p style="margin: 0; font-size: 14px; color: #999999">
                  Best Regards,<br /><strong>Yoka by Niti Team</strong>
                </p>
              </td>
            </tr>
          </table>

          <table
            width="100%"
            max-width="600"
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
