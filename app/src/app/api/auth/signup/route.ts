import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { setDoc, getDoc } from "@/lib/firebase/crud";
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

    // Verify the Firebase ID token (created by client after createUserWithEmailAndPassword)
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    const { uid, email } = decoded;

    if (!email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Only create the user document if it doesn't already exist
    const existingUser = await getDoc("users", uid);
    if (existingUser) {
      return NextResponse.json(
        { error: "Account already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    await setDoc("users", uid, {
      email,
      setupComplete: false,
      createdAt: new Date(),
    });

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
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
