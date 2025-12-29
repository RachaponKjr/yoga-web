import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/AppError";
import { config } from "../config/env";

interface AuthRequest extends Request {
  user?:
    | {
        id: string;
        role: string;
      }
    | JwtPayload
    | string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(
      new AppError(
        "You are not logged in! Please log in to get access.",
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    return next(
      new AppError("Invalid token or token expired", StatusCodes.UNAUTHORIZED)
    );
  }
};

export const restrictTo = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = (req.user as any).role;

    if (!allowedRoles.includes(userRole)) {
      return next(
        new AppError(
          "You do not have permission to perform this action",
          StatusCodes.FORBIDDEN
        )
      );
    }

    next();
  };
};
