"use client";

import React from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { Megaphone, Blocks, CheckCircle2 } from 'lucide-react';
import styles from './styles/CourseFeatures.module.css';

export default function CourseFeatures() {
    const { t } = useLanguage();

    const marketingItems = t("features.marketing.items");
    const businessItems = t("features.business.items");

    return (
        <section className={`${styles.featuresSection} container`} id="features">
            <h2 className={`${styles.sectionTitle} text-gradient`}>{t("features.title")}</h2>

            <div className={styles.featuresGrid}>
                <div className={`card ${styles.featureCard}`}>
                    <div className={`${styles.cardIconWrapper} ${styles.marketing}`}>
                        <Megaphone size={28} />
                    </div>
                    <h3 className={styles.cardTitle}>{t("features.marketing.title")}</h3>
                    <ul className={styles.featureList}>
                        {marketingItems && marketingItems.map((item: string, idx: number) => (
                            <li key={idx}>
                                <CheckCircle2 size={18} className={styles.listIcon} />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={`card ${styles.featureCard}`}>
                    <div className={`${styles.cardIconWrapper} ${styles.business}`}>
                        <Blocks size={28} />
                    </div>
                    <h3 className={styles.cardTitle}>{t("features.business.title")}</h3>
                    <ul className={styles.featureList}>
                        {businessItems && businessItems.map((item: string, idx: number) => (
                            <li key={idx}>
                                <CheckCircle2 size={18} className={`${styles.listIcon} ${styles.businessIcon}`} />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
