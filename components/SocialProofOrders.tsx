"use client";

import React from "react";
import { useLanguage } from "../app/i18n/LanguageContext";
import { ArrowUpRight } from "lucide-react";
import { REAL_ORDERS, REAL_ORDERS_META } from "../app/data/realOrders";
import styles from "./styles/SocialProofOrders.module.css";

function relativeTime(iso: string, lang: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const day = 86400000;
  const days = Math.max(1, Math.floor(diffMs / day));
  const ro = lang === "ro";
  if (days < 7) return ro ? `acum ${days} ${days === 1 ? "zi" : "zile"}` : `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (days < 30) return ro ? `acum ${weeks} ${weeks === 1 ? "săptămână" : "săpt."}` : `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return ro ? `acum ${months} ${months === 1 ? "lună" : "luni"}` : `${months}mo ago`;
}

export default function SocialProofOrders() {
  const { t, language } = useLanguage();

  return (
    <section className={styles.section} id="proof">
      <div className="container">
        <h2 className={styles.title}>{t("socialProof.title")}</h2>

        <div className={styles.statBar}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{REAL_ORDERS_META.count}</span>
            <span className={styles.statLabel}>{t("socialProof.statOrders")}</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>{REAL_ORDERS_META.totalRon.toLocaleString("ro-RO")}+ lei</span>
            <span className={styles.statLabel}>{t("socialProof.statValue")}</span>
          </div>
        </div>
        <p className={styles.caption}>{t("socialProof.statCaption")}</p>

        <div className={styles.feed}>
          {REAL_ORDERS.map((o, idx) => (
            <div key={idx} className={styles.row}>
              <span className={styles.dot} />
              <span className={styles.emoji}>{o.emoji}</span>
              <span className={styles.product}>{o.product}</span>
              <span className={styles.location}>
                {o.city}, {o.county}
              </span>
              <span className={styles.price}>{o.total.toLocaleString("ro-RO")} lei</span>
              <span className={styles.time}>{relativeTime(o.date, language)}</span>
            </div>
          ))}
        </div>

        <div className={styles.ctaRow}>
          <a href={REAL_ORDERS_META.storeUrl} target="_blank" rel="noopener noreferrer" className={`btn-primary ${styles.cta}`}>
            {t("socialProof.button")}
            <ArrowUpRight size={18} />
          </a>
        </div>
        <p className={styles.note}>{t("socialProof.note")}</p>
      </div>
    </section>
  );
}
