import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import ContactForm from "../components/home/ContactForm";
import styles from "../components/home/home.module.css";

const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const AUDIT_LINES: Array<[string, string]> = [
  ["Viteză pe mobil (PageSpeed)", "✓"],
  ["Meta Pixel + evenimente", "✓"],
  ["Conversions API (server)", "✓"],
  ["Google Analytics 4", "✓"],
  ["Conversii Google Ads", "✓"],
  ["TikTok Pixel", "✓"],
  ["Consent Mode v2", "✓"],
  ["SEO + vizibil pentru agenți AI", "✓"],
  ["Site demo pe brandul tău", "✓"],
];

const SERVICES = [
  {
    title: "Site-ul",
    text: "Magazin online construit întâi pentru telefon: pagini care se încarcă repede, coș și checkout scurte, plată cu cardul sau ramburs. Produse noi, modificări și actualizări le fac eu.",
    items: ["Next.js, fără teme grele", "Checkout într-o singură pagină", "Feed pentru Google Merchant și Meta"],
  },
  {
    title: "Tracking-ul",
    text: "Verific și repar tot drumul unei vânzări până în rapoarte. Dacă o comandă nu ajunge la Meta sau Google, reclamele optimizează pe ghicite și plătești pentru asta.",
    items: ["Meta Pixel + Conversions API, cu deduplicare", "GA4 și conversii Google Ads", "TikTok Pixel și Consent Mode v2"],
  },
  {
    title: "Reclamele",
    text: "Campanii Meta, Google și TikTok administrate cu agenți AI care citesc zilnic datele contului. Ei pregătesc analiza și propunerile, eu le verific, tu aprobi schimbările de buget.",
    items: ["Rapoarte pe vânzări, nu pe click-uri", "Oprim ce nu vinde", "Texte și bugete noi, testate pe rând"],
  },
];

const STEPS = [
  {
    title: "Auditez magazinul tău",
    text: "Un script parcurge site-ul ca un client de pe telefon: pagina principală, un produs, coșul, checkout-ul. Măsoară viteza și înregistrează tot ce trimite site-ul spre Meta, Google și TikTok.",
  },
  {
    title: "Construiesc un demo",
    text: "O versiune nouă a magazinului, cu brandul și produsele tale, la adresa brandul-tau.demo.jeff.ro. Auditul complet stă la /audit, cu dovada fiecărei probleme găsite.",
  },
  {
    title: "Compari",
    text: "Scorul vechi lângă cel nou, pe același tip de pagină, măsurat la fel. Tracking-ul vechi lângă cel nou, eveniment cu eveniment.",
  },
  {
    title: "Tu decizi",
    text: "Dacă vrei să mergem mai departe, stabilim ce preiau: site, tracking, reclame sau toate trei. Dacă nu, demo-ul se șterge.",
  },
];

export default function Home() {
  return (
    <div className={`${display.variable} ${mono.variable} ${styles.page}`}>
      <header className={styles.nav}>
        <div className={`${styles.wrap} ${styles.navInner}`}>
          <Link href="/" className={styles.logo}>
            jeff.ro
          </Link>
          <nav className={styles.navLinks} aria-label="Principal">
            <a href="/meditatii" className={styles.navAlt}>
              Meditații AI →
            </a>
            <a href="#contact" className={styles.navCta}>
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className={`${styles.wrap} ${styles.hero}`}>
          <div className={styles.heroText}>
            <h1 className={styles.h1}>
              Magazinul tău online, rapid pe telefon și cu reclame care știu ce vând.
            </h1>
            <p className={styles.lead}>
              Construiesc și administrez site-uri de e-commerce pentru firme din
              România. Repar tracking-ul: Meta Pixel, Conversions API, GA4, Google
              Ads, TikTok. Apoi rulez reclamele cu agenți AI care lucrează zilnic pe
              datele tale.
            </p>
            <div className={styles.heroActions}>
              <a href="#contact" className={styles.btn}>
                Cere auditul gratuit
              </a>
              <a href="mailto:contact@jeff.ro" className={styles.textLink}>
                sau scrie la contact@jeff.ro
              </a>
            </div>
          </div>

          <figure className={styles.receipt} aria-label="Ce conține auditul gratuit">
            <p className={styles.receiptHead}>
              AUDIT MAGAZIN ONLINE
              <span>jeff.ro · UNIC JUST ONLINE SRL</span>
            </p>
            <dl className={styles.receiptLines}>
              {AUDIT_LINES.map(([k, v]) => (
                <div key={k} className={styles.receiptRow}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.receiptTotal}>
              <span>TOTAL</span>
              <span>0,00 lei</span>
            </div>
            <figcaption className={styles.receiptFoot}>
              Fiecare problemă vine cu dovada ei.
            </figcaption>
          </figure>
        </section>

        <section className={styles.band} aria-labelledby="ce-fac">
          <div className={styles.wrap}>
            <h2 id="ce-fac" className={styles.h2}>
              Ce preiau de la tine
            </h2>
            <div className={styles.services}>
              {SERVICES.map((s) => (
                <article key={s.title} className={styles.service}>
                  <h3 className={styles.h3}>{s.title}</h3>
                  <p>{s.text}</p>
                  <ul className={styles.monoList}>
                    {s.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.wrap} ${styles.block}`} aria-labelledby="cum">
          <h2 id="cum" className={styles.h2}>
            Cum lucrăm
          </h2>
          <ol className={styles.steps}>
            {STEPS.map((s) => (
              <li key={s.title} className={styles.step}>
                <h3 className={styles.h3}>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${styles.wrap} ${styles.block}`} aria-labelledby="email">
          <div className={styles.note}>
            <h2 id="email" className={styles.h2}>
              Ai primit un email de la mine?
            </h2>
            <p>
              E real. M-am uitat pe magazinul tău, am rulat auditul și am construit
              demo-ul înainte să te contactez, ca să ai ceva concret de evaluat, nu o
              ofertă generică. Logo-ul și produsele tale le-am folosit doar ca să vezi
              cum ar arăta.
            </p>
            <ul className={styles.plainList}>
              <li>Demo-ul nu apare în Google și nu primește comenzi.</li>
              <li>
                Vrei să-l șterg sau să nu te mai contactez? Răspunde cu „stop” sau
                scrie la <a href="mailto:contact@jeff.ro">contact@jeff.ro</a> și îl
                șterg.
              </li>
            </ul>
          </div>
        </section>

        <section className={`${styles.wrap} ${styles.block}`} aria-labelledby="cine">
          <h2 id="cine" className={styles.h2}>
            Cine e în spate
          </h2>
          <div className={styles.about}>
            <Image
              className={styles.photo}
              src="/jeff.jpg"
              alt="Jeff, la biroul lui de lucru."
              width={1024}
              height={1280}
              sizes="160px"
            />
            <div className={styles.aboutText}>
              <p>
                Sunt Jeff. Programator de șapte ani, cu diplomă în informatică la
                Universitatea din Manchester, trecut prin IBM, acum Technical Lead
                într-o firmă de computer vision.
              </p>
              <p>
                În paralel construiesc și administrez magazine online, printre ele{" "}
                <a href="https://decor.ineo.ro" rel="noopener">
                  INEO Decor
                </a>
                , cu aceeași tehnologie pe care o vezi în demo-uri.
              </p>
              <p className={styles.legal}>
                UNIC JUST ONLINE SRL · CUI RO42662470 · J2020001482351 · Timișoara
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className={styles.band} aria-labelledby="contact-title">
          <div className={`${styles.wrap} ${styles.contact}`}>
            <div>
              <h2 id="contact-title" className={styles.h2}>
                Cere auditul gratuit
              </h2>
              <p className={styles.lead}>
                Lasă-mi site-ul magazinului. Primești auditul și, dacă are sens, un
                demo pe brandul tău. Sau scrie direct la{" "}
                <a href="mailto:contact@jeff.ro">contact@jeff.ro</a>.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={`${styles.wrap} ${styles.footerInner}`}>
          <span>© {new Date().getFullYear()} UNIC JUST ONLINE SRL</span>
          <nav className={styles.footerLinks} aria-label="Legal">
            <a href="/meditatii">Meditații AI</a>
            <a href="/termeni">Termeni</a>
            <a href="/confidentialitate">Confidențialitate</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
