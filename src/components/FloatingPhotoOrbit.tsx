"use client";

import React from "react";
import Image from "next/image";

const OUTER_PHOTOS = [
  { src: "/images/marian-look-1.jpg", angle: 0, label: "Chic & Casual" },
  { src: "/images/marian-look-2.jpg", angle: 72, label: "Elegant Smile" },
  { src: "/images/marian-look-3.jpg", angle: 144, label: "Regal Glamour" },
  { src: "/images/marian-look-4.jpg", angle: 216, label: "Polka Dot Charm" },
  { src: "/images/marian-look-5.jpg", angle: 288, label: "Power White" },
];

const INNER_PHOTOS = [
  { src: "/images/marian-hero.jpg", angle: 40, label: "Ruby Queen" },
  { src: "/images/marian-flora.jpg", angle: 160, label: "Flora Vida" },
  { src: "/images/marian-roles.jpg", angle: 280, label: "Screen Icon" },
];

/** Slow-rotating photo orbit ring: center portrait floats, photos circle it. */
export const FloatingPhotoOrbit: React.FC = () => {
  const R1 = 150; // outer radius (px)
  const R2 = 92;  // inner radius

  return (
    <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] mx-auto select-none">
      {/* Halo rings */}
      <div className="halo-ring" style={{ width: "96%", height: "96%", top: "2%", left: "2%" }} />
      <div
        className="halo-ring border-amber-400/25"
        style={{ width: "64%", height: "64%", top: "18%", left: "18%", animationDuration: "30s" }}
      />

      {/* Center floating portrait */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 animate-float-loop">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full p-[3px] bg-gradient-to-tr from-amber-400 via-rose-500 to-red-600 shadow-[0_0_40px_rgba(239,68,68,0.45)]">
          <div className="w-full h-full rounded-full overflow-hidden relative bg-black">
            <Image
              src="/images/marian-look-2.jpg"
              alt="Marian Rivera elegant portrait"
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-rose-500 text-black text-[9px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-lg">
            PRIMETIME QUEEN
          </div>
        </div>
      </div>

      {/* Outer orbit (clockwise) */}
      <div
        className="absolute top-1/2 left-1/2 animate-orbit"
        style={{ width: R1 * 2, height: R1 * 2 }}
      >
        {OUTER_PHOTOS.map((p, i) => {
          const rad = (p.angle * Math.PI) / 180;
          const x = Math.cos(rad) * R1;
          const y = Math.sin(rad) * R1;
          return (
            <div
              key={i}
              className="absolute group"
              style={{ top: "50%", left: "50%", transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            >
              {/* Counter-rotate so photo stays upright */}
              <div className="animate-orbit-rev">
                <div
                  className="relative w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-2xl overflow-hidden border-2 border-rose-400/50 shadow-lg shadow-black/60 float-tilt-hover cursor-pointer"
                  style={{ animation: `float-loop ${5 + i * 0.7}s ease-in-out infinite` }}
                  title={p.label}
                >
                  <Image
                    src={p.src}
                    alt={p.label}
                    fill
                    sizes="72px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inner orbit (counter-clockwise) */}
      <div
        className="absolute top-1/2 left-1/2 animate-orbit-rev"
        style={{ width: R2 * 2, height: R2 * 2, animationDuration: "22s" }}
      >
        {INNER_PHOTOS.map((p, i) => {
          const rad = (p.angle * Math.PI) / 180;
          const x = Math.cos(rad) * R2;
          const y = Math.sin(rad) * R2;
          return (
            <div
              key={i}
              className="absolute group"
              style={{ top: "50%", left: "50%", transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            >
              <div className="animate-orbit" style={{ animationDuration: "22s" }}>
                <div
                  className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-amber-400/60 shadow-lg shadow-red-900/50 cursor-pointer hover:scale-125 transition-transform duration-300"
                  title={p.label}
                >
                  <Image src={p.src} alt={p.label} fill sizes="48px" className="object-cover" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
