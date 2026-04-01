/**
 * Generic Firestore CRUD API
 *
 * GET    /api/{collection}          → list all docs
 * GET    /api/{collection}?id=xxx   → get one doc
 * POST   /api/{collection}          → create doc   (body: JSON data)
 * PATCH  /api/{collection}?id=xxx   → update doc   (body: partial JSON)
 * DELETE /api/{collection}?id=xxx   → delete doc
 */

import { NextRequest, NextResponse } from "next/server";
import {
  createDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
} from "@/lib/firebase/crud";

type Params = { collection: string };

function err(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

// ─── GET ───────────────────────────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { collection } = await params;
    const id = req.nextUrl.searchParams.get("id");

    if (id) {
      const doc = await getDoc(collection, id);
      if (!doc) return err("Document not found", 404);
      return NextResponse.json(doc);
    }

    const docs = await getDocs(collection);
    return NextResponse.json(docs);
  } catch (e) {
    return err(String(e), 500);
  }
}

// ─── POST ──────────────────────────────────────────────────────────────────────

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { collection } = await params;
    const body = await req.json();
    const id = await createDoc(collection, body);
    return NextResponse.json({ id }, { status: 201 });
  } catch (e) {
    return err(String(e), 500);
  }
}

// ─── PATCH ─────────────────────────────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { collection } = await params;
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return err("Missing ?id param", 400);

    const body = await req.json();
    await updateDoc(collection, id, body);
    return NextResponse.json({ success: true });
  } catch (e) {
    return err(String(e), 500);
  }
}

// ─── DELETE ────────────────────────────────────────────────────────────────────

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { collection } = await params;
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return err("Missing ?id param", 400);

    await deleteDoc(collection, id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return err(String(e), 500);
  }
}
