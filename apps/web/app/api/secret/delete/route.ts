import { WorkspaceError, WorkspaceSuccess } from "@/middlewares/type";
import { PrismaClient, Secret } from "database";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    //
    const { workspace } = (await request.json()) as {
      workspace: string;
    };

    const prisma = new PrismaClient();

    const existingSecret = await prisma.secret.delete({
      where: {
        orgId: workspace,
      },
    });

    prisma.$disconnect();

    return Response.json(
      {
        status: "success",
        result: existingSecret,
      } as WorkspaceSuccess<Secret>,
      { status: 201 }
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
