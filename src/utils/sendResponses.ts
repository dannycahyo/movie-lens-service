import { z } from "zod";

import type { Response } from "express";
import type { ResponseSuccess } from "../domain/entities/response";

type SuccessParams<T> = {
  res: Response;
  message: string;
  data: T;
};

type ErrorParams<T> = Omit<SuccessParams<T>, "data"> & { error: T };

export const sendSuccess = <T>({
  res,
  message,
  data,
}: SuccessParams<T>): void => {
  const response: ResponseSuccess<T> = { message, data };
  res.status(200).json(response);
};

export const sendError = <T>({ res, message, error }: ErrorParams<T>): void => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: "Bad Request", details: error.errors });
  } else {
    console.error(`${message}: ${error}`);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};
