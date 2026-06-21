"use client";

import React from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { Sparkles, Users2 } from 'lucide-react';
import styles from './styles/FOMOBanner.module.css';

export default function FOMOBanner() {
  const { t } = useLanguage();

  return (
    <>
      <div className={styles.fomoTopBanner}>
        <div className={`container ${styles.bannerInner}`}>
          <Sparkles size={16} />
          <span>{t("fomo.banner")}</span>
        </div>
      </div>

      <div className={styles.socialProofBanner}>
        <div className={`container ${styles.flexCenter}`}>
          <Users2 size={24} className="text-accent-cyan" />
          <p>{t("fomo.socialProof")}</p>
        </div>
      </div>
    </>
  );
}
