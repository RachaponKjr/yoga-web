import http from "@/lib/http";

type PaymentProps = {
  orderId: string;
  omiseToken: string;
};

export const paymentService = {
  // รับ config เพิ่มเติม (เผื่อส่ง Cookie จาก Server)
  payment: async (data: PaymentProps) => {
    const response = await http.post("/payment/checkout", data);
    return response.data;
  },
};
