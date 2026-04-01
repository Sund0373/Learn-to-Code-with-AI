import { getDb } from "./admin";
import {
  DocumentData,
  QueryDocumentSnapshot,
  WhereFilterOp,
} from "firebase-admin/firestore";

export type DocWithId<T = DocumentData> = T & { id: string };

function withId<T>(doc: QueryDocumentSnapshot): DocWithId<T> {
  return { id: doc.id, ...(doc.data() as T) };
}

// ─── CREATE ────────────────────────────────────────────────────────────────────

/** Add a new document to a collection. Returns the new document ID. */
export async function createDoc(
  collection: string,
  data: DocumentData
): Promise<string> {
  const ref = await getDb().collection(collection).add({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return ref.id;
}

/** Set a document at a known ID (creates or overwrites). */
export async function setDoc(
  collection: string,
  id: string,
  data: DocumentData
): Promise<void> {
  await getDb()
    .collection(collection)
    .doc(id)
    .set({ ...data, updatedAt: new Date() }, { merge: true });
}

// ─── READ ──────────────────────────────────────────────────────────────────────

/** Get a single document by ID. Returns null if not found. */
export async function getDoc<T = DocumentData>(
  collection: string,
  id: string
): Promise<DocWithId<T> | null> {
  const snap = await getDb().collection(collection).doc(id).get();
  if (!snap.exists) return null;
  return withId<T>(snap as QueryDocumentSnapshot);
}

/** Get all documents in a collection. */
export async function getDocs<T = DocumentData>(
  collection: string
): Promise<DocWithId<T>[]> {
  const snap = await getDb().collection(collection).get();
  return snap.docs.map((d) => withId<T>(d));
}

/** Query documents by a field value. */
export async function queryDocs<T = DocumentData>(
  collection: string,
  field: string,
  operator: WhereFilterOp,
  value: unknown
): Promise<DocWithId<T>[]> {
  const snap = await getDb()
    .collection(collection)
    .where(field, operator, value)
    .get();
  return snap.docs.map((d) => withId<T>(d));
}

// ─── UPDATE ────────────────────────────────────────────────────────────────────

/** Partially update a document (merge). */
export async function updateDoc(
  collection: string,
  id: string,
  data: Partial<DocumentData>
): Promise<void> {
  await getDb()
    .collection(collection)
    .doc(id)
    .update({ ...data, updatedAt: new Date() });
}

// ─── DELETE ────────────────────────────────────────────────────────────────────

/** Delete a document by ID. */
export async function deleteDoc(
  collection: string,
  id: string
): Promise<void> {
  await getDb().collection(collection).doc(id).delete();
}
