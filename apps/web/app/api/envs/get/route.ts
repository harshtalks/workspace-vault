import { WorkspaceError, WorkspaceSuccess } from "@/middlewares/type";
import { EnvironmentVariables, PrismaClient } from "database";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const prisma = new PrismaClient();

    const body = await request.json();

    const envs = await prisma.environmentVariables.findMany({
      where: body.workspace,
    });

    return Response.json(
      {
        result: envs,
        status: "success",
      } as WorkspaceSuccess<EnvironmentVariables[]>,
      {
        status: 400,
      }
    );
  } catch (error) {
    return Response.json(
      { error: (error as Error).message, status: "error" } as WorkspaceError,
      {
        status: 400,
      }
    );
  }
};
