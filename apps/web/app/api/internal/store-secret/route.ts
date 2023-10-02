import { hash } from "bcryptjs";
import { PrismaClient } from "database"; // Import PrismaClient from the correct package
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as {
      userId: string;
      secret: string;
    };

    const hashedSecret = await hash(body.secret, 10);

    const prismaClient = new PrismaClient();

    const existingSecret = await prismaClient.secret.upsert({
      where: {
        orgId: body.userId,
        org: {
          members: {
            some: {
              userId: body.userId,
              role: "admin",
            },
          },
        },
      },
      update: {
        secret: hashedSecret,
      },
      create: {
        orgId: body.userId,
        secret: hashedSecret,
      },
    });

    prismaClient.$disconnect(); // Disconnect the Prisma client

    return Response.json(
      { isSavedHash: true },
      { status: 200, statusText: "ok" }
    );
  } catch (e) {
    return Response.json(
      { error: e.message }, // Return the error message
      { status: 400, statusText: e.message }
    );
  }
};
