import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/tokenVerifier";

/**
 * Protects routes that require authentication.
 * Add route patterns to the `matcher` config below as your app grows.
 *
 * Protected routes redirect to /auth/login?redirect=<original-path>
 * if no valid token is found in the Authorization cookie.
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("Authorization")?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Add protected route patterns here
  // e.g. "/dashboard/:path*", "/account/:path*", "/admin/:path*"
  matcher: ["/dashboard/:path*"],
};
