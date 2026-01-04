import http from "@/lib/http";

export const adminService = {
  getDashboardStatus: async () => {
    const response = await http.get("/admin/stats");
    return response.data;
  },
  getBookingLast: async () => {
    const response = await http.get("/admin/booking-last");
    return response.data;
  },
};
