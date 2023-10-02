import { WorkspaceError, WorkspaceSuccess } from "@/middlewares/type";
import { compare } from "bcryptjs";
import { PrismaClient } from "database";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const prisma = new PrismaClient();

    const { workspace, secretValue } = await request.json();

    const secret = await prisma.secret.findFirst({
      where: {
        orgId: workspace,
      },
    });

    const result = await compare(secretValue, secret.secret);

    if (!result) {
      throw new Error(
        "Sorry the given secret is incorrect. Please try again or generate new secret."
      );
    }

    return Response.json(
      {
        status: "success",
        result: true,
      } as WorkspaceSuccess<Boolean>,
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
