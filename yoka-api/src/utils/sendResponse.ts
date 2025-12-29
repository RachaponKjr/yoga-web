import { Response } from "express";

interface ResponseType<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
}

export const sendResponse = <T>(res: Response, params: ResponseType<T>) => {
  const { statusCode, success, message, data } = params;

  res.status(statusCode).json({
    success,
    message,
    data,
  });
};
