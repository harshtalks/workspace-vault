import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { userId } = (await request.json()) as {
    userId: string;
  };

  const existingCookie = request.cookies.get("webAuthn");

  if (!existingCookie) {
    request.cookies.delete("webAuthn");
  }

  const alg = "HS256";

  const secret = new TextEncoder().encode(process.env.WEBAUTH_SECRET);

  const jwt = await new SignJWT({ userId })
    .setProtectedHeader({ alg })
    .setExpirationTime("24h")
    .sign(secret);

  const response = NextResponse.json(
    {
      status: "success",
      result: {},
    },
    {
      status: 200,
      statusText: "Set cookie successfully",
    }
  );

  response.cookies.set({
    name: "webAuthn",
    value: jwt,
    maxAge: 60 * 60 * 2,
  });

  return response;
};
