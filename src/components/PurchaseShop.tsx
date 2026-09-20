"use client";

import React, { useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import {
  ShoppingBag,
  CreditCard,
  Crown,
  Flower2,
  Mail,
  Plus,
  Minus,
  X,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Star,
  Send,
} from "lucide-react";
import { sounds } from "@/lib/soundUtils";

const PURCHASE_EMAIL = "marianrivera@fanclub.pm";

interface ShopItem {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  tier?: "ruby" | "gold" | "diamond";
  perks: string[];
  isMembership: boolean;
}

const MEMBERSHIPS: ShopItem[] = [
  {
    id: "mem-ruby",
    name: "Ruby Member Card",
    tagline: "Starter VIP membership",
    price: 999,
    image: "/images/marian-look-3.jpg",
    tier: "ruby",
    isMembership: true,
    perks: ["Digital membership ID", "Member-only fan polls", "Birthday e-card from Marian"],
  },
  {
    id: "mem-gold",
    name: "Gold Member Card",
    tagline: "Most popular tier",
    price: 1999,
    image: "/images/marian-look-2.jpg",
    tier: "gold",
    isMembership: true,
    perks: ["Everything in Ruby", "Priority live-chat replies", "Flora Vida 10% discount", "Monthly voice greeting"],
  },
  {
    id: "mem-diamond",
    name: "Diamond Member Card",
    tagline: "Ultimate VIP access",
    price: 2999,
    image: "/images/marian-hero.jpg",
    tier: "diamond",
    isMembership: true,
    perks: ["Everything in Gold", "Fan meet priority lane", "Signed collector print", "Annual video shoutout request"],
  },
];

const PRODUCTS: ShopItem[] = [
  {
    id: "prod-flora",
    name: "Flora Vida Rouge Box",
    tagline: "Preserved Ecuadorian roses",
    price: 3499,
    image: "/images/marian-flora.jpg",
    isMembership: false,
    perks: ["Lasts 3+ years", "Handcrafted by Marian", "Black acrylic keepsake box"],
  },
  {
    id: "prod-book",
    name: "DongYan Decade Photobook",
    tagline: "Hardcover collector edition",
    price: 1850,
    image: "/images/marian-roles.jpg",
    isMembership: false,
    perks: ["200 pages of unseen photos", "Rewind & Balota BTS", "Personal message pages"],
  },
  {
    id: "prod-tee",
    name: "Marimar Retro Tee",
    tagline: "Heavyweight 240GSM",
    price: 890,
    image: "/images/marian-look-1.jpg",
    isMembership: false,
    perks: ["Vintage dance graphic", "Unisex fit", "Embroidered crown patch"],
  },
  {
    id: "prod-print",
    name: "Polka Dot Art Print",
    tagline: "Museum-grade canvas",
    price: 650,
    image: "/images/marian-look-4.jpg",
    isMembership: false,
    perks: ["Numbered edition", "Archival ink", "A3 ready-to-frame"],
  },
];

const TIER_STYLES: Record<string, { ring: string; badge: string; glow: string }> = {
  ruby: { ring: "border-rose-500/60", badge: "bg-rose-600/25 text-rose-200 border-rose-500/40", glow: "shadow-rose-700/30" },
  gold: { ring: "border-amber-400/70", badge: "bg-amber-500/25 text-amber-200 border-amber-400/40", glow: "shadow-amber-600/30" },
  diamond: { ring: "border-cyan-300/50", badge: "bg-cyan-500/20 text-cyan-100 border-cyan-400/40", glow: "shadow-cyan-600/20" },
};

interface CartLine {
  item: ShopItem;
  qty: number;
}

export const PurchaseShop: React.FC = () => {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<{
    orderCode: string;
    digitalPassCode: string | null;
    mailto: string;
  } | null>(null);

  const total = cart.reduce((acc, l) => acc + l.item.price * l.qty, 0);
  const count = cart.reduce((acc, l) => acc + l.qty, 0);

  const addToCart = (item: ShopItem) => {
    sounds.playHeart();
    setCart((prev) => {
      const found = prev.find((l) => l.item.id === item.id);
      if (found) return prev.map((l) => (l.item.id === item.id ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { item, qty: 1 }];
    });
    setCartOpen(true);
  };

  const changeQty = (id: string, delta: number) => {
    sounds.playNotification();
    setCart((prev) =>
      prev
        .map((l) => (l.item.id === id ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0)
    );
  };

  const buildMailto = (orderCode: string, lines: CartLine[], totalAmt: number) => {
    const itemsText = lines
      .map((l) => `• ${l.item.name} x${l.qty} — ₱${(l.item.price * l.qty).toLocaleString()}`)
      .join("\n");
    const subject = `🌹 Marian Fan Club Purchase — ${orderCode}`;
    const body =
      `Hi Marian's Fan Club Team!\n\n` +
      `I would like to purchase:\n${itemsText}\n\n` +
      `TOTAL: ₱${totalAmt.toLocaleString()}\n` +
      `Order Code: ${orderCode}\n\n` +
      `My details:\nName: ${buyerName}\nEmail: ${buyerEmail}\nDelivery: ${shippingAddress || "N/A"}\n\n` +
      `Please confirm my purchase and send payment instructions. Salamat! 💖`;
    return `mailto:${PURCHASE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail || cart.length === 0) return;

    setIsSubmitting(true);
    const membershipTier = cart.find((l) => l.item.isMembership)?.item.tier || null;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName,
          buyerEmail,
          shippingAddress,
          items: cart.map((l) => ({ id: l.item.id, name: l.item.name, qty: l.qty, price: l.item.price })),
          totalAmount: total,
          membershipTier,
        }),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        sounds.playSuccess();
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 }, colors: ["#ef4444", "#f59e0b", "#fb7185", "#ffffff"] });
        const mailto = buildMailto(data.orderCode, cart, total);
        setSuccess({ orderCode: data.orderCode, digitalPassCode: data.digitalPassCode, mailto });
        setCart([]);
        // Attempt to open mail client automatically
        window.open(mailto, "_blank");
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  const ItemCard = ({ item, idx }: { item: ShopItem; idx: number }) => {
    const tierStyle = item.tier ? TIER_STYLES[item.tier] : null;
    const visiblePerks = item.perks.slice(0, 2);
    const hiddenCount = item.perks.length - visiblePerks.length;
    return (
      <div
        className={`rounded-2xl glass-panel border overflow-hidden flex flex-col justify-between shadow-xl shadow-black/40 animate-card-enter hover:-translate-y-1.5 transition-transform duration-300 w-full min-w-0 ${
          tierStyle ? `${tierStyle.ring} ${tierStyle.glow}` : "border-red-800/40 hover:border-red-500/60"
        }`}
        style={{ animationDelay: `${idx * 0.08}s`, animationFillMode: "both" }}
      >
        {/* Responsive frame — scales with page width, no fixed heights */}
        <div
          className={`relative w-full overflow-hidden bg-black ${
            item.isMembership ? "aspect-[16/10] sm:aspect-[3/4]" : "aspect-[5/4] sm:aspect-square"
          }`}
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 260px"
            className="object-cover object-[center_20%] opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10060d] via-transparent to-transparent" />
          {item.isMembership && item.tier && (
            <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${tierStyle!.badge}`}>
              <Crown size={10} className="inline mr-1 -mt-0.5" />
              {item.tier} Membership
            </span>
          )}
          {!item.isMembership && (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950/80 text-rose-200 border border-red-700/40">
              <Star size={10} className="inline mr-1 -mt-0.5 text-amber-400" />
              Fan Item
            </span>
          )}
        </div>

        <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-white text-xs sm:text-sm font-serif leading-tight">{item.name}</h4>
            <p className="text-[10px] sm:text-[11px] text-rose-300/70">{item.tagline}</p>
          </div>

          <ul className="space-y-1">
            {visiblePerks.map((perk) => (
              <li key={perk} className="flex items-start gap-1.5 text-[10px] text-rose-100/75">
                <Sparkles size={10} className="text-amber-400 shrink-0 mt-0.5" />
                <span>{perk}</span>
              </li>
            ))}
            {hiddenCount > 0 && (
              <li className="text-[10px] text-amber-300/80 font-semibold pl-4">
                +{hiddenCount} more perks included
              </li>
            )}
          </ul>

          <div className="pt-2 border-t border-red-900/30 flex items-center justify-between gap-2">
            <span className="text-sm sm:text-base font-bold text-amber-300 font-mono shrink-0">
              ₱{item.price.toLocaleString()}
            </span>
            <button
              onClick={() => addToCart(item)}
              className="px-3 py-1.5 rounded-full ruby-gradient-btn text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform shrink-0"
            >
              <Plus size={12} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 min-w-0">
      {/* Shop header with purchase email notice */}
      <div className="p-3.5 sm:p-4 rounded-2xl glass-panel-glow border border-red-600/40 flex flex-col sm:flex-row items-center justify-between gap-3 animate-card-enter">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-red-900/40 border border-red-700/40 animate-float-loop">
            <ShoppingBag size={20} className="text-amber-400" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-white text-base font-serif">Fan Club Shop & Membership Cards</h3>
            <p className="text-[11px] text-rose-300/75 flex items-center gap-1 justify-center sm:justify-start">
              <Mail size={11} className="text-amber-400" />
              All purchases are processed via
              <span className="text-amber-300 font-semibold">{PURCHASE_EMAIL}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setCartOpen(true)}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-red-950 to-black border border-red-600/50 hover:border-red-400 text-white text-xs font-bold flex items-center gap-2.5 shadow-lg cursor-pointer transition-all"
        >
          <div className="relative">
            <ShoppingBag size={15} className="text-amber-400" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pop-in">
                {count}
              </span>
            )}
          </div>
          <span>My Cart</span>
          <span className="text-amber-300 font-mono">₱{total.toLocaleString()}</span>
        </button>
      </div>

      {/* Membership cards */}
      <div>
        <div className="flex items-center gap-2 mb-2 px-1 animate-card-enter">
          <CreditCard size={14} className="text-amber-400" />
          <h4 className="text-xs sm:text-sm font-bold text-white font-serif">Official Membership Cards</h4>
          <span className="text-[10px] text-rose-300/60">Includes digital member ID + perks</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MEMBERSHIPS.map((m, i) => (
            <ItemCard key={m.id} item={m} idx={i} />
          ))}
        </div>
      </div>

      {/* Fan products */}
      <div>
        <div className="flex items-center gap-2 mb-2 px-1 animate-card-enter animate-card-d2">
          <Flower2 size={14} className="text-rose-400" />
          <h4 className="text-xs sm:text-sm font-bold text-white font-serif">Collectibles & Flora Vida</h4>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {PRODUCTS.map((p, i) => (
            <ItemCard key={p.id} item={p} idx={i + 3} />
          ))}
        </div>
      </div>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0d060b] border-l border-red-600/40 h-full p-6 flex flex-col justify-between shadow-2xl animate-card-enter">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-red-900/40 pb-4">
                <h3 className="font-bold text-white text-base font-serif flex items-center gap-2">
                  <ShoppingBag size={18} className="text-amber-400" /> Your Cart
                </h3>
                <button onClick={() => setCartOpen(false)} className="p-1 rounded-full bg-red-950/50 text-rose-300 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <p className="text-center py-12 text-rose-300/60 text-xs">Your cart is empty. Add a membership card or fan item!</p>
                ) : (
                  cart.map((line) => (
                    <div key={line.item.id} className="p-3 rounded-2xl bg-red-950/30 border border-red-800/40 flex items-center justify-between gap-3 animate-pop-in">
                      <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-xl overflow-hidden relative shrink-0 border border-red-700/40">
                          <Image src={line.item.image} alt={line.item.name} fill sizes="44px" className="object-cover" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white max-w-[130px] truncate">{line.item.name}</h4>
                          <span className="text-xs text-amber-300 font-mono">₱{line.item.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => changeQty(line.item.id, -1)} className="p-1 rounded-lg bg-red-900/40 text-white hover:bg-red-800">
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold text-white px-1 font-mono">{line.qty}</span>
                        <button onClick={() => changeQty(line.item.id, 1)} className="p-1 rounded-lg bg-red-900/40 text-white hover:bg-red-800">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-red-900/40 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-rose-200/80">Total:</span>
                <span className="text-xl font-bold text-amber-300 font-mono">₱{total.toLocaleString()}</span>
              </div>
              <button
                disabled={cart.length === 0}
                onClick={() => {
                  setCartOpen(false);
                  setSuccess(null);
                  setCheckoutOpen(true);
                }}
                className="w-full py-3 rounded-full ruby-gradient-btn text-white font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
              >
                <Send size={14} />
                <span>Checkout — Send to {PURCHASE_EMAIL}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0f070e] border border-red-600/40 shadow-2xl p-6 space-y-4 animate-pop-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-red-900/40 pb-3">
              <h4 className="font-bold text-white text-base font-serif">Purchase Confirmation</h4>
              <button
                onClick={() => setCheckoutOpen(false)}
                className="p-1 rounded-full bg-red-950 text-rose-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {success ? (
              <div className="text-center space-y-4 py-3">
                <CheckCircle2 size={50} className="text-emerald-400 mx-auto animate-bounce" />
                <div>
                  <h5 className="text-lg font-bold text-white font-serif">Purchase Request Sent! 🌹</h5>
                  <p className="text-xs text-rose-200/80 mt-1">
                    Your order was recorded and routed to{" "}
                    <span className="text-amber-300 font-semibold">{PURCHASE_EMAIL}</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950 via-red-900/60 to-black border border-amber-400/40 text-left space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-amber-300 uppercase">
                    <span>Fan Club Order</span>
                    <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-emerald-400" /> Recorded</span>
                  </div>
                  <p className="text-sm font-bold text-white">{buyerName}</p>
                  <p className="text-[11px] text-rose-200/80 font-mono">
                    Order Code: <span className="text-amber-300 font-bold">{success.orderCode}</span>
                  </p>
                  {success.digitalPassCode && (
                    <p className="text-[11px] text-rose-200/80 font-mono">
                      Digital Pass: <span className="text-emerald-300 font-bold">{success.digitalPassCode}</span>
                    </p>
                  )}
                </div>

                <a
                  href={success.mailto}
                  className="w-full py-3 rounded-full ruby-gradient-btn text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Mail size={14} />
                  <span>Open Email to {PURCHASE_EMAIL}</span>
                </a>
                <p className="text-[10px] text-rose-300/60">
                  Payment instructions will be sent to your email. You can also reply directly to {PURCHASE_EMAIL}.
                </p>

                <button
                  onClick={() => {
                    setCheckoutOpen(false);
                    setSuccess(null);
                  }}
                  className="px-6 py-2 rounded-full bg-red-950/50 text-rose-200 text-xs font-semibold border border-red-800/40"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-3">
                <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/30 space-y-1 text-xs">
                  <p className="text-rose-200/80 flex items-center gap-1.5">
                    <Mail size={12} className="text-amber-400" />
                    Purchase requests are emailed to:
                  </p>
                  <p className="text-amber-300 font-semibold text-sm">{PURCHASE_EMAIL}</p>
                </div>

                <div>
                  <label className="block text-[11px] text-rose-200/80 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Maria Clara Santos"
                    className="w-full bg-red-950/30 text-white px-3 py-2 rounded-xl border border-red-800/40 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-rose-200/80 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="e.g. maria@gmail.com"
                    className="w-full bg-red-950/30 text-white px-3 py-2 rounded-xl border border-red-800/40 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-rose-200/80 mb-1">Delivery Address (optional)</label>
                  <textarea
                    rows={2}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="City / Province / Country"
                    className="w-full bg-red-950/30 text-white px-3 py-2 rounded-xl border border-red-800/40 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-red-900/40 flex items-center justify-between text-xs">
                  <span className="text-rose-300/80">{count} item(s)</span>
                  <span className="text-base font-bold text-amber-300 font-mono">₱{total.toLocaleString()}</span>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCheckoutOpen(false)}
                    className="px-4 py-2 rounded-full bg-red-950/30 text-rose-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-full ruby-gradient-btn text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send size={12} />
                    <span>{isSubmitting ? "Sending..." : "Confirm Purchase"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
