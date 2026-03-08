"use client";

import React from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { Megaphone, Blocks, CheckCircle2 } from 'lucide-react';

export default function CourseFeatures() {
    const { t } = useLanguage();

    const marketingItems = t("features.marketing.items");
    const businessItems = t("features.business.items");

    return (
        <section className="features-section container" id="features">
            <h2 className="section-title text-gradient">{t("features.title")}</h2>

            <div className="features-grid">
                <div className="card feature-card">
                    <div className="card-icon-wrapper marketing">
                        <Megaphone size={28} />
                    </div>
                    <h3 className="card-title">{t("features.marketing.title")}</h3>
                    <ul className="feature-list">
                        {marketingItems && marketingItems.map((item: string, idx: number) => (
                            <li key={idx}>
                                <CheckCircle2 size={18} className="list-icon" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="card feature-card">
                    <div className="card-icon-wrapper business">
                        <Blocks size={28} />
                    </div>
                    <h3 className="card-title">{t("features.business.title")}</h3>
                    <ul className="feature-list">
                        {businessItems && businessItems.map((item: string, idx: number) => (
                            <li key={idx}>
                                <CheckCircle2 size={18} className="list-icon business-icon" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <style jsx>{`
        .features-section {
          padding: 6rem 2rem;
        }

        .section-title {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 4rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .feature-card {
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .card-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .card-icon-wrapper.marketing {
          background: rgba(99, 102, 241, 0.15);
          color: var(--accent-indigo);
          border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .card-icon-wrapper.business {
          background: rgba(6, 182, 212, 0.15);
          color: var(--accent-cyan);
          border: 1px solid rgba(6, 182, 212, 0.3);
        }

        .card-title {
          font-size: 1.5rem;
          color: var(--text-primary);
        }

        .feature-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .feature-list li {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .list-icon {
          color: var(--accent-purple);
          flex-shrink: 0;
          margin-top: 2px;
        }
        
        .business-icon {
          color: var(--accent-cyan);
        }
        
        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </section>
    );
}
