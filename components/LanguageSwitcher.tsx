"use client";

import React, { useState } from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { Globe } from 'lucide-react';
import styles from './styles/LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className={styles.languageSwitcherWrapper}>
      <button className={styles.langToggleBtn} onClick={toggleDropdown}>
        <Globe size={18} />
        <span>{language.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className={styles.langMenu}>
          <button
            className={language === 'ro' ? styles.active : ''}
            onClick={() => { setLanguage('ro'); setIsOpen(false); }}
          >
            Romanian (RO)
          </button>
          <button
            className={language === 'en' ? styles.active : ''}
            onClick={() => { setLanguage('en'); setIsOpen(false); }}
          >
            English (EN)
          </button>
        </div>
      )}
    </div>
  );
}
