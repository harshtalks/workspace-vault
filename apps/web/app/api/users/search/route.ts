import { RequestError, RequestSuccess } from "@/middlewares/type";
import { currentUser } from "@clerk/nextjs";
import db, { eq, members, users, ilike, ne } from "database";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const url = request.nextUrl;

    const { id } = await currentUser();

    const email = url.searchParams.get("email");

    if (!!!email) {
      throw new Error("without email, you cant proceed.");
    }

    const workspace = url.searchParams.get("workspace");

    const result = await db.query.users.findMany({
      where: ilike(users.email, `%${email}%`),
      with: {
        members: true,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        result: result.filter(
          (el) => !el.members.some((l) => l.workspaceId === workspace)
        ),
      } as RequestSuccess<(typeof users.$inferSelect)[]>,
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
