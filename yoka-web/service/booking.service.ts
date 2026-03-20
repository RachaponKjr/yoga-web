import http from "@/lib/http";
import { getCookie } from "./payment.service";

type BookingProps = {
  roundId: string;
  type: "ONLINE" | "OFFLINE";
  price: number;
  agreeToPrivacyPolicy: boolean;
  quantity?: number;
  isAgree: boolean;
  note?: string;
};

export const bookingService = {
  createBooking: async (data: BookingProps) => {
    const { data: response, status } = await http.post(
      "/booking/create-booking",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      },
    );
    return { response, status };
  },

  getMyBooking: async (userId: string) => {
    const { data: response, status } = await http.get(
      `/booking/booking-user/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      },
    );
    return { response, status };
  },

  cancelBooking: async (bookingId: string, message: string) => {
    const { data: response, status } = await http.post(
      `/booking/cancel-booking/${bookingId}`,
      {
        description: message,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      },
    );
    return { response, status };
  },
};
