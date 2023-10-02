// middleware/types.ts

import { NextMiddleware } from "next/server";
export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

export type WorkspaceSuccess<TData> = {
  status: "success";
  result: TData;
};

export type WorkspaceError = {
  status: "error";
  error: string;
};

export type WorkspaceResponse<Tdata> = WorkspaceSuccess<Tdata> | WorkspaceError;
