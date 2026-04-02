/**
 * POST /api/auth/login
 *
 * Accepts { idToken } (Firebase ID token from client-side sign-in),
 * verifies it server-side, and sets a signed JWT in an httpOnly cookie.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { generateToken } from "@/lib/auth/tokenGenerator";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      );
    }

    // Verify the Firebase ID token server-side
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    const { uid, email } = decoded;

    if (!email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const token = await generateToken({ uid, email });

    const response = NextResponse.json({ success: true, userId: uid });
    response.cookies.set("Authorization", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge:   60 * 60 * 24 * 7, // 7 days
      path:     "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
