"use client";

import React from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { X, Check } from 'lucide-react';
import styles from './styles/BeforeAfter.module.css';

export default function BeforeAfter() {
    const { t } = useLanguage();
    const items = t("beforeAfter.items") || [];

    return (
        <section className={styles.baSection} id="transformation">
            <div className="container">
                <h2 className={`${styles.sectionTitle} text-gradient`}>{t("beforeAfter.title")}</h2>

                <div className={styles.tableWrapper}>
                    <div className={styles.headerRow}>
                        <div className={styles.headerBefore}>{t("beforeAfter.beforeTitle")}</div>
                        <div className={styles.headerAfter}>{t("beforeAfter.afterTitle")}</div>
                    </div>

                    {items.map((item: any, idx: number) => (
                        <div key={idx} className={styles.row}>
                            <div className={styles.cellBefore}>
                                <X size={16} className={`${styles.icon} ${styles.iconBefore}`} />
                                <span>{item.before}</span>
                            </div>
                            <div className={styles.cellAfter}>
                                <Check size={16} className={`${styles.icon} ${styles.iconAfter}`} />
                                <span>{item.after}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
