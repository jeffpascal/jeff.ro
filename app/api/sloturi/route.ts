import { NextResponse } from "next/server";
import { getDb } from "../../lib/mongo";
import { upcomingSlots, ONE_ON_ONE } from "../../data/slots";

export const dynamic = "force-dynamic";

/** Sloturile din fereastra vizibilă, minus cele deja luate. */
export async function GET() {
  const all = upcomingSlots();
  let taken = new Set<string>();

  const dbPromise = getDb();
  if (dbPromise) {
    try {
      const db = await dbPromise;
      const rows = await db
        .collection("bookings")
        .find({
          slotIso: { $in: all.map((s) => s.iso) },
          $or: [
            { status: "confirmed" },
            { status: "pending_payment", holdExpiresAt: { $gt: new Date() } },
          ],
        })
        .project({ slotIso: 1 })
        .toArray();
      taken = new Set(rows.map((r) => r.slotIso as string));
    } catch (err) {
      console.error("Sloturi Mongo error:", err);
    }
  }

  return NextResponse.json({
    priceLei: ONE_ON_ONE.priceLei,
    durationMin: ONE_ON_ONE.durationMin,
    slots: all.filter((s) => !taken.has(s.iso)),
  });
}
