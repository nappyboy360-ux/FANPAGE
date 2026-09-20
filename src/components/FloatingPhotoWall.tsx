"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

const WALL_PHOTOS = [
  { src: "/images/marian-look-1.jpg", label: "Chic & Casual", tag: "Street Icon", float: "5.2s", span: "row-span-1" },
  { src: "/images/marian-look-3.jpg", label: "Regal Glamour", tag: "Red Carpet", float: "6.4s", span: "row-span-1" },
  { src: "/images/marian-look-2.jpg", label: "Signature Smile", tag: "Fan Favorite", float: "7.1s", span: "row-span-1" },
  { src: "/images/marian-look-5.jpg", label: "Power White", tag: "Style Icon", float: "5.8s", span: "row-span-1" },
  { src: "/images/marian-look-4.jpg", label: "Polka Dot Charm", tag: "Playful Era", float: "6.9s", span: "row-span-1" },
];

/** Floating photo wall: drift, hover zoom + tilt, shine sweep. */
export const FloatingPhotoWall: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-amber-400" />
          <h3 className="text-sm font-bold text-white font-serif">Glamour Photo Wall</h3>
        </div>
        <span className="text-[10px] text-rose-300/60">Hover any photo • All floating live</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {WALL_PHOTOS.map((photo, i) => (
          <div
            key={photo.src}
            className={`animate-card-enter ${photo.span}`}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationFillMode: "both",
            }}
          >
            <div
              className="group relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden border border-red-500/30 bg-black shadow-xl shadow-black/50 perspective-800 cursor-pointer"
              style={{
                animation: `float-loop ${photo.float} ease-in-out infinite`,
                animationDelay: `${i * 0.55}s`,
              }}
            >
              <Image
                src={photo.src}
                alt={photo.label}
                fill
                sizes="(max-width: 640px) 50vw, 20vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
              />

              {/* Bottom label */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2.5 pt-8">
                <p className="text-[10px] font-bold text-white leading-tight">{photo.label}</p>
                <p className="text-[8px] text-amber-300/90 uppercase tracking-wider">{photo.tag}</p>
              </div>

              {/* Shine sweep on hover */}
              <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="shimmer-sweep" style={{ animationDuration: "1.6s" }} />
              </div>

              {/* Border glow on hover */}
              <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 ring-rose-400/60 transition-all duration-300 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
