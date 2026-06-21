"use client";

import React from "react";
import { useLanguage } from "../app/i18n/LanguageContext";
import { ArrowRight } from "lucide-react";
import styles from "./styles/PainPoints.module.css";

type Item = { emoji: string; problem: string; solution: string };

export default function PainPoints() {
  const { t } = useLanguage();
  const items: Item[] = t("painPoints.items") || [];

  return (
    <section className={styles.section} id="pain-points">
      <div className="container">
        <h2 className={styles.title}>{t("painPoints.title")}</h2>
        <p className={styles.subtitle}>{t("painPoints.subtitle")}</p>

        <div className={styles.grid}>
          {items.map((item, idx) => (
            <div key={idx} className={`card ${styles.painCard}`}>
              <div className={styles.emoji}>{item.emoji}</div>
              <p className={styles.problem}>{item.problem}</p>
              <div className={styles.solution}>
                <ArrowRight size={16} className={styles.solIcon} />
                <span>{item.solution}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
