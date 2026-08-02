import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Commerce | Magazin online construit cu AI (arhivă)",
  description:
    "Proiectul anterior de pe jeff.ro: magazin online construit cu AI, de la idee la produs live. Păstrat ca arhivă.",
  robots: { index: false, follow: true },
};

export default function AICommerceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
