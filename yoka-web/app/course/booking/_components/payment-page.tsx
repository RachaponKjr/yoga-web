/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { imageUrl } from "@/lib/image-url";
import { useBooking } from "@/store/useBooking";
import { formatRoundEnglish } from "@/utils/format";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OmiseCardInputs, useOmise } from "@/hooks/useOmise";
import {
  Loader2,
  CreditCard,
  ArrowLeft,
  Leaf,
  Calendar,
  User,
  Minus,
  Plus,
  X,
  HeartPulse,
} from "lucide-react";
import { bookingService } from "@/service/booking.service";
import { toast } from "sonner";
import { paymentService } from "@/service/payment.service";
import { useAuthStore } from "@/store/useAuthStore";
import { CouponService, VerifyCouponPayload } from "@/service/coupon.service";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const PaymentPage = () => {
  const { booking, decrementQuantity, incrementQuantity } = useBooking();
  const { user } = useAuthStore();
  const { createToken, loading: isScriptLoading } = useOmise();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [isAgree] = useState(false);
  const [isConsentAccepted, setIsConsentAccepted] = useState(false);
  const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);

  const router = useRouter();

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [couponUsed, setCouponUsed] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [couponId, setCouponId] = useState("");
  const [note, setNote] = useState("");

  // Price State (Final Rounded Price)
  const [finalPrice, setFinalPrice] = useState(0);

  const [cardDetail, setCardDetail] = useState({
    cardNumber: "",
    cardHolder: "",
    cardExpiry: "",
    cardCvv: "",
  });

  // --- 🇹🇭 THB Logic Calculations ---
  const pricePerUnit = booking?.price || 0;
  const discountPricePerUnit = booking?.discount_price || 0;
  const quantity = booking?.quantity || 1;

  // 1. ยอดรวมก่อนหักส่วนลด (Subtotal)
  const subtotal = pricePerUnit * quantity;

  // 2. ส่วนลดจากโปรโมชั่นสินค้า (Item Discount)
  const itemDiscountTotal =
    discountPricePerUnit > 0
      ? (pricePerUnit - discountPricePerUnit) * quantity
      : 0;

  // 3. ยอดหลังหักส่วนลดสินค้า (Price after item discount)
  const priceAfterItemDiscount = subtotal - itemDiscountTotal;

  // 4. ภาษี 7% (Tax) - คำนวณจากยอดที่ต้องจ่ายจริงก่อนคูปอง
  const taxAmount = priceAfterItemDiscount * 0.07;

  // 5. ยอดสุทธิก่อนใช้คูปอง (Grand Total)
  const grandTotalBeforeCoupon = priceAfterItemDiscount + taxAmount;

  // 6. ยอดที่ต้องชำระจริง (Final Calculation)
  // หมายเหตุ: finalPrice จาก API คูปองควรถูกคำนวณรวมภาษีมาแล้ว แต่ถ้าเป็นยอดดิบ เราจะยึดตาม API
  const amountToPay =
    couponUsed && finalPrice > 0 ? finalPrice : grandTotalBeforeCoupon;

  // --- Handlers ---
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      const raw = value.replace(/\D/g, "").slice(0, 16);
      formattedValue = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    } else if (name === "cardExpiry") {
      const raw = value.replace(/\D/g, "").slice(0, 4);
      if (raw.length >= 2) {
        formattedValue = `${raw.slice(0, 2)}/${raw.slice(2)}`;
      } else {
        formattedValue = raw;
      }
    } else if (name === "cardCvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    } else if (name === "cardHolder") {
      formattedValue = value.toUpperCase();
    }

    setCardDetail((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPolicyAccepted) {
      toast.error("Please accept the privacy policy and consent terms.");
      return;
    }
    const { cardNumber, cardHolder, cardExpiry, cardCvv } = cardDetail;
    const rawCardNumber = cardNumber.replace(/\s/g, "");

    if (rawCardNumber.length < 16) {
      toast.error("Invalid card number");
      return;
    }
    if (cardExpiry.length < 5) {
      toast.error("Invalid expiry date");
      return;
    }
    if (cardCvv.length < 3) {
      toast.error("Invalid CVC/CVV");
      return;
    }

    setIsProcessing(true);
    const [expMonth, expYear] = cardExpiry.split("/");

    const cardObject: OmiseCardInputs = {
      name: cardHolder,
      number: rawCardNumber,
      expiration_month: parseInt(expMonth),
      expiration_year: parseInt("20" + expYear),
      security_code: cardCvv,
    };

    try {
      const tokenResponse = await createToken(cardObject);
      const omiseToken = tokenResponse.id;

      // สร้าง Booking
      const { response: bookingRes } = await bookingService.createBooking({
        roundId: booking?.id || "",
        type: "ONLINE",
        quantity: quantity || 1,
        agreeToPrivacyPolicy: isConsentAccepted,
        price: Math.round(amountToPay), // ปัดเศษให้เป็นจำนวนเต็มสำหรับหน่วยบาท (ป้องกันปัญหาทศนิยมใน DB)
        isAgree: isAgree,
        note: note,
      });

      // ชำระเงิน
      const paymentRes = await paymentService.payment({
        orderId: bookingRes.data.data.id,
        couponId: couponId,
        omiseToken,
      });
      if (paymentRes.data.authorizeUri) {
        // ย้ายหน้าไปที่หน้ากรอก OTP ของธนาคาร
        window.location.href = paymentRes.data.authorizeUri;
      } else {
        // ถ้าไม่มี (ชำระสำเร็จเลย) ก็ไปหน้าขอบคุณ
        toast.success(paymentRes.message);
        router.push(`/payment/success?bookingId=${bookingRes.data.data.id}`);
      }
    } catch (error: any) {
      console.error("❌ Error:", error);
      const message =
        error.response?.data?.message || error.message || "Payment failed";
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyCouponLogic = useCallback(
    async (codeToCheck: string, currentTotal: number) => {
      try {
        setIsValidatingCoupon(true);
        const payload: VerifyCouponPayload = {
          code: codeToCheck,
          cartTotal: currentTotal,
          userId: user?.id || "",
        };
        const res = await CouponService.verifyCoupon(payload);

        if (res.valid) {
          setCouponUsed(true);
          setAppliedCode(codeToCheck);
          setCouponDiscount(res.discountAmount);
          setFinalPrice(res.finalPrice);
          setCouponId(res.id);
          return true;
        } else {
          removeCoupon();
          toast.error(`Coupon removed: ${res.message}`);
          return false;
        }
      } catch (error) {
        console.error(error);
        removeCoupon();
        return false;
      } finally {
        setIsValidatingCoupon(false);
      }
    },
    [user?.id],
  );

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    const isValid = await verifyCouponLogic(couponCode, grandTotalBeforeCoupon);
    if (isValid) {
      toast.success("Coupon applied successfully!");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setCouponUsed(false);
    setCouponCode("");
    setAppliedCode("");
    setCouponDiscount(0);
    setFinalPrice(0);
    setCouponId("");
  };

  useEffect(() => {
    if (couponUsed && appliedCode) {
      const timer = setTimeout(() => {
        verifyCouponLogic(appliedCode, grandTotalBeforeCoupon);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [
    quantity,
    grandTotalBeforeCoupon,
    couponUsed,
    appliedCode,
    verifyCouponLogic,
  ]);

  useEffect(() => {
    if (!booking) {
      router.push("/");
    }
  }, [booking, router]);

  if (!booking) return null;

  const { dateLabel, timeLabel } = formatRoundEnglish(
    booking?.startDateTime || "",
    booking?.endDateTime || "",
  );

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#30372c] py-8 md:pb-20">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-7">
        <Link href={`/course?courseId=${booking.courseId}&date=${encodeURIComponent(booking.startDateTime)}`} className="inline-flex items-center gap-2 rounded-sm text-xs text-[#737b62] hover:text-[#454d39] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#788461]"><ArrowLeft className="size-3.5" /> กลับไปหน้าคอร์ส</Link>
        <header className="flex items-end justify-between gap-6 py-9 md:py-12">
          <div><p className="mb-4 flex items-center gap-3 text-[9px] tracking-[0.24em] text-[#737b62]"><span className="size-1.5 rounded-full bg-[#8c9778]" /> YOUR NEXT MOMENT</p><h1 className="font-serif text-4xl font-normal leading-tight tracking-[-0.035em] md:text-6xl">Make time for yourself.</h1><p className="mt-4 text-sm leading-relaxed text-[#73766b]">ตรวจสอบรายละเอียดการจอง แล้วเริ่มต้นช่วงเวลาดี ๆ ของคุณ</p></div>
          <Leaf className="mb-2 hidden size-10 shrink-0 text-[#929d7f] sm:block" strokeWidth={1} aria-hidden="true" />
        </header>
        <ol aria-label="ขั้นตอนการจอง" className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-[#dedfd4] py-4 text-[11px] md:gap-x-10">
          <li className="flex items-center gap-2 text-[#737b62]"><span className="text-[9px]">01</span> เลือกคลาส</li>
          <li aria-current="step" className="flex items-center gap-2 text-[#454d39]"><span className="flex size-5 items-center justify-center rounded-full bg-[#48533b] text-[9px] text-[#fffef5]">02</span> จองและชำระเงิน</li>
          <li className="flex items-center gap-2 text-[#858d79]"><span className="text-[9px]">03</span> ยืนยันการจอง</li>
        </ol>
        <div className="flex flex-col-reverse lg:flex-row gap-8 max-w-7xl mx-auto relative">
          {/* --- Left Column: Payment Form --- */}
          <div className="flex-1 min-w-0 bg-[#fffefa] rounded-md p-5 sm:p-6 lg:p-8 border border-[#dedfd4]">
            {/* Payment Header & Card Visual (Same as your original UI) */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[#eef0e5] rounded-sm text-[#737f5f]">
                <CreditCard size={24} />
              </div>
              <h2 className="text-xl font-normal text-[#454d39]">
                Payment Details
              </h2>
            </div>

            {/* Visual Card Display */}
            <div className="mb-8 mx-auto w-full max-w-md min-h-[210px] aspect-[1.586/1] rounded-lg bg-[#3c4833] text-[#fffdf2] border border-[#637252] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#bdc9a5]/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
              <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-8 bg-white/20 rounded-md backdrop-blur-sm border border-white/10"></div>
                  <span className="text-[#c4ceb5] text-[9px] tracking-[0.2em]">
                    DEBIT/CREDIT
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="font-mono text-base sm:text-2xl lg:text-3xl tracking-wider">
                    {cardDetail.cardNumber || "**** **** **** ****"}
                  </div>
                  <div className="flex justify-between items-end text-sm">
                    <div className="space-y-1">
                      <p className="text-[#bcc7ab] text-[10px] uppercase tracking-wider">
                        Card Holder
                      </p>
                      <p className="font-normal tracking-wide uppercase truncate max-w-[130px] sm:max-w-[180px]">
                        {cardDetail.cardHolder || "YOUR NAME"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#bcc7ab] text-[10px] uppercase tracking-wider">
                        Expires
                      </p>
                      <p className="font-normal tracking-widest">
                        {cardDetail.cardExpiry || "MM/YY"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleConfirmPayment}
              className="space-y-5 max-w-md mx-auto lg:max-w-none"
            >
              {/* Card Inputs (Same as your original UI) */}
              <div className="space-y-1.5">
                <label htmlFor="cardNumber" className="text-xs font-medium text-[#58634a]">
                  Card Number
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-3.5 text-[#858d79] group-focus-within:text-[#788461] transition-colors">
                    <CreditCard size={18} />
                  </div>
                  <input
                    type="text"
                    id="cardNumber"
                    autoComplete="cc-number"
                    inputMode="numeric"
                    name="cardNumber"
                    value={cardDetail.cardNumber}
                    onChange={handleCardChange}
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                    className="w-full pl-10 pr-4 py-3 bg-[#fafbf6] border border-[#d5dcc7] rounded-sm focus:ring-2 focus:ring-[#788461]/15 focus:border-[#788461] outline-none transition-all font-mono text-[#454d39] placeholder:text-[#858d79]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="cardHolder" className="text-xs font-medium text-[#58634a]">
                  Cardholder Name
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-3.5 text-[#858d79] group-focus-within:text-[#788461] transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    id="cardHolder"
                    autoComplete="cc-name"
                    name="cardHolder"
                    value={cardDetail.cardHolder}
                    onChange={handleCardChange}
                    placeholder="NAME ON CARD"
                    className="w-full pl-10 pr-4 py-3 bg-[#fafbf6] border border-[#d5dcc7] rounded-sm focus:ring-2 focus:ring-[#788461]/15 focus:border-[#788461] outline-none transition-all uppercase text-[#454d39] placeholder:text-[#858d79]"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 min-w-0 space-y-1.5">
                  <label htmlFor="cardExpiry" className="text-xs font-medium text-[#58634a]">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="cardExpiry"
                    autoComplete="cc-exp"
                    inputMode="numeric"
                    name="cardExpiry"
                    value={cardDetail.cardExpiry}
                    onChange={handleCardChange}
                    maxLength={5}
                    placeholder="MM / YY"
                    className="w-full px-4 py-3 bg-[#fafbf6] border border-[#d5dcc7] rounded-sm focus:ring-2 focus:ring-[#788461]/15 focus:border-[#788461] outline-none transition-all text-center"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <label htmlFor="cardCvv" className="text-xs font-medium text-[#58634a]">
                    CVC / CVV
                  </label>
                  <input
                    type="password"
                    id="cardCvv"
                    autoComplete="cc-csc"
                    inputMode="numeric"
                    name="cardCvv"
                    value={cardDetail.cardCvv}
                    onChange={handleCardChange}
                    maxLength={4}
                    placeholder="123"
                    className="w-full px-4 py-3 bg-[#fafbf6] border border-[#d5dcc7] rounded-sm focus:ring-2 focus:ring-[#788461]/15 focus:border-[#788461] outline-none transition-all text-center"
                  />
                </div>
              </div>

              {/* Consent & Notes (Same as your original UI) */}
              <div
                className={`bg-[#f5f6ef] rounded-sm p-4 border transition-colors ${isConsentAccepted ? "border-[#a9b594] bg-[#eef1e5]" : "border-[#d5dcc7]"}`}
              >
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isConsentAccepted}
                    onChange={(e) => setIsConsentAccepted(e.target.checked)}
                    className="mt-1 h-5 w-5 shrink-0 rounded border-[#cdd5bd] accent-[#626d4f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#788461]"
                  />
                  <div className="flex-1 text-sm text-[#73766b]">
                    <span className="font-medium text-[#454d39] block mb-1">
                      Data Privacy & Consent
                    </span>
                    <p className="leading-relaxed text-xs">
                      I agree to the collection of my data and photography/video
                      consent for promotional purposes.
                    </p>
                  </div>
                </label>
              </div>

              <div className="bg-[#f5f6ef] rounded-sm p-4 border border-[#d5dcc7]">
                <label htmlFor="booking-note" className="flex items-center gap-2 mb-2 font-medium text-[#454d39] text-sm">
                  <HeartPulse size={16} className="text-[#7d8867]" />{" "}
                  ข้อมูลสุขภาพ & ความต้องการเพิ่มเติม
                </label>
                <Textarea
                  id="booking-note"
                  placeholder="เช่น มีอาการปวดหลัง, ผ่าตัดเข่ามา หรืออยากเน้นส่วนไหนเป็นพิเศษ..."
                  className="min-h-28 rounded-sm bg-[#fffefa] border-[#d5dcc7] text-sm shadow-none focus-visible:border-[#788461] focus-visible:ring-[#788461]/20"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div
                className={`bg-[#f5f6ef] rounded-sm p-4 border transition-colors ${isPolicyAccepted ? "border-[#a9b594] bg-[#eef1e5]" : "border-[#d5dcc7]"}`}
              >
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isPolicyAccepted}
                    onChange={(e) => setIsPolicyAccepted(e.target.checked)}
                    className="mt-1 h-5 w-5 shrink-0 rounded border-[#cdd5bd] accent-[#626d4f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#788461]"
                  />
                  <div className="flex-1 text-sm text-[#73766b]">
                    <span className="font-medium text-[#454d39] block mb-1">
                      Privacy Policy & Refund Policy
                    </span>
                    <div className="flex flex-col md:flex-row md:gap-2">
                      <Link
                        href="/policy"
                        target="_blank"
                        className="text-[#737b62] underline underline-offset-4 hover:text-[#454d39]"
                      >
                        อ่านนโยบายความเป็นส่วนตัว
                      </Link>
                      <p className="text-[#858d79] hidden md:flex">/</p>
                      <Link
                        href="/refund"
                        target="_blank"
                        className="text-[#737b62] underline underline-offset-4 hover:text-[#454d39]"
                      >
                        อ่านนโยบายการคืนเงิน
                      </Link>
                    </div>
                  </div>
                </label>
              </div>

              {/* Pay Button */}
              <Button
                type="submit"
                disabled={isScriptLoading || isProcessing || isValidatingCoupon}
                className="w-full h-13 text-base font-normal rounded-sm bg-[#48533b] hover:bg-[#303c26] text-[#fffef5] shadow-none"
              >
                {isProcessing ? (
                  <><Loader2 className="animate-spin size-4" /> กำลังดำเนินการ…</>
                ) : (
                  `ชำระเงิน ฿${Math.round(amountToPay).toLocaleString()}`
                )}
              </Button>
            </form>
          </div>

          {/* --- Right Column: Booking Summary --- */}
          <div className="w-full lg:w-[420px]">
            <div className="bg-[#fffefa] rounded-md border border-[#dedfd4] overflow-hidden lg:sticky lg:top-28">
              <div className="bg-[#f0f2e8] px-6 py-5 border-b border-[#dedfd4] flex justify-between items-center">
                <h2 className="font-normal text-[#454d39]">Booking Summary</h2>
              </div>

              <div className="p-6">
                {/* Product Detail */}
                <div className="flex gap-4 mb-6">
                  <div
                    className="w-20 h-24 bg-[#e9ecdf] rounded-sm shrink-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url("${imageUrl(booking?.cover_image)}")`,
                    }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#454d39] leading-snug break-words">
                      {booking?.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-[#73766b] mt-2 leading-relaxed">
                      <Calendar size={14} className="shrink-0" /> {dateLabel} • {timeLabel}
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between mb-6 p-3 bg-[#f0f2e8] rounded-sm">
                  <span className="text-sm font-medium text-[#73766b]">
                    จำนวนผู้เข้าใช้งาน
                  </span>
                  <div className="flex items-center gap-2 bg-[#fffefa] rounded-sm border border-[#d5dcc7] p-1">
                    <button
                      aria-label="ลดจำนวนผู้เรียน"
                      disabled={quantity <= 1}
                      onClick={() => decrementQuantity()}
                      className="p-2 rounded-sm hover:bg-[#eef0e5] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#788461]"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-medium text-sm px-2">{quantity}</span>
                    <button
                      aria-label="เพิ่มจำนวนผู้เรียน"
                      onClick={() => incrementQuantity()}
                      className="p-2 rounded-sm hover:bg-[#eef0e5] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#788461]"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Coupon Input */}
                <div className="mb-6">
                  <label htmlFor="couponCode" className="mb-2 block text-xs text-[#737b62]">โค้ดส่วนลด</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="couponCode"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      placeholder="โค้ดส่วนลด"
                      className="min-w-0 flex-1 border border-[#d5dcc7] bg-[#fafbf6] rounded-sm px-3 py-2 uppercase font-mono text-sm outline-none focus:border-[#788461] focus:ring-2 focus:ring-[#788461]/15"
                    />
                    <Button
                      variant="outline"
                      className="h-10 rounded-sm border-[#d5dcc7] bg-transparent text-[#58634a] shadow-none hover:bg-[#eef0e5]"
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon}
                    >
                      {isValidatingCoupon ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        "ใช้โค้ด"
                      )}
                    </Button>
                  </div>
                  {couponUsed && (
                    <div className="mt-2 text-xs text-[#65734f] flex justify-between items-center bg-[#e8eddd] p-2 rounded">
                      <span>ใช้โค้ด {appliedCode} สำเร็จ</span>
                      <button aria-label="นำโค้ดส่วนลดออก" className="p-1 rounded-sm focus-visible:outline-2 focus-visible:outline-[#788461]" onClick={removeCoupon}>
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Breakdown THB */}
                <div className="space-y-3 text-sm border-t pt-4">
                  <div className="flex justify-between text-[#73766b]">
                    <span>ราคาปกติ (x{quantity})</span>
                    <span>฿{subtotal.toLocaleString()}</span>
                  </div>

                  {itemDiscountTotal > 0 && (
                    <div className="flex justify-between text-[#7d8867]">
                      <span>ส่วนลดพิเศษ</span>
                      <span>- ฿{itemDiscountTotal.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#73766b]">
                    <span>ภาษี (7%)</span>
                    <span>
                      ฿
                      {taxAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {couponUsed && (
                    <div className="flex justify-between text-[#737f5f] font-medium">
                      <span>ส่วนลดคูปอง</span>
                      <span>- ฿{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-4 mt-4 border-t border-[#dedfd4] flex justify-between items-end">
                    <div>
                      <span className="text-[#737b62] text-xs">
                        ยอดรวมสุทธิ
                      </span>
                      <div className="text-4xl font-serif font-normal text-[#454d39] mt-1">
                        ฿{Math.round(amountToPay).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentPage;
