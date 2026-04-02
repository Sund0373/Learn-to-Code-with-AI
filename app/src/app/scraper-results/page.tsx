"use client";

import { useState, useRef, useCallback } from "react";

interface ScrapedItem {
  [key: string]: unknown;
}

export default function ScraperResultsPage() {
  const [items, setItems] = useState<ScrapedItem[]>([]);
  const [fileName, setFileName] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    setStatus("idle");
    setMessage("");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        const data = Array.isArray(parsed) ? parsed : [parsed];
        setItems(data);

        // Suggest collection name from filename
        const suggested = file.name
          .replace(/\.json$/i, "")
          .replace(/[^a-zA-Z0-9]/g, "_")
          .toLowerCase();
        setCollectionName(suggested);
      } catch {
        setItems([]);
        setMessage("Invalid JSON file.");
        setStatus("error");
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith(".json")) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleImport = async () => {
    if (!collectionName.trim() || items.length === 0) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: collectionName.trim(),
          documents: items,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Failed to import.");
        return;
      }

      setStatus("success");
      setMessage(
        `Imported ${data.count} documents into the "${data.collection}" collection!`
      );
    } catch {
      setStatus("error");
      setMessage(
        "Failed to connect. Make sure Firebase is configured and your dev server is running."
      );
    }
  };

  // Get all unique keys across items for the table header
  const allKeys = items.length > 0
    ? [...new Set(items.flatMap((item) => Object.keys(item)))]
    : [];

  const formatValue = (val: unknown): string => {
    if (val === null || val === undefined) return "—";
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Scraper Results</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload your scraped JSON data, review it, and import it into Firestore.
        </p>
      </div>

      {items.length === 0 ? (
        <>
          {/* Upload zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
              dragging
                ? "border-action-primary bg-blue-50"
                : "border-gray-300 bg-gray-50 hover:border-gray-400"
            }`}
          >
            <svg
              className="h-10 w-10 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm font-medium text-gray-700">
              Drag & drop your output.json here
            </p>
            <p className="mt-1 text-xs text-gray-500">
              or click to browse — expects a JSON array of objects
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>

          <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Where to find your scraped data
            </h3>
            <p className="text-sm text-gray-600">
              After running your scraper, the output is saved to{" "}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-action-primary">
                scrapers/output.json
              </code>
              . Drag that file here to preview and import it into your database.
            </p>
          </div>

          {status === "error" && message && (
            <p className="mt-3 text-sm text-red-600">{message}</p>
          )}
        </>
      ) : (
        <>
          {/* Data loaded — show preview and import controls */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{fileName}</span>
                {" — "}
                {items.length} item{items.length !== 1 ? "s" : ""},{" "}
                {allKeys.length} field{allKeys.length !== 1 ? "s" : ""} detected
              </p>
            </div>
            <button
              onClick={() => {
                setItems([]);
                setFileName("");
                setCollectionName("");
                setStatus("idle");
                setMessage("");
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Upload different file
            </button>
          </div>

          {/* Schema preview */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Detected Schema
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              These are the fields found in your scraped data. Each field becomes
              a property on the Firestore documents.
            </p>
            <div className="flex flex-wrap gap-2">
              {allKeys.map((key) => {
                const sampleVal = items.find((item) => item[key] !== undefined)?.[key];
                const type =
                  sampleVal === null || sampleVal === undefined
                    ? "unknown"
                    : typeof sampleVal;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5"
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {key}
                    </span>
                    <span className="text-[10px] rounded bg-gray-200 px-1.5 py-0.5 text-gray-500 font-mono">
                      {type}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3">
              <p className="text-xs text-blue-800">
                <span className="font-semibold">Tip:</span> If the schema
                doesn&apos;t look right (e.g., wrong field names, missing data,
                or everything in one field), go back to your scraper and ask
                Claude to fix the output format. A clean schema here means clean
                data in your database.
              </p>
            </div>
          </div>

          {/* Data table preview */}
          <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Data Preview (first 20 rows)
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-left">
                    {allKeys.map((key) => (
                      <th
                        key={key}
                        className="px-4 py-2.5 text-xs font-semibold text-gray-600 whitespace-nowrap"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.slice(0, 20).map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      {allKeys.map((key) => (
                        <td
                          key={key}
                          className="px-4 py-2 text-gray-700 whitespace-nowrap max-w-[200px] truncate"
                          title={formatValue(item[key])}
                        >
                          {formatValue(item[key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {items.length > 20 && (
                <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-400">
                  ...and {items.length - 20} more rows
                </div>
              )}
            </div>
          </div>

          {/* Import to Firestore */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Import to Firestore
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Choose a collection name for this data. A new collection will be
              created in your Firestore database.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Collection name
                </label>
                <input
                  type="text"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  placeholder="e.g., scraped_restaurants"
                  className="input w-full"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleImport}
                  disabled={
                    !collectionName.trim() ||
                    status === "loading" ||
                    status === "success"
                  }
                  className={`w-full sm:w-auto rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors ${
                    status === "success"
                      ? "bg-green-600 text-white"
                      : status === "loading"
                      ? "bg-gray-300 text-gray-500 cursor-wait"
                      : !collectionName.trim()
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-action-primary text-action-primary-text hover:bg-action-primary-hover"
                  }`}
                >
                  {status === "loading"
                    ? "Importing..."
                    : status === "success"
                    ? "Imported!"
                    : `Import ${items.length} items`}
                </button>
              </div>
            </div>

            {message && (
              <p
                className={`mt-3 text-sm ${
                  status === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            {status === "success" && (
              <p className="mt-2 text-xs text-gray-500">
                Check your Firebase Console — you should see a new &quot;{collectionName}&quot; collection with your data.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
