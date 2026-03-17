import http from "@/lib/http";
import type { PayloadProps } from "@/pages/book-page/dialog/DialogEdit";

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
  updateBookingService: async (id: string, payload: PayloadProps) => {
    const response = await http.patch(
      `/booking/update-booking/${id}`,
      { payload },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      },
    );
    return response.data;
  },

  getBookingById: async (id: string) => {
    const response = await http.get(`/booking/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    });
    return response.data;
  },
};
