import {
  WorkspaceError,
  WorkspaceResponse,
  WorkspaceSuccess,
} from "@/middlewares/type";
import { getAuth } from "@clerk/nextjs/server";
import { Organization, PrismaClient } from "database";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const user = getAuth(request);

    if (!user.userId) {
      throw new Error("We could not find the user in the database..");
    }

    const prismaClient = new PrismaClient();

    const workspaces = await prismaClient.organization.findMany({
      where: {
        members: {
          some: {
            userId: user.userId,
          },
        },
      },
    });

    prismaClient.$disconnect();

    return Response.json(
      {
        status: "success",
        result: workspaces,
      } as WorkspaceSuccess<Organization[]>,
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
