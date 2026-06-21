"use client";

import React from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import WaitlistForm from './WaitlistForm';
import styles from './styles/Footer.module.css';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footerSection} id="enroll">
      <div className={`container ${styles.footerContent}`}>
        <h2 className={styles.footerCtaText}>{t("footer.cta")}</h2>

        <div className={styles.formWrapper}>
          <WaitlistForm source="footer" />
        </div>

        <div className={styles.footerBottom}>
          <p className="copyright">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
