// middleware/types.ts
import * as z from "zod";

import { NextMiddleware } from "next/server";
export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

export type RequestSuccess<TData> = {
  status: "success";
  result: TData;
};

export type RequestError = {
  status: "error";
  error: string;
};

export type RequestResponse<Tdata> = RequestSuccess<Tdata> | RequestError;

// Zod Specials

export const RequestSuccessSchema = <T extends z.ZodType>(schema: T) =>
  z.object({
    status: z.literal("success"),
    result: schema,
  });

export const RequestErrorSchema = z.object({
  status: z.literal("error"),
  error: z.string(),
});

export const RequestResponseSchema = <T extends z.ZodType>(schema: T) =>
  z.union([RequestSuccessSchema(schema), RequestErrorSchema]);
