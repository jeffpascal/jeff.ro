import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google";
import styles from "../../components/meditatii/meditatii.module.css";

export const metadata: Metadata = {
  title: "Rezervare primită | jeff.ro",
  robots: { index: false, follow: false },
};

const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"], weight: ["400", "600", "700"],
  variable: "--font-plex-sans", display: "swap",
});
const plexSerif = IBM_Plex_Serif({
  subsets: ["latin", "latin-ext"], weight: ["600", "700"],
  variable: "--font-plex-serif", display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"], weight: ["400", "500"],
  variable: "--font-plex-mono", display: "swap",
});

export default function MultumescRezervare() {
  return (
    <main className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable} ${styles.page}`}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>jeff.ro · sesiune 1 la 1</p>
            <h1 className={styles.h1}>Gata. Ora e a ta.</h1>
            <div className={styles.prose}>
              <p>
                Dacă plata a trecut, primești pe email confirmarea cu data și ora
                exactă. Linkul de conectare îl trimit cu o zi înainte.
              </p>
              <p>
                Vrei să adaugi ceva la ce mi-ai scris? Răspunde direct la emailul
                de confirmare — îl citesc înainte de sesiune.
              </p>
              <p>
                <Link href="/" className={styles.btnGhost}>← Înapoi la pagina principală</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
