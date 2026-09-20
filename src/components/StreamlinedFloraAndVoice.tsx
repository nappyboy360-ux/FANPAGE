"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Volume2, Sparkles, Flame, Mic, Music, ShoppingBag, Heart } from "lucide-react";
import { ICONIC_SOUND_BITES } from "@/lib/audioTracks";
import { sounds } from "@/lib/soundUtils";

export const StreamlinedFloraAndVoice: React.FC = () => {
  const [activeBite, setActiveBite] = useState<string | null>(null);
  const [customText, setCustomText] = useState("");

  const handlePlayBite = (sb: typeof ICONIC_SOUND_BITES[0]) => {
    setActiveBite(sb.id);
    sounds.playHeart();
    sounds.speakMarianText(sb.quote, () => setActiveBite(null));
  };

  const handleCustomSpeech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    sounds.speakMarianText(customText);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Flora Vida Showcase Card */}
      <div className="p-6 rounded-3xl glass-panel-glow border border-red-600/40 grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-2xl">
        <div className="md:col-span-5 relative aspect-video md:aspect-square rounded-2xl overflow-hidden border border-red-800/40 bg-black">
          <Image
            src="/images/marian-flora.jpg"
            alt="Flora Vida by Marian"
            fill
            className="object-cover"
          />
          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-amber-300 text-[10px] font-bold border border-amber-400/40">
            🌹 Flora Vida by Marian
          </div>
        </div>

        <div className="md:col-span-7 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>Preserved Eternal Roses Collection</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
            Rouge Royale & Parisian Botanical Art
          </h3>
          <p className="text-xs text-rose-200/80 leading-relaxed font-light">
            Certified Kyoto and Parisian floristry technique. Handcrafted eternal scarlet Ecuadorian roses preserved to retain their pristine velvety bloom for 3+ years without water.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-rose-300">
            <span className="px-2.5 py-1 rounded-full bg-red-950/60 border border-red-800/40">
              ✨ 100% Handcrafted by Marian
            </span>
            <span className="px-2.5 py-1 rounded-full bg-red-950/60 border border-red-800/40">
              🌹 Eternal Ecuadorian Roses
            </span>
          </div>
        </div>
      </div>

      {/* Iconic Soundboard Grid */}
      <div className="p-6 rounded-3xl glass-panel border border-red-800/40 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-white text-base font-serif flex items-center gap-1.5">
              <Flame size={16} className="text-amber-400" />
              <span>Marian's Iconic Lines Soundboard</span>
            </h4>
            <p className="text-xs text-rose-200/70">Tap any button to play voice audio!</p>
          </div>
          <span className="text-[11px] text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
            Voice Synth
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {ICONIC_SOUND_BITES.map((sb) => {
            const isPlaying = activeBite === sb.id;
            return (
              <button
                key={sb.id}
                onClick={() => handlePlayBite(sb)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between space-y-1.5 cursor-pointer ${
                  isPlaying
                    ? "bg-red-600 text-white border-rose-300 scale-105 shadow-lg shadow-red-600/40"
                    : "bg-red-950/30 hover:bg-red-900/50 text-rose-100 border-red-800/40 hover:border-red-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">{sb.label}</span>
                  <span className="text-[10px] bg-black/40 px-1.5 py-0.2 rounded text-rose-300">{sb.tag}</span>
                </div>
                <p className="text-[11px] italic text-rose-200/90 leading-snug">"{sb.quote}"</p>
                <div className="flex items-center gap-1 text-[10px] text-amber-300/80 pt-1">
                  <Volume2 size={11} className={isPlaying ? "animate-pulse" : ""} />
                  <span>{isPlaying ? "Speaking..." : "Play Voice"}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Custom Voice Box */}
        <div className="pt-3 border-t border-red-900/30 space-y-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Mic size={13} className="text-rose-400" />
            <span>Type any custom text for Marian to speak:</span>
          </span>
          <form onSubmit={handleCustomSpeech} className="flex items-center gap-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. Mabuhay ang lahat ng Kapuso! Mahal ko kayo!"
              className="flex-1 bg-red-950/40 text-white placeholder-rose-300/40 px-3.5 py-2 rounded-xl border border-red-800/40 text-xs focus:outline-none"
            />
            <button
              type="submit"
              disabled={!customText.trim()}
              className="px-4 py-2 rounded-xl ruby-gradient-btn text-white text-xs font-bold flex items-center gap-1 disabled:opacity-40"
            >
              <Volume2 size={13} />
              <span>Speak</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
