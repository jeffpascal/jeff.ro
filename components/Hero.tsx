"use client";

import React from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function Hero() {
    const { t } = useLanguage();

    return (
        <section className="hero-section">
            <div className="hero-background">
                <div className="glow-orb orb-1"></div>
                <div className="glow-orb orb-2"></div>
                <div className="grid-overlay"></div>
            </div>

            <div className="container relative z-10 hero-content">
                <div className="badge animate-fade-in-up">
                    <Sparkles size={16} className="text-cyan" />
                    <span>AI Business Mastery</span>
                </div>

                <h1 className="hero-title animate-fade-in-up delay-1">
                    {t("hero.headline")}
                </h1>

                <p className="hero-subtitle animate-fade-in-up delay-2">
                    {t("hero.subHeadline")}
                </p>

                <div className="pricing-box animate-fade-in-up delay-3">
                    <div className="price-strike">{t("hero.priceOld")}</div>
                    <div className="price-current text-gradient">{t("hero.priceNew")}</div>
                </div>

                <div className="cta-wrapper animate-fade-in-up delay-3">
                    <a href="#enroll" className="btn-primary cta-btn">
                        {t("hero.cta")}
                        <ArrowRight size={20} />
                    </a>
                    <p className="scarcity-text">
                        <Zap size={14} className="text-accent-purple" />
                        {t("hero.scarcityWarning")}
                    </p>
                </div>
            </div>

            <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8rem 0 4rem;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.5;
          animation: float 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
        }

        .orb-1 {
          top: -10%; left: -10%;
          width: 600px; height: 600px;
          background: rgba(99, 102, 241, 0.25);
        }

        .orb-2 {
          bottom: -20%; right: -10%;
          width: 500px; height: 500px;
          background: rgba(6, 182, 212, 0.2);
          animation-delay: -10s;
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 900px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--accent-indigo);
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          text-wrap: balance;
        }

        .hero-subtitle {
          font-size: clamp(1.125rem, 2vw, 1.25rem);
          color: var(--text-secondary);
          max-width: 700px;
          margin-bottom: 3rem;
          line-height: 1.6;
        }

        .pricing-box {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          background: rgba(255,255,255,0.02);
          padding: 1rem 3rem;
          border-radius: 24px;
          border: 1px solid var(--border-color);
          box-shadow: 0 0 40px rgba(0,0,0,0.5) inset;
        }

        .price-strike {
          font-size: 1.5rem;
          color: #64748B;
          text-decoration: line-through;
          font-weight: 500;
        }

        .price-current {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1;
        }

        .cta-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .cta-btn {
          font-size: 1.25rem;
          padding: 1.25rem 3.5rem;
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
        }
        
        .scarcity-text {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #FCA5A5; /* A soft red for urgency */
          font-weight: 500;
        }

        @keyframes float {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-50px) scale(1.05); }
        }
      `}</style>
        </section>
    );
}
