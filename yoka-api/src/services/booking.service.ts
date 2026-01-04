import { BookingType } from "../types/order.type";
import prisma from "../config/prisma";

const createBookingService = async ({ payload }: { payload: BookingType }) => {
  const res = await prisma.booking.create({ data: payload });

  return res;
};

const getAllBookingService = async ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}) => {
  const res = await prisma.booking.findMany({
    include: {
      round: true,
      student: true,
    },
    take: limit,
    skip: offset,
  });

  return res;
};

const getBookingByIdService = async ({ id }: { id: string }) => {
  const res = await prisma.booking.findUnique({
    where: { id },
    include: {
      round: true,
      student: true,
    },
  });

  return res;
};

const getBookingByUserIdService = async ({ id }: { id: string }) => {
  const res = await prisma.booking.findMany({
    where: { studentId: id },
    include: {
      round: true,
      student: true,
    },
  });

  return res;
};

export {
  createBookingService,
  getAllBookingService,
  getBookingByIdService,
  getBookingByUserIdService,
};
