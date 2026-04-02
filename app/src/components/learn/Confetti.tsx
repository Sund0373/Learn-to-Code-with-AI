"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  drift: number;
}

const COLORS = [
  "#2563EB", // blue
  "#16A34A", // green
  "#D97706", // amber
  "#DC2626", // red
  "#9333EA", // purple
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F59E0B", // yellow
];

const SHAPES = ["square", "circle", "strip"] as const;

/** Plays the celebration sound clip. */
function playCelebration() {
  try {
    const audio = new Audio("/Celebration.m4a");
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Browser may block autoplay — skip silently
    });
  } catch {
    // Audio not available — skip silently
  }
}

export default function Confetti({ onDone }: { onDone: () => void }) {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1.5,
      size: 4 + Math.random() * 6,
      drift: (Math.random() - 0.5) * 80,
    }))
  );

  useEffect(() => {
    playCelebration();
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => {
        const shape = SHAPES[p.id % SHAPES.length];
        return (
          <div
            key={p.id}
            className="absolute animate-confetti-fall"
            style={{
              left: `${p.x}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              ["--drift" as string]: `${p.drift}px`,
            }}
          >
            <div
              className="animate-confetti-spin"
              style={{
                width: shape === "strip" ? p.size * 0.4 : p.size,
                height: shape === "strip" ? p.size * 1.5 : p.size,
                backgroundColor: p.color,
                borderRadius: shape === "circle" ? "50%" : shape === "strip" ? "1px" : "0",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
