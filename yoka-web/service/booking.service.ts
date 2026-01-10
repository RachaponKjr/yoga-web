import http from "@/lib/http";

type BookingProps = {
  roundId: string;
  type: "ONLINE" | "OFFLINE";
  price: number;
  quantity?: number;
};

export const bookingService = {
  createBooking: async (data: BookingProps) => {
    const response = await http.post("/booking/create-booking", data);
    return response.data;
  },
};
