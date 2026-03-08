"use client";

import React from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import styles from './styles/Hero.module.css';

export default function Hero() {
  const { t } = useLanguage();

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
          <span>AI Business Mastery</span>
        </div>

        <h1 className={`${styles.heroTitle} animate-fade-in-up delay-1`}>
          {t("hero.headline")}
        </h1>

        <p className={`${styles.heroSubtitle} animate-fade-in-up delay-2`}>
          {t("hero.subHeadline")}
        </p>

        <div className={`${styles.pricingBox} animate-fade-in-up delay-3`}>
          <div className={styles.priceStrike}>{t("hero.priceOld")}</div>
          <div className={`${styles.priceCurrent} text-gradient`}>{t("hero.priceNew")}</div>
        </div>

        <div className={`${styles.ctaWrapper} animate-fade-in-up delay-3`}>
          <a href="#enroll" className={`btn-primary ${styles.ctaBtn}`}>
            {t("hero.cta")}
            <ArrowRight size={20} />
          </a>
          <p className={styles.scarcityText}>
            <Zap size={14} className="text-accent-purple" />
            {t("hero.scarcityWarning")}
          </p>
        </div>
      </div>
    </section>
  );
}
