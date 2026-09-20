import { NextResponse } from "next/server";
import { db } from "@/db";
import { fanLetters } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

const MARIAN_REPLIES: Record<string, string> = {
  "Balota & Rewind":
    "Salamat nang marami sa iyong pagsuporta sa 'Balota' at 'Rewind'! Ang galing at sipag ng bawat Pilipino ang naging inspirasyon ko. Yakap mula sa akin at kay Dong! ❤️👑",
  "Flora Vida":
    "Nakakatunaw ng puso ang suporta mo sa Flora Vida! Patuloy nating pagandahin ang bawat tahanan ng may pagmamahal at kapayapaan. 🌹💐",
  Birthday: "Happy birthday! Nawa'y biyayaan ka ng Panginoon ng masaganang kalusugan, kapayapaan at kaligayahan! Cheers! 🎂🥳",
  "Life Advice": "Laban lang lagi! Walang pagsubok na hindi natin kakayanin kasama ang pananalig at pagsisikap. Nandito kami para sa 'yo! 🙏❤️",
  DongYan: "DongYan forever! Maraming salamat sa walang humpay na pagmamahal sa aming pamilya nina Zia at Sixto! 🥰👑",
  Appreciation: "Napakalaking regalo sa akin ang inyong pagmamahal sa loob ng halos dalawang dekada. Mahal ko kayo mga Kapuso! ❤️",
};

export async function GET() {
  try {
    await seedDatabase();
    const letters = await db
      .select()
      .from(fanLetters)
      .orderBy(desc(fanLetters.isPinned), desc(fanLetters.createdAt));

    return NextResponse.json({ success: true, letters });
  } catch (error) {
    console.error("Letters GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch fan letters" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authorName, authorCity, authorCountry, category, title, content } = body;

    if (!authorName || !title || !content) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const [letter] = await db
      .insert(fanLetters)
      .values({
        authorName,
        authorCity: authorCity || "Philippines",
        authorCountry: authorCountry || "Philippines",
        fanBadge: "Verified Kapuso Fan",
        category: category || "Appreciation",
        title,
        content,
        likesCount: 1,
        isPinned: false,
        marianReply:
          MARIAN_REPLIES[category] ||
          "Maraming salamat sa napakagandang sulat mo! Napangiti mo ako ngayon. Pagpalain ka ng Diyos! ❤️",
        marianReplyDate: "Verified Marian Rivera Reply",
      })
      .returning();

    return NextResponse.json({ success: true, letter });
  } catch (error) {
    console.error("Letters POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit letter" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { letterId } = await request.json();
    if (!letterId) {
      return NextResponse.json({ success: false, error: "Missing letterId" }, { status: 400 });
    }

    const [updated] = await db
      .update(fanLetters)
      .set({ likesCount: sql`${fanLetters.likesCount} + 1` })
      .where(eq(fanLetters.id, letterId))
      .returning();

    return NextResponse.json({ success: true, letter: updated });
  } catch (error) {
    console.error("Letters PATCH error:", error);
    return NextResponse.json({ success: false, error: "Failed to like letter" }, { status: 500 });
  }
}
