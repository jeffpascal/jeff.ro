import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./i18n/LanguageContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jeff.ro"),
  title: "Site-uri de e-commerce rapide, tracking corect și reclame cu agenți AI | jeff.ro",
  description:
    "Construiesc magazine online rapide pe mobil, repar Meta Pixel, Conversions API, GA4, Google Ads și TikTok, apoi administrez reclamele cu agenți AI. Audit gratuit și site demo pe brandul tău.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
