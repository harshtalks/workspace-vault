import { authMiddleware } from "@clerk/nextjs";
import { NextMiddleware, NextResponse } from "next/server";
import { withWebAuthn } from "./middlewares/withWebAuthn";

export const WithClerkSession: () => NextMiddleware = () => {
  return authMiddleware({
    publicRoutes: ["/"],
    ignoredRoutes: ["/api/webhook"],
  });
};

export default withWebAuthn(WithClerkSession());

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
