"use client";

import { useState, useEffect, useCallback } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category) params.set("category", category);
    params.set("sort", sort);
    params.set("order", order);

    try {
      const res = await fetch(`/api/products/search?${params}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch");
      }
      const data = await res.json();
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, order]);

  // Load categories on mount
  useEffect(() => {
    fetch("/api/products/search?sort=category")
      .then((r) => r.json())
      .then((data) => {
        const cats = [
          ...new Set(
            (data.products as Product[]).map((p) => p.category).filter(Boolean)
          ),
        ] as string[];
        setCategories(cats.sort());
      })
      .catch(() => {});
  }, []);

  // Fetch on filter change (debounced for search)
  useEffect(() => {
    const timer = setTimeout(fetchProducts, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchProducts, search]);

  const handleSort = (field: string) => {
    if (sort === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(field);
      setOrder("asc");
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sort !== field)
      return <span className="text-gray-300 ml-1">&uarr;</span>;
    return (
      <span className="text-action-primary ml-1">
        {order === "asc" ? "\u2191" : "\u2193"}
      </span>
    );
  };

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search and browse the product catalog from your Firestore database.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input w-full pl-10"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input w-full sm:w-48"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {loading ? "Loading..." : `${total} product${total !== 1 ? "s" : ""} found`}
        </p>
        {(search || category) && (
          <button
            onClick={() => {
              setSearch("");
              setCategory("");
            }}
            className="text-xs text-action-primary hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          {error.includes("Failed") && (
            <p className="mt-1 text-xs text-red-500">
              Make sure Firebase is configured and the database is seeded (Step 4 in the tutorial).
            </p>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th
                  onClick={() => handleSort("name")}
                  className="cursor-pointer px-4 py-3 font-semibold text-gray-700 hover:text-gray-900 select-none"
                >
                  Name
                  <SortIcon field="name" />
                </th>
                <th
                  onClick={() => handleSort("category")}
                  className="cursor-pointer px-4 py-3 font-semibold text-gray-700 hover:text-gray-900 select-none"
                >
                  Category
                  <SortIcon field="category" />
                </th>
                <th
                  onClick={() => handleSort("price")}
                  className="cursor-pointer px-4 py-3 font-semibold text-gray-700 hover:text-gray-900 text-right select-none"
                >
                  Price
                  <SortIcon field="price" />
                </th>
                <th
                  onClick={() => handleSort("stock")}
                  className="cursor-pointer px-4 py-3 font-semibold text-gray-700 hover:text-gray-900 text-right select-none"
                >
                  Stock
                  <SortIcon field="stock" />
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!loading &&
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      ${product.price?.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-medium ${
                          product.stock < 50
                            ? "text-amber-600"
                            : product.stock < 100
                            ? "text-gray-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-xs truncate">
                      {product.description}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Empty / loading states */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-action-primary" />
            </div>
          )}
          {!loading && products.length === 0 && !error && (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">No products found.</p>
              {search || category ? (
                <p className="mt-1 text-xs text-gray-400">
                  Try adjusting your search or filters.
                </p>
              ) : (
                <p className="mt-1 text-xs text-gray-400">
                  Seed your database first in{" "}
                  <a href="/learn" className="text-action-primary hover:underline">
                    Step 4 of the tutorial
                  </a>
                  .
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
