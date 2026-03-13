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
        <meta charset="utf-8">
        <style>
          /* นำเข้า Font เพื่อรองรับภาษาไทยและดู Modern */
          @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;500;700&family=Inter:wght@400;700&display=swap');
          
          body { 
            font-family: 'Inter', 'Kanit', sans-serif; 
            margin: 0; padding: 0; 
            background-color: #F3F4F6;
            -webkit-print-color-adjust: exact;
          }
          .page {
            width: 210mm; height: 297mm; /* ขนาด A4 */
            display: flex; flex-direction: column; align-items: center; padding-top: 50px;
          }
          .ticket {
            width: 500px; background: white; border-radius: 24px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.1); overflow: hidden;
            border: 1px solid #E5E7EB;
          }
          .header {
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white; padding: 40px 30px; text-align: center;
          }
          .brand-name { font-size: 28px; font-weight: 700; letter-spacing: 2px; margin: 0; }
          .ticket-type { font-size: 12px; text-transform: uppercase; opacity: 0.8; letter-spacing: 3px; margin-top: 5px; }
          
          .content { padding: 40px; position: relative; }
          
          /* เส้นประรอยตัดตั๋ว */
          .cut-line {
            border-top: 2px dashed #F3F4F6; margin: 25px 0; position: relative;
          }
          .cut-line::before, .cut-line::after {
            content: ""; position: absolute; top: -11px; width: 20px; height: 20px;
            background: #F3F4F6; border-radius: 50%;
          }
          .cut-line::before { left: -51px; }
          .cut-line::after { right: -51px; }

          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
          .info-item { margin-bottom: 20px; }
          .label { font-size: 11px; color: #9CA3AF; text-transform: uppercase; font-weight: 700; margin-bottom: 5px; }
          .value { font-size: 16px; color: #111827; font-weight: 600; }
          
          .qr-section {
            text-align: center; margin-top: 10px; padding: 20px;
            background: #F9FAFB; border-radius: 16px;
          }
          .qr-code {
            width: 120px; height: 120px; margin: 0 auto 15px;
            background: #fff; border: 1px solid #EEE; padding: 10px; border-radius: 12px;
          }
          .footer-text { font-size: 11px; color: #9CA3AF; text-align: center; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="ticket">
            <div class="header">
              <div class="brand-name">YOGA BY NITI</div>
              <div class="ticket-type">Official Class Pass</div>
            </div>
            
            <div class="content">
              <div class="info-item">
                <div class="label">Course / คลาสเรียน</div>
                <div class="value" style="font-size: 20px; color: #4F46E5;">${data.courseTitle}</div>
              </div>

              <div class="info-grid">
                <div class="info-item">
                  <div class="label">Customer / ชื่อผู้จอง</div>
                  <div class="value">${data.customerName}</div>
                </div>
                <div class="info-item">
                  <div class="label">Booking ID</div>
                  <div class="value">#${data.bookingId}</div>
                </div>
                <div class="info-item">
                  <div class="label">Date / วันที่</div>
                  <div class="value">${data.roundDate}</div>
                </div>
                <div class="info-item">
                  <div class="label">Time / เวลา</div>
                  <div class="value">${data.roundTime}</div>
                </div>
              </div>

              <div class="cut-line"></div>

              <div class="qr-section">
                <div class="qr-code">
                   <img src="${data.qrCodeUrl || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + data.bookingId}" style="width:100%">
                </div>
                <div class="label">Scan for Entry Check-in</div>
              </div>

              <p class="footer-text">
                Please arrive 15 minutes early. Namaste. <br>
                123 Yoga Street, Bangkok | +66 81 123 4567
              </p>
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
  await page.setContent(finalHtml, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
  });

  await browser.close();
  return Buffer.from(pdfBuffer);
};
