// middleware/types.ts

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
