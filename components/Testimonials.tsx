"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './styles/Testimonials.module.css';

export default function Testimonials() {
  const { t } = useLanguage();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const testimonials = t("testimonials.items") || [];

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px tolerance
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [testimonials]);

  const scrollByAmount = (amount: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.testimonialsSection}>
      <div className="container">
        <h2 className={`${styles.sectionTitle} text-gradient`}>{t("testimonials.title")}</h2>

        <div className={styles.carouselWrapper}>
          {/* Navigation Controls (Visible mainly on larger screens) */}
          {canScrollLeft && (
            <button className={`${styles.navBtn} ${styles.prev}`} onClick={() => scrollByAmount(-350)} aria-label="Previous">
              <ChevronLeft size={24} />
            </button>
          )}

          <div
            className={styles.carouselContainer}
            ref={carouselRef}
            onScroll={checkScroll}
          >
            {testimonials.map((item: any, idx: number) => (
              <div key={idx} className={styles.testimonialCard}>
                <Quote size={32} className={`${styles.quoteIcon} text-accent-cyan`} />
                <p className={styles.testimonialContent}>"{item.content}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatarPlaceholder}>
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className={styles.authorName}>{item.name}</h4>
                    <p className={styles.authorRole}>{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {canScrollRight && testimonials.length > 0 && (
            <button className={`${styles.navBtn} ${styles.next}`} onClick={() => scrollByAmount(350)} aria-label="Next">
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
