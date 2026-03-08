"use client";

import React from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { ShieldCheck } from 'lucide-react';
import styles from './styles/Guarantee.module.css';

export default function Guarantee() {
    const { t } = useLanguage();

    return (
        <section className={styles.guaranteeSection} id="guarantee">
            <div className="container">
                <div className={styles.guaranteeBox}>
                    <div className={styles.badgeIcon}>
                        <ShieldCheck size={40} />
                    </div>

                    <h3 className={styles.subtitle}>{t("guarantee.subtitle")}</h3>
                    <h2 className={styles.title}>{t("guarantee.title")}</h2>

                    <p className={styles.description}>
                        {t("guarantee.description")}
                    </p>
                </div>
            </div>
        </section>
    );
}
