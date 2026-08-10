import React from "react";
import { nextSession, formatSessionDate } from "../../app/data/sessions";
import styles from "./meditatii.module.css";

export default function Hero() {
  const session = nextSession();

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>
            Live · în română · grupă mică · pe cazuri reale
          </p>

          <h1 className={styles.h1}>
            Ai încercat AI.
            <br />
            Tot tu ai rămas cu munca.
          </h1>

          <p className={styles.heroSub}>
            Nu-ți trebuie <span className={styles.strike}>un agent coordonator</span>,{" "}
            <span className={styles.strike}>un model antrenat de tine</span> sau{" "}
            <span className={styles.strike}>încă cinci abonamente</span>.{" "}
            <span className={styles.heroEmphasis}>
              Îți trebuie o problemă clară, unealta potrivită și cineva care
              lucrează cu tine până iese.
            </span>
          </p>

          {session && (
            <div className={styles.sessionCard}>
              <p className={styles.sessionCardDate}>
                Următoarea sesiune · {formatSessionDate(session.date)} · online ·{" "}
                {session.priceLei === 0 ? "gratuită" : `${session.priceLei} lei`}
              </p>
              <p className={styles.sessionCardTitle}>{session.title}</p>
              <p className={styles.sessionCardSummary}>{session.summary}</p>
            </div>
          )}

          <div className={styles.ctaRow}>
            <a href="#inscriere" className={styles.btnPrimary}>
              Spune-mi ce vrei să rezolvi →
            </a>
            <a href="/grupa" className={styles.btnGhost}>
              Vezi grupa pilot →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
