import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google";
import styles from "../../components/meditatii/meditatii.module.css";

export const metadata: Metadata = {
  title: "Politica de confidențialitate | jeff.ro",
  description: "Ce date colectează jeff.ro, de ce, și ce drepturi ai.",
  robots: { index: false, follow: true },
};

const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexSerif = IBM_Plex_Serif({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  variable: "--font-plex-serif",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export default function Confidentialitate() {
  return (
    <main
      className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable} ${styles.page}`}
    >
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>jeff.ro · meditații AI</p>
            <h1 className={styles.h2}>Politica de confidențialitate</h1>

            <div className={styles.prose}>
              <p>
                <strong>Cine prelucrează datele.</strong> Site-ul jeff.ro este
                operat de Jeff (contact:{" "}
                <a href="mailto:jeffpascal96@gmail.com">jeffpascal96@gmail.com</a>).
              </p>
              <p>
                <strong>Ce date colectăm.</strong> Doar ce completezi în
                formularul de înscriere: nume, email, telefon, o descriere a
                afacerii tale și a rezultatului pe care vrei să-l obții, plus
                sursa vizitei (de exemplu, din ce campanie ai ajuns pe site).
                Nu-ți cerem și te rugăm să nu introduci date sensibile în
                câmpurile libere.
              </p>
              <p>
                <strong>De ce le colectăm.</strong> Ca să organizăm sesiunile la
                care te înscrii și să te contactăm în legătură cu ele. Emailuri
                despre sesiunile viitoare trimitem doar dacă ai bifat separat
                acordul de marketing — și te poți răzgândi oricând.
              </p>
              <p>
                <strong>Temeiul legal</strong> este consimțământul tău, exprimat
                prin bifarea acordului la înscriere. Îl poți retrage oricând,
                printr-un simplu email.
              </p>
              <p>
                <strong>Cine mai vede datele.</strong> Folosim furnizori care
                procesează datele în numele nostru: Vercel (găzduirea
                site-ului), MongoDB Atlas (stocarea înscrierilor) și Resend
                (trimiterea emailurilor). Dacă accepți cookie-urile de
                măsurare, Meta (Facebook) primește evenimente de conversie —
                folosite doar ca să știm dacă reclamele aduc înscrieri; poți
                refuza fără să afecteze înscrierea. Nu vindem și nu închiriem
                datele nimănui.
              </p>
              <p>
                <strong>Cât le păstrăm.</strong> Până când îți retragi
                consimțământul sau ceri ștergerea lor.
              </p>
              <p>
                <strong>Drepturile tale.</strong> Poți cere oricând accesul la
                datele tale, corectarea sau ștergerea lor, și îți poți retrage
                consimțământul. Dacă ceva nu ți se pare în regulă, ne poți
                scrie sau poți depune o plângere la ANSPDCP
                (dataprotection.ro).
              </p>
              <p>
                Ultima actualizare: 2 august 2026. Documentul va fi revizuit,
                inclusiv cu sfat juridic, înainte de campaniile plătite.
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
