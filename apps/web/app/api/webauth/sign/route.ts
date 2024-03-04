import { withError } from "@/async/with-error";
import {
  RequestError,
  RequestResponse,
  RequestSuccess,
} from "@/middlewares/type";
import { NextRequest, NextResponse } from "next/server";

export const POST = withError(async (request: NextRequest) => {
  const { jwt } = (await request.json()) as {
    userId: string;
    jwt: string;
  };

  const existingCookie = request.cookies.get("webAuthn");

  if (!existingCookie) {
    request.cookies.delete("webAuthn");
  }

  const response = NextResponse.json(
    {
      status: "success",
      result: "successfully added to the cookie",
    } as RequestSuccess<string>,
    { status: 200, statusText: "Set cookie successfully" }
  );

  response.cookies.set({
    name: "webAuthn",
    value: jwt,
    maxAge: 60 * 60 * 24,
  });

  return response;
});
