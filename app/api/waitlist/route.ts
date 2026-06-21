import { NextResponse } from "next/server";
import { sendEmail } from "../../lib/resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esc(s: string): string {
  return s.replace(/[<>&"]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : "&quot;"
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body?.email ?? "").trim().toLowerCase();
    const source = String(body?.source ?? "hero").slice(0, 40);
    const lang = String(body?.lang ?? "ro").slice(0, 5);

    if (!email || email.length > 200 || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Email invalid" }, { status: 400 });
    }

    const to = process.env.WAITLIST_TO || "unicjustonline@gmail.com";
    const from = process.env.WAITLIST_FROM || "AI Commerce <comenzi@ineo.annops.com>";
    const when = new Date().toISOString();

    const html = `
      <div style="font-family:system-ui,sans-serif;line-height:1.6">
        <h2 style="margin:0 0 8px">🎉 Înscriere nouă pe lista de așteptare</h2>
        <p style="margin:0 0 4px"><strong>Email:</strong> ${esc(email)}</p>
        <p style="margin:0 0 4px"><strong>Sursă:</strong> ${esc(source)} · <strong>Limbă:</strong> ${esc(lang)}</p>
        <p style="margin:0;color:#666"><strong>Când:</strong> ${esc(when)}</p>
      </div>`;

    const { error } = await sendEmail({
      from,
      to: [to],
      subject: `🚀 Waitlist AI Commerce — ${email}`,
      html,
      replyTo: email,
    });

    if (error) {
      console.error("Waitlist Resend error:", error);
      return NextResponse.json({ error: "Nu am putut trimite. Încearcă din nou." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Waitlist API error:", err);
    return NextResponse.json({ error: "Eroare internă. Încearcă din nou." }, { status: 500 });
  }
}
