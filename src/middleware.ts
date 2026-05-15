import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Lightweight middleware that checks for the auth session cookie.
 * If no session cookie exists, redirect to login.
 * The actual auth validation happens server-side in the dashboard pages.
 */
export function middleware(request: NextRequest) {
  // Check for NextAuth session token cookie
  const sessionToken =
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("__Secure-authjs.session-token");

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
