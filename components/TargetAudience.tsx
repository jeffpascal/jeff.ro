"use client";

import React from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { Check, X } from 'lucide-react';
import styles from './styles/TargetAudience.module.css';

export default function TargetAudience() {
    const { t } = useLanguage();

    const forItems = t("targetAudience.forItems") || [];
    const notForItems = t("targetAudience.notForItems") || [];

    return (
        <section className={styles.targetSection} id="audience">
            <div className="container">
                <h2 className={styles.sectionTitle}>{t("targetAudience.title")}</h2>

                <div className={styles.grid}>
                    {/* For Who */}
                    <div className={`${styles.card} ${styles.cardFor}`}>
                        <h3 className={styles.cardTitle}>{t("targetAudience.forTitle")}</h3>
                        <ul className={styles.list}>
                            {forItems.map((item: string, idx: number) => (
                                <li key={idx} className={styles.listItem}>
                                    <Check size={20} className={`${styles.icon} ${styles.iconCheck}`} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* NOT For Who */}
                    <div className={`${styles.card} ${styles.cardNotFor}`}>
                        <h3 className={styles.cardTitle}>{t("targetAudience.notForTitle")}</h3>
                        <ul className={styles.list}>
                            {notForItems.map((item: string, idx: number) => (
                                <li key={idx} className={styles.listItem}>
                                    <X size={20} className={`${styles.icon} ${styles.iconX}`} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
