import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { sendEmail } from "../../lib/resend";
import { getDb } from "../../lib/mongo";
import { sessions, formatSessionDate } from "../../data/sessions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d().\s-]{8,}$/;

function esc(s: string): string {
  return s.replace(/[<>&"]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : "&quot;"
  );
}

function str(v: unknown, max: number): string {
  return String(v ?? "").trim().slice(0, max);
}

/** Conversions API: trimite Lead cu același event_id ca browserul (deduplicare).
 *  Rulează doar cu consimțământ explicit de tracking și doar la înscrieri NOI. */
async function sendMetaLead(args: {
  email: string;
  phone: string;
  eventId: string;
  fbc?: string;
  fbp?: string;
  ip?: string;
  ua?: string;
  sourceUrl: string;
}) {
  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) return;
  const sha = (s: string) => createHash("sha256").update(s).digest("hex");
  const digits = args.phone.replace(/\D/g, "");
  const phoneIntl = digits.startsWith("0") ? `4${digits}` : digits;
  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: args.eventId,
        action_source: "website",
        event_source_url: args.sourceUrl,
        user_data: {
          em: [sha(args.email)],
          ph: [sha(phoneIntl)],
          ...(args.fbc ? { fbc: args.fbc } : {}),
          ...(args.fbp ? { fbp: args.fbp } : {}),
          ...(args.ip ? { client_ip_address: args.ip } : {}),
          ...(args.ua ? { client_user_agent: args.ua } : {}),
        },
      },
    ],
  };
  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) console.error("CAPI error:", await res.text());
  } catch (err) {
    console.error("CAPI exception:", err);
  }
}

/** Email de confirmare către participant, cu link de calendar. Best-effort:
 *  dacă eșuează, lead-ul e deja salvat și notificarea internă a plecat. */
async function sendConfirmation(args: {
  name: string;
  email: string;
  sessionSlug: string;
}) {
  const session = sessions.find((s) => s.slug === args.sessionSlug);
  if (!session) return;
  const from =
    process.env.CONFIRM_FROM || "Jeff — Meditații AI <meditatii@ineo.annops.com>";
  const replyTo = process.env.WAITLIST_TO || "jeffpascal96@gmail.com";
  const when = formatSessionDate(session.date);

  const startUtc = new Date(session.date);
  const endUtc = new Date(startUtc.getTime() + session.durationMin * 60000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const gcal =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent("Meditații AI — sesiunea deschisă")}` +
    `&dates=${fmt(startUtc)}/${fmt(endUtc)}` +
    `&details=${encodeURIComponent("Sesiune live, online. Linkul de participare vine pe email cu o zi înainte. jeff.ro")}` +
    `&location=${encodeURIComponent("Online")}`;

  const firstName = args.name.split(/\s+/)[0];
  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#1d2534">
      <h2 style="margin:0 0 10px">Ți-am păstrat loc, ${esc(firstName)}.</h2>
      <p style="margin:0 0 6px"><strong>Meditații AI — sesiunea deschisă</strong></p>
      <p style="margin:0 0 14px">${esc(when)} · online · ${session.durationMin} min · ${session.priceLei === 0 ? "gratuit" : `${session.priceLei} lei`}</p>
      <p style="margin:0 0 14px">
        <a href="${gcal}" style="color:#2247c4">Adaugă în Google Calendar →</a>
      </p>
      <p style="margin:0 0 10px">Linkul de participare îl primești pe email cu o zi înainte de sesiune.</p>
      <p style="margin:0 0 10px">Ideea pe care ai descris-o la înscriere intră în selecția pentru lucrul live.
      Dacă vrei să adaugi ceva la ea, răspunde direct la acest email.</p>
      <p style="margin:0;color:#4e586e">— Jeff · <a href="https://jeff.ro" style="color:#2247c4">jeff.ro</a></p>
    </div>`;

  try {
    const { error } = await sendEmail({
      from,
      to: [args.email],
      subject: `Ești înscris: Meditații AI — ${when}`,
      html,
      replyTo,
    });
    if (error) console.error("Confirmare Resend error:", error);
  } catch (err) {
    console.error("Confirmare Resend exception:", err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    // Honeypot: câmp invizibil pentru oameni. Dacă e completat, e un bot —
    // răspundem success ca să nu-i dăm semnal, fără să salvăm nimic.
    if (str(body?.website, 200)) {
      return NextResponse.json({ success: true });
    }

    const name = str(body?.name, 120);
    const email = str(body?.email, 200).toLowerCase();
    const phone = str(body?.phone, 40);
    const business = str(body?.business, 300);
    const outcome = str(body?.outcome, 2000);
    const aiExperience = str(body?.aiExperience, 40);
    const sessionSlug = str(body?.sessionSlug, 80) || "sesiunea-deschisa-1";
    const marketingConsent = body?.marketingConsent === true;
    const privacyAccepted = body?.privacyAccepted === true;
    const trackingConsent = body?.trackingConsent === true;
    const eventId = str(body?.eventId, 64);

    if (name.length < 2) {
      return NextResponse.json({ error: "Spune-mi cum te cheamă." }, { status: 400 });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Emailul nu arată valid." }, { status: 400 });
    }
    const phoneDigits = (phone.match(/\d/g) || []).length;
    if (!phone || !PHONE_RE.test(phone) || phoneDigits < 8) {
      return NextResponse.json({ error: "Numărul de telefon nu arată valid." }, { status: 400 });
    }
    if (business.length < 3) {
      return NextResponse.json(
        { error: "Spune-mi pe scurt ce afacere ai — după asta aleg cazurile." },
        { status: 400 }
      );
    }
    if (outcome.length < 10) {
      return NextResponse.json(
        { error: "Scrie în câteva cuvinte ce ai vrea să rezolvi — de aici pornim." },
        { status: 400 }
      );
    }
    if (!privacyAccepted) {
      return NextResponse.json(
        { error: "Bifează acordul pentru politica de confidențialitate." },
        { status: 400 }
      );
    }

    const now = new Date();

    // Atribuție: parsăm query-ul brut (acoperă și parametrii dinamici din ads).
    const rawQuery = str(body?.query, 600);
    const params = new URLSearchParams(rawQuery.startsWith("?") ? rawQuery.slice(1) : rawQuery);
    const q = (k: string) => str(params.get(k), 120);
    const attribution = {
      utmSource: q("utm_source") || str(body?.utm?.source, 100),
      utmMedium: q("utm_medium") || str(body?.utm?.medium, 100),
      utmCampaign: q("utm_campaign") || str(body?.utm?.campaign, 100),
      utmContent: q("utm_content") || str(body?.utm?.content, 100),
      utmId: q("utm_id"),
      fbclid: q("fbclid"),
      adsetId: q("adset_id"),
      adId: q("ad_id"),
      placement: q("placement"),
      rawQuery,
      referrer: str(body?.referrer, 300),
      landingPath: str(body?.landingPath, 300),
    };

    // MongoDB mai întâi — lead-ul nu se pierde dacă emailul pică.
    // firstTouch se scrie o singură dată; lastTouch la fiecare submit.
    let savedToDb = false;
    let created = false;
    const dbPromise = getDb();
    if (dbPromise) {
      try {
        const db = await dbPromise;
        const result = await db.collection("leads").updateOne(
          { emailNormalized: email, sessionSlug },
          {
            $set: {
              name, email, phone, business, outcome, aiExperience,
              marketingConsent, trackingConsent, privacyAcceptedAt: now,
              lastTouch: attribution, updatedAt: now,
            },
            $setOnInsert: {
              emailNormalized: email, sessionSlug, status: "new",
              firstTouch: attribution, createdAt: now,
            },
          },
          { upsert: true }
        );
        savedToDb = true;
        created = result.upsertedCount > 0;
      } catch (err) {
        console.error("Inscriere Mongo error:", err);
      }
    }

    const to = process.env.WAITLIST_TO || "jeffpascal96@gmail.com";
    const from = process.env.WAITLIST_FROM || "Meditații AI <comenzi@ineo.annops.com>";

    const row = (label: string, value: string) =>
      value ? `<p style="margin:0 0 4px"><strong>${label}:</strong> ${esc(value)}</p>` : "";

    const html = `
      <div style="font-family:system-ui,sans-serif;line-height:1.6">
        <h2 style="margin:0 0 8px">${created ? "Înscriere nouă" : "Înscriere actualizată"} — Meditații AI</h2>
        ${row("Nume", name)}
        ${row("Email", email)}
        ${row("Telefon", phone)}
        ${row("Afacere / rol", business)}
        ${row("Rezultatul dorit", outcome)}
        ${row("Experiență AI", aiExperience)}
        ${row("Sesiune", sessionSlug)}
        ${row("Marketing opt-in", marketingConsent ? "da" : "nu")}
        ${row("Tracking consent", trackingConsent ? "da" : "nu")}
        ${row("Sursă", [attribution.utmSource, attribution.utmMedium, attribution.utmCampaign, attribution.utmContent].filter(Boolean).join(" / "))}
        ${row("Salvat în DB", savedToDb ? "da" : "NU — configurează MONGODB_URI")}
        <p style="margin:0;color:#666"><strong>Când:</strong> ${esc(now.toISOString())}</p>
      </div>`;

    let emailSent = false;
    try {
      const { error } = await sendEmail({
        from,
        to: [to],
        subject: `Meditații AI — ${created ? "înscriere" : "update"}: ${name}`,
        html,
        replyTo: email,
      });
      if (error) console.error("Inscriere Resend error:", error);
      else emailSent = true;
    } catch (err) {
      console.error("Inscriere Resend exception:", err);
    }

    if (!savedToDb && !emailSent) {
      return NextResponse.json(
        { error: "Nu am putut salva înscrierea. Încearcă din nou." },
        { status: 502 }
      );
    }

    if (created) {
      await sendConfirmation({ name, email, sessionSlug });
    }

    // Lead către Meta doar la înscrieri NOI — altfel numărăm dublu.
    if (created && trackingConsent && eventId) {
      await sendMetaLead({
        email,
        phone,
        eventId,
        fbc: str(body?.fbc, 200) || undefined,
        fbp: str(body?.fbp, 200) || undefined,
        ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
        ua: request.headers.get("user-agent") ?? undefined,
        sourceUrl: `https://www.jeff.ro${attribution.landingPath || "/"}`,
      });
    }

    return NextResponse.json({ success: true, created });
  } catch (err) {
    console.error("Inscriere API error:", err);
    return NextResponse.json({ error: "Eroare internă. Încearcă din nou." }, { status: 500 });
  }
}
