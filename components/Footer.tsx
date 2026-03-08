"use client";

import React from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { ArrowUpRight } from 'lucide-react';
import styles from './styles/Footer.module.css';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footerSection}>
      <div className={`container ${styles.footerContent}`}>
        <h2 className={styles.footerCtaText}>{t("footer.cta")}</h2>

        <a href="#enroll" className={`btn-primary ${styles.footerBtn}`}>
          {t("footer.ctaButton")}
          <ArrowUpRight size={20} />
        </a>

        <div className={styles.footerBottom}>
          <p className="copyright">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
