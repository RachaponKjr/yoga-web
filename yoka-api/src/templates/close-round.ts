export const getClassCancellationTemplate = (
  courseName: string,
  classDate: string,
  classTime: string,
  homeLink: string,
) => {
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
      background-color: #fdfcfb;
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
              border: 1px solid #f3f4f6;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0,0,0,0.03);
            "
          >
            <!-- Header Section -->
            <tr>
              <td align="center" style="padding: 40px 40px 20px 40px">
                <div
                  style="
                    background-color: #fff7ed;
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    display: inline-block;
                    line-height: 70px;
                    font-size: 35px;
                  "
                >
                  📢
                </div>
                <h1
                  style="
                    margin: 20px 0 0 0;
                    font-size: 24px;
                    font-weight: 700;
                    color: #9a3412;
                  "
                >
                  Class Cancellation Notice
                </h1>
                <p style="color: #666666; font-size: 14px; margin-top: 8px;">
                  แจ้งยกเลิกคลาสเรียนที่คุณจองไว้
                </p>
              </td>
            </tr>

            <!-- Content Section -->
            <tr>
              <td style="padding: 20px 40px 30px 40px; line-height: 1.6; text-align: center;">
                <p style="margin: 0 0 16px 0; font-size: 16px">
                  เรียนคุณลูกค้า,
                </p>
                <p style="margin: 0 0 24px 0; font-size: 16px; color: #4b5563;">
                  เรามีความเสียใจที่ต้องแจ้งให้ทราบว่า <strong>วันนี้จะไม่มีการสอน</strong> ในคลาสที่คุณได้ทำการจองไว้ เนื่องจากเหตุสุดวิสัยบางประการ
                </p>

                <!-- Class Detail Box -->
           <div style="background-color: #fffaf5; border-radius: 12px; padding: 25px; border: 1px dashed #fdba74; margin-bottom: 24px; text-align: left;">
  <p style="margin: 0 0 12px 0; font-size: 15px; color: #7c2d12;">
    <strong>คลาสที่ยกเลิก:</strong> ${courseName}
  </p>
  
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td style="padding-bottom: 8px;">
        <span style="font-size: 14px; color: #9a3412;"><strong>🗓️ วันที่:</strong></span>
      </td>
      <td style="padding-bottom: 8px;">
        <span style="font-size: 14px; color: #7c2d12;">${classDate}</span>
      </td>
    </tr>
    <tr>
      <td>
        <span style="font-size: 14px; color: #9a3412;"><strong>⏰ เวลา:</strong></span>
      </td>
      <td>
        <span style="font-size: 14px; color: #7c2d12;">${classTime} น.</span>
      </td>
    </tr>
  </table>
</div>

                <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563;">
                  ทางสถาบันต้องขออภัยในความไม่สะดวกเป็นอย่างสูง โดยทางเราจะดำเนินการคืนเงินให้คุณภายใน 3-7 วันทำการ
                </p>

                <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto">
                  <tr>
                    <td align="center" style="border-radius: 8px" bgcolor="#1a1a1a">
                      <a
                        href="${homeLink}"
                        target="_blank"
                        style="
                          font-size: 15px;
                          color: #ffffff;
                          text-decoration: none;
                          border-radius: 8px;
                          padding: 12px 35px;
                          display: inline-block;
                          font-weight: bold;
                        "
                      >
                        เข้าสู่เว็บไซต์เพื่อจองใหม่
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Help Box -->
            <tr>
              <td style="padding: 0 40px 30px 40px">
                <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; text-align: center;">
                  <p style="margin: 0; font-size: 13px; color: #666666">
                    หากมีข้อสงสัยเพิ่มเติมเกี่ยวกับการคืนเงินหรือการเลื่อนคลาส<br/> 
                    สามารถติดต่อเราได้ที่ 
                    <a href="mailto:yogabyniti@gmail.com" style="color: #1a1a1a; font-weight: bold;">yogabyniti@gmail.com</a>
                  </p>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 0 40px 40px 40px; text-align: center">
                <p style="margin: 0; font-size: 14px; color: #999999">
                  ขออภัยในความไม่สะดวกอีกครั้ง,<br /><strong>Yoka by Niti Team</strong>
                </p>
              </td>
            </tr>
          </table>

          <table width="100%" style="max-width: 600px; margin-top: 20px">
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
