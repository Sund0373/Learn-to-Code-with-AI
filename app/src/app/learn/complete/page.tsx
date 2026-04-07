"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import Link from "next/link";
import Confetti from "@/components/learn/Confetti";

function generateDiploma(canvas: HTMLCanvasElement, name: string) {
  const ctx = canvas.getContext("2d")!;
  const w = 1100;
  const h = 780;
  canvas.width = w;
  canvas.height = h;

  // Background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, w, h);

  // Border
  ctx.strokeStyle = "#2563EB";
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, w - 60, h - 60);

  // Inner border
  ctx.strokeStyle = "#BFDBFE";
  ctx.lineWidth = 2;
  ctx.strokeRect(45, 45, w - 90, h - 90);

  // Title
  ctx.fillStyle = "#1E3A5F";
  ctx.font = "bold 44px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("Certificate of Completion", w / 2, 150);

  // Divider
  ctx.strokeStyle = "#2563EB";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 180, 175);
  ctx.lineTo(w / 2 + 180, 175);
  ctx.stroke();

  // Subtitle
  ctx.fillStyle = "#6B7280";
  ctx.font = "20px Georgia, serif";
  ctx.fillText("This certifies that", w / 2, 240);

  // Name
  ctx.fillStyle = "#111827";
  ctx.font = "bold 48px Georgia, serif";
  ctx.fillText(name || "Student", w / 2, 310);

  // Name underline
  ctx.strokeStyle = "#D1D5DB";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 200, 325);
  ctx.lineTo(w / 2 + 200, 325);
  ctx.stroke();

  // Body
  ctx.fillStyle = "#6B7280";
  ctx.font = "20px Georgia, serif";
  ctx.fillText("has successfully completed the", w / 2, 390);

  ctx.fillStyle = "#2563EB";
  ctx.font = "bold 32px Georgia, serif";
  ctx.fillText("Learn to Code with AI", w / 2, 440);

  ctx.fillStyle = "#6B7280";
  ctx.font = "20px Georgia, serif";
  ctx.fillText("full-stack development training program", w / 2, 480);

  // Skills
  ctx.fillStyle = "#374151";
  ctx.font = "16px Georgia, serif";
  const skills = "Git \u2022 Next.js \u2022 Firebase \u2022 Authentication \u2022 APIs \u2022 Web Scraping \u2022 AI Integration";
  ctx.fillText(skills, w / 2, 530);

  // Date
  ctx.fillStyle = "#9CA3AF";
  ctx.font = "18px Georgia, serif";
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  ctx.fillText(date, w / 2, 620);

  // Footer
  ctx.fillStyle = "#D1D5DB";
  ctx.font = "14px Georgia, serif";
  ctx.fillText("Powered by Claude Code \u2022 Anthropic", w / 2, 720);
}

export default function CompletionPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState("");
  const [generated, setGenerated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  const playCelebration = useCallback(() => {
    try {
      const audio = new Audio("/Celebration.m4a");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {}
  }, []);

  useEffect(() => {
    playCelebration();
  }, [playCelebration]);

  const handleConfettiDone = useCallback(() => {
    setShowConfetti(false);
  }, []);

  useEffect(() => {
    if (canvasRef.current && generated) {
      generateDiploma(canvasRef.current, name);
    }
  }, [generated, name]);

  const handleGenerate = () => {
    setGenerated(true);
    setShowConfetti(true);
    playCelebration();
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "Certificate-of-Completion.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-app-bg">
      {showConfetti && <Confetti onDone={handleConfettiDone} />}

      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Congratulations!
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          You&apos;ve completed the entire Learn to Code with AI training program.
          You now have a working full-stack application with authentication,
          a database, APIs, web scraping, and AI integration.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            What you built
          </h2>
          <ul className="mt-4 space-y-2 text-left text-sm text-gray-600 max-w-md mx-auto">
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs">&#10003;</span>
              A Next.js web application with Tailwind CSS
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs">&#10003;</span>
              Git version control and GitHub collaboration
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs">&#10003;</span>
              Firebase Firestore database with 200+ records
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs">&#10003;</span>
              User authentication with email/password
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs">&#10003;</span>
              REST API endpoints with CRUD operations
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs">&#10003;</span>
              Python web scraping with Playwright
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs">&#10003;</span>
              AI integration with Claude and/or OpenAI
            </li>
          </ul>
        </div>

        {/* Diploma generator */}
        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Certificate of Completion
          </h2>

          {!generated ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Enter your name to generate your certificate of completion.
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="input mx-auto max-w-xs"
              />
              <div>
                <button
                  onClick={handleGenerate}
                  className="rounded-lg bg-action-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-action-primary-hover transition-colors"
                >
                  Generate Certificate
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <canvas
                ref={canvasRef}
                className="mx-auto w-full max-w-2xl rounded-lg border border-gray-200 shadow-sm"
              />
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleDownload}
                  className="rounded-lg bg-action-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-action-primary-hover transition-colors"
                >
                  Download Certificate
                </button>
                <button
                  onClick={() => setGenerated(false)}
                  className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Edit Name
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10">
          <Link
            href="/learn"
            className="text-sm text-action-primary hover:underline"
          >
            &larr; Back to tutorial
          </Link>
        </div>
      </div>
    </div>
  );
}
