import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getDb } from "../../lib/mongo";
import { createRevolutOrder } from "../../lib/revolut";
import { GRUPA } from "../../data/grupa";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d().\s-]{8,}$/;
const HOLD_MIN = 30;

export const dynamic = "force-dynamic";

function str(v: unknown, max: number): string {
  return String(v ?? "").trim().slice(0, max);
}

type Db = NonNullable<Awaited<ReturnType<typeof getDb>>>;

/** Locuri ocupate = plătite + hold-uri neexpirate. Expirările se curăță întâi. */
async function seatsTaken(db: Db): Promise<number> {
  const orders = db.collection("grupa_orders");
  const now = new Date();
  await orders.updateMany(
    { status: "pending_payment", holdExpiresAt: { $lte: now } },
    { $set: { status: "abandoned", abandonReason: "hold_expired", abandonedAt: now, updatedAt: now } }
  );
  return orders.countDocuments({
    $or: [{ status: "confirmed" }, { status: "pending_payment", holdExpiresAt: { $gt: now } }],
  });
}

export async function GET() {
  const dbPromise = getDb();
  // Fail-closed: fără bază nu vindem locuri pe care nu le putem număra.
  if (!dbPromise) {
    return NextResponse.json({ seats: GRUPA.seats, left: 0 }, { status: 503 });
  }
  try {
    const db = await dbPromise;
    const taken = await seatsTaken(db);
    return NextResponse.json({
      seats: GRUPA.seats,
      left: Math.max(0, GRUPA.seats - taken),
      priceLei: GRUPA.priceLei,
    });
  } catch (err) {
    console.error("Grupa GET error:", err);
    return NextResponse.json({ seats: GRUPA.seats, left: 0 }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    // honeypot
    if (str(body?.website, 200)) {
      return NextResponse.json({ error: "Cerere invalidă." }, { status: 400 });
    }

    const name = str(body?.name, 120);
    const email = str(body?.email, 200).toLowerCase();
    const phone = str(body?.phone, 40);

    if (name.length < 2) {
      return NextResponse.json({ error: "Spune-mi cum te cheamă." }, { status: 400 });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Emailul nu arată valid." }, { status: 400 });
    }
    const digits = (phone.match(/\d/g) || []).length;
    if (!phone || !PHONE_RE.test(phone) || digits < 8) {
      return NextResponse.json({ error: "Numărul de telefon nu arată valid." }, { status: 400 });
    }

    const dbPromise = getDb();
    if (!dbPromise) {
      return NextResponse.json({ error: "Înscrierile nu sunt disponibile momentan." }, { status: 503 });
    }
    const db = await dbPromise;
    const orders = db.collection("grupa_orders");

    const taken = await seatsTaken(db);
    if (taken >= GRUPA.seats) {
      return NextResponse.json(
        { error: "Locurile s-au ocupat. Scrie-mi și te pun pe lista pentru următoarea grupă." },
        { status: 409 }
      );
    }

    // Un singur loc activ per email — evită dublurile la refresh/reîncercare.
    const existing = await orders.findOne({
      emailNormalized: email,
      $or: [{ status: "confirmed" }, { status: "pending_payment", holdExpiresAt: { $gt: new Date() } }],
    });
    if (existing?.status === "confirmed") {
      return NextResponse.json({ error: "Ai deja locul confirmat — verifică emailul." }, { status: 409 });
    }

    const now = new Date();
    const holdExpiresAt = new Date(now.getTime() + HOLD_MIN * 60_000);
    const ref = existing?.ref ?? `grupa-${randomUUID()}`;

    if (!existing) {
      await orders.insertOne({
        ref, name, email, emailNormalized: email, phone,
        status: "pending_payment",
        priceLei: GRUPA.priceLei,
        sessions: GRUPA.sessions.map((s) => s.iso),
        holdExpiresAt, createdAt: now, updatedAt: now,
      });
    } else {
      await orders.updateOne({ ref }, { $set: { name, phone, holdExpiresAt, updatedAt: now } });
    }

    let checkoutUrl: string | undefined;
    try {
      const order = await createRevolutOrder({
        amountMinor: GRUPA.priceLei * 100,
        currency: "RON",
        description: `Grupa pilot Meditații AI — ${GRUPA.sessions.length} sesiuni`,
        merchantOrderRef: ref,
        redirectUrl: "https://www.jeff.ro/multumesc-grupa",
        customer: { email, full_name: name, phone },
        metadata: { ref },
        idempotencyKey: ref,
      });
      checkoutUrl = order.checkout_url;
      await orders.updateOne(
        { ref },
        { $set: { payment: { provider: "revolut", orderId: order.id, state: order.state }, updatedAt: new Date() } }
      );
    } catch (err) {
      console.error("Grupa Revolut create-order error:", err);
      await orders.updateOne(
        { ref, status: "pending_payment" },
        { $set: { status: "abandoned", abandonReason: "payment_init_failed", abandonedAt: new Date() },
          $unset: { holdExpiresAt: "" } }
      );
      return NextResponse.json(
        { error: "Nu am putut porni plata. Încearcă din nou în câteva minute." },
        { status: 502 }
      );
    }

    if (!checkoutUrl) {
      await orders.updateOne(
        { ref, status: "pending_payment" },
        { $set: { status: "abandoned", abandonReason: "no_checkout_url", abandonedAt: new Date() },
          $unset: { holdExpiresAt: "" } }
      );
      return NextResponse.json({ error: "Plata nu a putut fi inițiată." }, { status: 502 });
    }

    return NextResponse.json({ ref, checkoutUrl });
  } catch (err) {
    console.error("Grupa API error:", err);
    return NextResponse.json({ error: "Eroare internă. Încearcă din nou." }, { status: 500 });
  }
}
