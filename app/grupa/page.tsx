import React from "react";
import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google";
import { Section } from "../../components/meditatii/Sections";
import SiteFooter from "../../components/meditatii/SiteFooter";
import GrupaCheckout from "../../components/meditatii/GrupaCheckout";
import { formatSessionDate } from "../data/sessions";
import { GRUPA } from "../data/grupa";
import styles from "../../components/meditatii/meditatii.module.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexSerif = IBM_Plex_Serif({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-plex-serif",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Grupa pilot — Meditații AI pentru afaceri | jeff.ro",
  description:
    "3 sesiuni live de 75 de minute, grup de maximum 5. Aplicăm metoda pe cazul tău, cu hot seat garantat. 790 lei, preț de pilot.",
};

const FAQ: Array<[string, string]> = [
  [
    "Eu folosesc doar ChatGPT. E pentru mine?",
    "Da — cam jumătate din grup pornește exact de acolo. Nu îți trebuie nimic tehnic: vii cu problema din afacerea ta, unealta o alegem împreună.",
  ],
  [
    "Ce se întâmplă dacă grupa nu se umple?",
    "Dacă grupa nu pornește, primești toți banii înapoi, integral. Fără discuții.",
  ],
  [
    "Se înregistrează sesiunile?",
    "Hot seat-urile nu se înregistrează niciodată fără acordul tău. Primești în schimb, după fiecare sesiune, rezumatul și pașii următori în scris.",
  ],
  [
    "E abonament?",
    "Nu. Program finit: 3 sesiuni, o singură plată. La final decizi singur dacă vrei să continui cu altceva.",
  ],
  [
    "Ce îmi trebuie?",
    "Un laptop, 75 de minute marțea seara și un caz real din afacerea sau proiectul tău — chiar și formulat vag; fix asta clarificăm împreună.",
  ],
];

export default function GrupaPage() {
  return (
    <main
      className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable} ${styles.page}`}
    >
      <header className={styles.nav}>
        <div className={styles.container}>
          <div className={styles.navInner}>
            <div className={styles.brand}>
              <span className={styles.brandDomain}>jeff.ro</span>
              <span className={styles.brandTag}>meditații AI pentru afaceri</span>
            </div>
            <a href="#plata" className={styles.navCta}>
              Rezervă un loc
            </a>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>
              grupa pilot · maximum {GRUPA.seats} locuri · live, în română
            </p>
            <h1 className={styles.h1}>
              Ai văzut metoda. Acum o aplicăm pe cazul tău.
            </h1>
            <p className={styles.heroSub}>
              {GRUPA.sessions.length} sesiuni live de {GRUPA.durationMin} de
              minute, în grup de maximum {GRUPA.seats}. Cazul tău e lucrat live
              — hot seat garantat — și după fiecare sesiune pleci cu pașii
              următori, în scris.
            </p>
            <div className={styles.sessionCard}>
              <p className={styles.sessionCardDate}>
                Prima sesiune: {formatSessionDate(GRUPA.sessions[0].iso)}
              </p>
              <p className={styles.sessionCardTitle}>
                Înscrierile se închid {GRUPA.registrationClosesText} — sau când
                se ocupă cele {GRUPA.seats} locuri.
              </p>
            </div>
            <div className={styles.ctaRow}>
              <a href="#plata" className={styles.btnPrimary}>
                Rezervă unul din cele {GRUPA.seats} locuri
              </a>
              <a href="#calendar" className={styles.btnGhost}>
                Vezi calendarul
              </a>
            </div>
          </div>
        </div>
      </section>

      <Section label="ce primești">
        <h2 className={styles.h2}>Nu un curs.</h2>
        <div className={styles.priceGrid}>
          <div className={styles.priceCard}>
            <p className={styles.priceName}>Hot seat garantat</p>
            <p className={styles.priceDesc}>
              Grupul e de maximum {GRUPA.seats}, tocmai ca să încapă toată
              lumea: cazul tău e lucrat live de cel puțin două ori pe parcursul
              celor {GRUPA.sessions.length} sesiuni — de la problemă spusă cu
              voce tare, la ceva construit și verificat.
            </p>
          </div>
          <div className={styles.priceCard}>
            <p className={styles.priceName}>Pașii următori, în scris</p>
            <p className={styles.priceDesc}>
              După fiecare sesiune primești rezumatul și exact ce ai de făcut
              până data viitoare. Nu pleci cu notițe vagi — pleci cu o listă.
            </p>
          </div>
          <div className={styles.priceCard}>
            <p className={styles.priceName}>Grup mic, nivel apropiat</p>
            <p className={styles.priceDesc}>
              Oameni cu afaceri și proiecte reale, nu spectatori. Înveți și din
              cazurile celorlalți — de multe ori problema lor e și a ta, cu alt
              nume.
            </p>
          </div>
        </div>
      </Section>

      <Section label="calendar" id="calendar">
        <h2 className={styles.h2}>Trei marți seara, la 19:00</h2>
        {GRUPA.sessions.map((s, i) => (
          <div key={s.iso} className={styles.sessionRow}>
            <span className={styles.sessionRowDate}>{formatSessionDate(s.iso)}</span>
            <div>
              <p className={styles.sessionRowTitle}>
                Meditația #{i + 1}: {s.title}
              </p>
              <p className={styles.sessionRowMeta}>
                online · {GRUPA.durationMin} min · hot seats pe cazurile din grup
              </p>
            </div>
            <span className={styles.sessionRowPrice}>inclus</span>
          </div>
        ))}
        <p className={styles.calendarNote}>
          Nu poți ajunge la una dintre date? Spune-mi înainte să te înscrii —
          dacă nu găsim o soluție corectă pentru tine, mai bine nu plătești.
        </p>
      </Section>

      <Section label="prețul" id="plata">
        <h2 className={styles.h2}>790 lei. O singură plată, tot programul.</h2>
        <div className={styles.priceGrid}>
          <div className={`${styles.priceCard} ${styles.priceCardFeatured}`}>
            <span className={styles.priceTag}>preț de pilot</span>
            <p className={styles.priceName}>
              Grupa pilot — {GRUPA.sessions.length} sesiuni
            </p>
            <p className={styles.priceValue}>
              {GRUPA.priceLei} lei
              <span className={styles.priceUnit}>
                {" "}
                · după pilot: {GRUPA.priceAfterLei} lei
              </span>
            </p>
            <p className={styles.priceDesc}>
              Locul e confirmat în ordinea plății. Dacă grupa nu pornește,
              primești toți banii înapoi.
            </p>
            <GrupaCheckout priceLei={GRUPA.priceLei} />
          </div>
        </div>
        <p className={styles.priceFootnote}>
          Fără abonament, fără reînnoire automată. Prețul de {GRUPA.priceLei}{" "}
          lei e valabil pentru această grupă; edițiile următoare vor fi la{" "}
          {GRUPA.priceAfterLei} lei.
        </p>
      </Section>

      <Section label="pentru cine">
        <h2 className={styles.h2}>E pentru tine dacă…</h2>
        <div className={styles.prose}>
          <p>
            …ai o afacere sau un rol real și o problemă concretă la care vrei
            AI-ul pus la treabă în următoarele 30 de zile — un site, o
            automatizare, promovare, un proces care îți mănâncă timp.
          </p>
          <p>
            …sau abia vrei să începi. N-ai încă firmă — ai o idee, un proiect
            personal sau doar dorința de a învăța lucrând. Începem drumul tău
            antreprenorial pe loc: site-ul și promovarea lui pot porni chiar
            din prima sesiune.
          </p>
          <p>
            …ai încercat deja ChatGPT sau Claude și ai rămas cu senzația că
            „răspunde frumos, dar munca tot la mine rămâne”.
          </p>
          <p>
            <strong>Nu e pentru tine</strong> dacă vrei doar să te uiți sau
            cauți venit pasiv fără muncă. Aici se lucrează, pe proiecte reale,
            cu numele tău pe ele.
          </p>
        </div>
      </Section>

      <Section label="întrebări">
        <h2 className={styles.h2}>Întrebări frecvente</h2>
        <div className={styles.faqList}>
          {FAQ.map(([q, a]) => (
            <details key={q} className={styles.faqItem}>
              <summary>{q}</summary>
              <p className={styles.faqAnswer}>{a}</p>
            </details>
          ))}
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
