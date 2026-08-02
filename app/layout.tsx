import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./i18n/LanguageContext";

export const metadata: Metadata = {
  title: "Meditații AI pentru afaceri — live, pe cazul tău | jeff.ro",
  description:
    "Vii cu problema din afacerea ta. O clarificăm, alegem unealta AI potrivită și construim împreună ceva ce poți folosi. Sesiuni live, în română, în grupă mică. Prima sesiune deschisă e gratuită.",
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
