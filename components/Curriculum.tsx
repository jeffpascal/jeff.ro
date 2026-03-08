"use client";

import React, { useState } from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import styles from './styles/Curriculum.module.css';

export default function Curriculum() {
    const { t } = useLanguage();
    const modules = t("curriculum.modules") || [];
    const [openIndex, setOpenIndex] = useState<number | null>(0); // First module open by default

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={styles.curriculumSection} id="curriculum">
            <div className="container">
                <h2 className={`${styles.sectionTitle} text-gradient`}>{t("curriculum.title")}</h2>

                <div className={styles.accordionWrapper}>
                    {modules.map((mod: any, index: number) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={index} className={styles.accordionItem}>
                                <button
                                    className={styles.accordionHeader}
                                    onClick={() => toggleAccordion(index)}
                                    aria-expanded={isOpen}
                                >
                                    <span>{mod.title}</span>
                                    <div className={`${styles.iconWrapper} ${isOpen ? styles.iconRotated : ''}`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </button>

                                <div className={`${styles.accordionContent} ${isOpen ? styles.open : ''}`}>
                                    <div className={styles.contentInner}>
                                        <ul className={styles.moduleList}>
                                            {mod.items.map((item: string, iIndex: number) => (
                                                <li key={iIndex}>
                                                    <CheckCircle2 size={18} className={styles.checkIcon} />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
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
