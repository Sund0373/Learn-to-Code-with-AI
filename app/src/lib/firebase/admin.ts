import path from "path";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let app: App;
let db: Firestore;
let auth: Auth;

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // service-account.json lives in the project root (one level above app/)
  const serviceAccountPath = path.join(process.cwd(), "..", "service-account.json");

  app = initializeApp({
    credential: cert(serviceAccountPath),
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
