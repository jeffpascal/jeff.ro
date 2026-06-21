"use client";

import React from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { Sparkles } from 'lucide-react';
import WaitlistForm from './WaitlistForm';
import styles from './styles/Hero.module.css';

type Promise = { emoji: string; title: string; desc: string };

export default function Hero() {
  const { t } = useLanguage();
  const promises: Promise[] = t("hero.promises") || [];

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroBackground}>
        <div className={`${styles.glowOrb} ${styles.orb1}`}></div>
        <div className={`${styles.glowOrb} ${styles.orb2}`}></div>
        <div className={styles.gridOverlay}></div>
      </div>

      <div className={`container relative z-10 ${styles.heroContent}`}>
        <div className={`${styles.badge} animate-fade-in-up`}>
          <Sparkles size={16} className="text-cyan" />
          <span>{t("hero.badge")}</span>
        </div>

        <h1 className={`${styles.heroTitle} animate-fade-in-up delay-1`}>
          {t("hero.headline")}
        </h1>

        <p className={`${styles.heroSubtitle} animate-fade-in-up delay-2`}>
          {t("hero.subHeadline")}
        </p>

        <div className={`${styles.formWrapper} animate-fade-in-up delay-3`}>
          <WaitlistForm source="hero" />
        </div>

        <div className={`${styles.promises} animate-fade-in-up delay-3`}>
          {promises.map((p, idx) => (
            <div key={idx} className={styles.promise}>
              <span className={styles.promiseEmoji}>{p.emoji}</span>
              <div>
                <div className={styles.promiseTitle}>{p.title}</div>
                <div className={styles.promiseDesc}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
