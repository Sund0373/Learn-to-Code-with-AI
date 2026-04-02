import path from "path";
import fs from "fs";
import { initializeApp, getApps, cert, App, ServiceAccount } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let app: App;
let db: Firestore;
let auth: Auth;

function getServiceAccount(): ServiceAccount | string {
  // Option 1: JSON string in environment variable (for deployment — Vercel, etc.)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) as ServiceAccount;
  }

  // Option 2: File on disk (for local development)
  const filePath = path.join(process.cwd(), "..", "service-account.json");
  if (fs.existsSync(filePath)) {
    return filePath;
  }

  throw new Error(
    "Firebase service account not found. Either:\n" +
    "  - Place service-account.json in the project root (for local dev), or\n" +
    "  - Set FIREBASE_SERVICE_ACCOUNT_JSON env var (for deployment)"
  );
}

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const serviceAccount = getServiceAccount();

  app = initializeApp({
    credential: cert(serviceAccount),
  });

  return app;
}

export function getDb(): Firestore {
  if (!db) {
    getAdminApp();
    db = getFirestore();
  }
  return db;
}

export function getAdminAuth(): Auth {
  if (!auth) {
    getAdminApp();
    auth = getAuth();
  }
  return auth;
}
