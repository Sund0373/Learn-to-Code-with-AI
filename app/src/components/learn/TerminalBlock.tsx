"use client";

import { useState } from "react";

interface TerminalBlockProps {
  command: string;
  label?: string;
}

export default function TerminalBlock({ command, label }: TerminalBlockProps) {
  const [copied, setCopied] = useState(false);

  const lines = command.split("\n").filter((l) => l.trim() !== "");

  const handleCopy = async () => {
    // Copy without the $ prefix
    const cleanCommands = lines
      .map((l) => l.replace(/^\$\s*/, "").trim())
      .join("\n");
    await navigator.clipboard.writeText(cleanCommands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-gray-700 bg-gray-950">
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          </div>
          <span className="text-xs text-gray-400">
            {label || "Terminal"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="p-4">
        {lines.map((line, i) => (
          <div key={i} className="font-mono text-sm leading-relaxed">
            <span className="text-green-400 select-none">$ </span>
            <span className="text-gray-100">{line.replace(/^\$\s*/, "")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
