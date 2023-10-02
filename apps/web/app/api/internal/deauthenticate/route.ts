import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const response = NextResponse.json({}, { status: 200, statusText: "ok" });

  response.cookies.delete("webAuthn");

  return response;
};
