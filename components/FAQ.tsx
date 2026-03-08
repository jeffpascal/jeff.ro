"use client";

import React, { useState } from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { Plus } from 'lucide-react';
import styles from './styles/FAQ.module.css';

export default function FAQ() {
    const { t } = useLanguage();
    const items = t("faq.items") || [];
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={styles.faqSection} id="faq">
            <div className="container">
                <h2 className={styles.sectionTitle}>{t("faq.title")}</h2>

                <div className={styles.faqWrapper}>
                    {items.map((item: any, index: number) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={index} className={styles.faqItem}>
                                <button
                                    className={styles.faqHeader}
                                    onClick={() => toggleAccordion(index)}
                                    aria-expanded={isOpen}
                                >
                                    <span>{item.q}</span>
                                    <div className={`${styles.iconWrapper} ${isOpen ? styles.iconRotated : ''}`}>
                                        <Plus size={20} />
                                    </div>
                                </button>

                                <div className={`${styles.faqContent} ${isOpen ? styles.open : ''}`}>
                                    <div className={styles.contentInner}>
                                        <p>{item.a}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
