import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes
        if (
          pathname.startsWith("/auth") ||
          pathname === "/" ||
          pathname === "/sign-in" ||
          pathname.startsWith("/u/") || 
          pathname.startsWith("/api/except") ||
          pathname.startsWith("/api/send") ||
          pathname.startsWith("/_next") ||
          pathname.startsWith("/api/auth") ||
          pathname === "/favicon.ico"
        ) {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
