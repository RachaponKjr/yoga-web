import puppeteer from "puppeteer";
import handlebars from "handlebars";
import { Buffer } from "buffer";
import { BookingEmailData } from "../templates/booking-success";

export const generateBookingPDF = async (
  data: BookingEmailData,
): Promise<Buffer> => {
  const htmlTemplate = `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Kanit:wght@300;400&display=swap");

      body {
        font-family: "Inter", "Kanit", sans-serif;
        margin: 0;
        padding: 0;
        background-color: #ffffff;
        color: #333;
      }
      .page {
        width: 100%;
        display: flex;
        justify-content: center;
        padding-top: 20px;
      }
      .ticket {
        width: 450px;
        height: fit-content;
        background: white;
        overflow: hidden;
      }
      .header {
        padding: 40px 40px 10px 40px;
        text-align: center;
      }
      .brand-name {
        font-size: 22px;
        font-weight: 700;
        letter-spacing: 4px;
        margin: 0;
        color: #000;
      }
      .ticket-type {
        font-size: 10px;
        text-transform: uppercase;
        color: #aaa;
        letter-spacing: 2px;
        margin-top: 8px;
      }

      .content {
        padding: 0 40px 40px 40px;
      }

      .main-info {
        margin: 30px 0;
        text-align: center;
      }
      .course-label {
        font-size: 10px;
        color: #999;
        text-transform: uppercase;
        font-weight: 700;
        margin-bottom: 6px;
      }
      .course-value {
        font-size: 24px;
        color: #1a1a1a;
        font-weight: 700;
        line-height: 1.2;
      }

      .divider {
        border-top: 1px solid #f0f0f0;
        margin: 20px 0;
      }

      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
      }
      .info-item {
        margin-bottom: 10px;
      }
      .label {
        font-size: 9px;
        color: #bbb;
        text-transform: uppercase;
        font-weight: 700;
        margin-bottom: 4px;
      }
      .value {
        font-size: 14px;
        color: #333;
        font-weight: 500;
      }

      /* ✅ New Section: Notes */
      .notes-section {
        margin-top: 20px;
      }
      .section-title {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        color: #1a1a1a;
        margin-bottom: 10px;
        letter-spacing: 1px;
      }
      .note-list {
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .note-item {
        font-size: 12px;
        color: #666;
        margin-bottom: 6px;
        display: flex;
        align-items: flex-start;
      }
      .note-item::before {
        content: "•";
        margin-right: 8px;
        color: #ccc;
      }

      .thank-you-section {
        margin-top: 25px;
        padding: 20px;
        background: #fafafa;
        border-radius: 12px;
        text-align: center;
      }
      .thank-you-title {
        font-size: 15px;
        font-weight: 700;
        color: #1a1a1a;
        margin-bottom: 6px;
      }
      .thank-you-text {
        font-size: 12px;
        color: #777;
        line-height: 1.5;
      }

      /* ✅ New Section: Contact */
      .contact-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-top: 20px;
        border-top: 1px solid #f8f8f8;
        padding-top: 15px;
      }
      .contact-item {
        font-size: 11px;
        color: #888;
      }
      .contact-item b {
        color: #444;
      }

      .footer-text {
        font-size: 9px;
        color: #ddd;
        text-align: center;
        margin-top: 30px;
        line-height: 1.6;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="ticket">
        <div class="header">
          <div class="brand-name">YOKA BY NITI</div>
          <div class="ticket-type">Official Class Pass</div>
        </div>

        <div class="content">
          <div class="main-info">
            <div class="course-label">Selected Class</div>
            <div class="course-value">${data.courseTitle}</div>
          </div>

          <div class="divider"></div>

          <div class="info-grid">
            <div class="info-item">
              <div class="label">Attendee</div>
              <div class="value">${data.customerName}</div>
            </div>
            <div class="info-item" style="text-align: right">
              <div class="label">Reference ID</div>
              <div class="value">#${data.bookingId}</div>
            </div>
            <div class="info-item">
              <div class="label">Session Date</div>
              <div class="value">${data.roundDate}</div>
            </div>
            <div class="info-item" style="text-align: right">
              <div class="label">Session Time</div>
              <div class="value">${data.roundTime}</div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="notes-section">
            <div class="section-title">Important Notes</div>
            <ul class="note-list">
              <li class="note-item">
                Please arrive at least 15 minutes before the session starts.
              </li>
              <li class="note-item">
                Comfortable yoga attire is highly recommended.
              </li>
              <li class="note-item">
                Mats and props are provided, but you may bring your own.
              </li>
              <li class="note-item">
                Kindly keep your mobile devices on silent mode.
              </li>
            </ul>
          </div>

          <div class="thank-you-section">
            <div class="thank-you-title">Thank You for Joining Us!</div>
            <div class="thank-you-text">
              We believe yoga is for everyone. Thank you for letting us be part
              of your journey. See you on the mat!
            </div>
          </div>

          <div class="contact-grid">
            <div class="contact-item"><b>Line:</b> @yokaniti</div>
            <div class="contact-item" style="text-align: right">
              <b>Tel:</b> +66 81 123 4567
            </div>
            <div class="contact-item"><b>IG:</b> yoka_by_niti</div>
            <div class="contact-item" style="text-align: right">
              <b>Email:</b> hello@yokaniti.com
            </div>
          </div>

          <p class="footer-text">Yoka by Niti Studio | Bangkok, Thailand</p>
        </div>
      </div>
    </div>
  </body>
</html>

  `;

  const template = handlebars.compile(htmlTemplate);
  const finalHtml = template(data);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(finalHtml, { waitUntil: "load" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
  });

  await browser.close();
  return Buffer.from(pdfBuffer);
};
