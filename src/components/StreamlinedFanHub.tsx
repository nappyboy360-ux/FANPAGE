"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Heart, Plus, MapPin, ShieldCheck, Flame, Send, MessageSquare, Sparkles, X } from "lucide-react";
import { sounds } from "@/lib/soundUtils";

interface Letter {
  id: number;
  authorName: string;
  authorCity: string;
  authorCountry: string;
  category: string;
  title: string;
  content: string;
  likesCount: number;
  isPinned: boolean;
  marianReply?: string | null;
}

interface FanPost {
  id: number;
  authorName: string;
  authorAvatar: string;
  badge: string;
  roleTag: string;
  content: string;
  likesCount: number;
  heartsCount: number;
}

const INITIAL_LETTERS: Letter[] = [
  {
    id: 1,
    authorName: "Bea Alonzo Fan Turned DongYan Sister",
    authorCity: "Quezon City",
    authorCountry: "Philippines",
    category: "Balota & Rewind",
    title: "To our Queen Marian: You showed us what courage looks like in Balota",
    content: "Dear Ms. Marian, I have followed your career from your very first commercial to Marimar, Amaya, and now Balota. Seeing you run through the muddy forest holding that yellow ballot box with raw tears and grit proved once again why you are our greatest actress. Salamat sa tapang at inspirasyon!",
    likesCount: 284,
    isPinned: true,
    marianReply: "Maraming maraming salamat, Bea! Nakakataba ng puso marinig ito. Ang 'Balota' ay alay ko sa bawat Pilipino at guro na nagtatanggol sa ating kinabukasan. Mahal ko kayo! Yakap na mahigpit mula sa akin at kay Dong! ❤️👑",
  },
  {
    id: 2,
    authorName: "Kristine Joy Mendoza",
    authorCity: "Cebu City",
    authorCountry: "Philippines",
    category: "Flora Vida",
    title: "How your Flora Vida story inspired me to start my own floral shop",
    content: "Dearest Queen Marian, as a young mother of two, watching you balance showbiz, Dingdong, Zia, Sixto, and your passion for floral arrangements at Flora Vida showed me that women can have both passion and family. Thank you for being my role model!",
    likesCount: 198,
    isPinned: true,
    marianReply: "Kristine! Sobrang proud ako sa 'yo! Ang sarap sa puso na maging inspirasyon sa kapwa ko nanay. Tandaan mo, lagyan mo lang ng pagmamahal bawat bulaklak at gawa mo, pagpapalain ka ni Lord. Laban lang! 🌸💐",
  },
];

const INITIAL_POSTS: FanPost[] = [
  {
    id: 1,
    authorName: "Maria Clara Santos",
    authorAvatar: "🌸",
    badge: "DongYan OG Fan since 2007",
    roleTag: "Marimar Era",
    content: "Marian Rivera is forever the undisputed Philippine Primetime Queen! From Marimar dancing on the shores to Teacher Emmy defending our votes in Balota, her talent and heart for the Filipino people are unparalleled! ❤️👑🔥",
    likesCount: 342,
    heartsCount: 189,
  },
  {
    id: 2,
    authorName: "Kenji Ramos",
    authorAvatar: "🎬",
    badge: "Balota Champion",
    roleTag: "Balota Era",
    content: "Just watched Balota for the 3rd time in cinemas! Marian's performance gave me absolute chills. That raw emotion and bravery—she truly deserved the Cinemalaya Best Actress award. Proud Kapuso forever! 🇵🇭✨",
    likesCount: 512,
    heartsCount: 278,
  },
];

export const StreamlinedFanHub: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"letters" | "feed">("letters");
  const [letters, setLetters] = useState<Letter[]>(INITIAL_LETTERS);
  const [posts, setPosts] = useState<FanPost[]>(INITIAL_POSTS);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Letter Form
  const [authorName, setAuthorName] = useState("");
  const [authorCity, setAuthorCity] = useState("");
  const [category, setCategory] = useState("Appreciation");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Post Form
  const [postAuthor, setPostAuthor] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postAvatar, setPostAvatar] = useState("👑");
  const [postTag, setPostTag] = useState("Balota Champion");

  const [likedLetters, setLikedLetters] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchLetters();
    fetchPosts();
  }, []);

  const fetchLetters = async () => {
    try {
      const res = await fetch("/api/letters");
      const data = await res.json();
      if (data.success && data.letters && data.letters.length > 0) {
        setLetters(data.letters);
      }
    } catch {
      // safe fallback
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (data.success && data.posts && data.posts.length > 0) {
        setPosts(data.posts);
      }
    } catch {
      // safe fallback
    }
  };

  const handleLikeLetter = async (id: number) => {
    if (likedLetters[id]) return;
    sounds.playHeart();
    setLikedLetters((prev) => ({ ...prev, [id]: true }));
    setLetters((prev) =>
      prev.map((l) => (l.id === id ? { ...l, likesCount: l.likesCount + 1 } : l))
    );

    try {
      await fetch("/api/letters", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letterId: id }),
      });
    } catch {
      // safe
    }
  };

  const handleReactPost = async (postId: number, type: "like" | "heart") => {
    sounds.playHeart();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            likesCount: type === "like" ? p.likesCount + 1 : p.likesCount,
            heartsCount: type === "heart" ? p.heartsCount + 1 : p.heartsCount,
          };
        }
        return p;
      })
    );

    try {
      await fetch("/api/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, type }),
      });
    } catch {
      // safe
    }
  };

  const handleSendLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !title || !content) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName,
          authorCity: authorCity || "Manila",
          authorCountry: "Philippines",
          category,
          title,
          content,
        }),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        sounds.playSuccess();
        setLetters((prev) => [data.letter, ...prev]);
        setIsWriteModalOpen(false);
        setAuthorName("");
        setTitle("");
        setContent("");
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ef4444", "#dc2626", "#f59e0b", "#fb7185"],
        });
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postAuthor.trim() || !postContent.trim()) return;

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: postAuthor,
          authorAvatar: postAvatar,
          badge: "DongYan Fan Club Member",
          roleTag: postTag,
          content: postContent,
        }),
      });
      const data = await res.json();
      if (data.success) {
        sounds.playGiftChime();
        setPosts((prev) => [data.post, ...prev]);
        setIsPostModalOpen(false);
        setPostAuthor("");
        setPostContent("");
      }
    } catch {
      // safe
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Sub Header & Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-red-800/40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playNotification();
              setActiveSubTab("letters");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "letters"
                ? "bg-red-600 text-white shadow-md shadow-red-600/40"
                : "text-rose-300 hover:text-white hover:bg-red-950/40"
            }`}
          >
            <Heart size={14} className="text-rose-300" />
            <span>Fan Letters & Marian's Replies ({letters.length})</span>
          </button>

          <button
            onClick={() => {
              sounds.playNotification();
              setActiveSubTab("feed");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "feed"
                ? "bg-red-600 text-white shadow-md shadow-red-600/40"
                : "text-rose-300 hover:text-white hover:bg-red-950/40"
            }`}
          >
            <MessageSquare size={14} className="text-amber-300" />
            <span>Kapuso Fan Wall ({posts.length})</span>
          </button>
        </div>

        <div>
          {activeSubTab === "letters" ? (
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="px-4 py-2 rounded-xl ruby-gradient-btn text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus size={14} />
              <span>Write a Letter</span>
            </button>
          ) : (
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="px-4 py-2 rounded-xl ruby-gradient-btn text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus size={14} />
              <span>Post on Fan Wall</span>
            </button>
          )}
        </div>
      </div>

      {/* Letters Tab View */}
      {activeSubTab === "letters" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {letters.map((letter) => {
            const isLiked = !!likedLetters[letter.id];
            return (
              <div
                key={letter.id}
                className="p-5 rounded-3xl glass-panel border border-red-800/40 flex flex-col justify-between space-y-4 hover:border-red-500/50 transition-all shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 text-amber-300 text-[10px] font-semibold border border-red-800/40">
                      {letter.category}
                    </span>
                    {letter.isPinned && (
                      <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                        ⭐ Marian's Pick
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-white text-sm font-serif">{letter.title}</h4>
                  <p className="text-xs text-rose-100/80 leading-relaxed font-light">
                    "{letter.content}"
                  </p>
                </div>

                {/* Marian Reply Pill */}
                {letter.marianReply && (
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-[#270b16] to-[#12050b] border border-rose-500/40 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full overflow-hidden relative border border-amber-400">
                          <Image src="/images/marian-avatar.jpg" alt="Marian" width={20} height={20} className="object-cover w-full h-full" />
                        </div>
                        <span className="font-bold text-amber-300 font-serif">Marian Rivera</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                        <ShieldCheck size={10} /> Verified Reply
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-50 italic">"{letter.marianReply}"</p>
                  </div>
                )}

                {/* Footer */}
                <div className="pt-2 border-t border-red-900/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white block">{letter.authorName}</span>
                    <span className="text-[10px] text-rose-300/60 flex items-center gap-0.5">
                      <MapPin size={9} /> {letter.authorCity}
                    </span>
                  </div>

                  <button
                    onClick={() => handleLikeLetter(letter.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      isLiked ? "bg-red-600 text-white" : "bg-red-950/40 text-rose-200 border border-red-800/40"
                    }`}
                  >
                    <Heart size={12} fill={isLiked ? "currentColor" : "none"} />
                    <span>{letter.likesCount}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fan Wall View */}
      {activeSubTab === "feed" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-5 rounded-3xl glass-panel border border-red-900/30 hover:border-red-500/40 transition-all flex flex-col justify-between space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{post.authorAvatar}</span>
                  <div>
                    <h5 className="font-bold text-white text-xs">{post.authorName}</h5>
                    <span className="text-[10px] text-amber-300">{post.badge}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-red-950/60 text-rose-300 text-[10px] border border-red-800/40">
                  {post.roleTag}
                </span>
              </div>

              <p className="text-xs text-rose-100/90 leading-relaxed font-light">
                {post.content}
              </p>

              <div className="pt-2 border-t border-red-900/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReactPost(post.id, "heart")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-950/40 text-rose-300 text-xs hover:bg-red-900"
                  >
                    <Heart size={12} className="text-red-400 fill-red-400" />
                    <span>{post.heartsCount}</span>
                  </button>
                  <button
                    onClick={() => handleReactPost(post.id, "like")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-950/40 text-rose-300 text-xs hover:bg-red-900"
                  >
                    <Flame size={12} className="text-amber-400" />
                    <span>{post.likesCount}</span>
                  </button>
                </div>
                <span className="text-[10px] text-rose-400/50">Verified Kapuso Member</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Write Letter */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0f070e] border border-red-600/40 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-red-900/40 pb-3">
              <h4 className="font-bold text-white text-base font-serif">Write Letter to Queen Marian</h4>
              <button onClick={() => setIsWriteModalOpen(false)} className="text-rose-300 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendLetter} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-rose-200/80 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Maria Clara"
                    className="w-full bg-red-950/30 text-white px-3 py-1.5 rounded-xl border border-red-800/40 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-rose-200/80 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={authorCity}
                    onChange={(e) => setAuthorCity(e.target.value)}
                    placeholder="e.g. Quezon City / Dubai"
                    className="w-full bg-red-950/30 text-white px-3 py-1.5 rounded-xl border border-red-800/40 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-rose-200/80 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#1b0811] text-white px-3 py-1.5 rounded-xl border border-red-800/40 text-xs focus:outline-none"
                >
                  <option value="Balota & Rewind">Balota & Rewind Movies</option>
                  <option value="Flora Vida">Flora Vida Preserved Roses</option>
                  <option value="Birthday">Birthday Greeting / Wish</option>
                  <option value="Life Advice">Life & Career Motivation</option>
                  <option value="DongYan">DongYan Couple & Family</option>
                  <option value="Appreciation">General Appreciation</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-rose-200/80 mb-1">Letter Subject *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Thank you Queen Marian for inspiring us!"
                  className="w-full bg-red-950/30 text-white px-3 py-1.5 rounded-xl border border-red-800/40 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-rose-200/80 mb-1">Your Letter *</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Dear Ms. Marian..."
                  className="w-full bg-red-950/30 text-white px-3 py-2 rounded-xl border border-red-800/40 text-xs focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-1.5 rounded-full bg-red-950/40 text-rose-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-1.5 rounded-full ruby-gradient-btn text-white text-xs font-bold"
                >
                  {isSubmitting ? "Sending..." : "Send Letter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Post to Wall */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0f070e] border border-red-600/40 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-red-900/40 pb-3">
              <h4 className="font-bold text-white text-base font-serif">Post on Kapuso Fan Wall</h4>
              <button onClick={() => setIsPostModalOpen(false)} className="text-rose-300 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="block text-[11px] text-rose-200/80 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={postAuthor}
                  onChange={(e) => setPostAuthor(e.target.value)}
                  placeholder="e.g. Kenji Ramos"
                  className="w-full bg-red-950/30 text-white px-3 py-1.5 rounded-xl border border-red-800/40 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-rose-200/80 mb-1">Avatar</label>
                  <select
                    value={postAvatar}
                    onChange={(e) => setPostAvatar(e.target.value)}
                    className="w-full bg-[#1b0811] text-white px-2 py-1.5 rounded-xl border border-red-800/40 text-xs focus:outline-none"
                  >
                    <option value="👑">👑 Queen Crown</option>
                    <option value="🌹">🌹 Flora Rose</option>
                    <option value="🎬">🎬 Movie Fan</option>
                    <option value="💃">💃 Dancer</option>
                    <option value="✨">✨ Sparkle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-rose-200/80 mb-1">Era Tag</label>
                  <select
                    value={postTag}
                    onChange={(e) => setPostTag(e.target.value)}
                    className="w-full bg-[#1b0811] text-white px-2 py-1.5 rounded-xl border border-red-800/40 text-xs focus:outline-none"
                  >
                    <option value="Balota Champion">Balota Champion</option>
                    <option value="Rewind Miracle">Rewind Miracle</option>
                    <option value="Marimar Era">Marimar Era</option>
                    <option value="Flora Vida VIP">Flora Vida VIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-rose-200/80 mb-1">Your Message</label>
                <textarea
                  required
                  rows={3}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share your love for Queen Marian..."
                  className="w-full bg-red-950/30 text-white px-3 py-2 rounded-xl border border-red-800/40 text-xs focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-1.5 rounded-full bg-red-950/40 text-rose-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-full ruby-gradient-btn text-white text-xs font-bold"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
