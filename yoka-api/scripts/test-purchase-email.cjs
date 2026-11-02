require("dotenv").config();
require("ts-node/register");

const { mailService } = require("../src/utils/mail.ts");
const {
  getBookingSuccessTemplate,
} = require("../src/templates/booking-success.ts");
const {
  ownerPurchaseEmail,
} = require("../src/templates/purchase-notification.ts");

const recipient = process.argv[2]?.trim();
if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
  console.error("Usage: npm run test:purchase-email -- your-inbox@example.com");
  process.exit(1);
}

const now = new Date();
const sessionDate = now.toLocaleDateString("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Bangkok",
});
const notice = {
  bookingId: `TEST-${Date.now()}`,
  customerName: "Test Customer",
  customerEmail: recipient,
  courseTitle: "Sample Yoga Class",
  sessionDate,
  sessionTime: "09:00 - 10:00",
  quantity: 1,
  totalAmount: 500,
};

async function main() {
  const customer = await mailService.sendEmail(
    recipient,
    `[TEST] Booking confirmed: ${notice.courseTitle} | Yoga By Niti`,
    getBookingSuccessTemplate({
      customerName: notice.customerName,
      courseTitle: notice.courseTitle,
      roundDate: notice.sessionDate,
      roundTime: notice.sessionTime,
      bookingId: notice.bookingId,
      quantity: notice.quantity,
      totalAmount: notice.totalAmount,
      contactEmail:
        process.env.BOOKING_NOTIFICATION_EMAIL || "Yogabyniti@gmail.com",
    }),
  );
  const owner = await mailService.sendEmail(
    recipient,
    `[TEST] New booking: ${notice.courseTitle} (${notice.bookingId})`,
    ownerPurchaseEmail(notice),
  );

  console.log(`Sent two sample emails to ${recipient}`);
  console.log(`Customer confirmation message ID: ${customer.messageId}`);
  console.log(`Studio notification message ID: ${owner.messageId}`);
}

main().catch((error) => {
  console.error("Test email failed:", error);
  process.exitCode = 1;
});
