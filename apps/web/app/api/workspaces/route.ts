import {
  RequestError,
  RequestResponse,
  RequestSuccess,
} from "@/middlewares/type";
import { getAuth } from "@clerk/nextjs/server";
import db, { eq, members, secrets, workspaces } from "database";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const user = getAuth(request);

    if (!user.userId) {
      throw new Error("We could not find the user in the database..");
    }

    const workspacesResult = await db.query.workspaces.findMany({
      with: {
        members: {
          where: eq(members.ownerId, user.userId),
        },
      },
    });

    return NextResponse.json(
      {
        status: "success",
        result: workspacesResult,
      } as RequestSuccess<(typeof workspaces.$inferInsert)[]>,
      { status: 200 }
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

export const POST = async (request: NextRequest) => {
  try {
    const body: {
      workspace: typeof workspaces.$inferInsert;
      secret: typeof secrets.$inferInsert;
    } = await request.json();

    const { userId } = getAuth(request);

    const workspace = await db.transaction(async (tx) => {
      const workspace = await tx
        .insert(workspaces)
        .values({
          ...body.workspace,
        })
        .returning();

      await tx.insert(members).values({
        ownerId: userId,
        workspaceId: workspace[0].id,
        permissions: ["AddMembers", "Read", "Write"],
        role: "Admin",
      });

      await tx.insert(secrets).values({
        ...body.secret,
        workspaceId: workspace[0].id,
      });

      return workspace[0];
    });

    revalidateTag("workspaces");

    return NextResponse.json(
      {
        status: "success",
        result: workspace,
      } as RequestSuccess<typeof workspaces.$inferSelect>,
      { status: 200 }
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
