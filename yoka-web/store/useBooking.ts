import { RoundCourseType } from "@/types/course.type";
import { create } from "zustand";

interface Booking extends RoundCourseType {
  quantity: number;
  title: string;
  price: number;
  discount_price?: number;
  cover_image?: string;
}

interface BookingState {
  booking: Booking | null;
  setBooking: (booking: Booking) => void;
  resetBooking: () => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
}

export const useBooking = create<BookingState>((set) => ({
  booking: null,
  setBooking: (booking: Booking) => set({ booking }),
  resetBooking: () => set({ booking: null }),
  incrementQuantity: () =>
    set((state) => {
      if (!state.booking) return {};
      return {
        booking: {
          ...state.booking,
          quantity: state.booking.quantity + 1,
        },
      };
    }),

  decrementQuantity: () =>
    set((state) => {
      if (!state.booking || state.booking.quantity <= 1) return {};
      return {
        booking: {
          ...state.booking,
          quantity: state.booking.quantity - 1,
        },
      };
    }),
}));
