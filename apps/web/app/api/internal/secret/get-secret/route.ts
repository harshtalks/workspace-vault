import { PrismaClient, prismaClient } from "database";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const prisma = prismaClient;
  const { workspace } = (await request.json()) as { workspace: string };

  try {
    const secret = await prisma.secret.findFirst({
      where: {
        orgId: workspace,
      },
    });

    return NextResponse.json(secret, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, {
      status: 400,
      statusText: (error as Error).message,
    });
  }
};
