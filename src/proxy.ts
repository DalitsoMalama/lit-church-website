import { NextResponse, type NextRequest } from "next/server";
import { ADMIN, readCookie, verifyToken } from "@/lib/staff-token";

/**
 * First line of defence for the admin side: anyone without a valid admin session is
 * sent to the sign-in page before any admin page renders. Every admin page and action
 * still checks the session itself (requireAdmin), so this is defence in depth.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (!verifyToken(ADMIN, readCookie(request.headers.get("cookie"), ADMIN.cookie))) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
