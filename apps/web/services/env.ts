import { RequestError, RequestSuccess } from "@/middlewares/type";

export type GetEnvDataFromServer = Awaited<
  ReturnType<typeof getEnvDataFromServer>
>;

export type ExtractRequestSuccess<T> = T extends { status: "success" }
  ? T
  : never;

export const getEnvDataFromServer = async (env: number) => {
  return null;
};

export type WhatServerPromisedMeUponTheirSuccess =
  ExtractRequestSuccess<GetEnvDataFromServer>;
