import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase/admin";

interface ProductRow {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

export async function POST(req: NextRequest) {
  try {
    const { products } = (await req.json()) as { products: ProductRow[] };

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "No products provided" },
        { status: 400 }
      );
    }

    const db = getDb();
    const batch = db.batch();
    const col = db.collection("products");

    for (const product of products) {
      const ref = col.doc();
      batch.set(ref, {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      count: products.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
