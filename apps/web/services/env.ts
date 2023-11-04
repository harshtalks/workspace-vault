import { WorkspaceError, WorkspaceSuccess } from "@/middlewares/type";
import { prismaClient } from "database";

export type GetEnvDataFromServer = Awaited<
  ReturnType<typeof getEnvDataFromServer>
>;

export type ExtractWorkspaceSuccess<T> = T extends { status: "success" }
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

    return { status: "success", result: file } as WorkspaceSuccess<typeof file>;
  } catch (error) {
    return (
      error instanceof Error &&
      ({
        error: error.message,
        status: "error",
      } as WorkspaceError)
    );
  } finally {
    prismaClient.$disconnect();
  }
};

export type WhatServerPromisedMeUponTheirSuccess =
  ExtractWorkspaceSuccess<GetEnvDataFromServer>;
