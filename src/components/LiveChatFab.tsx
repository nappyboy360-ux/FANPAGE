"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { openLiveChat } from "./TawkToChat";
import { sounds } from "@/lib/soundUtils";

/** Custom Marian-branded floating live chat button (replaces Tawk default logo bubble). */
export const LiveChatFab: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slight entrance delay for a smooth page load
    const t = window.setTimeout(() => setVisible(true), 900);
    return () => window.clearTimeout(t);
  }, []);

  const handleOpen = () => {
    sounds.playGiftChime();
    openLiveChat();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 animate-pop-in">
      {/* Floating label bubble */}
      <div className="absolute -top-11 right-0 whitespace-nowrap bg-[#17060e]/95 border border-rose-400/50 text-[10px] font-bold text-rose-100 px-3 py-1.5 rounded-xl shadow-xl animate-bounce-subtle pointer-events-none">
        💬 Live chat with Marian's team
        <div className="absolute -bottom-1 right-6 w-2 h-2 bg-[#17060e] border-r border-b border-rose-400/50 rotate-45" />
      </div>

      <button
        onClick={handleOpen}
        aria-label="Open VIP live chat"
        className="group relative flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full bg-gradient-to-r from-red-700 via-rose-600 to-red-700 border border-rose-300/50 shadow-[0_8px_30px_rgba(220,38,38,0.5)] hover:scale-105 transition-transform cursor-pointer"
      >
        {/* Avatar with online dot */}
        <div className="relative w-10 h-10 rounded-full border-2 border-amber-300/80 overflow-hidden animate-float-loop">
          <Image
            src="/images/marian-look-2.jpg"
            alt="Marian Rivera Live Chat"
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-black animate-pulse" />
        </div>

        <div className="text-left leading-tight">
          <p className="text-[9px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Live Now
          </p>
          <p className="text-[11px] font-extrabold text-white">VIP Chat</p>
        </div>

        {/* Pulsing glow ring */}
        <span className="absolute inset-0 rounded-full border-2 border-red-400/40 animate-ping pointer-events-none" />
      </button>
    </div>
  );
};
