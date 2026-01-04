import http from "@/lib/http";

export const bookingService = {
  getAllBooking: async () => {
    const response = await http.get("/booking/all-booking", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    });
    return response.data;
  },
};
