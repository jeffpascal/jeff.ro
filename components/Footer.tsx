"use client";

import React from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="footer-section">
            <div className="container footer-content">
                <h2 className="footer-cta-text">{t("footer.cta")}</h2>

                <a href="#enroll" className="btn-primary footer-btn">
                    {t("footer.ctaButton")}
                    <ArrowUpRight size={20} />
                </a>

                <div className="footer-bottom">
                    <p className="copyright">{t("footer.copyright")}</p>
                </div>
            </div>

            <style jsx>{`
        .footer-section {
          padding: 6rem 0 2rem;
          background: #04060A;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          text-align: center;
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .footer-cta-text {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          background: linear-gradient(180deg, #FFFFFF, rgba(255,255,255,0.7));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .footer-btn {
          background: var(--accent-gradient);
          color: white;
          border: none;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
        }

        .footer-btn:hover {
          box-shadow: 0 15px 40px rgba(99, 102, 241, 0.5);
          transform: translateY(-2px);
        }

        .footer-btn::after {
          display: none;
        }

        .footer-bottom {
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          width: 100%;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
      `}</style>
        </footer>
    );
}
