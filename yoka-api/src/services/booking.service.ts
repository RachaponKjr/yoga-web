import { BookingType } from "../types/order.type";
import prisma from "../config/prisma";

export interface PayloadProps {
  status: string;
  roundId: string;
  courseId: string;
  teacherId: string;
  price: number;
  description: string;
}

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
      round: {
        include: {
          course: true,
        },
      },
      student: {
        include: {
          userInfo: true,
        },
      },
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

const updateBookingService = async ({
  id,
  payload,
}: {
  id: string;
  payload: PayloadProps;
}) => {
  const { roundId, courseId, teacherId, price, description } = payload;

  const round = await prisma.courseRound.update({
    where: { id: roundId },
    data: { courseId, teacherId },
  });

  const res = await prisma.booking.update({
    where: { id },
    data: {
      round: {
        connect: { id: roundId },
      },
      price,
      description,
    },
  });

  const payloadRes = {
    ...round,
    ...res,
  };

  return payloadRes;
};

export {
  createBookingService,
  getAllBookingService,
  getBookingByIdService,
  getBookingByUserIdService,
  updateBookingService,
};
