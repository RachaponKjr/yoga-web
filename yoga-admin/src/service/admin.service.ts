import http from "@/lib/http";

export const adminService = {
  getInstructors: async () => (await http.get("/admin/instructors")).data,
  createInstructor: async (payload: { email: string; password: string; firstName: string; lastName: string; phone_number: string; experience: string }) =>
    (await http.post("/admin/instructors", payload)).data,
  getDashboardStatus: async () => {
    const response = await http.get("/admin/stats");
    return response.data;
  },
  getBookingLast: async () => {
    const response = await http.get("/admin/booking-last");
    return response.data;
  },
  getRoundsAll: async () => {
    const response = await http.get("/course/rounds-all");
    return response.data;
  },

  getMonitorCountryStats: async () => {
    const response = await http.get("/admin/monitor-country-stats");
    return response.data;
  },
};
