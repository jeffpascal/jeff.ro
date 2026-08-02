export type Session = {
  slug: string;
  kind: "deschisa" | "meditatie";
  title: string;
  summary: string;
  /** Local time, Europe/Bucharest */
  date: string; // ISO, e.g. "2026-08-11T19:00:00+03:00"
  durationMin: number;
  format: "online";
  priceLei: number; // 0 = gratuit
  status: "published" | "draft";
};

/**
 * Sursa sesiunilor până migrăm în MongoDB. Data primei sesiuni este
 * provizorie — se schimbă aici, într-un singur loc.
 */
export const sessions: Session[] = [
  {
    slug: "sesiunea-deschisa-1",
    kind: "deschisa",
    title: "Sesiunea deschisă: de la idee spusă cu voce tare, la pagină publicată",
    summary:
      "Pe un caz ales din grup: clarificăm problema, alegem unealta și construim live o pagină publicată pe internet, plus prima reclamă draft.",
    date: "2026-08-11T19:00:00+03:00",
    durationMin: 75,
    format: "online",
    priceLei: 0,
    status: "published",
  },
  {
    slug: "meditatia-1",
    kind: "meditatie",
    title: "Meditația #1: din idee vagă, în brief pe care AI-ul îl execută",
    summary:
      "Prima meditație din grupă: lucrăm pe cazurile participanților, hot seat cu hot seat.",
    date: "2026-08-20T19:00:00+03:00",
    durationMin: 90,
    format: "online",
    priceLei: 290,
    status: "draft",
  },
];

export function publishedSessions(): Session[] {
  return sessions.filter((s) => s.status === "published");
}

export function nextSession(): Session | undefined {
  const now = Date.now();
  return publishedSessions()
    .filter((s) => new Date(s.date).getTime() > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
}

const RO_DAY: Record<string, string> = {
  Mon: "luni", Tue: "marți", Wed: "miercuri", Thu: "joi",
  Fri: "vineri", Sat: "sâmbătă", Sun: "duminică",
};
const MONTHS = [
  "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie",
  "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie",
];

/** "marți, 11 august, 19:00" — formatat pe fusul României, fără dependențe. */
export function formatSessionDate(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Bucharest",
    weekday: "short", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const month = MONTHS[parseInt(get("month"), 10) - 1] ?? "";
  return `${RO_DAY[get("weekday")] ?? ""}, ${get("day")} ${month}, ${get("hour")}:${get("minute")}`;
}
