/** Notificări scurte pe Telegram. Best-effort: dacă pică, nu oprim fluxul. */
export async function notifyTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) console.error("Telegram error:", await res.text());
    return res.ok;
  } catch (err) {
    console.error("Telegram exception:", err);
    return false;
  }
}

export function esc(s: unknown): string {
  return String(s ?? "").replace(/[<>&]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&amp;"
  );
}
