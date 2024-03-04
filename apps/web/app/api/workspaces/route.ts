import { withError } from "@/async/with-error";
import { validateRequest } from "@/lib/auth/auth";
import { RequestSuccess } from "@/middlewares/type";
import db, { eq, members, secrets, workspaces } from "database";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const GET = withError(async (request: NextRequest) => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("We could not find the user in the database..");
  }

  const workspacesResult = await db.query.workspaces.findMany({
    with: {
      members: {
        where: eq(members.ownerId, user.id),
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
});

export const POST = withError(async (request: NextRequest) => {
  const body: {
    workspace: typeof workspaces.$inferInsert;
    secret: typeof secrets.$inferInsert;
  } = await request.json();

  const { user } = await validateRequest();

  if (!user) {
    throw new Error("We could not find the user in the database..");
  }

  const workspace = await db.transaction(async (tx) => {
    const workspace = await tx
      .insert(workspaces)
      .values({
        ...body.workspace,
      })
      .returning();

    await tx.insert(members).values({
      ownerId: user.id,
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
});
