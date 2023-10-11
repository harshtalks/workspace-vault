import { WorkspaceError, WorkspaceSuccess } from "@/middlewares/type";
import { EnvironmentVariables, prismaClient } from "database";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const prisma = prismaClient;

    const body = await request.json();

    const envs = await prisma.environmentVariables.findMany({
      where: body.workspace,
    });

    return NextResponse.json(
      {
        result: envs,
        status: "success",
      } as WorkspaceSuccess<EnvironmentVariables[]>,
      {
        status: 400,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message, status: "error" } as WorkspaceError,
      {
        status: 400,
      }
    );
  }
};
