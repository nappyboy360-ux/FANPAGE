import { NextResponse } from "next/server";
import { db } from "@/db";
import { fanOrders } from "@/db/schema";
import { seedDatabase } from "@/db/seed";

const PURCHASE_EMAIL = "marianrivera@fanclub.pm";

export async function POST(request: Request) {
  try {
    await seedDatabase();
    const body = await request.json();
    const { buyerName, buyerEmail, shippingAddress, items, totalAmount, membershipTier } = body;

    if (!buyerName || !buyerEmail || !items || !totalAmount) {
      return NextResponse.json({ success: false, error: "Missing order details" }, { status: 400 });
    }

    const orderCode = "MR-" + Math.floor(100000 + Math.random() * 900000);
    const digitalPassCode = membershipTier
      ? "VIP-" + membershipTier.toUpperCase() + "-" + Math.random().toString(36).substring(2, 8).toUpperCase()
      : null;

    const [order] = await db
      .insert(fanOrders)
      .values({
        orderCode,
        buyerName,
        buyerEmail,
        shippingAddress: shippingAddress || null,
        items: typeof items === "string" ? items : JSON.stringify(items),
        totalAmount: Number(totalAmount),
        membershipTier: membershipTier || null,
        digitalPassCode,
        status: "Pending Confirmation",
        purchaseEmail: PURCHASE_EMAIL,
      })
      .returning();

    return NextResponse.json({
      success: true,
      order,
      orderCode,
      digitalPassCode,
      purchaseEmail: PURCHASE_EMAIL,
    });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to process order" }, { status: 500 });
  }
}
