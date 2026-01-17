interface BookingEmailData {
  customerName: string;
  courseTitle: string;
  roundDate: string; // เช่น "Monday, 20 Jan 2026"
  roundTime: string; // เช่น "09:00 - 10:30 AM"
  location?: string;
  bookingId: string;
  qrCodeUrl?: string; // (Optional) เผื่ออนาคตอยากใส่รูป QR Code
}

export const getBookingSuccessTemplate = (data: BookingEmailData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmed</title>
      <style>
        body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
        .content { padding: 40px 30px; color: #333333; }
        .greeting { font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #111827; }
        .message { font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 30px; }
        
        /* Card แสดงรายละเอียดการจอง */
        .booking-card { background-color: #F3F4F6; border-radius: 8px; padding: 25px; border-left: 5px solid #4F46E5; margin-bottom: 30px; }
        .booking-item { margin-bottom: 12px; font-size: 15px; }
        .booking-item:last-child { margin-bottom: 0; }
        .label { font-weight: 700; color: #374151; display: inline-block; width: 100px; }
        .value { color: #111827; }

        /* คำแนะนำเพิ่มเติม */
        .notes { font-size: 14px; color: #6B7280; background-color: #fff; border: 1px dashed #E5E7EB; padding: 20px; border-radius: 8px; }
        .notes h3 { margin-top: 0; color: #374151; font-size: 15px; }
        .notes ul { margin: 0; padding-left: 20px; }
        .notes li { margin-bottom: 5px; }

        .footer { background-color: #F9FAFB; padding: 20px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #E5E7EB; }
        
        .btn { display: inline-block; background-color: #4F46E5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
        .center { text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmed! ✅</h1>
        </div>

        <div class="content">
          <div class="greeting">Namaste, ${data.customerName} 🙏</div>
          <p class="message">
            Thank you for booking a class with <strong>Yoka by Niti</strong>. 
            We are excited to see you on the mat! Here are your booking details:
          </p>

          <div class="booking-card">
            <div class="booking-item">
              <span class="label">Class:</span>
              <span class="value">${data.courseTitle}</span>
            </div>
            <div class="booking-item">
              <span class="label">Date:</span>
              <span class="value">${data.roundDate}</span>
            </div>
            <div class="booking-item">
              <span class="label">Time:</span>
              <span class="value">${data.roundTime}</span>
            </div>
            <div class="booking-item">
              <span class="label">Location:</span>
              <span class="value">${data.location}</span>
            </div>
             <div class="booking-item">
              <span class="label">Booking ID:</span>
              <span class="value">#${data.bookingId}</span>
            </div>
          </div>

          <div class="notes">
            <h3>📝 Things to know before class:</h3>
            <ul>
              <li>Please arrive <strong>15 minutes</strong> before the class starts.</li>
              <li>Wear comfortable clothing suitable for movement.</li>
              <li>If you need to cancel, please do so at least 24 hours in advance.</li>
            </ul>
          </div>
          
          <div class="center">
             <a href="https://yoka-yoga-studio.com/my-booking" class="btn" style="color: #ffffff;">View My Booking</a>
          </div>

        </div>

        <div class="footer">
          <p>Yoka Yoga Studio by Niti</p>
          <p>123 Yoga Street, Bangkok, Thailand | +66 81 123 4567</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
