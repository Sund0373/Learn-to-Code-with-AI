import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/tokenVerifier";

/**
 * Protects routes that require authentication.
 * Add route patterns to the `matcher` config below as your app grows.
 *
 * Protected routes redirect to /auth?redirect=<original-path>
 * if no valid token is found in the Authorization cookie.
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("Authorization")?.value;

  if (!token) {
    return denyAccess(request);
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return denyAccess(request);
  }

  return NextResponse.next();
}

function denyAccess(request: NextRequest) {
  // API routes get a 401 JSON response
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  // Pages get redirected to login
  const loginUrl = new URL("/auth", request.url);
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Add protected route patterns here
  // e.g. "/dashboard/:path*", "/account/:path*", "/admin/:path*"
  matcher: ["/dashboard/:path*"],
};
