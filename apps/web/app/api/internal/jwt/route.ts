import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { jwt } = (await request.json()) as {
    userId: string;
    jwt: string;
  };

  const existingCookie = request.cookies.get("webAuthn");

  if (!existingCookie) {
    request.cookies.delete("webAuthn");
  }

  const response = NextResponse.json({
    status: 204,
    statusText: "Set cookie successfully",
  });

  response.cookies.set({
    name: "webAuthn",
    value: jwt,
    maxAge: 60 * 60 * 2,
  });

  return response;
};
