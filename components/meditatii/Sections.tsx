import React from "react";
import Image from "next/image";
import { publishedSessions, formatSessionDate } from "../../app/data/sessions";
import styles from "./meditatii.module.css";

type SectionProps = {
  label: string;
  id?: string;
  children: React.ReactNode;
};

export function Section({ label, id, children }: SectionProps) {
  return (
    <section className={styles.section} id={id}>
      <div className={styles.container}>
        <div className={styles.sectionInner}>
          <span className={styles.marginLabel}>{label}</span>
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}

const PAIN_QUOTES = [
  "Nu știu ce AI să folosesc. ChatGPT, Claude, Gemini… par toate la fel.",
  "Toată lumea vorbește de agenți și automatizări. Eu cu ce încep?",
  "ChatGPT îmi răspunde frumos și general. Adică inutil.",
  "N-am buget de agenție, de programator sau de om de marketing.",
  "Aș porni ceva al meu, dar mă blochez la marketing și la unelte.",
  "Mi-e frică să nu stric ceva sau să arunc banii aiurea.",
  "Primesc idei bune, dar munca tot la mine rămâne.",
  "Simt că toți se mișcă mai repede decât mine cu AI-ul ăsta.",
  "Cursurile pe care le-am găsit nu răspund la cazul meu.",
];

export function PainMirror() {
  return (
    <Section label="sună cunoscut?">
      <h2 className={styles.h2}>Gândurile pe care le aud cel mai des</h2>
      <ul className={styles.quotes}>
        {PAIN_QUOTES.map((q) => (
          <li key={q} className={styles.quote}>
            {q}
          </li>
        ))}
      </ul>
      <p className={styles.painClose}>
        Dacă te-ai regăsit măcar în unul — exact pentru asta există
        meditațiile.
      </p>
    </Section>
  );
}

const COMPARE_ROWS: Array<[string, string]> = [
  ["Te uiți la lecții înregistrate", "Lucrăm live, pe problema ta"],
  ["Exemple generice, pentru oricine", "Cazul tău, pe masă"],
  ["Termini cu notițe și bune intenții", "Pleci cu ceva construit sau cu pașii exacți"],
  ["Întrebările rămân pe forum", "Întrebi și primești răspuns pe loc"],
];

export function WhatIs() {
  return (
    <Section label="ce sunt">
      <h2 className={styles.h2}>Meditații, nu curs.</h2>
      <div className={styles.prose}>
        <p>
          Îți amintești cum funcționau meditațiile? Nu stăteai într-un
          amfiteatru cu două sute de oameni. Stăteai la masă cu cineva care se
          uita pe caietul tău și lucra cu tine până înțelegeai.
        </p>
        <p>
          Exact așa funcționează și astea — doar că problema nu e la
          matematică, ci în afacerea ta. Și fix asta le lipsește celor mai
          mulți: nu încă un curs de privit, ci cineva care lucrează cu ei.
        </p>
      </div>
      <div className={styles.compare}>
        <div className={styles.compareHeads}>
          <span className={`${styles.compareHead} ${styles.compareHeadCourse}`}>
            La un curs
          </span>
          <span className={`${styles.compareHead} ${styles.compareHeadMeditation}`}>
            La meditații
          </span>
        </div>
        {COMPARE_ROWS.map(([course, meditation]) => (
          <div key={meditation} className={styles.compareRow}>
            <span className={`${styles.compareCell} ${styles.compareCellCourse}`}>
              {course}
            </span>
            <span className={`${styles.compareCell} ${styles.compareCellMeditation}`}>
              {meditation}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

const STEPS: Array<[string, string]> = [
  ["Context", "Spui liber ce faci, ce vrei și ce te blochează. Fără pregătire, fără jargon."],
  ["Claritate", "Îți pun întrebări, una câte una, până când problema și rezultatul dorit sunt limpezi."],
  ["Alegere", "Alegem agentul și uneltele potrivite pentru tine și pentru cazul tău."],
  ["Construcție", "Construim live: o aplicație, o pagină, un plan, o automatizare."],
  ["Audit", "Cum știi ce face AI-ul tău: îl pui să-ți raporteze pe WhatsApp sau Telegram."],
];

export function Method() {
  return (
    <Section label="metoda">
      <h2 className={styles.h2}>Cum lucrăm, pas cu pas</h2>
      <ol className={styles.steps}>
        {STEPS.map(([title, desc]) => (
          <li key={title} className={styles.step}>
            <div>
              <p className={styles.stepTitle}>{title}</p>
              <p className={styles.stepDesc}>{desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function DemoSession() {
  return (
    <Section label="sesiunea deschisă">
      <h2 className={styles.h2}>Ce se întâmplă la sesiunea deschisă</h2>
      <p className={styles.lead}>
        Pe un singur caz, ales din grup, parcurgem toată metoda — de la o idee
        spusă cu voce tare, la o automatizare, un site sau o aplicație care
        chiar funcționează. Fără tăieturi, fără slide-uri pregătite dinainte.
      </p>
      <div className={styles.terminal}>
        <p><span className={styles.tDim}>—</span> „Vreau AI în restaurantul meu. Am auzit că-mi trebuie un agent coordonator.”</p>
        <p><span className={styles.tDim}>—</span> Stai puțin. Ce vrei să se întâmple, concret?</p>
        <p><span className={styles.tDim}>—</span> „Să văd cum ar arăta terasa renovată. Și mai multe rezervări.”</p>
        <p><span className={styles.tRed}>✎ agent coordonator → nu e nevoie de așa ceva</span></p>
        <p><span className={styles.tBlue}>✓</span> brief: 3 randări ale terasei + pagină de rezervări</p>
        <p><span className={styles.tBlue}>✓</span> construit live: pagina, publicată pe internet</p>
        <p><span className={styles.tBlue}>✓</span> prima reclamă: draft, gata de pornit</p>
      </div>
      <p className={styles.terminalCaption}>
        * metoda, comprimată. La sesiune o facem live, pe cazul ales din grup.
      </p>
      <ul className={styles.agendaList}>
        <li>Ce poate face AI acum pentru o afacere — fără mituri și fără hype.</li>
        <li>Un caz real, lucrat cap-coadă, în direct.</li>
        <li>Întrebările tale, cu răspunsuri pe cazul tău.</li>
      </ul>
      <figure className={styles.methodPhoto}>
        <Image
          src="/metoda-caiet-pagina.jpg"
          alt="Un caiet cu schița unei pagini, lângă un laptop pe care aceeași pagină e deja publicată."
          width={1024}
          height={1024}
          sizes="(max-width: 700px) 100vw, 46rem"
        />
        <figcaption className={styles.methodPhotoCaption}>
          Asta e distanța pe care o parcurgem în sesiune: din schița de pe
          caiet, într-o pagină publicată.
        </figcaption>
      </figure>
      <div className={styles.ideaCallout}>
        <p className={styles.ideaCalloutTitle}>O singură idee se alege. Poate fi a ta.</p>
        <p className={styles.ideaCalloutBody}>
          La înscriere ne spui ce vrei să rezolvi. Din toate ideile trimise
          aleg una și o construim live, în sesiune — de la vorbă la ceva
          publicat. Cu cât e mai concretă, cu atât are șanse mai mari.
        </p>
        <a href="#inscriere" className={styles.btnPrimary}>
          Trimite-ți ideea →
        </a>
      </div>
    </Section>
  );
}

export function Calendar() {
  const sessions = publishedSessions();
  return (
    <Section label="calendar" id="calendar">
      <h2 className={styles.h2}>Sesiunile următoare</h2>
      {sessions.map((s) => (
        <div key={s.slug} className={styles.sessionRow}>
          <span className={styles.sessionRowDate}>{formatSessionDate(s.date)}</span>
          <div>
            <p className={styles.sessionRowTitle}>{s.title}</p>
            <p className={styles.sessionRowMeta}>
              online · {s.durationMin} min
            </p>
          </div>
          <span className={styles.sessionRowPrice}>
            {s.priceLei === 0 ? "gratuit" : `${s.priceLei} lei`}
          </span>
        </div>
      ))}
      <p className={styles.calendarNote}>
        Meditațiile săptămânale pornesc după sesiunea deschisă — o dată pe
        săptămână, seara, la 19:00. Calendarul se completează aici, cu date și
        locuri reale.
      </p>
    </Section>
  );
}

export function Pricing() {
  return (
    <Section label="prețul">
      <h2 className={styles.h2}>Simplu și la vedere</h2>
      <div className={styles.priceGrid}>
        <div className={styles.priceCard}>
          <p className={styles.priceName}>Sesiunea deschisă</p>
          <p className={styles.priceValue}>
            0 lei<span className={styles.priceUnit}> · prima ediție</span>
          </p>
          <p className={styles.priceDesc}>
            Vezi metoda pe viu, pe un caz real. Te ajută să decizi dacă
            meditațiile au sens pentru tine.
          </p>
        </div>
        <div className={styles.priceCard}>
          <p className={styles.priceName}>O meditație</p>
          <p className={styles.priceValue}>
            290 lei<span className={styles.priceUnit}> / sesiune</span>
          </p>
          <p className={styles.priceDesc}>
            Vii la o singură sesiune, când ai nevoie, în limita locurilor.
          </p>
        </div>
        <div className={`${styles.priceCard} ${styles.priceCardFeatured}`}>
          <span className={styles.priceTag}>recomandat</span>
          <p className={styles.priceName}>Pachet 4 meditații</p>
          <p className={styles.priceValue}>
            790 lei<span className={styles.priceUnit}> · ~198 lei / sesiune</span>
          </p>
          <p className={styles.priceDesc}>
            O lună de lucru pe cazul tău, cu hot seat garantat. Preț de pilot.
          </p>
        </div>
      </div>
      <p className={styles.priceFootnote}>
        Prețuri de pilot — cresc după primele grupe. Fără abonament și fără
        reînnoire automată: cumperi, participi, decizi dacă vrei să continui.
      </p>
    </Section>
  );
}

export function Proof() {
  return (
    <Section label="ce am construit">
      <h2 className={styles.h2}>Nu vorbesc din cărți. Astea rulează acum.</h2>
      <p className={styles.lead}>
        Metoda pe care o predau e metoda cu care lucrez. Două lucruri
        construite cu ea, pe care le poți deschide chiar acum:
      </p>
      <div className={styles.proofList}>
        <article className={styles.proofItem}>
          <p className={styles.proofTitle}>INEO DECOR</p>
          <a
            className={styles.proofLink}
            href="https://decor.ineo.ro"
            target="_blank"
            rel="noopener noreferrer"
          >
            decor.ineo.ro
          </a>
          <p className={styles.proofDesc}>
            Magazin online cu plată cu cardul, recuperare automată a
            coșurilor abandonate pe email, feed de produse către Google
            Shopping și măsurare corectă a conversiilor. Construit și
            întreținut de mine, cu AI.
          </p>
        </article>
        <article className={styles.proofItem}>
          <p className={styles.proofTitle}>Vila Franceză</p>
          <a
            className={styles.proofLink}
            href="https://vilafranceza.ro"
            target="_blank"
            rel="noopener noreferrer"
          >
            vilafranceza.ro
          </a>
          <p className={styles.proofDesc}>
            Șase case de închiriat în Colibița, automatizate: prețurile se
            ajustează singure după cerere, mesajele oaspeților de pe Airbnb și
            Booking primesc răspuns asistat de AI, apelurile telefonice sunt
            transcrise și rezumate, iar echipa primește programul de curățenie
            pe Telegram.
          </p>
        </article>
      </div>
      <p className={styles.proofNote}>
        Exact felul ăsta de lucruri le desfacem în bucăți la meditații, ca să
        poți începe și tu de la prima ta problemă.
      </p>
    </Section>
  );
}

export function ForWho() {
  return (
    <section className={styles.spread} id="pentru-cine">
      <div className={styles.spreadInner}>
        <h2 className={styles.spreadTitle}>E pentru tine? Verifică sincer.</h2>
        <div className={styles.spreadPages}>
          <div className={`${styles.spreadSide} ${styles.spreadYes}`}>
            <h3>Da, dacă</h3>
            <ul className={styles.spreadList}>
              <li>
                Ai o afacere reală, cu clienți — sau vrei să pornești una și te
                blochează lucrurile „simple”: marketing, unelte, primii pași.
              </li>
              <li>Ai o problemă sau o idee concretă pentru următoarele 30 de zile.</li>
              <li>Ai încercat măcar puțin ChatGPT sau altă unealtă AI.</li>
              <li>Poți lucra 90–120 de minute pe săptămână.</li>
              <li>
                Vrei să înveți, să fii la zi cu AI și să verifici rezultatele,
                nu să crezi pe cuvânt.
              </li>
            </ul>
          </div>
          <div className={styles.spreadFold} aria-hidden="true" />
          <div className={`${styles.spreadSide} ${styles.spreadNo}`}>
            <h3>Nu, dacă</h3>
            <ul className={styles.spreadList}>
              <li>Cauți îmbogățire rapidă sau venit pasiv, fără muncă.</li>
              <li>Vrei doar noutăți și tool-uri, fără să aplici pe nimic.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <Section label="cine te ajută">
      <h2 className={styles.h2}>Lucrezi direct cu mine</h2>
      <div className={styles.aboutGrid}>
        <Image
          className={styles.aboutPhoto}
          src="/jeff.jpg"
          alt="Jeff, la biroul lui de lucru."
          width={1024}
          height={1280}
          sizes="(max-width: 700px) 15rem, 15rem"
        />
        <div className={styles.prose}>
        <p>
          Sunt Jeff. Programator de șapte ani, cu diplomă în informatică la
          Universitatea din Manchester. Am trecut prin IBM, iar acum sunt
          Technical Lead într-o firmă care duce modele de computer vision în
          producție.
        </p>
        <p>
          În paralel construiesc cu AI lucruri care chiar rulează: magazine
          online, automatizări și campanii de marketing. Integrez AI în afaceri
          care merg deja și le construiesc automatizările de care au nevoie.
          Două dintre ele le-ai văzut mai sus.
        </p>
        <p>
          La meditații nu primești teorie despre AI. Îți arăt exact cum lucrez
          eu, pe cazul tău, și nu ne oprim până nu pleci cu ceva ce poți
          folosi.
        </p>
          <p className={styles.signature}>— Jeff</p>
        </div>
      </div>
    </Section>
  );
}

const FAQ_ITEMS: Array<[string, string]> = [
  [
    "Trebuie să știu programare?",
    "Nu. Lucrăm cu unelte pe care le poate folosi oricine. Unde e nevoie de ceva tehnic, fac eu partea aia, cu ecranul la vedere, ca să vezi exact cum se face.",
  ],
  [
    "Cu ce unelte lucrăm?",
    "Alegem după problemă, nu după hype: ChatGPT, Claude, unelte pentru imagini, automatizări. Ideea nu e să înveți o unealtă anume, ci să știi să alegi și să verifici.",
  ],
  [
    "Cât mă costă uneltele AI?",
    "De cele mai multe ori, la început, ajunge un singur abonament — sau chiar varianta gratuită. Stabilim împreună ce merită plătit pentru cazul tău, înainte să plătești ceva.",
  ],
  [
    "N-am buget mare. Are sens pentru mine?",
    "Tocmai atunci are cel mai mult sens. AI-ul face azi o parte din treaba pentru care altfel ai plăti o agenție, un programator sau un om în plus — iar la meditații înveți să i-o ceri tu, pentru cazul tău.",
  ],
  [
    "Se înregistrează sesiunile?",
    "Demonstrațiile pot fi înregistrate. Lucrul pe cazul tău — niciodată fără acordul tău explicit.",
  ],
  [
    "Dacă nu pot ajunge la o sesiune?",
    "Îmi scrii și te mut la următoarea. Fără penalizări și fără termene ascunse.",
  ],
  [
    "E sigur să vorbesc despre firma mea?",
    "În formular nu-ți cer date sensibile. În sesiuni discutăm și ce informații e sigur să pui într-un AI și ce nu — e una dintre temele importante.",
  ],
];

export function Faq() {
  return (
    <Section label="întrebări">
      <h2 className={styles.h2}>Întrebări frecvente</h2>
      <div className={styles.faqList}>
        {FAQ_ITEMS.map(([q, a]) => (
          <details key={q} className={styles.faqItem}>
            <summary>{q}</summary>
            <p className={styles.faqAnswer}>{a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
