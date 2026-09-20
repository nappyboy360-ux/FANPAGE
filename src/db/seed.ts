import { db } from "./index";
import { fanLetters, fanPosts, vipChats } from "./schema";

let seededInProcess = false;

export async function seedDatabase() {
  if (seededInProcess) return { message: "Already seeded" };

  try {
    const existing = await db.select({ id: fanPosts.id }).from(fanPosts).limit(1);
    if (existing.length > 0) {
      seededInProcess = true;
      return { message: "Database already seeded" };
    }

    await db.insert(fanPosts).values([
      {
        authorName: "Maria Clara Santos",
        authorAvatar: "🌸",
        badge: "DongYan OG Fan since 2007",
        roleTag: "Marimar Era",
        content:
          "Marian Rivera is forever the undisputed Philippine Primetime Queen! From Marimar dancing on the shores to Teacher Emmy defending our votes in Balota, her talent and heart for the Filipino people are unparalleled! ❤️👑🔥",
        likesCount: 342,
        heartsCount: 189,
      },
      {
        authorName: "Kenji Ramos",
        authorAvatar: "🎬",
        badge: "Balota Champion",
        roleTag: "Balota Era",
        content:
          "Just watched Balota for the 3rd time in cinemas! Marian's performance gave me absolute chills. She truly deserved the Cinemalaya Best Actress award. Proud Kapuso forever! 🇵🇭✨",
        likesCount: 512,
        heartsCount: 278,
      },
      {
        authorName: "Jasmine Dela Cruz (UAE Kapuso)",
        authorAvatar: "🌹",
        badge: "Flora Vida VIP",
        roleTag: "Flora Vida Boss",
        content:
          "Received my Flora Vida eternal roses in Dubai! Marian's eye for elegance is unmatched. Thank you Queen Marian for inspiring all working moms and Filipinas abroad! 💐❤️",
        likesCount: 230,
        heartsCount: 145,
      },
      {
        authorName: "Patricia & Carlo (DongYan Forever)",
        authorAvatar: "💍",
        badge: "DongYan Loyalists",
        roleTag: "Rewind Miracle",
        content:
          "'Rewind' made our entire family cry and value second chances. Marian and Dingdong's chemistry is the standard of true love. Forever DongYan! 👑💑",
        likesCount: 689,
        heartsCount: 440,
      },
    ]);

    await db.insert(fanLetters).values([
      {
        authorName: "Bea Alonzo Fan Turned DongYan Sister",
        authorCity: "Quezon City",
        authorCountry: "Philippines",
        fanBadge: "Kapuso Diamond VIP",
        category: "Balota & Rewind",
        title: "To our Queen Marian: You showed us what courage looks like in Balota",
        content:
          "Dear Ms. Marian, I have followed your career from your very first commercial to Marimar, Amaya, and now Balota. Seeing you run through the muddy forest holding that yellow ballot box with raw tears and grit proved once again why you are our greatest actress. Salamat sa tapang at inspirasyon!",
        likesCount: 284,
        isPinned: true,
        marianReply:
          "Maraming maraming salamat, Bea! Nakakataba ng puso marinig ito. Ang 'Balota' ay alay ko sa bawat Pilipino at guro na nagtatanggol sa ating kinabukasan. Mahal ko kayo! Yakap na mahigpit mula sa akin at kay Dong! ❤️👑",
        marianReplyDate: "Verified Marian Rivera Reply",
      },
      {
        authorName: "Kristine Joy Mendoza",
        authorCity: "Cebu City",
        authorCountry: "Philippines",
        fanBadge: "DongYan Forever",
        category: "Flora Vida",
        title: "How your Flora Vida story inspired me to start my own floral shop",
        content:
          "Dearest Queen Marian, as a young mother of two, watching you balance showbiz, Dingdong, Zia, Sixto, and your passion for floral arrangements at Flora Vida showed me that women can have both passion and family. Thank you for being my role model!",
        likesCount: 198,
        isPinned: true,
        marianReply:
          "Kristine! Sobrang proud ako sa 'yo! Ang sarap sa puso na maging inspirasyon sa kapwa ko nanay. Tandaan mo, lagyan mo lang ng pagmamahal bawat bulaklak at gawa mo, pagpapalain ka ni Lord. Laban lang! 🌸💐",
        marianReplyDate: "Verified Marian Rivera Reply",
      },
      {
        authorName: "Rafael 'Ralph' Santos",
        authorCity: "San Francisco, CA",
        authorCountry: "United States",
        fanBadge: "Global Kapuso Superfan",
        category: "Appreciation",
        title: "From Marimar in 2007 to 2026: The Queen that kept Overseas Filipinos connected home",
        content:
          "Living abroad in California for 20 years, watching your teleseryes made us feel like we were right back home. We love you Marian and Dingdong!",
        likesCount: 165,
        isPinned: false,
        marianReply:
          "Hello mga kababayan natin sa San Francisco! Kayo ang dahilan kung bakit patuloy kaming nagsisipag nina Dong. Huwag kalimutang mag-smile at mag-enjoy lagi. Ingat kayo dyan palagi! ❤️",
        marianReplyDate: "Verified Marian Rivera Reply",
      },
    ]);

    await db.insert(vipChats).values([
      {
        sessionId: "welcome_broadcast",
        sender: "marian",
        senderName: "Marian Rivera-Dantes 👑",
        senderAvatar: "/images/marian-avatar.jpg",
        content:
          "Kumusta, mga mahal kong Kapuso at fans! ❤️ Welcome sa aking official direct VIP Fan Portal! Dito pwede kayong mag-iwan ng mensahe, magtanong tungkol sa aking mga projects tulad ng 'Balota' at 'Rewind', o tungkol sa Flora Vida at pamilya. Super happy ako na makausap kayo! 🌹✨",
        isVoiceNote: true,
        reaction: "❤️",
      },
    ]);

    seededInProcess = true;
    return { message: "Database seeded successfully" };
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
