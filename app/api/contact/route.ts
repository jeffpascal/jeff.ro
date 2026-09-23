import { NextResponse } from "next/server";
import { sendEmail } from "../../lib/resend";
import { notifyTelegram, esc } from "../../lib/telegram";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d().\s-]{8,}$/;

function str(v: unknown, max: number): string {
  return String(v ?? "").trim().slice(0, max);
}

/** Cererile de audit de pe homepage: email la contact@jeff.ro + Telegram. */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cerere invalidă." }, { status: 400 });
  }

  // honeypot: câmp invizibil pentru oameni
  if (str(body.company, 200)) return NextResponse.json({ ok: true });

  const name = str(body.name, 120);
  const contact = str(body.contact, 160);
  const site = str(body.site, 200);
  const message = str(body.message, 3000);

  if (!name) return NextResponse.json({ error: "Scrie-ți numele." }, { status: 400 });
  const isEmail = EMAIL_RE.test(contact);
  if (!isEmail && !PHONE_RE.test(contact)) {
    return NextResponse.json(
      { error: "Lasă un email sau un număr de telefon valid." },
      { status: 400 }
    );
  }

  const rows: Array<[string, string]> = [
    ["Nume", name],
    ["Contact", contact],
    ["Site", site || "—"],
    ["Mesaj", message || "—"],
  ];
  const html = `<h2 style="font-family:sans-serif">Cerere nouă de pe jeff.ro</h2><table style="font-family:sans-serif;font-size:15px">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${k}</td><td style="padding:4px 0;white-space:pre-wrap">${esc(v)}</td></tr>`
    )
    .join("")}</table>`;

  try {
    const { error } = await sendEmail({
      from: process.env.CONTACT_FROM || "jeff.ro <comenzi@ineo.annops.com>",
      to: "contact@jeff.ro",
      replyTo: isEmail ? contact : undefined,
      subject: `Cerere audit: ${name}${site ? ` · ${site}` : ""}`,
      html,
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error("contact email failed:", err);
    const sent = await notifyTelegram(
      `⚠️ Cerere jeff.ro (email eșuat)\n${rows.map(([k, v]) => `<b>${k}:</b> ${esc(v)}`).join("\n")}`
    );
    if (!sent) {
      return NextResponse.json(
        { error: "Nu am putut trimite cererea. Scrie-mi direct la contact@jeff.ro." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  }

  await notifyTelegram(
    `📥 Cerere jeff.ro\n${rows.map(([k, v]) => `<b>${k}:</b> ${esc(v)}`).join("\n")}`
  );
  return NextResponse.json({ ok: true });
}
