import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  try {
    const { collection, documents } = await req.json();

    if (!collection || typeof collection !== "string") {
      return NextResponse.json(
        { error: "collection name is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(documents) || documents.length === 0) {
      return NextResponse.json(
        { error: "documents array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Sanitize collection name
    const safeName = collection.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();

    const db = getDb();
    const col = db.collection(safeName);

    // Batch write in groups of 500 (Firestore limit)
    const batchSize = 500;
    let written = 0;

    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = db.batch();
      const chunk = documents.slice(i, i + batchSize);

      for (const doc of chunk) {
        const ref = col.doc();
        batch.set(ref, {
          ...doc,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await batch.commit();
      written += chunk.length;
    }

    return NextResponse.json({
      success: true,
      collection: safeName,
      count: written,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Failed to import data" },
      { status: 500 }
    );
  }
}
