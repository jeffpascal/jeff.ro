"use client";

import React from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import styles from './styles/HowItWorks.module.css';

export default function HowItWorks() {
    const { t } = useLanguage();
    const steps = t("howItWorks.steps") || [];

    return (
        <section className={styles.howSection} id="how-it-works">
            <div className="container">
                <h2 className={styles.sectionTitle}>{t("howItWorks.title")}</h2>

                <div className={styles.stepsGrid}>
                    {steps.map((step: any, idx: number) => (
                        <div key={idx} className={styles.stepCard}>
                            <div className={styles.emoji}>{step.emoji}</div>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDesc}>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
