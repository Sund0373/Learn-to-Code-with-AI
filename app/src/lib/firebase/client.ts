import type { Auth } from "firebase/auth";

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}

let _auth: Auth | null = null;
let _initialized = false;

export function getClientAuth(): Auth | null {
  if (_initialized) return _auth;
  _initialized = true;

  if (!isFirebaseConfigured()) return null;

  try {
    // Only import Firebase when keys are present
    const { initializeApp, getApps, getApp } = require("firebase/app");
    const { getAuth } = require("firebase/auth");

    const firebaseConfig = {
      apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    _auth = getAuth(app);
  } catch {
    _auth = null;
  }

  return _auth;
}

// Backwards-compatible export
export const clientAuth = isFirebaseConfigured() ? getClientAuth() : null;
