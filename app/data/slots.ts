/**
 * Sloturi pentru sesiunile 1 la 1.
 * Disponibil doar luni 18:30 și joi 17:00, ora României, și doar în săptămâna
 * care urmează — nimic mai departe în viitor.
 */
export const ONE_ON_ONE = {
  priceLei: 480,
  durationMin: 60,
  currency: "RON",
} as const;

/** luni = 1, joi = 4 (ISO) */
const WEEKLY_SLOTS: Array<{ isoWeekday: number; hour: number; minute: number }> = [
  { isoWeekday: 1, hour: 18, minute: 30 },
  { isoWeekday: 4, hour: 17, minute: 0 },
];

const MIN_LEAD_MS = 12 * 60 * 60 * 1000; // nu se rezervă cu mai puțin de 12h înainte
const HORIZON_MS = 7 * 24 * 60 * 60 * 1000; // doar săptămâna care urmează, nimic mai departe

/** Cât e ceasul în România față de UTC, la un moment dat (ms). */
function roOffsetMs(at: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Bucharest", hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(at);
  const g = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const asUtc = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute"), g("second"));
  return asUtc - at.getTime();
}

/** Construiește momentul UTC pentru o oră locală românească. */
function roDateToUtc(y: number, m: number, d: number, hh: number, mm: number): Date {
  const naive = Date.UTC(y, m - 1, d, hh, mm);
  // o singură corecție e suficientă pentru orele noastre (18:30 / 17:00),
  // care nu cad niciodată în intervalul ambiguu al schimbării de oră
  return new Date(naive - roOffsetMs(new Date(naive)));
}

export type Slot = {
  /** ISO UTC, cheia canonică folosită în baza de date */
  iso: string;
  /** etichetă gata de afișat, ex: „luni, 3 august, 18:30” */
  label: string;
};

const RO_DAY: Record<string, string> = {
  Mon: "luni", Tue: "marți", Wed: "miercuri", Thu: "joi",
  Fri: "vineri", Sat: "sâmbătă", Sun: "duminică",
};
const MONTHS = [
  "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie",
  "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie",
];

export function formatSlot(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Bucharest",
    weekday: "short", day: "numeric", month: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const month = MONTHS[parseInt(get("month"), 10) - 1] ?? "";
  return `${RO_DAY[get("weekday")] ?? ""}, ${get("day")} ${month}, ${get("hour")}:${get("minute")}`;
}

/** Toate sloturile din fereastra vizibilă, indiferent dacă sunt ocupate. */
export function upcomingSlots(now: Date = new Date()): Slot[] {
  const out: Slot[] = [];
  const from = now.getTime() + MIN_LEAD_MS;
  const to = now.getTime() + HORIZON_MS;

  for (let dayOffset = 0; dayOffset <= 10; dayOffset++) {
    const probe = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    // data calendaristică românească a zilei sondate
    const p = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Bucharest",
      weekday: "short", year: "numeric", month: "numeric", day: "numeric",
    }).formatToParts(probe);
    const g = (t: string) => p.find((x) => x.type === t)?.value ?? "";
    const wd = g("weekday");
    const isoWeekday = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[wd] ?? 0;

    for (const s of WEEKLY_SLOTS) {
      if (s.isoWeekday !== isoWeekday) continue;
      const utc = roDateToUtc(
        Number(g("year")), Number(g("month")), Number(g("day")), s.hour, s.minute
      );
      const t = utc.getTime();
      if (t >= from && t <= to) {
        const iso = utc.toISOString();
        if (!out.some((x) => x.iso === iso)) out.push({ iso, label: formatSlot(iso) });
      }
    }
  }
  return out.sort((a, b) => a.iso.localeCompare(b.iso));
}
