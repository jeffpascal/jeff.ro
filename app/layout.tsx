import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./i18n/LanguageContext";

export const metadata: Metadata = {
  title: "AI Commerce | Magazin online construit cu AI, lansat în minute",
  description: "De la idee la produs live și reclame în 15-30 de minute. Magazin rapid, plăți native (Revolut, Apple Pay, Google Pay), tracking corect și expert de marketing AI. Intră pe lista de așteptare.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
