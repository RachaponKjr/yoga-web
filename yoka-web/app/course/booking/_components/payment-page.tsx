/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useBooking } from "@/store/useBooking";
import { formatRoundEnglish } from "@/utils/format";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OmiseCardInputs, useOmise } from "@/hooks/useOmise";
import {
  Loader2,
  Tag,
  CreditCard,
  Calendar,
  User,
  Lock,
  Check,
  ShieldCheck,
  Minus,
  Plus,
  RefreshCw,
  X,
  Camera,
  FileText,
  HeartPulse,
  MessageSquarePlus,
} from "lucide-react";
import { bookingService } from "@/service/booking.service";
import { toast } from "sonner";
import { paymentService } from "@/service/payment.service";
import { useAuthStore } from "@/store/useAuthStore";
import { CouponService, VerifyCouponPayload } from "@/service/coupon.service";
import { Textarea } from "@/components/ui/textarea";
import Policy from "./policy";
import Link from "next/link";

const PaymentPage = () => {
  const { booking, decrementQuantity, incrementQuantity } = useBooking();
  const { user } = useAuthStore();
  const { createToken, loading: isScriptLoading } = useOmise();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
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
    <div className="min-h-screen bg-white flex justify-center items-start py-10 md:pt-20 md:pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row gap-8 max-w-7xl mx-auto relative">
          {/* --- Left Column: Payment Form --- */}
          <div className="flex-1 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-100">
            {/* Payment Header & Card Visual (Same as your original UI) */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <CreditCard size={24} />
              </div>
              <h5 className="text-xl font-bold text-slate-800">
                Payment Details
              </h5>
            </div>

            {/* Visual Card Display */}
            <div className="mb-8 mx-auto w-full max-w-md aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white shadow-2xl relative overflow-hidden transition-all duration-300 group hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-8 bg-white/20 rounded-md backdrop-blur-sm border border-white/10"></div>
                  <span className="font-mono text-white/50 text-sm tracking-wider">
                    DEBIT/CREDIT
                  </span>
                </div>
                <div className="space-y-6">
                  <div className="font-mono text-2xl lg:text-3xl tracking-widest drop-shadow-md">
                    {cardDetail.cardNumber || "**** **** **** ****"}
                  </div>
                  <div className="flex justify-between items-end text-sm">
                    <div className="space-y-1">
                      <p className="text-white/40 text-[10px] uppercase tracking-wider">
                        Card Holder
                      </p>
                      <p className="font-semibold tracking-wide uppercase truncate max-w-[180px]">
                        {cardDetail.cardHolder || "YOUR NAME"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-white/40 text-[10px] uppercase tracking-wider">
                        Expires
                      </p>
                      <p className="font-semibold tracking-widest">
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
                <label className="text-sm font-semibold text-slate-700">
                  Card Number
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <CreditCard size={18} />
                  </div>
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardDetail.cardNumber}
                    onChange={handleCardChange}
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Cardholder Name
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="cardHolder"
                    value={cardDetail.cardHolder}
                    onChange={handleCardChange}
                    placeholder="NAME ON CARD"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all uppercase text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="cardExpiry"
                    value={cardDetail.cardExpiry}
                    onChange={handleCardChange}
                    maxLength={5}
                    placeholder="MM / YY"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-center"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    CVC / CVV
                  </label>
                  <input
                    type="password"
                    name="cardCvv"
                    value={cardDetail.cardCvv}
                    onChange={handleCardChange}
                    maxLength={4}
                    placeholder="123"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-center"
                  />
                </div>
              </div>

              {/* Consent & Notes (Same as your original UI) */}
              <div
                className={`bg-slate-50 rounded-xl p-4 border transition-colors ${isConsentAccepted ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200"}`}
              >
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isConsentAccepted}
                    onChange={(e) => setIsConsentAccepted(e.target.checked)}
                    className="mt-1 h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800 block mb-1">
                      Data Privacy & Consent
                    </span>
                    <p className="leading-relaxed text-xs">
                      I agree to the collection of my data and photography/video
                      consent for promotional purposes.
                    </p>
                  </div>
                </label>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <label className="flex items-center gap-2 mb-2 font-semibold text-slate-800 text-sm">
                  <HeartPulse size={16} className="text-rose-500" />{" "}
                  ข้อมูลสุขภาพ & ความต้องการเพิ่มเติม
                </label>
                <Textarea
                  placeholder="เช่น มีอาการปวดหลัง, ผ่าตัดเข่ามา หรืออยากเน้นส่วนไหนเป็นพิเศษ..."
                  className="bg-white"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div
                className={`bg-slate-50 rounded-xl p-4 border transition-colors ${isPolicyAccepted ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200"}`}
              >
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isPolicyAccepted}
                    onChange={(e) => setIsPolicyAccepted(e.target.checked)}
                    className="mt-1 h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800 block mb-1">
                      Privacy Policy & Refund Policy
                    </span>
                    <div className="flex flex-col md:flex-row md:gap-2">
                      <Link
                        href="/policy"
                        target="_blank"
                        className="text-gray-400 hover:text-emerald-700"
                      >
                        อ่านนโยบายความเป็นส่วนตัว
                      </Link>
                      <p className="text-gray-400 hidden md:flex">/</p>
                      <Link
                        href="/refund"
                        target="_blank"
                        className="text-gray-400 hover:text-emerald-700"
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
                className="w-full h-14 text-lg font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  `ชำระเงิน ฿${Math.round(amountToPay).toLocaleString()}`
                )}
              </Button>
            </form>
          </div>

          {/* --- Right Column: Booking Summary --- */}
          <div className="w-full lg:w-[420px]">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden lg:sticky lg:top-8">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h5 className="font-bold text-slate-800">Booking Summary</h5>
              </div>

              <div className="p-6">
                {/* Product Detail */}
                <div className="flex gap-4 mb-6">
                  <div
                    className="w-20 h-20 bg-slate-100 rounded-xl shrink-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url("${process.env.NEXT_PUBLIC_HOST_IMAGE || "https://api.yogabyniti.com/"}${booking?.cover_image}")`,
                    }}
                  ></div>
                  <div className="flex-1">
                    <h6 className="font-bold text-slate-800 leading-tight truncate">
                      {booking?.title}
                    </h6>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-2 bg-slate-50 p-1.5 rounded">
                      <Calendar size={12} /> {dateLabel} • {timeLabel}
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between mb-6 p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-600">
                    จำนวนผู้เข้าใช้งาน
                  </span>
                  <div className="flex items-center gap-3 bg-white rounded-md border p-1">
                    <button
                      onClick={() => decrementQuantity()}
                      className="p-1 hover:bg-slate-100"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold px-2">{quantity}</span>
                    <button
                      onClick={() => incrementQuantity()}
                      className="p-1 hover:bg-slate-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Coupon Input */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      placeholder="โค้ดส่วนลด"
                      className="flex-1 border rounded-lg px-3 py-2 uppercase font-mono text-sm"
                    />
                    <Button
                      variant="outline"
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
                    <div className="mt-2 text-xs text-emerald-600 flex justify-between items-center bg-emerald-50 p-2 rounded">
                      <span>ใช้โค้ด {appliedCode} สำเร็จ</span>
                      <button onClick={removeCoupon}>
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Breakdown THB */}
                <div className="space-y-3 text-sm border-t pt-4">
                  <div className="flex justify-between text-slate-600">
                    <span>ราคาปกติ (x{quantity})</span>
                    <span>฿{subtotal.toLocaleString()}</span>
                  </div>

                  {itemDiscountTotal > 0 && (
                    <div className="flex justify-between text-rose-500">
                      <span>ส่วนลดพิเศษ</span>
                      <span>- ฿{itemDiscountTotal.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>ภาษี (7%)</span>
                    <span>
                      ฿
                      {taxAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {couponUsed && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>ส่วนลดคูปอง</span>
                      <span>- ฿{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-end">
                    <div>
                      <span className="text-slate-500 text-xs">
                        ยอดรวมสุทธิ
                      </span>
                      <div className="text-3xl font-black text-slate-900 mt-1">
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
    </div>
  );
};

export default PaymentPage;
