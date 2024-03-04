import { RequestError, RequestResponse } from "@/middlewares/type";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export type NextHandler = (
  req: NextRequest,
  { params }: { params: Record<string, string | undefined> }
) => Promise<NextResponse>;

export function withError(handler: NextHandler): NextHandler {
  return async (req, params) => {
    try {
      return await handler(req, params);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json<RequestError>(
          { error: error.message, status: "error" },
          { status: 400 }
        );
      }

      if (error instanceof Error) {
        return NextResponse.json<RequestError>(
          { error: error.message, status: "error" },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json<RequestError>(
        { error: "Server error", status: "error" },
        { status: 500 }
      );
    }
  };
}
