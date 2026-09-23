import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

// Fontul arhivei AI Commerce, încărcat doar aici (înainte era un @import
// render-blocking în globals.css, pe toate paginile).
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Commerce | Magazin online construit cu AI (arhivă)",
  description:
    "Proiectul anterior de pe jeff.ro: magazin online construit cu AI, de la idee la produs live. Păstrat ca arhivă.",
  robots: { index: false, follow: true },
};

export default function AICommerceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={jakarta.className}
      style={{ ["--font-sans" as string]: jakarta.style.fontFamily } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
