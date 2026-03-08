"use client";

import React, { useState } from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="language-switcher-wrapper">
            <button className="lang-toggle-btn" onClick={toggleDropdown}>
                <Globe size={18} />
                <span>{language.toUpperCase()}</span>
            </button>

            {isOpen && (
                <div className="lang-menu">
                    <button
                        className={language === 'ro' ? 'active' : ''}
                        onClick={() => { setLanguage('ro'); setIsOpen(false); }}
                    >
                        Romanian (RO)
                    </button>
                    <button
                        className={language === 'en' ? 'active' : ''}
                        onClick={() => { setLanguage('en'); setIsOpen(false); }}
                    >
                        English (EN)
                    </button>
                </div>
            )}

            <style jsx>{`
        .language-switcher-wrapper {
          position: relative;
        }
        .lang-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          cursor: pointer;
          font-family: inherit;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }
        .lang-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .lang-menu {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 150px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          animation: slideDown 0.2s ease-out;
        }
        .lang-menu button {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 0.5rem 1rem;
          text-align: left;
          cursor: pointer;
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }
        .lang-menu button:hover, .lang-menu button.active {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
