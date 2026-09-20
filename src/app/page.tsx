"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import {
  MessageCircle,
  Heart,
  Sparkles,
  Trophy,
  Flame,
  Share2,
  Crown,
  ShieldCheck,
  Check,
  Camera,
  ShoppingBag,
} from "lucide-react";
import { LiveChatLounge } from "@/components/LiveChatLounge";
import { TawkToChat } from "@/components/TawkToChat";
import { LiveChatFab } from "@/components/LiveChatFab";
import { PurchaseShop } from "@/components/PurchaseShop";
import { StreamlinedFanHub } from "@/components/StreamlinedFanHub";
import { StreamlinedHighlights } from "@/components/StreamlinedHighlights";
import { StreamlinedFloraAndVoice } from "@/components/StreamlinedFloraAndVoice";
import { FloatingParticles } from "@/components/FloatingParticles";
import { FloatingPhotoOrbit } from "@/components/FloatingPhotoOrbit";
import { FloatingPhotoWall } from "@/components/FloatingPhotoWall";
import { sounds } from "@/lib/soundUtils";

type Tab = "gallery" | "chat" | "purchase" | "fanhub" | "highlights" | "flora";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("gallery");
  const [cheersCount, setCheersCount] = useState(128450);
  const [hasCheered, setHasCheered] = useState(false);
  const [liveFansOnline, setLiveFansOnline] = useState(14820);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveFansOnline((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleCheer = () => {
    sounds.playHeart();
    setCheersCount((prev) => prev + 1);
    setHasCheered(true);
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 }, colors: ["#ef4444", "#dc2626", "#f59e0b", "#ffffff"] });
    } catch {}
    setTimeout(() => setHasCheered(false), 700);
  };

  const handleShare = () => {
    sounds.playNotification();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const switchTab = (tab: Tab) => {
    sounds.playNotification();
    setActiveTab(tab);
  };

  const tabs: { id: Tab; label: string; short: string; icon: React.ReactNode }[] = [
    { id: "gallery", label: "Glamour Wall", short: "Gallery", icon: <Camera size={15} /> },
    { id: "chat", label: "VIP Live Chat", short: "Chat", icon: <MessageCircle size={15} /> },
    { id: "purchase", label: "Fan Shop & Cards", short: "Shop", icon: <ShoppingBag size={15} /> },
    { id: "fanhub", label: "Fan Mail & Wall", short: "Fans", icon: <Heart size={15} /> },
    { id: "highlights", label: "Highlights & Roles", short: "Roles", icon: <Trophy size={15} /> },
    { id: "flora", label: "Voice & Flora Vida", short: "Voice", icon: <Sparkles size={15} /> },
  ];

  return (
    <main className="min-h-screen bg-[#060608] text-white selection:bg-red-600 selection:text-white relative pb-24">
      {/* Global Tawk.to live chat widget (default logo hidden) */}
      <TawkToChat />

      {/* Custom Marian-branded live chat button */}
      <LiveChatFab />

      {/* Animated ambient background */}
      <FloatingParticles />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[580px] h-[580px] bg-red-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[380px] h-[380px] bg-rose-900/15 rounded-full blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,15,25,0.18)_0%,rgba(6,6,8,0.95)_75%)]" />
      </div>

      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-[#090408]/90 backdrop-blur-md border-b border-red-900/40 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-red-600 shadow-md animate-heartbeat">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-black">
                <Image src="/images/marian-look-2.jpg" alt="Marian Rivera" fill sizes="44px" className="object-cover" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white font-serif">MARIAN RIVERA</span>
                <span className="bg-red-600/30 text-rose-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-red-500/40">OFFICIAL</span>
              </div>
              <p className="text-[10px] text-amber-400/90 font-medium">Philippine Primetime Queen • Fan Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/30 text-[11px] text-rose-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{liveFansOnline.toLocaleString()} Online</span>
            </div>

            <button
              onClick={handleCheer}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                hasCheered ? "bg-red-600 text-white scale-105" : "bg-red-950/40 text-rose-300 hover:text-white border border-red-800/40 hover:bg-red-900/50"
              }`}
              title="Cheer for Marian"
            >
              <Flame size={13} className="text-amber-400" />
              <span>{cheersCount.toLocaleString()}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-red-950/40 text-rose-300 hover:text-white hover:bg-red-900/50 border border-red-800/40 transition-all text-xs flex items-center gap-1"
              title="Share Fan Portal Link"
            >
              {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Profile Card with floating orbit */}
        <div className="p-6 sm:p-7 rounded-3xl glass-panel-glow border border-red-600/40 shadow-2xl shadow-red-950/40 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            {/* Left: Orbit + Photos */}
            <div className="md:col-span-5 flex justify-center">
              <FloatingPhotoOrbit />
            </div>

            {/* Right: Copy */}
            <div className="md:col-span-7 space-y-3 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif animate-card-enter">Marian Rivera-Dantes</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 text-rose-200 text-xs font-bold border border-rose-400/40 flex items-center gap-1 animate-pop-in" style={{ animationDelay: "0.15s" }}>
                  <Crown size={12} className="text-amber-400" /> Primetime Queen
                </span>
              </div>

              <p className="text-xs sm:text-sm text-rose-200/80 font-light max-w-xl animate-card-enter animate-card-d2">
                Cinemalaya Best Actress for <span className="text-white font-medium italic">Balota</span> • Star of{" "}
                <span className="text-white font-medium italic">Rewind</span> (₱1.2B+ PH All-Time Box Office) • Founder of{" "}
                <span className="text-amber-300 font-medium">Flora Vida</span>.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-[11px] text-rose-300/80 animate-card-enter animate-card-d3">
                <span className="flex items-center gap-1 bg-red-950/60 px-2 py-1 rounded-md border border-red-800/30 hover:bg-red-900/50 transition-colors">
                  <ShieldCheck size={11} className="text-emerald-400" /> Direct VIP Verified Channel
                </span>
                <span className="flex items-center gap-1 bg-red-950/60 px-2 py-1 rounded-md border border-red-800/30 hover:bg-red-900/50 transition-colors">
                  <Sparkles size={11} className="text-amber-400" /> Voice Audio Synth
                </span>
                <span className="flex items-center gap-1 bg-red-950/60 px-2 py-1 rounded-md border border-red-800/30 hover:bg-red-900/50 transition-colors">
                  <Camera size={11} className="text-rose-400" /> 9 Fixed Photos Live
                </span>
              </div>

              {/* Mini floating photo chips */}
              <div className="flex items-center justify-center md:justify-start gap-2 pt-2 animate-card-enter animate-card-d4">
                {["/images/marian-look-1.jpg", "/images/marian-look-3.jpg", "/images/marian-look-4.jpg", "/images/marian-look-5.jpg"].map(
                  (src, i) => (
                    <div
                      key={src}
                      className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-rose-400/40 shadow-lg float-tilt-hover cursor-pointer"
                      style={{ animation: `float-loop ${4.5 + i * 0.8}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }}
                      title="Marian style look"
                    >
                      <Image src={src} alt="Marian style look" fill sizes="48px" className="object-cover" />
                    </div>
                  )
                )}
                <div className="text-[10px] text-rose-300/60 pl-1">
                  <p className="font-semibold text-rose-200">Tap the glamour wall</p>
                  <p>for full-size floating photos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-1.5 rounded-2xl bg-[#0f060e] border border-red-800/40 animate-card-enter animate-card-d2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => switchTab(t.id)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === t.id
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/40 border border-rose-300/40"
                  : "text-rose-300/80 hover:text-white hover:bg-red-950/40"
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content with reveal animation */}
        <div key={activeTab} className="animate-tab-reveal pt-1">
          {activeTab === "chat" && <LiveChatLounge />}

          {activeTab === "purchase" && <PurchaseShop />}

          {activeTab === "gallery" && (
            <div className="space-y-8">
              <div className="text-center space-y-2 animate-card-enter">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-600/40 text-amber-300 text-[10px] font-bold uppercase tracking-widest">
                  <Camera size={12} /> Fixed & Floating Photo Gallery
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif">Marian Rivera — Style Universe</h2>
                <p className="text-xs sm:text-sm text-rose-200/70 max-w-xl mx-auto font-light">
                  Every photo is live-animated — floating, orbiting, and shimmering. Hover to make them dance.
                </p>
              </div>

              <FloatingPhotoWall />

              {/* Quick navigation CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-card-enter animate-card-d2">
                <button
                  onClick={() => switchTab("chat")}
                  className="w-full sm:w-auto px-6 py-3 rounded-full ruby-gradient-btn text-white text-xs font-bold flex items-center justify-center gap-2 border border-rose-300/40 cursor-pointer hover:shadow-red-500/50 transition-shadow"
                >
                  <MessageCircle size={15} />
                  <span>Open VIP Live Chat</span>
                </button>
                <button
                  onClick={() => switchTab("fanhub")}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-red-950/50 hover:bg-red-900/60 text-rose-200 text-xs font-bold flex items-center justify-center gap-2 border border-red-800/50 cursor-pointer transition-all"
                >
                  <Heart size={15} />
                  <span>Read Fan Letters</span>
                </button>
              </div>

              <div className="p-5 rounded-3xl glass-panel border border-red-800/40 text-center animate-card-enter animate-card-d3">
                <p className="text-xs text-rose-200/80 font-light">
                  9 professionally fixed photos (white shirt & jeans, black gown, polka-dot peplum, power-white blazer, emerald sparkle,
                  navy lace, taupe chic, black sleeve portrait) — all optimized to ~20KB for instant loading.
                </p>
              </div>
            </div>
          )}

          {activeTab === "fanhub" && <StreamlinedFanHub />}

          {activeTab === "highlights" && <StreamlinedHighlights onOpenChat={() => switchTab("chat")} />}

          {activeTab === "flora" && <StreamlinedFloraAndVoice />}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="sm:hidden fixed bottom-3 left-4 right-4 z-40">
        <div className="bg-[#12070e]/95 backdrop-blur-xl border border-red-600/40 rounded-2xl shadow-2xl p-1 flex items-center justify-around">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => switchTab(t.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-xl text-[9px] ${
                activeTab === t.id ? "text-white font-bold bg-red-900/50" : "text-rose-300/70"
              }`}
            >
              {t.icon}
              <span>{t.short}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
