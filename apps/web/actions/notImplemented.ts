import { NextResponse } from "next/server";

export const notImplemented = () => {
  return NextResponse.json(
    {},
    {
      statusText: "Not implemented",
      status: 400,
    }
  );
};
