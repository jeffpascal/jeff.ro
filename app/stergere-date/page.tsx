import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google";
import styles from "../../components/meditatii/meditatii.module.css";

export const metadata: Metadata = {
  title: "Ștergerea datelor | jeff.ro",
  description: "Cum ceri ștergerea datelor tale de pe jeff.ro — How to request deletion of your data.",
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

export default function StergereDate() {
  return (
    <main
      className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable} ${styles.page}`}
    >
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>jeff.ro · meditații AI</p>
            <h1 className={styles.h2}>Ștergerea datelor — Data deletion</h1>

            <div className={styles.prose}>
              <p>
                <strong>Cum ceri ștergerea datelor tale.</strong> Trimite un
                email la{" "}
                <a href="mailto:jeffpascal96@gmail.com">jeffpascal96@gmail.com</a>{" "}
                de pe adresa pe care ai folosit-o la înscriere (sau
                menționeaz-o în mesaj), cu subiectul „Ștergere date”. Nu
                trebuie să explici de ce.
              </p>
              <p>
                <strong>Ce ștergem.</strong> Toate datele care te privesc:
                înscrierea (nume, email, telefon, descrierea afacerii și a
                obiectivului), consimțămintele și datele de atribuire a
                vizitei. Confirmăm ștergerea pe email în cel mult 30 de zile,
                de regulă mult mai repede.
              </p>
              <p>
                <strong>Datele trimise către Meta.</strong> Dacă ai acceptat
                cookie-urile de măsurare, către Meta s-au trimis evenimente de
                conversie cu date transformate ireversibil (hash). Poți gestiona
                sau șterge activitatea ta off-Facebook direct din contul tău
                Facebook: Setări → Informațiile tale Facebook → Activitate
                off-Facebook.
              </p>
              <p>
                <strong>English.</strong> To request deletion of your data,
                email{" "}
                <a href="mailto:jeffpascal96@gmail.com">jeffpascal96@gmail.com</a>{" "}
                from the address you used to register (or mention that address
                in your message), with the subject line “Data deletion”. We
                will delete all records associated with you and confirm the
                deletion within 30 days.
              </p>
              <p>
                Detalii complete despre ce colectăm și de ce:{" "}
                <Link href="/confidentialitate">politica de confidențialitate</Link>.
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
