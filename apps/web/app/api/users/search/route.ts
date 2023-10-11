import { WorkspaceError, WorkspaceSuccess } from "@/middlewares/type";
import { PrismaClient, User } from "database";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const url = request.nextUrl;

    const email = url.searchParams.get("email");
    const workspace = url.searchParams.get("workspace");

    const prisma = new PrismaClient();

    const members = await prisma.user.findMany({
      where: {
        email: { contains: email },
        orgMembers: {
          every: {
            organization: {
              id: { not: workspace },
            },
          },
        },
      },
    });

    prisma.$disconnect();

    return Response.json(
      {
        status: "success",
        result: members,
      } as WorkspaceSuccess<User[]>,
      { status: 200 }
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