// Reminder personalizat pentru sesiunea deschisă — marți, 11 aug, 19:00.
// Mod implicit: PREVIEW (scrie scripts/reminder-preview.html, nu trimite nimic).
// Trimitere: node scripts/send-session-reminder.mjs --send --link="https://..." [--only=email@x.com]
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = {};
for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2];
}

const args = process.argv.slice(2);
const SEND = args.includes("--send");
const only = args.find((a) => a.startsWith("--only="))?.slice(7);
// --test=adresa@x.com: trimite UN email de probă (personalizarea primului lead) la adresa dată
const testTo = args.find((a) => a.startsWith("--test="))?.slice(7);
const MEETING_LINK = args.find((a) => a.startsWith("--link="))?.slice(7) || env.MEETING_LINK || "";

if (SEND && !MEETING_LINK) {
  console.error("Refuz să trimit fără linkul de meeting: --link=\"https://...\"");
  process.exit(1);
}

const FROM = "Jeff — Meditații AI <meditatii@ineo.annops.com>";
const REPLY_TO = "jeffpascal96@gmail.com";
const SUBJECT = "Linkul pentru mâine seară — sesiunea deschisă, marți 19:00";

// Google Calendar: 11 aug 19:00–20:15 Europe/Bucharest (16:00–17:15 UTC)
const gcal =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent("Meditații AI — sesiunea deschisă")}` +
  "&dates=20260811T160000Z/20260811T171500Z" +
  `&details=${encodeURIComponent(`Sesiune live, online. Link participare: ${MEETING_LINK || "(vine pe email)"} · jeff.ro`)}` +
  `&location=${encodeURIComponent("Online")}`;

const esc = (s) =>
  String(s ?? "").replace(/[<>&"]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : "&quot;"
  );

function render(lead, link) {
  const salut = lead.first ? `Salut, ${esc(lead.first)},` : "Salut,";
  return `
  <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#1d2534;max-width:560px">
    <p style="margin:0 0 14px">${salut}</p>
    <p style="margin:0 0 14px"><strong>Mâine seară ne vedem</strong> — marți, 11 august, 19:00 (75 de minute, online).</p>
    <p style="margin:0 0 14px;font-size:17px"><a href="${esc(link || "#LINK_LIPSA")}" style="color:#2247c4"><strong>Linkul de participare →</strong></a></p>
    <p style="margin:0 0 14px">${esc(lead.personal)}</p>
    <p style="margin:0 0 14px">Dacă vrei ca al tău să fie printre cazurile discutate live, răspunde la acest email cu încă 2–3 detalii despre el.</p>
    <p style="margin:0 0 14px"><a href="${gcal}" style="color:#2247c4">Adaugă în calendar →</a></p>
    <p style="margin:0;color:#4e586e">— Jeff · <a href="https://jeff.ro" style="color:#2247c4">jeff.ro</a></p>
  </div>`;
}

const leads = JSON.parse(readFileSync(join(root, "scripts", "reminder-emails.json"), "utf8"));
let targets = only ? leads.filter((l) => l.email === only) : leads;

if (testTo) {
  if (!MEETING_LINK) {
    console.error("Testul are nevoie de --link=\"https://...\"");
    process.exit(1);
  }
  const { Resend } = await import("resend");
  const resend = new Resend(env.RESEND_API_KEY);
  const sample = { ...leads[0], email: testTo };
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [testTo],
    replyTo: REPLY_TO,
    subject: `[TEST] ${SUBJECT}`,
    html: render(sample, MEETING_LINK),
  });
  console.log(error ? `EROARE test: ${error.message}` : `Test trimis către ${testTo} (id ${data?.id})`);
  process.exit(error ? 1 : 0);
}

if (!SEND) {
  const blocks = targets
    .map(
      (l) => `
    <section style="border:1px solid #ccd3e0;border-radius:8px;margin:0 0 18px;overflow:hidden">
      <div style="background:#eef1f7;padding:8px 14px;font:13px monospace">
        Către: ${esc(l.email)} · Subiect: ${esc(SUBJECT)}${l.note ? ` · <strong style="color:#c03b2d">${esc(l.note)}</strong>` : ""}
      </div>
      <div style="padding:16px">${render(l, MEETING_LINK)}</div>
    </section>`
    )
    .join("\n");
  const html = `<!doctype html><meta charset="utf-8"><title>Preview reminder — ${targets.length} emailuri</title>
  <body style="margin:24px;background:#f6f7fa;font-family:system-ui,sans-serif">
  <h1 style="font-size:18px">Preview: ${targets.length} emailuri personalizate (NIMIC trimis)</h1>
  <p style="color:#4e586e">De la: ${esc(FROM)} · Reply-To: ${esc(REPLY_TO)} · Link meeting: ${MEETING_LINK ? esc(MEETING_LINK) : "<strong style='color:#c03b2d'>NESETAT</strong>"}</p>
  ${blocks}</body>`;
  const out = join(root, "scripts", "reminder-preview.html");
  writeFileSync(out, html);
  console.log(`PREVIEW: ${targets.length} emailuri → ${out} (nimic trimis)`);
  process.exit(0);
}

const { Resend } = await import("resend");
const resend = new Resend(env.RESEND_API_KEY);
const results = [];
for (const l of targets) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [l.email],
      replyTo: REPLY_TO,
      subject: SUBJECT,
      html: render(l, MEETING_LINK),
    });
    results.push({ email: l.email, id: data?.id ?? null, error: error?.message ?? null });
    console.log(error ? `EROARE ${l.email}: ${error.message}` : `OK ${l.email}`);
  } catch (err) {
    results.push({ email: l.email, id: null, error: String(err?.message || err) });
    console.log(`EXCEPȚIE ${l.email}: ${err?.message || err}`);
  }
  await new Promise((r) => setTimeout(r, 700)); // Resend: max ~2 req/s
}
writeFileSync(join(root, "scripts", `reminder-sendlog-${Date.now()}.json`), JSON.stringify(results, null, 2));
const failed = results.filter((r) => r.error);
console.log(`\nTrimise: ${results.length - failed.length}/${results.length}${failed.length ? ` · eșuate: ${failed.map((f) => f.email).join(", ")}` : ""}`);
