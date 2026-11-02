import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
require("ts-node/register");
const { getBookingSuccessTemplate } = require("../src/templates/booking-success.ts");

test("customer confirmation includes payment details and escapes booking input", () => {
  const html = getBookingSuccessTemplate({
    customerName: '<script>alert("x")</script>',
    courseTitle: "Hatha & Flow",
    roundDate: "1 November 2026",
    roundTime: "09:00 - 10:00",
    bookingId: "booking-123",
    quantity: 2,
    totalAmount: 1234,
    contactEmail: "studio@example.com",
  });

  assert.match(html, /Hatha &amp; Flow/);
  assert.match(html, /฿1,234/);
  assert.match(html, /booking-123/);
  assert.match(html, /mailto:studio@example.com/);
  assert.doesNotMatch(html, /<script>/);
  assert.doesNotMatch(html, /081-234-5678|support@yokaniti.com/);
});
