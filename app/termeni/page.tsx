import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google";
import styles from "../../components/meditatii/meditatii.module.css";

export const metadata: Metadata = {
  title: "Termeni și condiții | jeff.ro",
  description: "Termenii de utilizare a site-ului jeff.ro și de participare la sesiunile de meditații AI.",
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

export default function Termeni() {
  return (
    <main
      className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable} ${styles.page}`}
    >
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>jeff.ro · meditații AI</p>
            <h1 className={styles.h2}>Termeni și condiții</h1>

            <div className={styles.prose}>
              <p>
                <strong>Cine operează site-ul.</strong> Site-ul jeff.ro este
                operat de Jeff (contact:{" "}
                <a href="mailto:jeffpascal96@gmail.com">jeffpascal96@gmail.com</a>).
                Prin accesarea site-ului sau înscrierea la o sesiune, ești de
                acord cu acești termeni.
              </p>
              <p>
                <strong>Ce oferim.</strong> Sesiuni live, în grupă mică, de
                meditații AI pentru afaceri — lucrăm pe problema ta concretă
                și alegem împreună unealta AI potrivită. Programul, prețurile
                și formatul fiecărei sesiuni sunt cele afișate pe pagina
                principală la momentul înscrierii.
              </p>
              <p>
                <strong>Înscriere și plată.</strong> Locurile se rezervă prin
                formularul de pe site și, pentru sesiunile plătite, prin
                plată online procesată de Revolut. Locul este confirmat doar
                după ce plata este finalizată cu succes.
              </p>
              <p>
                <strong>Anulare și modificări.</strong> Ne rezervăm dreptul de
                a reprograma sau anula o sesiune (de exemplu, din lipsă de
                înscrieri) — în acest caz te anunțăm din timp și oferim
                rambursarea integrală sau reprogramarea, la alegerea ta. Dacă
                nu poți participa, scrie-ne cât mai repede posibil la adresa
                de mai sus.
              </p>
              <p>
                <strong>Conținut și proprietate intelectuală.</strong>{" "}
                Materialele prezentate în sesiuni (structură, exerciții,
                documentație) rămân proprietatea jeff.ro și sunt oferite
                participanților doar pentru uz personal, nu pentru
                redistribuire sau revânzare.
              </p>
              <p>
                <strong>Limitarea răspunderii.</strong> Sesiunile au scop
                educațional și de consultanță — nu garantăm un rezultat de
                business anume. Nu răspundem pentru decizii luate exclusiv pe
                baza discuțiilor din sesiune, fără verificare proprie.
              </p>
              <p>
                <strong>Date personale.</strong> Modul în care colectăm și
                folosim datele tale este descris în{" "}
                <Link href="/confidentialitate">politica de confidențialitate</Link>.
              </p>
              <p>
                <strong>Legea aplicabilă.</strong> Acești termeni sunt supuși
                legii române. Orice neînțelegere se rezolvă pe cale amiabilă
                și, dacă nu este posibil, de instanțele competente din
                România.
              </p>
              <p>
                Ultima actualizare: 26 august 2026. Documentul va fi revizuit,
                inclusiv cu o consultare juridică, înainte de campaniile
                plătite.
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
