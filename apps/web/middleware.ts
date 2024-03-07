import { NextMiddleware, NextRequest, NextResponse } from "next/server";
import { withWebAuthn } from "./middlewares/withWebAuthn";
import { Session, User } from "lucia";
import { RequestResponse } from "./middlewares/type";

const withLuciaSession = () => async (req: NextRequest) => {
  const publicRoutes = [
    "/",
    "/login/github",
    "/login/github/callback",
    "/login/github/validate",
  ];

  const requestHeaders = new Headers(req.headers);

  if (
    publicRoutes.includes(req.nextUrl.pathname) ||
    req.nextUrl.pathname.endsWith("png")
  ) {
    return NextResponse.next();
  }
  try {
    const result = await fetch(
      `${process.env.BASE_URL}/login/github/validate`,
      {
        headers: {
          Cookie: requestHeaders.get("cookie") || "",
        },
      }
    );
    const response: RequestResponse<{
      session: Session | null;
      user: User | null;
    }> = await result.json();

    if (response.status === "error" || !response.result.session) {
      return NextResponse.redirect(new URL("/", req.url));
    } else {
      return NextResponse.next();
    }
  } catch (e) {
    console.log(e);
    return NextResponse.redirect(new URL("/", req.url));
  }
};

// chained middlewares
export default withWebAuthn(withLuciaSession());

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
