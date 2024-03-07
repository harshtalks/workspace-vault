import { withError } from "@/async/with-error";
import ROUTES from "@/lib/routes";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = withError(async (req) => {
  cookies().delete("webAuthn");

  return NextResponse.redirect(
    new URL(ROUTES.getStarted({}), process.env.BASE_URL),
    {
      status: 302,
      statusText: "redirected to the web auth signup page",
    }
  );
});
