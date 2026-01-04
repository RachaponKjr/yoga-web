"use client";

import { useBooking } from "@/store/useBooking";
import { formatRoundEnglish } from "@/utils/format";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OmiseCardInputs, useOmise } from "@/hooks/useOmise";
import { Loader2 } from "lucide-react";
import { bookingService } from "@/service/booking.service";
import { toast } from "sonner";
import { paymentService } from "@/service/payment.service";
import { useAuthStore } from "@/store/useAuthStore";

const PaymentPage = () => {
  const { booking, decrementQuantity, incrementQuantity } = useBooking();
  // 2. เรียกใช้ Hook
  // loading: คือสถานะว่า Script ของ Omise โหลดเสร็จหรือยัง (ถ้ายังไม่เสร็จ ห้ามกดปุ่ม)
  const { createToken, loading: isScriptLoading } = useOmise();
  const { checkAuth } = useAuthStore();
  // State สำหรับ Loading ตอนกดปุ่มจ่ายเงิน (หมุนๆ)
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const [totlePrice, setTotlePrice] = useState(0);
  // State สำหรับเก็บข้อมูลบัตร
  const [cardDetail, setCardDetail] = useState({
    cardNumber: "",
    cardHolder: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const pricePerUnit = booking?.price || 0;
  const discountPrice = booking?.discount_price || 0;
  const quantity = booking?.quantity || 1;

  // ราคารวมก่อนภาษี
  const subtotal = pricePerUnit * quantity;
  // คำนวณส่วนลด (ถ้ามี discount_price จะถือว่าเป็นส่วนลดต่อชิ้น หรือถ้า logic คือราคาลดแล้ว code นี้ต้องปรับ)
  // สมมติว่า discount_price คือ "ราคาที่ลดแล้ว" -> ส่วนลด = (ราคาเต็ม - ราคาลด) * จำนวน
  // แต่จาก Code เก่า ดูเหมือน discount_price คือ ยอดที่จะลด
  const discountAmount = discountPrice * quantity;

  // ภาษี 7%
  const taxAmount = subtotal * 0.07;

  // ราคาสุทธิที่ต้องจ่าย
  const grandTotal = subtotal + taxAmount - discountAmount;
  // ฟังก์ชันจัดการการพิมพ์ และจัดรูปแบบ (Formatting)
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // 1. Logic จัดรูปแบบเลขบัตร (เว้นวรรคทุก 4 ตัว)
    if (name === "cardNumber") {
      // ลบทุกอย่างที่ไม่ใช่ตัวเลขออกก่อน
      const raw = value.replace(/\D/g, "").slice(0, 16);
      // ใส่ space ทุก 4 ตัว
      formattedValue = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    }
    // 2. Logic จัดรูปแบบวันหมดอายุ (เติม /)
    else if (name === "cardExpiry") {
      const raw = value.replace(/\D/g, "").slice(0, 4);
      if (raw.length >= 2) {
        formattedValue = `${raw.slice(0, 2)}/${raw.slice(2)}`;
      } else {
        formattedValue = raw;
      }
    }
    // 3. Logic CVV (ตัวเลขเท่านั้น)
    else if (name === "cardCvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }
    // 4. ชื่อเจ้าของบัตร (ตัวพิมพ์ใหญ่)
    else if (name === "cardHolder") {
      formattedValue = value.toUpperCase();
    }

    setCardDetail((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const { cardNumber, cardHolder, cardExpiry, cardCvv } = cardDetail;
    const [expMonth, expYear] = cardExpiry.split("/");

    const cardObject: OmiseCardInputs = {
      name: cardHolder,
      number: cardNumber,
      expiration_month: parseInt(expMonth),
      expiration_year: parseInt("20" + expYear),
      security_code: cardCvv,
    };

    try {
      // 1. ขอ Token จาก Omise
      const tokenResponse = await createToken(cardObject);
      const omiseToken = tokenResponse.id;
      const bookingRes = await bookingService.createBooking({
        roundId: booking?.id || "",
        type: "ONLINE",
        price: grandTotal,
      });

      if (!bookingRes.success) {
        toast.error("Booking Failed", { className: "text-red-500" });
        return;
      }

      const paymentRes = await paymentService.payment({
        orderId: bookingRes.data.id,
        omiseToken,
      });

      console.log(paymentRes, "paymentRes");

      // 2. ส่ง Token ไปให้ Backend ตัดเงิน (API ที่เพิ่งสร้าง)
      console.log("💸 Processing Charge...");

      alert("ชำระเงินเรียบร้อยแล้ว!");

      // เคลียร์ตะกร้า หรือ Redirect ไปหน้าขอบคุณ
      // resetBooking();
      // router.push("/payment/success");
    } catch (error: any) {
      console.error("❌ Error:", error);
      alert(`Payment Failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!booking) {
      router.push("/");
    }
  }, [booking, router]);

  if (!booking) {
    return null;
  }
  const { dateLabel, timeLabel } = formatRoundEnglish(
    booking?.startDateTime || "",
    booking?.endDateTime || ""
  );

  return (
    <div className="flex justify-center items-center py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row bg-white rounded-2xl p-6 lg:p-8 max-w-7xl w-full shadow-lg gap-8 mx-auto">
          {/* --- ฝั่งซ้าย: Credit Card Form --- */}
          <div className="flex-1">
            <h5 className="text-2xl font-bold text-slate-800 mb-6">
              Card Payment
            </h5>

            {/* Visual Card Display (แสดงผลตามที่พิมพ์) */}
            <div className="mb-6 bg-linear-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden transition-all duration-300">
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <span className="font-mono text-xl tracking-widest min-h-[28px]">
                    {cardDetail.cardNumber || "**** **** **** ****"}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-slate-400 uppercase">
                      Card Holder
                    </p>
                    <p className="font-semibold tracking-wide min-h-[24px]">
                      {cardDetail.cardHolder || "YOUR NAME"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Expires</p>
                    <p className="font-semibold min-h-[24px]">
                      {cardDetail.cardExpiry || "MM/YY"}
                    </p>
                  </div>
                </div>
              </div>
              {/* Decorative Circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
            </div>

            <form className="space-y-4" onSubmit={handleConfirmPayment}>
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardDetail.cardNumber}
                    onChange={handleCardChange}
                    maxLength={19} // 16 digits + 3 spaces
                    placeholder="0000 0000 0000 0000"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-mono"
                  />
                  <svg
                    className="w-5 h-5 text-slate-400 absolute left-3 top-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
              </div>

              {/* Card Holder */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardHolder"
                  value={cardDetail.cardHolder}
                  onChange={handleCardChange}
                  placeholder="ENTER NAME ON CARD"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all uppercase"
                />
              </div>

              {/* Expiry & CVC */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    name="cardExpiry"
                    value={cardDetail.cardExpiry}
                    onChange={handleCardChange}
                    maxLength={5} // MM/YY
                    placeholder="MM / YY"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-center"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    CVC / CVV
                  </label>
                  <div className="relative">
                    <input
                      type="password" // ซ่อนเลข CVV
                      name="cardCvv"
                      value={cardDetail.cardCvv}
                      onChange={handleCardChange}
                      maxLength={4}
                      placeholder="123"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-center"
                    />
                    <svg
                      className="w-5 h-5 text-slate-400 absolute right-3 top-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Checkbox Save Card */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="save-card"
                  className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="save-card" className="text-sm text-slate-600">
                  Save card for future payments
                </label>
              </div>
              {/* ปุ่ม Submit */}
              <Button
                type="submit"
                disabled={isScriptLoading || isProcessing}
                className="w-full h-14 text-base font-bold cursor-pointer rounded-xl shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all disabled:opacity-70 mt-6"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                    Processing...
                  </>
                ) : isScriptLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading
                    Security...
                  </>
                ) : (
                  `Confirm Payment $${grandTotal.toFixed(2)}`
                )}
              </Button>
            </form>
          </div>

          {/* --- ฝั่งขวา: Booking Summary --- */}
          <div className="w-full lg:w-[480px] bg-slate-50 rounded-xl p-6 border border-slate-100 h-fit">
            <h5 className="text-xl font-bold text-slate-800 mb-4">
              Booking Summary
            </h5>

            {/* Product Item */}
            <div className="flex gap-3 mb-4 pb-4 border-b border-slate-200">
              <div
                className="w-16 h-16 bg-slate-200 rounded-lg shrink-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${process.env.NEXT_PUBLIC_HOST_IMAGE || "http://119.59.99.141:4001/"}${
                    booking?.cover_image || "https://placehold.co/100"
                  }")`,
                }}
              ></div>
              <div>
                <h6 className="font-semibold text-slate-800 text-sm leading-tight mb-1">
                  {booking?.title}
                </h6>
                <p className="text-xs text-slate-500">Yoga & Stretching</p>
              </div>
            </div>

            {/* Details List */}
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  Date
                </span>
                <span className="font-medium text-slate-700">{dateLabel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  Time
                </span>
                <span className="font-medium text-slate-700">{timeLabel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                  Guests
                </span>
                <div className="flex flex-row items-center gap-2">
                  <Button
                    variant="outline"
                    size={`xs`}
                    onClick={() => decrementQuantity()}
                    className="cursor-pointer"
                  >
                    -
                  </Button>
                  <span className="font-medium text-slate-700">
                    {booking?.quantity} Person
                  </span>
                  <Button
                    variant="outline"
                    size={`xs`}
                    onClick={() => incrementQuantity()}
                    className="cursor-pointer"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            {/* Price Calculation */}
            <div className="space-y-2 pt-4 border-t border-slate-200 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({quantity} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (7%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
              <span className="font-bold text-slate-800">Total Amount</span>
              <span className="text-2xl font-bold text-emerald-600">
                ${grandTotal.toFixed(2)}
              </span>
            </div>

            {/* Security Note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
              Secure SSL Encrypted Transaction
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
