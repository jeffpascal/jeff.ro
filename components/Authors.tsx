"use client";

import React from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { Timer, Users, Terminal } from 'lucide-react';

export default function Authors() {
    const { t } = useLanguage();

    return (
        <section className="authors-section" id="authors">
            <div className="container">
                <h2 className="section-title">{t("authors.title")}</h2>

                <div className="authors-grid">
                    {/* Jeff Card */}
                    <div className="author-card">
                        <div className="author-avatar jeff-avatar">
                            <Terminal size={32} className="avatar-icon" />
                        </div>
                        <div className="author-info">
                            <h3 className="author-name">{t("authors.jeff.name")}</h3>
                            <p className="author-role text-gradient">{t("authors.jeff.role")}</p>
                            <p className="author-desc">{t("authors.jeff.description")}</p>
                        </div>
                    </div>

                    {/* Andra Card */}
                    <div className="author-card">
                        <div className="author-avatar andra-avatar">
                            <Users size={32} className="avatar-icon" />
                        </div>
                        <div className="author-info">
                            <h3 className="author-name">{t("authors.andra.name")}</h3>
                            <p className="author-role text-gradient">{t("authors.andra.role")}</p>
                            <p className="author-desc">{t("authors.andra.description")}</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .authors-section {
          padding: 6rem 0;
          background: linear-gradient(180deg, transparent, rgba(18, 22, 34, 0.8), transparent);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }

        .section-title {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 4rem;
        }

        .authors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 3rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .author-card {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          padding: 2rem;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }

        .author-card:hover {
          background: rgba(255, 255, 255, 0.04);
          transform: translateY(-5px);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .author-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        .jeff-avatar {
          background: radial-gradient(circle at top left, #2D3748, #0F172A);
          color: var(--accent-cyan);
        }

        .andra-avatar {
          background: radial-gradient(circle at top left, #4C1D95, #312E81);
          color: #E879F9;
        }

        .author-name {
          font-size: 1.5rem;
          color: white;
          margin-bottom: 0.25rem;
        }

        .author-role {
          font-size: 0.875rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .author-desc {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 0.95rem;
        }

        @media (max-width: 600px) {
          .author-card {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }
      `}</style>
        </section>
    );
}
