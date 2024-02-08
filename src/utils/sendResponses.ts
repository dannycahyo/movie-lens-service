import type { Response } from "express";
import type { ResponseSuccess } from "../domain/entities/response";

type Params<T> = {
  res: Response;
  message: string;
  data: T;
};

export const sendSuccess = <T>({ res, message, data }: Params<T>): void => {
  const response: ResponseSuccess<T> = { message, data };
  res.status(200).json(response);
};
