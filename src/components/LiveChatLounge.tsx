"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import {
  Headset,
  ShieldCheck,
  Sparkles,
  Radio,
  MessageCircle,
  Crown,
  Flower2,
  Gift,
  Clapperboard,
} from "lucide-react";
import { openLiveChat } from "./TawkToChat";

const QUICK_TOPICS = [
  { icon: Clapperboard, label: "Balota & Rewind projects" },
  { icon: Flower2, label: "Flora Vida flower orders" },
  { icon: Crown, label: "VIP fan meet & greets" },
  { icon: Gift, label: "Fan gifts & deliveries" },
];

const PERKS = [
  "Real-time responses from Marian's official fan concierge",
  "Secure & private — powered by Tawk.to live chat",
  "Open 24/7 for Kapuso fans worldwide",
  "Ask about movies, Flora Vida, events & fan perks",
];

export const LiveChatLounge: React.FC = () => {
  // Auto-open the live widget when entering the VIP chat tab
  useEffect(() => {
    const t = window.setTimeout(() => openLiveChat(), 650);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-[#0e060d] border border-red-700/40 shadow-2xl shadow-black overflow-hidden min-h-[560px] flex flex-col animate-card-enter">
      {/* Lounge Header */}
      <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-red-950/90 via-[#18050e] to-black border-b border-red-800/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-red-600 shadow-lg animate-float-loop">
              <div className="w-full h-full rounded-full overflow-hidden relative">
                <Image
                  src="/images/marian-look-2.jpg"
                  alt="Marian Rivera"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <span
              className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-black"
              title="Live Support Online"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm sm:text-base font-serif">
                Marian Rivera — VIP Live Concierge
              </h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/40 flex items-center gap-1 animate-bounce-subtle">
                <Radio size={10} className="animate-pulse" />
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-rose-300/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Official live chat with Marian's fan support team</span>
            </p>
          </div>
        </div>

        <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/30 text-[10px] text-rose-200">
          <ShieldCheck size={12} className="text-emerald-400" />
          Tawk.to Secure
        </span>
      </div>

      {/* Lounge Body */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-6 p-5 sm:p-8 items-center relative overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(40,10,20,0.25)_0%,rgba(6,6,8,0.95)_100%)]">
        {/* Halo decor */}
        <div className="halo-ring hidden sm:block" style={{ width: 260, height: 260, top: "8%", right: "-60px" }} />
        <div className="absolute -top-10 -left-10 w-52 h-52 rounded-full bg-red-600/15 blur-3xl animate-float-slow pointer-events-none" />

        {/* Left column */}
        <div className="sm:col-span-7 space-y-5 relative z-10">
          <div className="space-y-2 animate-card-enter">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-600/40 text-amber-300 text-[10px] font-bold uppercase tracking-widest">
              <Headset size={12} /> Live Chat Is Now Active
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-serif leading-snug">
              Talk to Marian's team — in real time, right now.
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/75 font-light leading-relaxed max-w-md">
              Tap the button below — or the <span className="text-amber-300 font-medium">red Marian VIP bubble</span> at
              the bottom-right of your screen — to open the live conversation instantly.
            </p>
          </div>

          {/* Perks */}
          <ul className="space-y-2 animate-card-enter animate-card-d2">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-2 text-[11px] sm:text-xs text-rose-100/85">
                <Sparkles size={13} className="text-amber-400 shrink-0 mt-0.5" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>

          {/* Quick topics */}
          <div className="space-y-2 animate-card-enter animate-card-d3">
            <p className="text-[10px] font-bold text-rose-300/70 uppercase tracking-widest">Start with a topic:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_TOPICS.map((t) => (
                <button
                  key={t.label}
                  onClick={openLiveChat}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/50 hover:bg-red-900/70 text-rose-200 text-[11px] border border-red-800/40 hover:border-red-500 transition-all hover:scale-105 cursor-pointer"
                >
                  <t.icon size={12} className="text-amber-400" />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Big CTA */}
          <div className="pt-1 animate-card-enter animate-card-d4">
            <button
              onClick={openLiveChat}
              className="relative overflow-hidden w-full sm:w-auto px-8 py-4 rounded-full ruby-gradient-btn text-white font-bold text-sm flex items-center justify-center gap-3 border border-rose-300/40 cursor-pointer group"
            >
              <MessageCircle size={18} className="animate-heartbeat" />
              <span>Open Live Chat Now</span>
              <span className="shimmer-sweep" />
            </button>
            <p className="text-[10px] text-rose-300/50 mt-2">
              100% Marian-branded — the default chat logo has been removed for a seamless VIP look.
            </p>
          </div>
        </div>

        {/* Right column: floating portrait */}
        <div className="sm:col-span-5 flex justify-center relative z-10">
          <div className="relative animate-float-loop">
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-[2rem] overflow-hidden border-2 border-rose-400/50 shadow-[0_0_50px_rgba(239,68,68,0.35)]">
              <Image
                src="/images/marian-look-2.jpg"
                alt="Marian Rivera live concierge"
                fill
                sizes="224px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-8">
                <p className="text-[10px] font-bold text-white">Marian Rivera-Dantes</p>
                <p className="text-[9px] text-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Replying live today
                </p>
              </div>
            </div>

            {/* Floating mini badges */}
            <div className="absolute -top-3 -left-4 px-2.5 py-1 rounded-xl bg-[#17060e]/95 border border-amber-400/50 text-[9px] font-bold text-amber-300 shadow-lg animate-float-loop [animation-delay:0.8s]">
              🌹 Flora Vida support
            </div>
            <div className="absolute -bottom-3 -right-4 px-2.5 py-1 rounded-xl bg-[#17060e]/95 border border-rose-400/50 text-[9px] font-bold text-rose-200 shadow-lg animate-float-loop [animation-delay:1.6s]">
              🎬 Fan questions welcome
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
