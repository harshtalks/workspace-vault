import { WorkspaceError, WorkspaceSuccess } from "@/middlewares/type";
import { PrismaClient, Secret } from "database";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { workspace: string } }
) => {
  try {
    const prisma = new PrismaClient();

    console.log("hit", params.workspace);

    const existingSecret = await prisma.secret.findFirst({
      where: {
        orgId: params.workspace,
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