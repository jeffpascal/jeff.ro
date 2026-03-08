"use client";

import React from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { Timer, Users, Terminal } from 'lucide-react';
import styles from './styles/Authors.module.css';

export default function Authors() {
  const { t } = useLanguage();

  return (
    <section className={styles.authorsSection} id="authors">
      <div className="container">
        <h2 className={styles.sectionTitle}>{t("authors.title")}</h2>

        <div className={styles.authorsGrid}>
          {/* Jeff Card */}
          <div className={styles.authorCard}>
            <div className={`${styles.authorAvatar} ${styles.jeffAvatar}`}>
              <Terminal size={32} />
            </div>
            <div className="author-info">
              <h3 className={styles.authorName}>{t("authors.jeff.name")}</h3>
              <p className={`${styles.authorRole} text-gradient`}>{t("authors.jeff.role")}</p>
              <p className={styles.authorDesc}>{t("authors.jeff.description")}</p>
            </div>
          </div>

          {/* Andra Card */}
          <div className={styles.authorCard}>
            <div className={`${styles.authorAvatar} ${styles.andraAvatar}`}>
              <Users size={32} />
            </div>
            <div className="author-info">
              <h3 className={styles.authorName}>{t("authors.andra.name")}</h3>
              <p className={`${styles.authorRole} text-gradient`}>{t("authors.andra.role")}</p>
              <p className={styles.authorDesc}>{t("authors.andra.description")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
