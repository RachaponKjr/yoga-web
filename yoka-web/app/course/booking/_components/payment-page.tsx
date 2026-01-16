"use client";

import { useBooking } from "@/store/useBooking";
import { formatRoundEnglish } from "@/utils/format";
import { useEffect, useState, useCallback } from "react"; // เพิ่ม useCallback
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
  X, // เพิ่ม icon สำหรับ loading ตอนคำนวณใหม่
} from "lucide-react";
import { bookingService } from "@/service/booking.service";
import { toast } from "sonner";
import { paymentService } from "@/service/payment.service";
import { useAuthStore } from "@/store/useAuthStore";
import { CouponService, VerifyCouponPayload } from "@/service/coupon.service";

const PaymentPage = () => {
  const { booking, decrementQuantity, incrementQuantity } = useBooking();
  const { user } = useAuthStore();
  const { createToken, loading: isScriptLoading } = useOmise();

  const [isProcessing, setIsProcessing] = useState(false);
  // เพิ่ม state เช็คว่ากำลังคำนวณคูปองใหม่อยู่ไหม
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const router = useRouter();

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [couponUsed, setCouponUsed] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [couponId, setCouponId] = useState("");

  // Price States
  const [finalPrice, setFinalPrice] = useState(0);

  // Card Form State
  const [cardDetail, setCardDetail] = useState({
    cardNumber: "",
    cardHolder: "",
    cardExpiry: "",
    cardCvv: "",
  });

  // --- Calculations ---
  const pricePerUnit = booking?.price || 0;
  const discountPrice = booking?.discount_price || 0;
  const quantity = booking?.quantity || 1;

  const subtotal = pricePerUnit * quantity;
  const itemDiscountTotal = discountPrice * quantity;
  const taxAmount = (subtotal - itemDiscountTotal) * 0.07;

  // คำนวณยอดรวม (ก่อนหักคูปอง)
  const grandTotalBeforeCoupon = subtotal + taxAmount - itemDiscountTotal;

  // ยอดที่ต้องจ่ายจริง
  const amountToPay = finalPrice !== 0 ? finalPrice : grandTotalBeforeCoupon;

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
      const tokenResponse = await createToken(cardObject);
      const omiseToken = tokenResponse.id;
      const { response: bookingRes } = await bookingService.createBooking({
        roundId: booking?.id || "",
        type: "ONLINE",
        quantity: quantity || 1,
        price: amountToPay,
      });

      const paymentRes = await paymentService.payment({
        orderId: bookingRes.data.data.id,
        couponId: couponId, // ส่ง Coupon ID ไปด้วยถ้ามี
        omiseToken,
      });

      if (paymentRes.success) {
        toast.success(paymentRes.data.message);
        router.push("/payment/success");
      }
    } catch (error: any) {
      console.error("❌ Error:", error);
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // แยก Logic การตรวจสอบคูปองออกมาเป็นฟังก์ชัน (เพื่อให้เรียกใช้ซ้ำได้)
  const verifyCouponLogic = useCallback(
    async (codeToCheck: string, currentTotal: number) => {
      try {
        setIsValidatingCoupon(true); // เริ่มโหลด
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
          // กรณีเคยใช้ได้ แต่พอปรับยอดแล้วใช้ไม่ได้ (เช่น ต่ำกว่า Min Spend)
          setCouponUsed(false);
          setCouponDiscount(0);
          setFinalPrice(0);
          setCouponId("");
          toast.error(`Coupon removed: ${res.message}`);
          return false;
        }
      } catch (error) {
        console.error(error);
        setCouponUsed(false);
        setCouponDiscount(0);
        setFinalPrice(0);
        setCouponId("");
        return false;
      } finally {
        setIsValidatingCoupon(false); // หยุดโหลด
      }
    },
    [user?.id]
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
    toast.info("Coupon removed");
  };

  // --- LOGIC ใหม่: Re-validate Coupon เมื่อ Quantity เปลี่ยน ---
  useEffect(() => {
    // ถ้ามีการใช้คูปองอยู่ และ จำนวนคนเปลี่ยน
    if (couponUsed && appliedCode) {
      // ใช้ Debounce เล็กน้อยกันยิง API รัวเกินไป
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
    booking?.endDateTime || ""
  );

  return (
    <div className="min-h-screen bg-white flex justify-center items-start pt-28 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto relative">
          {/* --- Left Column: Payment Form --- */}
          <div className="flex-1 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <CreditCard size={24} />
              </div>
              <h5 className="text-xl font-bold text-slate-800">
                Payment Details
              </h5>
            </div>

            {/* Visual Card Display */}
            <div className="mb-8 mx-auto w-full max-w-md aspect-[1.586/1] rounded-2xl bg-linear-to-br from-slate-800 via-slate-900 to-black text-white shadow-2xl relative overflow-hidden transition-all duration-300 group hover:scale-[1.02]">
              {/* (UI ส่วนบัตรคงเดิม) */}
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
              {/* Card Inputs (UI เดิม) */}
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
                  <div className="absolute right-3.5 top-3.5">
                    {cardDetail.cardNumber.length === 19 ? (
                      <Check size={18} className="text-emerald-500" />
                    ) : (
                      <Lock size={16} className="text-slate-400" />
                    )}
                  </div>
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
                  <div className="relative group">
                    <div className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <Calendar size={18} />
                    </div>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={cardDetail.cardExpiry}
                      onChange={handleCardChange}
                      maxLength={5}
                      placeholder="MM / YY"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-center text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    CVC / CVV
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <ShieldCheck size={18} />
                    </div>
                    <input
                      type="password"
                      name="cardCvv"
                      value={cardDetail.cardCvv}
                      onChange={handleCardChange}
                      maxLength={4}
                      placeholder="123"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-center text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Secure Note & Button */}
              <div>
                <div className="flex items-center gap-2 mb-4 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <Lock size={14} className="text-emerald-600" />
                  <span>Your transaction is secured with SSL encryption.</span>
                </div>

                <Button
                  type="submit"
                  // ป้องกันการกดจ่ายเงินถ้ากำลังโหลด Omise, กำลังประมวลผลจ่าย, หรือกำลังคำนวณคูปองใหม่
                  disabled={
                    isScriptLoading || isProcessing || isValidatingCoupon
                  }
                  className="w-full h-14 text-base font-bold rounded-xl shadow-md shadow-emerald-200 bg-emerald-600 hover:bg-emerald-700 text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </div>
                  ) : isValidatingCoupon ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Updating Price...
                    </div>
                  ) : (
                    `Pay $${amountToPay.toFixed(2)}`
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* --- Right Column: Booking Summary (Sticky) --- */}
          <div className="w-full lg:w-[420px]">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden lg:sticky lg:top-8">
              {/* Header */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h5 className="font-bold text-slate-800">Booking Summary</h5>
                <span className="text-xs font-medium px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-500">
                  ID: #{booking.id.slice(0, 8)}
                </span>
              </div>

              <div className="p-6">
                {/* Product Card */}
                <div className="flex gap-4 mb-6">
                  <div
                    className="w-20 h-20 bg-slate-100 rounded-xl shrink-0 bg-cover bg-center shadow-inner"
                    style={{
                      backgroundImage: `url("${process.env.NEXT_PUBLIC_HOST_IMAGE || "http://119.59.99.141:4001/"}${
                        booking?.cover_image || "https://placehold.co/100"
                      }")`,
                    }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <h6 className="font-bold text-slate-800 leading-tight truncate mb-1">
                      {booking?.title}
                    </h6>
                    <p className="text-xs text-slate-500 mb-2">
                      Yoga & Stretching Class
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded w-fit">
                      <Calendar size={12} />
                      {dateLabel} • {timeLabel}
                    </div>
                  </div>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center justify-between mb-6 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <User size={16} /> Guests
                  </span>
                  <div className="flex items-center gap-3 bg-white rounded-md shadow-sm border border-slate-200 px-1 py-1">
                    <button
                      // ลบ disabled={couponUsed} ออก เพื่อให้กดได้ตลอด
                      disabled={isValidatingCoupon} // แต่ disable ตอนกำลังคำนวณราคา
                      onClick={() => decrementQuantity()}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600 transition-colors disabled:opacity-50"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold text-slate-800 min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <button
                      // ลบ disabled={couponUsed} ออก
                      disabled={isValidatingCoupon}
                      onClick={() => incrementQuantity()}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600 transition-colors disabled:opacity-50"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200 my-4"></div>

                {/* Coupon Section */}
                <div className="mb-6">
                  {couponUsed ? (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center justify-between animate-in fade-in zoom-in duration-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 p-1.5 rounded-full text-emerald-600">
                          <Tag size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-800 flex items-center gap-2">
                            Coupon Applied
                            {isValidatingCoupon && (
                              <RefreshCw
                                size={10}
                                className="animate-spin text-emerald-500"
                              />
                            )}
                          </p>
                          <p className="text-xs text-emerald-600 font-mono">
                            {appliedCode}
                          </p>
                        </div>
                      </div>
                      {/* ถ้าอยากให้ลบออกได้ ก็ Uncomment ตรงนี้ */}
                      <button
                        onClick={removeCoupon}
                        className="text-emerald-400 hover:text-emerald-700 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Tag size={12} /> Discount Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) =>
                            setCouponCode(e.target.value.toUpperCase())
                          }
                          placeholder="ENTER CODE"
                          className="flex-1 bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 outline-none transition-all placeholder:text-slate-400 font-mono uppercase"
                        />
                        <Button
                          variant="outline"
                          size={"lg"}
                          onClick={handleApplyCoupon}
                          disabled={isValidatingCoupon}
                          className="hover:bg-slate-50 border-slate-200 text-slate-600"
                        >
                          {isValidatingCoupon ? (
                            <Loader2 className="animate-spin w-4 h-4" />
                          ) : (
                            "Apply"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  {itemDiscountTotal > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Item Discount</span>
                      <span>- ${itemDiscountTotal.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Tax (7%)</span>
                    <span className="font-medium">${taxAmount.toFixed(2)}</span>
                  </div>

                  {couponUsed && (
                    <div className="flex justify-between text-emerald-600 font-medium py-2 border-y border-dashed border-emerald-100 bg-emerald-50/50 px-2 -mx-2 rounded">
                      <span className="flex items-center gap-1">
                        <Tag size={12} /> Coupon Discount
                      </span>
                      <span className={isValidatingCoupon ? "opacity-50" : ""}>
                        - ${couponDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-end">
                    <div className="">
                      <span className="text-slate-500 text-xs">
                        Total Amount
                      </span>
                      <div className="text-3xl font-bold text-slate-900 leading-none mt-1 transition-all duration-300">
                        {isValidatingCoupon ? (
                          <span className="opacity-50">...</span>
                        ) : (
                          `$${amountToPay.toFixed(2)}`
                        )}
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
