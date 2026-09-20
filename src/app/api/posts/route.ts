import { NextResponse } from "next/server";
import { db } from "@/db";
import { fanPosts } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET() {
  try {
    await seedDatabase();
    const posts = await db.select().from(fanPosts).orderBy(desc(fanPosts.createdAt));
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Posts GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch fan wall posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authorName, roleTag, content, authorAvatar, badge } = body;

    if (!authorName || !content) {
      return NextResponse.json({ success: false, error: "Author name and content are required" }, { status: 400 });
    }

    const [newPost] = await db.insert(fanPosts).values({
      authorName,
      authorAvatar: authorAvatar || "👑",
      badge: badge || "DongYan Fan Club Member",
      roleTag: roleTag || "Marimar Era",
      content,
      likesCount: 1,
      heartsCount: 1,
    }).returning();

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error("Posts POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to create fan post" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { postId, type } = body; // type: 'like' | 'heart'

    if (!postId) {
      return NextResponse.json({ success: false, error: "Missing postId" }, { status: 400 });
    }

    let updateField = type === "heart"
      ? { heartsCount: sql`${fanPosts.heartsCount} + 1` }
      : { likesCount: sql`${fanPosts.likesCount} + 1` };

    const [updated] = await db
      .update(fanPosts)
      .set(updateField)
      .where(eq(fanPosts.id, postId))
      .returning();

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error("Posts PATCH error:", error);
    return NextResponse.json({ success: false, error: "Failed to react to post" }, { status: 500 });
  }
}
