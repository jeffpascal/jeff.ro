import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getDb } from "../../lib/mongo";
import { createRevolutOrder } from "../../lib/revolut";
import { upcomingSlots, formatSlot, ONE_ON_ONE } from "../../data/slots";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d().\s-]{8,}$/;
const HOLD_MIN = 30;

function str(v: unknown, max: number): string {
  return String(v ?? "").trim().slice(0, max);
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
    const topic = str(body?.topic, 20000);
    const slotIso = str(body?.slotIso, 40);

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
    if (topic.length < 10) {
      return NextResponse.json(
        { error: "Scrie pe scurt ce vrei să rezolvăm în ora aceea." },
        { status: 400 }
      );
    }

    // Slotul trebuie să fie unul dintre cele oferite acum — clientul nu poate
    // inventa o oră, iar prețul nu vine niciodată din browser.
    const allowed = upcomingSlots();
    const slot = allowed.find((s) => s.iso === slotIso);
    if (!slot) {
      return NextResponse.json(
        { error: "Intervalul ales nu mai este disponibil. Reîncarcă pagina." },
        { status: 409 }
      );
    }

    const dbPromise = getDb();
    if (!dbPromise) {
      return NextResponse.json(
        { error: "Rezervările nu sunt disponibile momentan." },
        { status: 503 }
      );
    }
    const db = await dbPromise;
    const bookings = db.collection("bookings");
    // Unic doar peste rezervările active: cele abandonate rămân în bază drept
    // lead-uri, fără să mai blocheze intervalul.
    await bookings
      .createIndex({ slotIso: 1 }, { unique: true, partialFilterExpression: { active: true } })
      .catch(() => {});

    const now = new Date();
    const holdExpiresAt = new Date(now.getTime() + HOLD_MIN * 60_000);
    const ref = `1to1-${randomUUID().slice(0, 8)}`;

    // Eliberăm intervalul dacă cineva l-a ținut fără să plătească — dar
    // păstrăm înregistrarea, e un lead.
    await bookings.updateMany(
      { slotIso: slot.iso, status: "pending_payment", holdExpiresAt: { $lte: now } },
      { $set: { status: "abandoned", abandonedAt: now, updatedAt: now }, $unset: { active: "" } }
    );

    try {
      await bookings.insertOne({
        ref, slotIso: slot.iso, slotLabel: slot.label,
        name, email, phone, topic,
        status: "pending_payment",
        active: true,
        priceLei: ONE_ON_ONE.priceLei,
        durationMin: ONE_ON_ONE.durationMin,
        holdExpiresAt, createdAt: now, updatedAt: now,
      });
    } catch {
      return NextResponse.json(
        { error: "Cineva tocmai a rezervat acest interval. Alege altul." },
        { status: 409 }
      );
    }

    let checkoutUrl: string | undefined;
    let publicId: string | undefined;
    try {
      const order = await createRevolutOrder({
        amountMinor: ONE_ON_ONE.priceLei * 100,
        currency: ONE_ON_ONE.currency,
        description: `Sesiune 1 la 1 — ${slot.label}`,
        merchantOrderRef: ref,
        redirectUrl: `https://www.jeff.ro/multumesc-rezervare?ref=${ref}`,
        customer: { email, full_name: name, phone },
        metadata: { ref, slotIso: slot.iso },
        idempotencyKey: ref,
      });
      checkoutUrl = order.checkout_url;
      publicId = order.token;
      await bookings.updateOne(
        { ref },
        { $set: { payment: { provider: "revolut", orderId: order.id, state: order.state }, updatedAt: new Date() } }
      );
    } catch (err) {
      console.error("Revolut create-order error:", err);
      // Lead-ul rămâne salvat; eliberăm doar slotul ca să nu-l blocheze degeaba.
      await bookings.updateOne(
        { ref, status: "pending_payment" },
        { $set: { status: "abandoned", abandonReason: "payment_init_failed", abandonedAt: new Date() },
          $unset: { holdExpiresAt: "", active: "" } }
      );
      return NextResponse.json(
        { error: "Nu am putut porni plata. Încearcă din nou în câteva minute." },
        { status: 502 }
      );
    }

    if (!checkoutUrl && !publicId) {
      await bookings.updateOne(
        { ref, status: "pending_payment" },
        { $set: { status: "abandoned", abandonReason: "no_checkout_url", abandonedAt: new Date() },
          $unset: { holdExpiresAt: "", active: "" } }
      );
      return NextResponse.json({ error: "Plata nu a putut fi inițiată." }, { status: 502 });
    }

    return NextResponse.json({ ref, checkoutUrl, publicId, slotLabel: formatSlot(slot.iso) });
  } catch (err) {
    console.error("Rezervare API error:", err);
    return NextResponse.json({ error: "Eroare internă. Încearcă din nou." }, { status: 500 });
  }
}
