"use client";

import React, { useMemo } from "react";

const PETAL_COLORS = ["", "gold", "soft"] as const;

/** Lightweight CSS-only floating rose petals + sparkles + gentle glow orbs. */
export const FloatingParticles: React.FC = () => {
  const petals = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        left: `${(i * 8.3 + 4) % 98}%`,
        duration: `${11 + (i % 6) * 2.2}s`,
        delay: `${(i * 1.7) % 12}s`,
        scale: 0.6 + (i % 4) * 0.22,
        color: PETAL_COLORS[i % 3],
      })),
    []
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        top: `${(i * 17 + 6) % 92}%`,
        left: `${(i * 23 + 11) % 96}%`,
        duration: `${2.4 + (i % 5) * 0.7}s`,
        delay: `${(i * 0.9) % 4}s`,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Warm glow orbs */}
      <div className="absolute top-[12%] left-[8%] w-40 h-40 rounded-full bg-red-600/20 blur-3xl animate-float-slow" />
      <div className="absolute top-[55%] right-[6%] w-52 h-52 rounded-full bg-rose-500/15 blur-3xl animate-float-slow [animation-delay:2.5s]" />
      <div className="absolute bottom-[8%] left-[30%] w-44 h-44 rounded-full bg-amber-500/10 blur-3xl animate-float-slow [animation-delay:4s]" />

      {/* Drifting rose petals */}
      {petals.map((p, i) => (
        <div
          key={`p-${i}`}
          className="petal"
          style={{ left: p.left, animationDuration: p.duration, animationDelay: p.delay }}
        >
          <div className={`petal-shape ${p.color}`} style={{ transform: `scale(${p.scale})` }} />
        </div>
      ))}

      {/* Twinkling gold sparkles */}
      {sparkles.map((s, i) => (
        <span
          key={`s-${i}`}
          className="sparkle-dot"
          style={{
            top: s.top,
            left: s.left,
            animationDuration: s.duration,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
};
