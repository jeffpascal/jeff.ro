import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongo";
import { sendEmail } from "../../../lib/resend";
import { verifyRevolutWebhookSignature, retrieveRevolutOrder } from "../../../lib/revolut";

function esc(s: string): string {
  return String(s ?? "").replace(/[<>&"]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : "&quot;"
  );
}

// Doar COMPLETED înseamnă bani încasați. AUTHORISED e doar o rezervare pe card
// și nu trebuie să confirme nimic.
const PAID = new Set(["ORDER_COMPLETED"]);
// Un refuz de card nu e final — omul poate reîncerca imediat cu alt card, deci
// NU eliberăm intervalul pe ORDER_PAYMENT_DECLINED.
const DEAD = new Set(["ORDER_CANCELLED", "ORDER_FAILED"]);

export async function POST(request: Request) {
  // Corpul brut, verbatim — orice reserializare strică HMAC-ul.
  const rawBody = await request.text();

  const verify = verifyRevolutWebhookSignature({
    rawBody,
    signatureHeader: request.headers.get("revolut-signature"),
    timestampHeader: request.headers.get("revolut-request-timestamp"),
    signingSecret: process.env.REVOLUT_WEBHOOK_SIGNING_SECRET ?? "",
  });
  if (!verify.ok) {
    console.error("Revolut webhook signature rejected:", verify.reason);
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let payload: { event?: string; order_id?: string; merchant_order_ext_ref?: string };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const event = payload.event ?? "";
  const ref = payload.merchant_order_ext_ref;
  if (!ref) return NextResponse.json({ ok: true, ignored: "no reference" });

  const dbPromise = getDb();
  // Fail-closed: fără bază nu putem procesa. 503 face Revolut să reîncerce.
  if (!dbPromise) return NextResponse.json({ error: "db unavailable" }, { status: 503 });
  let db;
  try {
    db = await dbPromise;
  } catch (err) {
    console.error("Webhook Mongo error:", err);
    return NextResponse.json({ error: "db unavailable" }, { status: 503 });
  }
  // Comenzile pentru grupa pilot au ref cu prefix "grupa-" și trăiesc în
  // colecția lor; fluxul 1 la 1 rămâne neatins mai jos.
  if (ref.startsWith("grupa-")) {
    const orders = db.collection("grupa_orders");
    if (DEAD.has(event)) {
      await orders.updateOne(
        { ref, status: "pending_payment" },
        { $set: { status: "abandoned", abandonReason: event, abandonedAt: new Date() },
          $unset: { holdExpiresAt: "" } }
      );
      return NextResponse.json({ ok: true });
    }
    if (!PAID.has(event)) return NextResponse.json({ ok: true, ignored: event });

    const orderDoc = await orders.findOne({ ref });
    if (!orderDoc) {
      console.error("Webhook pentru comandă grupa inexistentă:", ref, payload.order_id);
      return NextResponse.json({ ok: true, ignored: "unknown ref" });
    }
    if (!payload.order_id) return NextResponse.json({ ok: true, ignored: "no order id" });

    try {
      const order = await retrieveRevolutOrder(payload.order_id);
      const okAll =
        order.state === "completed" &&
        Number(order.amount) === Number(orderDoc.priceLei) * 100 &&
        order.currency === "RON" &&
        order.merchant_order_data?.reference === ref;
      if (!okAll) {
        console.error("Verificare Revolut grupa eșuată:", {
          ref, state: order.state, amount: order.amount, currency: order.currency,
        });
        return NextResponse.json({ ok: true, ignored: "verification failed" });
      }
    } catch (err) {
      console.error("Revolut retrieve error (grupa):", err);
      return NextResponse.json({ error: "verify failed" }, { status: 503 });
    }

    const gres = await orders.findOneAndUpdate(
      { ref, status: { $ne: "confirmed" } },
      {
        $set: {
          status: "confirmed", paidAt: new Date(), updatedAt: new Date(),
          "payment.state": event, "payment.orderId": payload.order_id,
        },
        $unset: { holdExpiresAt: "" },
      },
      { returnDocument: "after" }
    );
    type GOrder = { name?: string; email?: string; phone?: string; priceLei?: number };
    const graw = gres as unknown as (GOrder & { value?: GOrder }) | null;
    const g: GOrder | null = graw?.value ?? graw;
    if (!g?.email) return NextResponse.json({ ok: true, ignored: "already handled" });

    // Lead-ul devine client — vizibil pe dashboardul de marketing.
    try {
      await db.collection("leads").updateOne(
        { emailNormalized: g.email.toLowerCase() },
        { $set: { status: "customer", updatedAt: new Date() } }
      );
    } catch (err) {
      console.error("Lead->customer update error:", err);
    }

    const gTo = (process.env.WAITLIST_TO || "jeffpascal96@gmail.com")
      .split(",").map((s) => s.trim()).filter(Boolean);
    const gFrom = process.env.WAITLIST_FROM || "Meditații AI <comenzi@ineo.annops.com>";
    const gConfirmFrom =
      process.env.CONFIRM_FROM || "Jeff — Meditații AI <meditatii@ineo.annops.com>";

    try {
      await sendEmail({
        from: gFrom, to: gTo, replyTo: g.email,
        subject: `LOC PLĂTIT în grupa pilot — ${g.name} (${g.priceLei} lei)`,
        html: `<div style="font-family:system-ui,sans-serif;line-height:1.6">
          <h2 style="margin:0 0 8px">Loc plătit în grupa pilot</h2>
          <p style="margin:0 0 4px"><strong>Cine:</strong> ${esc(g.name ?? "")} · ${esc(g.email)} · ${esc(g.phone ?? "")}</p>
          <p style="margin:0 0 4px"><strong>Sumă:</strong> ${g.priceLei} lei</p>
        </div>`,
      });
    } catch (err) {
      console.error("Notificare grupa error:", err);
    }

    try {
      await sendEmail({
        from: gConfirmFrom, to: [g.email], replyTo: gTo,
        subject: "Confirmat: locul tău în grupa pilot Meditații AI",
        html: `<div style="font-family:system-ui,sans-serif;line-height:1.6;color:#1d2534">
          <h2 style="margin:0 0 10px">Locul tău e confirmat.</h2>
          <p style="margin:0 0 10px">Grupa pilot Meditații AI — 3 sesiuni live de 75 de minute,
          marți seara la 19:00: 18 august, 25 august și 1 septembrie.</p>
          <p style="margin:0 0 10px">Linkul de conectare îl primești pe email cu o zi înainte de fiecare
          sesiune. Până atunci, răspunde la acest email cu 2–3 rânduri despre cazul pe care vrei
          să-l lucrăm — hot seat-ul tău e garantat.</p>
          <p style="margin:0;color:#4e586e">— Jeff · <a href="https://jeff.ro" style="color:#2247c4">jeff.ro</a></p>
        </div>`,
      });
    } catch (err) {
      console.error("Confirmare grupa error:", err);
    }

    return NextResponse.json({ ok: true });
  }

  const bookings = db.collection("bookings");

  if (DEAD.has(event)) {
    // Nu ștergem: rămâne lead. Eliberăm doar intervalul.
    await bookings.updateOne(
      { ref, status: "pending_payment" },
      { $set: { status: "abandoned", abandonReason: event, abandonedAt: new Date() },
        $unset: { holdExpiresAt: "", active: "" } }
    );
    return NextResponse.json({ ok: true });
  }
  if (!PAID.has(event)) return NextResponse.json({ ok: true, ignored: event });

  // Nu ne bazăm pe corpul webhook-ului: întrebăm Revolut care e adevărul.
  const booking = await bookings.findOne({ ref });
  if (!booking) {
    console.error("Webhook pentru rezervare inexistentă:", ref, payload.order_id);
    return NextResponse.json({ ok: true, ignored: "unknown ref" });
  }
  if (!payload.order_id) {
    return NextResponse.json({ ok: true, ignored: "no order id" });
  }
  try {
    const order = await retrieveRevolutOrder(payload.order_id);
    const expectedMinor = Number(booking.priceLei) * 100;
    const okState = order.state === "completed";
    const okAmount = Number(order.amount) === expectedMinor;
    const okCurrency = order.currency === "RON";
    const okRef = order.merchant_order_data?.reference === ref;
    if (!okState || !okAmount || !okCurrency || !okRef) {
      console.error("Verificare Revolut esuata:", {
        ref, state: order.state, amount: order.amount, expectedMinor,
        currency: order.currency, orderRef: order.merchant_order_data?.reference,
      });
      return NextResponse.json({ ok: true, ignored: "verification failed" });
    }
  } catch (err) {
    // Nu confirmăm pe baza unei presupuneri — lăsăm Revolut să reîncerce.
    console.error("Revolut retrieve error:", err);
    return NextResponse.json({ error: "verify failed" }, { status: 503 });
  }

  // Idempotent: doar prima tranziție spre confirmed trimite emailuri.
  const res = await bookings.findOneAndUpdate(
    { ref, status: { $ne: "confirmed" } },
    {
      $set: {
        status: "confirmed",
        active: true,
        paidAt: new Date(),
        updatedAt: new Date(),
        "payment.state": event,
        "payment.orderId": payload.order_id,
      },
      $unset: { holdExpiresAt: "" },
    },
    { returnDocument: "after" }
  );
  // driverul v6+ întoarce documentul direct; v5 îl învelea în `.value`
  type Booking = { name?: string; email?: string; phone?: string; topic?: string; slotLabel?: string; priceLei?: number };
  const raw = res as unknown as (Booking & { value?: Booking }) | null;
  const b: Booking | null = raw?.value ?? raw;
  if (!b?.email) return NextResponse.json({ ok: true, ignored: "already handled" });

  const to = (process.env.WAITLIST_TO || "jeffpascal96@gmail.com")
    .split(",").map((s) => s.trim()).filter(Boolean);
  const from = process.env.WAITLIST_FROM || "Meditații AI <comenzi@ineo.annops.com>";
  const confirmFrom =
    process.env.CONFIRM_FROM || "Jeff — Meditații AI <meditatii@ineo.annops.com>";

  // notificare către Jeff
  try {
    await sendEmail({
      from, to,
      subject: `Sesiune 1 la 1 PLĂTITĂ — ${b.name} — ${b.slotLabel}`,
      replyTo: b.email,
      html: `<div style="font-family:system-ui,sans-serif;line-height:1.6">
        <h2 style="margin:0 0 8px">Rezervare plătită</h2>
        <p style="margin:0 0 4px"><strong>Când:</strong> ${esc(b.slotLabel ?? "")}</p>
        <p style="margin:0 0 4px"><strong>Cine:</strong> ${esc(b.name ?? "")} · ${esc(b.email)} · ${esc(b.phone ?? "")}</p>
        <p style="margin:0 0 4px"><strong>Sumă:</strong> ${b.priceLei} lei</p>
        <p style="margin:12px 0 0"><strong>Ce vrea să rezolve:</strong><br>${esc(b.topic ?? "")}</p>
      </div>`,
    });
  } catch (err) {
    console.error("Notificare rezervare error:", err);
  }

  // confirmare către client
  try {
    await sendEmail({
      from: confirmFrom, to: [b.email], replyTo: to,
      subject: `Confirmat: sesiunea ta 1 la 1 — ${b.slotLabel}`,
      html: `<div style="font-family:system-ui,sans-serif;line-height:1.6;color:#1d2534">
        <h2 style="margin:0 0 10px">Ne vedem ${esc(b.slotLabel ?? "")}.</h2>
        <p style="margin:0 0 10px">Plata a intrat, ora e a ta: o sesiune 1 la 1 de 60 de minute, online.</p>
        <p style="margin:0 0 10px">Îți trimit linkul de conectare cu o zi înainte. Dacă vrei să adaugi
        ceva la ce mi-ai scris, răspunde direct la acest email.</p>
        <p style="margin:0;color:#4e586e">— Jeff · <a href="https://jeff.ro" style="color:#2247c4">jeff.ro</a></p>
      </div>`,
    });
  } catch (err) {
    console.error("Confirmare rezervare error:", err);
  }

  return NextResponse.json({ ok: true });
}
