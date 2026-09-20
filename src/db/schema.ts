import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";

// Direct Chat with Marian Rivera
export const vipChats = pgTable("vip_chats", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  sender: text("sender").notNull(), // 'fan' | 'marian' | 'system'
  senderName: text("sender_name").notNull(),
  senderAvatar: text("sender_avatar"),
  content: text("content").notNull(),
  isVoiceNote: boolean("is_voice_note").default(false),
  audioUrl: text("audio_url"),
  giftType: text("gift_type"), // 'rose' | 'crown' | 'letter' | 'heart' | null
  reaction: text("reaction"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Fan Mail & Letters to Marian
export const fanLetters = pgTable("fan_letters", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  authorCity: text("author_city").notNull(),
  authorCountry: text("author_country").default("Philippines").notNull(),
  authorEmail: text("author_email"),
  fanBadge: text("fan_badge").default("Loyal Kapuso").notNull(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  likesCount: integer("likes_count").default(0).notNull(),
  isPinned: boolean("is_pinned").default(false).notNull(),
  marianReply: text("marian_reply"),
  marianReplyDate: text("marian_reply_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Fan Club Shop Orders (membership cards & merch)
export const fanOrders = pgTable("fan_orders", {
  id: serial("id").primaryKey(),
  orderCode: text("order_code").notNull(),
  buyerName: text("buyer_name").notNull(),
  buyerEmail: text("buyer_email").notNull(),
  shippingAddress: text("shipping_address"),
  items: text("items").notNull(), // JSON string
  totalAmount: integer("total_amount").notNull(),
  membershipTier: text("membership_tier"),
  digitalPassCode: text("digital_pass_code"),
  status: text("status").default("Pending Confirmation").notNull(),
  purchaseEmail: text("purchase_email").default("marianrivera@fanclub.pm").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Fan Wall & Community Feed Posts
export const fanPosts = pgTable("fan_posts", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  authorAvatar: text("author_avatar").default("👑").notNull(),
  badge: text("badge").default("DongYan Superfan").notNull(),
  roleTag: text("role_tag").default("Marimar Era").notNull(),
  content: text("content").notNull(),
  mediaUrl: text("media_url"),
  likesCount: integer("likes_count").default(1).notNull(),
  heartsCount: integer("hearts_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
