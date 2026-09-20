"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trophy, Star, Sparkles, Heart, Film, Play, Check } from "lucide-react";
import { sounds } from "@/lib/soundUtils";

interface HighlightItem {
  id: string;
  year: string;
  title: string;
  roleName: string;
  badge: string;
  description: string;
  quote: string;
  image: string;
  records: string;
}

const HIGHLIGHTS: HighlightItem[] = [
  {
    id: "balota",
    year: "2024",
    title: "Balota (Cinemalaya 2024 Landmark)",
    roleName: "Teacher Emmy",
    badge: "🏆 Cinemalaya Best Actress",
    description: "Marian's critically acclaimed dramatic masterpiece defending democratic votes in a tense wilderness thriller.",
    quote: "Hindi ko isusuko ang sagradong boto ng bayan!",
    image: "/images/marian-roles.jpg",
    records: "Award-Winning Performance",
  },
  {
    id: "rewind",
    year: "2023 - 2024",
    title: "Rewind (Historic Box Office King)",
    roleName: "Mary (with Dingdong Dantes)",
    badge: "👑 Highest Grossing PH Film (₱1.2B+)",
    description: "The heartwarming emotional phenomenon celebrating second chances and true love.",
    quote: "Kung bibigyan ako ng isa pang pagkakataon, ikaw at ikaw pa rin ang pipiliin ko.",
    image: "/images/marian-roles.jpg",
    records: "₱1.2 Billion All-Time Record",
  },
  {
    id: "floravida",
    year: "2017 - Present",
    title: "Flora Vida by Marian",
    roleName: "Founder & Kyoto Master Florist",
    badge: "🌹 Preserved European Botanicals",
    description: "Luxury eternal preserved Ecuadorian roses, home scents, and lifestyle artistry personally curated by Marian.",
    quote: "Bringing timeless elegance and floral beauty into every home.",
    image: "/images/marian-flora.jpg",
    records: "Certified Master Florist",
  },
  {
    id: "marimar",
    year: "2007",
    title: "Marimar (Breakout Legend)",
    roleName: "Marimar / Bella Aldama",
    badge: "⭐ 52.6% Peak TV Rating",
    description: "The groundbreaking television adaptation that propelled Marian Rivera to become the Philippine Primetime Queen.",
    quote: "Aw! Marimar! Sergio!",
    image: "/images/marian-hero.jpg",
    records: "All-Time TV Viewership Record",
  },
];

export const StreamlinedHighlights: React.FC<{ onOpenChat: () => void }> = ({ onOpenChat }) => {
  const [lovedItems, setLovedItems] = useState<Record<string, boolean>>({});

  const toggleLove = (id: string) => {
    sounds.playHeart();
    setLovedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {HIGHLIGHTS.map((item, idx) => {
          const isLoved = !!lovedItems[item.id];
          return (
            <div
              key={item.id}
              className="rounded-3xl glass-panel border border-red-800/40 hover:border-red-500/60 transition-all overflow-hidden flex flex-col justify-between shadow-xl shadow-black/40 animate-card-enter"
              style={{
                animationDelay: `${idx * 0.12}s`,
                animationFillMode: "both",
              }}
            >
              {/* Media Image Banner */}
              <div className="relative h-48 w-full overflow-hidden bg-black animate-float-loop" style={{ animationDelay: `${idx * 0.6}s` }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10060d] via-black/30 to-transparent"></div>

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-amber-300 font-bold text-[10px] border border-amber-500/40">
                    {item.year}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 backdrop-blur-md text-rose-200 text-[10px] font-semibold border border-red-700/40">
                    {item.records}
                  </span>
                </div>

                <button
                  onClick={() => toggleLove(item.id)}
                  className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all ${
                    isLoved ? "bg-red-600 text-white" : "bg-black/60 text-rose-300 hover:text-white"
                  }`}
                >
                  <Heart size={14} fill={isLoved ? "currentColor" : "none"} />
                </button>

                <div className="absolute bottom-2.5 left-3 right-3">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    Role: {item.roleName}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white font-serif">{item.title}</h4>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="p-2 rounded-xl bg-red-950/60 border border-red-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                  <Trophy size={13} className="text-amber-400 shrink-0" />
                  <span>{item.badge}</span>
                </div>

                <p className="text-xs text-rose-100/80 font-light leading-relaxed">
                  {item.description}
                </p>

                <div className="p-2.5 rounded-xl bg-black/40 border-l-2 border-red-500 text-[11px] italic text-rose-200/90">
                  "{item.quote}"
                </div>

                <div className="pt-2 border-t border-red-900/30 flex items-center justify-between text-xs">
                  <button
                    onClick={onOpenChat}
                    className="text-amber-300 hover:text-white font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <span>Chat about this role</span>
                    <Sparkles size={11} />
                  </button>
                  <span className="text-[10px] text-rose-400/60">Queen's Archive</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
