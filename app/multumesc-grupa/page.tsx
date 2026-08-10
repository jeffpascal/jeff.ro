import React from "react";
import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google";
import styles from "../../components/meditatii/meditatii.module.css";

export const metadata: Metadata = {
  title: "Loc rezervat | jeff.ro",
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

export default function MultumescGrupa() {
  return (
    <main className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable} ${styles.page}`}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>jeff.ro · grupa pilot</p>
            <h1 className={styles.h1}>Locul e al tău.</h1>
            <div className={styles.prose}>
              <p>
                Dacă plata a trecut, primești pe email confirmarea cu datele celor
                trei sesiuni: 18 august, 25 august și 1 septembrie, de la 19:00.
              </p>
              <p>
                Un singur lucru te rog: răspunde la emailul de confirmare cu 2–3
                rânduri despre cazul pe care vrei să-l lucrăm — hot seat-ul tău e
                garantat, iar eu îl pregătesc înainte.
              </p>
              <p>
                <a href="/" className={styles.btnGhost}>← Înapoi pe jeff.ro</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
