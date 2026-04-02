"use client";

import { useState, useCallback, useRef } from "react";

interface ParsedProduct {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

function parseCsv(text: string): ParsedProduct[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  // Skip header row
  return lines.slice(1).map((line) => {
    const [name, category, price, stock, description] = line.split(",").map((s) => s.trim());
    return {
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      description,
    };
  }).filter((p) => p.name && !isNaN(p.price));
}

export default function SeedDatabase() {
  const [products, setProducts] = useState<ParsedProduct[]>([]);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCsv(text);
      setProducts(parsed);
      setStatus("idle");
      setMessage("");
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith(".csv")) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleLoadSample = async () => {
    try {
      const res = await fetch("/sample-products.csv");
      const text = await res.text();
      const parsed = parseCsv(text);
      setProducts(parsed);
      setStatus("idle");
      setMessage("");
    } catch {
      setMessage("Failed to load sample file.");
    }
  };

  const handleSeed = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Failed to seed database.");
        return;
      }

      setStatus("success");
      setMessage(`Added ${data.count} products to your Firestore database!`);
    } catch {
      setStatus("error");
      setMessage("Failed to connect. Is your Firebase service account set up?");
    }
  };

  const categories = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="my-6 rounded-xl border border-gray-200 bg-white p-5">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">
        Seed Your Database with Sample Data
      </h4>

      {products.length === 0 ? (
        <>
          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
              dragging
                ? "border-action-primary bg-blue-50"
                : "border-gray-300 bg-gray-50 hover:border-gray-400"
            }`}
          >
            <svg className="h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600">
              Drag & drop a CSV file here, or click to browse
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>

          {/* Load sample button */}
          <div className="mt-3 text-center">
            <span className="text-xs text-gray-400">or</span>
            <button
              onClick={handleLoadSample}
              className="ml-2 text-xs font-medium text-action-primary hover:underline"
            >
              Load the included sample-products.csv (200 products)
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Preview */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {products.length} products ready
              </span>
              <button
                onClick={() => {
                  setProducts([]);
                  setStatus("idle");
                  setMessage("");
                }}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            </div>

            {/* Category breakdown */}
            <div className="flex flex-wrap gap-2 mb-3">
              {Object.entries(categories).map(([cat, count]) => (
                <span
                  key={cat}
                  className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs text-gray-600 border border-gray-200"
                >
                  {cat}: {count}
                </span>
              ))}
            </div>

            {/* Sample rows */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pb-1 pr-4 font-medium">Name</th>
                    <th className="pb-1 pr-4 font-medium">Category</th>
                    <th className="pb-1 pr-4 font-medium">Price</th>
                    <th className="pb-1 font-medium">Stock</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  {products.slice(0, 5).map((p, i) => (
                    <tr key={i}>
                      <td className="py-0.5 pr-4">{p.name}</td>
                      <td className="py-0.5 pr-4">{p.category}</td>
                      <td className="py-0.5 pr-4">${p.price.toFixed(2)}</td>
                      <td className="py-0.5">{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length > 5 && (
                <p className="mt-1 text-xs text-gray-400">
                  ...and {products.length - 5} more
                </p>
              )}
            </div>
          </div>

          {/* Seed button */}
          <button
            onClick={handleSeed}
            disabled={status === "loading" || status === "success"}
            className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              status === "success"
                ? "bg-green-600 text-white"
                : status === "loading"
                ? "bg-gray-300 text-gray-500 cursor-wait"
                : "bg-action-primary text-action-primary-text hover:bg-action-primary-hover"
            }`}
          >
            {status === "loading"
              ? "Seeding database..."
              : status === "success"
              ? "Database seeded!"
              : `Seed ${products.length} products to Firestore`}
          </button>
        </>
      )}

      {/* Status message */}
      {message && (
        <p
          className={`mt-3 text-center text-sm ${
            status === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
