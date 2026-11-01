import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
require("ts-node/register");
const { ownerPurchaseEmail } = require("../src/templates/purchase-notification.ts");

test("owner notification identifies the purchase and escapes customer input", () => {
  const html = ownerPurchaseEmail({
    bookingId: "booking-123",
    customerName: '<script>alert("x")</script>',
    customerEmail: "guest@example.com",
    courseTitle: "Hatha & Flow",
    sessionDate: "1 November 2026",
    sessionTime: "09:00 - 10:00",
    quantity: 2,
    totalAmount: 1234,
  });
  assert.match(html, /Hatha &amp; Flow/);
  assert.match(html, /guest@example.com/);
  assert.match(html, /booking-123/);
  assert.match(html, /1,234/);
  assert.doesNotMatch(html, /<script>/);
});
