"use client";

import React from "react";
import { useLanguage } from "../app/i18n/LanguageContext";
import { CheckCircle2 } from "lucide-react";
import styles from "./styles/Tiers.module.css";

type Tier = { tag: string; title: string; desc: string; points: string[] };

export default function Tiers() {
  const { t } = useLanguage();
  const tiers: Tier[] = t("tiers.items") || [];

  return (
    <section className={styles.section} id="tiers">
      <div className="container">
        <h2 className={styles.title}>{t("tiers.title")}</h2>
        <p className={styles.subtitle}>{t("tiers.subtitle")}</p>

        <div className={styles.grid}>
          {tiers.map((tier, idx) => (
            <div key={idx} className={`card ${styles.tierCard} ${idx === 1 ? styles.highlight : ""}`}>
              <span className={styles.tag}>{tier.tag}</span>
              <h3 className={styles.tierTitle}>{tier.title}</h3>
              <p className={styles.tierDesc}>{tier.desc}</p>
              <ul className={styles.points}>
                {tier.points.map((p, i) => (
                  <li key={i}>
                    <CheckCircle2 size={18} className={styles.checkIcon} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
