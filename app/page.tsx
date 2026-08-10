import React from "react";
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google";
import Hero from "../components/meditatii/Hero";
import {
  Section,
  PainMirror,
  WhatIs,
  Method,
  DemoSession,
  Proof,
  Calendar,
  Pricing,
  ForWho,
  About,
  Faq,
} from "../components/meditatii/Sections";
import RegisterForm from "../components/meditatii/RegisterForm";
import MetaTracking from "../components/meditatii/MetaTracking";
import SiteFooter from "../components/meditatii/SiteFooter";
import { nextSession, formatSessionDate } from "./data/sessions";
import styles from "../components/meditatii/meditatii.module.css";

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

export default function Home() {
  const session = nextSession();

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
            <a href="#inscriere" className={styles.navCta}>
              Înscrie-te gratuit
            </a>
          </div>
        </div>
      </header>

      <Hero />
      <PainMirror />
      <WhatIs />
      <Method />
      <DemoSession />
      <Proof />
      <Calendar />
      <Pricing />
      <ForWho />
      <About />
      <Faq />

      <Section label="înscriere" id="inscriere">
        <h2 className={styles.h2}>Spune-mi ce vrei să rezolvi</h2>
        <p className={styles.lead}>
          {session
            ? `Te înscrii la sesiunea deschisă din ${formatSessionDate(session.date)} — online și gratuită.`
            : "Lasă-mi contextul tău și te anunț când se deschide următoarea sesiune."}{" "}
          Nu e nevoie de nicio pregătire: scrie cu cuvintele tale. Ideea pe
          care o descrii intră direct în selecția pentru lucrul live din
          sesiune.
        </p>
        <RegisterForm
          sessionSlug={session?.slug ?? "urmatoarea-sesiune"}
          sessionLabel={session ? formatSessionDate(session.date) : "următoarea sesiune"}
        />
      </Section>

      <SiteFooter />
      <MetaTracking />
    </main>
  );
}
