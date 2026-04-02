import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase/admin";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("q")?.toLowerCase() || "";
    const category = req.nextUrl.searchParams.get("category") || "";
    const sort = req.nextUrl.searchParams.get("sort") || "name";
    const order = req.nextUrl.searchParams.get("order") || "asc";

    const db = getDb();
    let ref = db.collection("products") as FirebaseFirestore.Query;

    // Category filter (server-side — exact match)
    if (category) {
      ref = ref.where("category", "==", category);
    }

    // Sort
    const validSorts = ["name", "price", "stock", "category"];
    const sortField = validSorts.includes(sort) ? sort : "name";
    ref = ref.orderBy(sortField, order === "desc" ? "desc" : "asc");

    const snap = await ref.get();

    let products: Product[] = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Product, "id">),
    }));

    // Text search (client-side filter — Firestore doesn't support full-text search)
    if (query) {
      products = products.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      products,
      total: products.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}
