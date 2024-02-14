import { RequestError, RequestSuccess } from "@/middlewares/type";
import { PrismaClient, Secret } from "database";
import { NextRequest, NextResponse } from "next/server";

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

    return NextResponse.json(
      {
        status: "success",
        result: existingSecret,
      } as RequestSuccess<Secret>,
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message, status: "error" } as RequestError,
      {
        status: 400,
      }
    );
  }
};
