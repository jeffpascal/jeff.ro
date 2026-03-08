"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { AlertTriangle, Users2 } from 'lucide-react';
import styles from './styles/FOMOBanner.module.css';

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
      <div className={styles.fomoTopBanner}>
        <div className={`container ${styles.bannerInner}`}>
          <AlertTriangle size={16} />
          <span>{t("fomo.banner")}</span>
          <div className={styles.timer}>
            {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
          </div>
        </div>
      </div>

      <div className={styles.socialProofBanner}>
        <div className={`container ${styles.flexCenter}`}>
          <Users2 size={24} className="text-accent-cyan" />
          <p>{t("fomo.socialProof")}</p>
        </div>
      </div>
    </>
  );
}
