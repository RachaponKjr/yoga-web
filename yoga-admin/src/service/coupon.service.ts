import http from "@/lib/http";

export const CouponService = {
  getCoupon: async () => {
    const response = await http.get("/coupon");
    return response.data;
  },

  createCoupon: async (payload: any) => {
    const response = await http.post("/coupon", payload);
    return response.data;
  },

  verifyCoupon: async (payload: any) => {
    const response = await http.post("/coupon/verify", payload);
    return response.data;
  },

  statusCoupon: async (payload: { isActive: boolean; id: string }) => {
    const response = await http.patch(`/coupon/${payload.id}`, payload);
    return response.data;
  },

  deleteCoupon: async (id: string) => {
    const response = await http.delete(`/coupon/${id}`);
    return response.data;
  },
};
