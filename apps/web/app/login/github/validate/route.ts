import { withError } from "@/async/with-error";
import { validateRequest, validateRequestWithoutCache } from "@/lib/auth/auth";
import { RequestSuccess } from "@/middlewares/type";
import { Session, User } from "lucia";
import { NextRequest, NextResponse } from "next/server";

export const GET = withError(async (request: NextRequest) => {
  const { user, session } = await validateRequest();
  return NextResponse.json<
    RequestSuccess<{
      session: Session | null;
      user: User | null;
    }>
  >(
    {
      result: {
        session: session,
        user: user,
      },
      status: "success",
    },
    { status: 200 }
  );
});
