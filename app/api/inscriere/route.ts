import { NextResponse } from "next/server";
import { sendEmail } from "../../lib/resend";
import { getDb } from "../../lib/mongo";

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
    const utm = typeof body?.utm === "object" && body?.utm !== null ? body.utm : {};

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
    const attribution = {
      utmSource: str(utm?.source, 100),
      utmMedium: str(utm?.medium, 100),
      utmCampaign: str(utm?.campaign, 100),
      utmContent: str(utm?.content, 100),
      referrer: str(body?.referrer, 300),
      landingPath: str(body?.landingPath, 300),
    };

    // MongoDB mai întâi — lead-ul nu se pierde dacă emailul pică.
    let savedToDb = false;
    const dbPromise = getDb();
    if (dbPromise) {
      try {
        const db = await dbPromise;
        await db.collection("leads").updateOne(
          { emailNormalized: email, sessionSlug },
          {
            $set: {
              name, email, emailNormalized: email, phone, business,
              outcome, aiExperience, sessionSlug, marketingConsent,
              privacyAcceptedAt: now, attribution, updatedAt: now,
            },
            $setOnInsert: { status: "new", createdAt: now },
          },
          { upsert: true }
        );
        savedToDb = true;
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
        <h2 style="margin:0 0 8px">Înscriere nouă — Meditații AI</h2>
        ${row("Nume", name)}
        ${row("Email", email)}
        ${row("Telefon", phone)}
        ${row("Afacere / rol", business)}
        ${row("Rezultatul dorit", outcome)}
        ${row("Experiență AI", aiExperience)}
        ${row("Sesiune", sessionSlug)}
        ${row("Marketing opt-in", marketingConsent ? "da" : "nu")}
        ${row("Sursă", [attribution.utmSource, attribution.utmMedium, attribution.utmCampaign].filter(Boolean).join(" / "))}
        ${row("Salvat în DB", savedToDb ? "da" : "NU — configurează MONGODB_URI")}
        <p style="margin:0;color:#666"><strong>Când:</strong> ${esc(now.toISOString())}</p>
      </div>`;

    let emailSent = false;
    try {
      const { error } = await sendEmail({
        from,
        to: [to],
        subject: `Meditații AI — înscriere: ${name}`,
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
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Inscriere API error:", err);
    return NextResponse.json({ error: "Eroare internă. Încearcă din nou." }, { status: 500 });
  }
}
