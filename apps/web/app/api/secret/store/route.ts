import { WorkspaceError, WorkspaceSuccess } from "@/middlewares/type";
import { hash } from "bcryptjs";
import { PrismaClient, Secret } from "database";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    //
    const { workspace, secret } = (await request.json()) as {
      workspace: string;
      secret: string;
    };

    const hashedSecret = await hash(secret, 10);

    const prisma = new PrismaClient();

    const existingSecret = await prisma.secret.create({
      data: {
        secret: hashedSecret,
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
