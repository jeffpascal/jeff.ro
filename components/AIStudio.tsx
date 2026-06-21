"use client";

import React from "react";
import { useLanguage } from "../app/i18n/LanguageContext";
import styles from "./styles/AIStudio.module.css";

type Item = { emoji: string; title: string; desc: string };

export default function AIStudio() {
  const { t } = useLanguage();
  const items: Item[] = t("aiStudio.items") || [];

  return (
    <section className={styles.section} id="ai-studio">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.badge}>AI</span>
          <h2 className={styles.title}>{t("aiStudio.title")}</h2>
          <p className={styles.subtitle}>{t("aiStudio.subtitle")}</p>
        </div>

        <div className={styles.grid}>
          {items.map((item, idx) => (
            <div key={idx} className={`card ${styles.item}`}>
              <div className={styles.emoji}>{item.emoji}</div>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <p className={styles.itemDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
