import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import {
  LoginInputSchema,
  RegisterInputSchema,
  UpdateProfileInput,
} from "../types/auth.type";
import { sendResponse } from "../utils/sendResponse";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import {
  checkUserExistService,
  getInstructorService,
  getUserAllService,
  getUserService,
  registerService,
  updateProfilService,
} from "../services/auth.service";
import { config } from "../config/env";
import { StatusCodes } from "http-status-codes";
import { removeFile } from "../utils/file.utils";
import { mailService } from "../utils/mail";

interface AuthenticatedRequest extends Request {
  user?: any; // หรือใส่ Type User ของคุณ
}

const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validateRegisterInput = RegisterInputSchema.safeParse(req.body);
    if (!validateRegisterInput.success) {
      sendResponse(res, {
        success: false,
        statusCode: 400,
        message: validateRegisterInput.error.issues
          .map((issue) => issue.message)
          .join(", "),
      });
      return;
    }
    const { email, password, role } = validateRegisterInput.data;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const payload = { email, password: hashedPassword, role };

    const registerServiceRes = await registerService({ payload });

    if (!registerServiceRes) {
      sendResponse(res, {
        success: false,
        statusCode: 500,
        message: "Can't register user!",
      });
      return;
    }

    await mailService.sendEmail(
      email,
      "Thank you for registering!",
      "<h1>Thank you for registering!</h1>"
    );

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "User registered successfully",
      data: registerServiceRes,
    });
    return;
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Server error!",
    });
    return;
  }
};

const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const validateLoginInput = LoginInputSchema.safeParse(req.body);
    if (!validateLoginInput.success) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: validateLoginInput.error.issues
          .map((issue) => issue.message)
          .join(", "),
      });
      return;
    }
    const { email, password } = validateLoginInput.data;

    const user = await checkUserExistService({ email });

    if (!user) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "User not found!",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Invalid password!",
      });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.jwtSecret as string,
      {
        expiresIn: config.jwtExpiresIn,
      } as SignOptions
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        user,
      },
    });
    return;
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server error!",
    });
    return;
  }
};

const logoutController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    res.clearCookie("token");
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User logged out successfully",
    });
    return;
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server error!",
    });
    return;
  }
};

const getMeController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;
    const getUserServiceRes = await getUserService({ id: user.id });
    if (!getUserServiceRes) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "User not found!",
      });
      return;
    }
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User logged in successfully",
      data: getUserServiceRes,
    });
    return;
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server error!",
    });
    return;
  }
};

const updateProfileController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;
    const payload = req.body as UpdateProfileInput;
    const avatar = req.file;

    console.log(req.file, "req.file");

    const checkAvatar = await getUserService({ id: user.id });
    if (checkAvatar?.userInfo?.avatar) {
      removeFile(checkAvatar.userInfo.avatar);
    }

    if (avatar) {
      payload.avatar = avatar.path;
    }
    const updateUserRes = await updateProfilService({ id: user.id, payload });

    if (!updateUserRes) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "User not found!",
      });
      return;
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Update profile successfully",
      data: updateUserRes,
    });
    return;
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server error!",
    });
    return;
  }
};

// lnstructor
const getInstructorController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const instructorRes = await getInstructorService();
    if (!instructorRes) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Instructor not found!",
      });
      return;
    }
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Instructor found successfully",
      data: instructorRes,
    });
    return;
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server error!",
    });
    return;
  }
};

const getUserAllController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userRes = await getUserAllService();
    if (!userRes) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "User not found!",
      });
      return;
    }
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User found successfully",
      data: userRes,
    });
    return;
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server error!",
    });
    return;
  }
};

export {
  registerController,
  loginController,
  logoutController,
  getMeController,
  updateProfileController,
  getInstructorController,
  getUserAllController,
};
