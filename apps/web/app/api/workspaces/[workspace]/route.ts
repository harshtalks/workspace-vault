import { WorkspaceError, WorkspaceSuccess } from "@/middlewares/type";
import { getAuth } from "@clerk/nextjs/server";
import { Organization, Prisma, PrismaClient } from "database";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { workspace: string } }
) => {
  try {
    const id = nanoid();

    const prismaClient = new PrismaClient();

    const user = getAuth(request);

    if (!user.userId) {
      throw new Error("We could not find the user in the database..");
    }

    const workspace = params.workspace;

    const newOrg = prismaClient.organization.create({
      data: {
        id: id,
        name: workspace,
      },
    });

    // creating member

    const member = prismaClient.orgMember.create({
      data: {
        userId: user.userId,
        orgId: id,
        role: "admin",
        permission: ["add_user", "read", "write"],
        id: nanoid(),
      },
    });

    const transaction = await prismaClient.$transaction([newOrg, member]);

    prismaClient.$disconnect();

    return NextResponse.json(
      {
        status: "success",
        result: transaction[0],
      } as WorkspaceSuccess<Organization>,
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message, status: "error" } as WorkspaceError,
      {
        status: 400,
      }
    );
  }
};
