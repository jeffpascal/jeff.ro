/**
 * Grupa pilot — sursa unică pentru pagina /grupa.
 * Decizii (9-10 aug): 3 sesiuni × 75 min, maxim 5 locuri, 790 lei pilot,
 * plată prin link Revolut + confirmare manuală.
 */
export const GRUPA = {
  priceLei: 790,
  priceAfterLei: 990,
  seats: 5,
  durationMin: 75,
  sessions: [
    { iso: "2026-08-18T19:00:00+03:00", title: "De la proiect la lansare — site, pipeline de marketing și automatizări" },
    { iso: "2026-08-25T19:00:00+03:00", title: "De la proiect la lansare — site, pipeline de marketing și automatizări" },
    { iso: "2026-09-01T19:00:00+03:00", title: "De la proiect la lansare — site, pipeline de marketing și automatizări" },
  ],
  registrationClosesText: "duminică, 16 august, 23:59",
} as const;
