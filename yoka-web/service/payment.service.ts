import http from "@/lib/http";

type PaymentProps = {
  orderId: string;
  omiseToken: string;
  couponId?: string;
};

export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

export const paymentService = {
  // รับ config เพิ่มเติม (เผื่อส่ง Cookie จาก Server)
  payment: async (data: PaymentProps) => {
    const token = getCookie("token");
    const response = await http.post("/payment/checkout", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response.data;
  },
};
