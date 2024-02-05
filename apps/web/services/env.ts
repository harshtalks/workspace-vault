import { RequestError, RequestSuccess } from "@/middlewares/type";
import db, { prismaClient } from "database";

export type GetEnvDataFromServer = Awaited<
  ReturnType<typeof getEnvDataFromServer>
>;

export type ExtractRequestSuccess<T> = T extends { status: "success" }
  ? T
  : never;

export const getEnvDataFromServer = async (env: number) => {
  try {
    const file = await prismaClient.environmentVariables.findUniqueOrThrow({
      where: {
        id: env,
      },
      include: {
        secret: {
          include: {
            org: {
              include: {
                members: {
                  where: {
                    role: "admin",
                  },
                },
              },
            },
          },
        },
      },
    });

    return { status: "success", result: file } as RequestSuccess<typeof file>;
  } catch (error) {
    return (
      error instanceof Error &&
      ({
        error: error.message,
        status: "error",
      } as RequestError)
    );
  } finally {
    prismaClient.$disconnect();
  }
};

export type WhatServerPromisedMeUponTheirSuccess =
  ExtractRequestSuccess<GetEnvDataFromServer>;
