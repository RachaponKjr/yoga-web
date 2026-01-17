import PDFDocument from "pdfkit";
import path from "path";

// 1. สร้าง Interface ให้ตรงกับข้อมูลที่คุณเตรียมไว้
interface ReceiptData {
  userDetail: {
    email: string;
    phone_number: string;
    firstName: string;
    lastName: string;
  };
  bookingDetail: {
    bookingId: string;
    courseTitle: string;
    startDate: string | Date; // รองรับทั้ง string และ Date
    endDate: string | Date;
    totalAmount: number;
  };
}

export const generateBookingReceipt = (data: ReceiptData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers: Buffer[] = [];

    // เก็บข้อมูลลง Buffer
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));

    // --- เริ่มวาด PDF ---

    // 1. ตั้งค่า Font ไทย
    // ⚠️ อย่าลืมวางไฟล์ THSarabunNew.ttf ไว้ใน folder นี้ หรือแก้ path ให้ถูก
    const fontPath = path.join(
      process.cwd(),
      "src",
      "assets",
      "fonts",
      "THSarabunNew.ttf"
    );

    // เช็คเผื่อไม่มี font แล้วโปรแกรมพัง (Optional)
    try {
      doc.font(fontPath);
    } catch (e) {
      console.warn("Font not found, falling back to default.");
    }

    // ================= HEADER =================
    doc.fontSize(24).text("YOKA YOGA STUDIO", { align: "center" });
    doc
      .fontSize(16)
      .text("Booking Confirmation / ใบยืนยันการจอง", { align: "center" });
    doc.moveDown(0.5);

    // วันที่ออกใบเสร็จ
    doc
      .fontSize(12)
      .text(`Date of Issue: ${new Date().toLocaleDateString("th-TH")}`, {
        align: "right",
      });
    doc.moveDown(1);

    // เส้นคั่นบน
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // ================= CUSTOMER INFO =================
    const { userDetail, bookingDetail } = data;

    doc.fontSize(16).text("Customer Details / ข้อมูลลูกค้า");
    doc.fontSize(14);
    doc.text(`Name: ${userDetail.firstName} ${userDetail.lastName}`);
    doc.text(`Email: ${userDetail.email}`);
    doc.text(`Phone: ${userDetail.phone_number || "-"}`);
    doc.moveDown(1);

    // ================= BOOKING INFO =================
    doc.fontSize(16).text("Booking Details / รายละเอียดการจอง");
    doc.fontSize(14);

    // Format วันที่และเวลา
    const startObj = new Date(bookingDetail.startDate);
    const endObj = new Date(bookingDetail.endDate);

    const dateStr = startObj.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = `${startObj.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${endObj.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    doc.text(`Booking ID: ${bookingDetail.bookingId}`);
    doc.text(`Class: ${bookingDetail.courseTitle}`);
    doc.text(`Date: ${dateStr}`);
    doc.text(`Time: ${timeStr}`);

    doc.moveDown(1);

    // ================= PRICE SECTION =================
    // เส้นคั่นราคา
    doc.moveTo(50, doc.y).lineTo(550, doc.y).dash(5, { space: 5 }).stroke();
    doc.moveDown(1);

    // ล้าง dash ออก
    doc.undash();

    doc.fontSize(18);
    // พิมพ์ Label ซ้าย
    doc.text("Total Amount / ยอดชำระรวม:", { continued: true });
    // พิมพ์ราคา ขวา
    doc.text(`${bookingDetail.totalAmount.toLocaleString()} THB`, {
      align: "right",
    });

    // ================= FOOTER & CONTACT =================
    // ดันลงไปด้านล่างๆ หน่อย
    doc.moveDown(4);

    // เปลี่ยนสีเป็นเทาสำหรับ Footer
    doc.fillColor("#555555");

    doc
      .fontSize(12)
      .text("Thank you for choosing Yoka by Niti!", { align: "center" });
    doc.text("Please present this confirmation to our staff upon arrival.", {
      align: "center",
    });

    doc.moveDown(1);

    // Contact Info Box (วาดกรอบสี่เหลี่ยมจางๆ หรือแค่จัดกลุ่ม)
    doc
      .fontSize(14)
      .font(fontPath)
      .text("--- Contact Us ---", { align: "center" });
    doc.fontSize(12);
    doc.text("📞 Phone: +66 81 123 4567", { align: "center" });
    doc.text("📧 Email: contact@yoka-yoga.com", { align: "center" });
    doc.text("🌐 Website: www.yoka-yoga.com", { align: "center" });
    doc.text("📍 Location: 123 Yoga Street, Bangkok, Thailand", {
      align: "center",
    });

    doc.end();
  });
};
