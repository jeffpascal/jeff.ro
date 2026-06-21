// Comenzi REALE extrase din MongoDB prod (decor.ineo.ro, colecția `orders`,
// status `received`). Snapshot anonimizat (oraș + județ + produs + valoare +
// dată) — fără nume/email/PII. Testele interne și intrările-garbage excluse.
// Re-extrage cu scriptul de inspecție când vrei să împrospătezi.
// Snapshot: 2026-06-21 · 11 comenzi · 10.226 lei.

export type RealOrder = {
  emoji: string;
  product: string;
  city: string;
  county: string; // cod scurt județ
  total: number; // RON
  date: string; // ISO
};

export const REAL_ORDERS: RealOrder[] = [
  { emoji: "🛡️", product: "Seif INEO", city: "Feldru", county: "BN", total: 1602, date: "2026-06-16T20:05:59.798Z" },
  { emoji: "🛡️", product: "Seif INEO", city: "Buzești", county: "MM", total: 567, date: "2026-06-13T17:03:00.892Z" },
  { emoji: "🛡️", product: "Seif INEO", city: "București", county: "B", total: 567, date: "2026-06-09T12:59:24.584Z" },
  { emoji: "🚿", product: "Chiuvetă multifuncțională", city: "Moşniţa Nouă", county: "TM", total: 945, date: "2026-06-04T15:48:08.336Z" },
  { emoji: "🛏️", product: "Noptieră cu seif", city: "Salacea", county: "BH", total: 855, date: "2026-05-26T07:27:48.736Z" },
  { emoji: "🛡️", product: "Seif INEO", city: "Ploiești", county: "PH", total: 1602, date: "2026-05-22T20:58:11.132Z" },
  { emoji: "🛡️", product: "Seif INEO", city: "Șura Mare", county: "SB", total: 567, date: "2026-05-13T15:18:00.851Z" },
  { emoji: "🛡️", product: "Seif INEO", city: "Buzău", county: "BZ", total: 407, date: "2026-05-12T19:15:13.012Z" },
  { emoji: "🛡️", product: "Seif INEO", city: "Constanța", county: "CT", total: 1602, date: "2026-05-10T12:19:47.503Z" },
  { emoji: "🚿", product: "Chiuvetă multifuncțională", city: "Filiași", county: "DJ", total: 945, date: "2026-05-08T14:32:05.148Z" },
  { emoji: "🛡️", product: "Seif INEO", city: "București", county: "B", total: 567, date: "2026-05-07T15:08:11.190Z" },
];

export const REAL_ORDERS_META = {
  count: 11,
  totalRon: 10226,
  storeUrl: "https://decor.ineo.ro",
};
