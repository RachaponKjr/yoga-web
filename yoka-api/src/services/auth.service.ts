import { RegisterInput, UpdateProfileInput } from "../types/auth.type";
import prisma from "../config/prisma";

const registerService = async ({ payload }: { payload: RegisterInput }) => {
  const res = await prisma.user.create({
    data: {
      ...payload,
      userInfo: {
        create: {},
      },
    },
  });

  return res;
};

const checkUserExistService = async ({ email }: { email: string }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      userInfo: true,
    },
  });

  return user;
};

const getUserService = async ({ id }: { id: string }) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      role: true,
      email: true,
      userInfo: {
        select: {
          sex: true,
          avatar: true,
          firstName: true,
          lastName: true,
          experience: true,
          facebook: true,
          instagram: true,
          twitter: true,
          phone_number: true,
          country: true,
        },
      },
    },
  });

  return user;
};

const updateProfilService = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateProfileInput;
}) => {
  const user = await prisma.userInfo.update({
    where: {
      userId: id,
    },
    data: {
      ...payload,
    },
  });

  return user;
};

const getInstructorService = async () => {
  const user = await prisma.user.findMany({
    where: {
      role: "Instructor",
    },
    select: {
      id: true,
      role: true,
      email: true,
      userInfo: {
        select: {
          sex: true,
          avatar: true,
          firstName: true,
          lastName: true,
          experience: true,
          facebook: true,
          instagram: true,
          twitter: true,
        },
      },
    },
  });

  return user;
};

const getUserAllService = async () => {
  const user = await prisma.user.findMany({
    include: { userInfo: true, bookings: true },
  });

  return user;
};

export {
  registerService,
  checkUserExistService,
  getUserService,
  updateProfilService,
  getInstructorService,
  getUserAllService,
};
