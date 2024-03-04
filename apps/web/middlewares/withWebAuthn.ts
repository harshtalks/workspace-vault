// middlewaresponse/withHeaders.ts
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";
import { MiddlewareFactory } from "./type";
import { jwtVerify } from "jose";
import { UNAUTHORIZED } from "http-status";
import ROUTES from "@/lib/routes";
export const withWebAuthn: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const callbackUrl = new URL(request.url);
    const response = await next(request, _next);
    if (response) {
      const cookie = request.cookies.get("webAuthn");

      const protectedPaths = [
        /^\/workspaces\/[^/]+\/overview/,
        /^\/workspaces\/[^/]+\/files/,
        /^\/workspaces\/[^/]+\/add-new-file/,
        /^\/workspaces\/[^/]+\/settings/,
        /^\/workspaces\/[^/]+\/generate-secret/,
        /^\/workspaces\/[^/]+\/enter-secret/,
        /^\/api\/workspaces/,
        /^\/api\/secret/,
        /^\/api\/members/,
        /^\/api\/users/,
        /^\/api\/envs/,
        /^\/get-started\/workspaces/,
      ];

      const currentPath = new URL(request.url).pathname;

      // Check if the user is accessing a protected path and if the "webAuthn" cookie is missing
      if (protectedPaths.some((regex) => regex.test(currentPath)) && !cookie) {
        // Check if the user is already on the login page
        if (currentPath !== "/get-started/authenticate") {
          // Redirect the user to the login page

          if (currentPath.includes("api")) {
            return NextResponse.json(
              {
                status: "error",
                error:
                  "You are not authorized to access this, you need MFA Authorized with the passkey.",
              },
              { status: UNAUTHORIZED }
            );
          }
          return NextResponse.redirect(
            new URL(
              ROUTES.webAuthRedirect(
                {},
                {
                  search: {
                    callbackMFA: callbackUrl.toString(),
                  },
                }
              ),
              request.url
            )
          );
        }
      }

      if (cookie) {
        try {
          const key = process.env.WEBAUTH_SECRET;

          if (!key) {
            throw new Error("WebAuthn secret not found");
          }
          // Secret for JWT verification
          const secret = new TextEncoder().encode(key);

          // Verify the JWT token
          const { payload, protectedHeader } = await jwtVerify(
            cookie.value,
            secret
          );

          // Log the payload and protected header if verification succeeds
          console.log("Token verification succeeded");
          console.log("Payload:", payload);
          console.log("Protected Header:", protectedHeader);

          // Check if the user is already on the login page
          if (
            currentPath === "/get-started/authenticate" ||
            currentPath === "/get-started"
          ) {
            // Redirect the user to the workspaces page
            return NextResponse.redirect(
              new URL(ROUTES.workspaces({}), request.url)
            );
          }
        } catch (e) {
          // Token verification failed
          console.error(e);

          // Check if the user is already on the login page
          if (currentPath !== "/get-started/authenticate") {
            // Redirect the user to the login page after failed verification
            return NextResponse.redirect(
              new URL(
                ROUTES.webAuthRedirect(
                  {},
                  {
                    search: {
                      callbackMFA: callbackUrl.toString(),
                    },
                  }
                ),
                request.url
              )
            );
          }
        }
      }
    }
    return response;
  };
};
