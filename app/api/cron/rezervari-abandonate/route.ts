import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongo";
import { notifyTelegram, esc } from "../../../lib/telegram";

export const dynamic = "force-dynamic";

/**
 * Prinde rezervările începute și neplătite: le trece în `abandoned` (nu le
 * șterge — lead-ul rămâne) și anunță pe Telegram, o singură dată fiecare.
 * Rulează din cron-ul Vercel; acceptă și un secret ca să poată fi apelat manual.
 */
export async function GET(request: Request) {
  // Fail-closed: fără secret configurat, endpoint-ul nu răspunde deloc. Un
  // header `x-vercel-cron` poate fi trimis de oricine, deci nu e dovadă.
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "cron not configured" }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const dbPromise = getDb();
  if (!dbPromise) return NextResponse.json({ ok: true, skipped: "no db" });
  const db = await dbPromise;
  const bookings = db.collection("bookings");

  const now = new Date();
  const stale = await bookings
    .find({ status: "pending_payment", holdExpiresAt: { $lte: now } })
    .toArray();

  let notified = 0;
  for (const b of stale) {
    const upd = await bookings.updateOne(
      { _id: b._id, status: "pending_payment" },
      { $set: { status: "abandoned", abandonedAt: now, updatedAt: now }, $unset: { active: "" } }
    );
    if (upd.modifiedCount !== 1) continue; // altcineva a luat-o deja

    const ok = await notifyTelegram(
      `⚠️ <b>Rezervare 1 la 1 neplătită</b>\n\n` +
        `<b>${esc(b.name)}</b>\n` +
        `${esc(b.email)}\n` +
        `${esc(b.phone)}\n\n` +
        `<b>Interval:</b> ${esc(b.slotLabel)}\n` +
        `<b>Sumă:</b> ${b.priceLei} lei\n\n` +
        `<b>Ce voia:</b>\n${esc(String(b.topic ?? "").slice(0, 600))}\n\n` +
        `<i>A completat datele dar nu a plătit. Intervalul e liber din nou.</i>`
    );
    if (ok) notified++;
  }

  return NextResponse.json({ ok: true, abandoned: stale.length, notified });
}
