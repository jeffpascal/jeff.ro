"use client";

import React from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { CheckCircle2 } from 'lucide-react';
import styles from './styles/ValueStack.module.css';

export default function ValueStack() {
    const { t } = useLanguage();
    const items = t("valueStack.items") || [];

    return (
        <section className={styles.vsSection} id="value">
            <div className="container">
                <h2 className={`${styles.sectionTitle} text-gradient`}>{t("valueStack.title")}</h2>

                <div className={styles.stackWrapper}>
                    {items.map((item: any, idx: number) => (
                        <div key={idx} className={styles.stackRow}>
                            <div className={styles.rowLabel}>
                                <CheckCircle2 size={18} className={styles.checkIcon} />
                                <span>{item.label}</span>
                            </div>
                            <div className={styles.rowValue}>{item.value}</div>
                        </div>
                    ))}

                    <div className={styles.totalRow}>
                        <span className={styles.totalLabel}>{t("valueStack.totalLabel")}</span>
                        <span className={styles.totalValue}>{t("valueStack.totalValue")}</span>
                    </div>

                    <div className={styles.payRow}>
                        <span className={styles.payLabel}>{t("valueStack.payLabel")}</span>
                        <span className={styles.payValue}>{t("valueStack.payValue")}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
