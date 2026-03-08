"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { AlertTriangle, Users2 } from 'lucide-react';

export default function FOMOBanner() {
    const { t } = useLanguage();
    const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 59, seconds: 59 });

    // Simple countdown effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (val: number) => val.toString().padStart(2, '0');

    return (
        <>
            <div className="fomo-top-banner">
                <div className="container banner-inner">
                    <AlertTriangle size={16} />
                    <span>{t("fomo.banner")}</span>
                    <div className="timer">
                        {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
                    </div>
                </div>
            </div>

            <div className="social-proof-banner">
                <div className="container flex-center">
                    <Users2 size={24} className="text-accent-cyan" />
                    <p>{t("fomo.socialProof")}</p>
                </div>
            </div>

            <style jsx>{`
        .fomo-top-banner {
          background: var(--accent-gradient);
          color: white;
          padding: 0.75rem 0;
          font-weight: 600;
          font-size: 0.875rem;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .banner-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .timer {
          background: rgba(0, 0, 0, 0.2);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          font-family: var(--font-geist-mono), monospace;
          letter-spacing: 0.05em;
        }

        .social-proof-banner {
          background: rgba(6, 182, 212, 0.05);
          border-top: 1px solid rgba(6, 182, 212, 0.1);
          border-bottom: 1px solid rgba(6, 182, 212, 0.1);
          padding: 1.5rem 0;
          margin: 4rem 0;
        }

        .flex-center {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          text-align: center;
          color: var(--text-secondary);
          font-size: 1.1rem;
        }
      `}</style>
        </>
    );
}
