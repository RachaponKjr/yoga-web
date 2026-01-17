export const getRegisterEmailTemplate = (loginLink: string) => {
  // เราใช้ Backticks (`) เพื่อเขียน HTML หลายบรรทัด
  // และใช้ ${variable} เพื่อแทรกตัวแปร
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        /* CSS เบื้องต้นสำหรับ Email Client */
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-top: 20px; }
        .header { background-color: #4F46E5; padding: 20px; text-align: center; color: #ffffff; }
        .content { padding: 30px; color: #333333; line-height: 1.6; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
        .footer { background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Yoka by Niti! 🧘‍♀️</h1>
        </div>
        <div class="content">
          <p>Thank you for registering with us. We are excited to have you on board!</p>
          <p>Your account has been successfully created. You can now login and start booking your classes.</p>
          
          <div style="text-align: center;">
            <a href="${loginLink}" class="button" style="color: #ffffff;">Login to Account</a>
          </div>
          
          <p style="margin-top: 30px;">Namaste,<br>The Yoka Team</p>
        </div>
        <div class="footer">
          <p>© 2026 Yoka Yoga Studio. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
