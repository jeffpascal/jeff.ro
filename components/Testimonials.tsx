"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../app/i18n/LanguageContext';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

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
        <section className="testimonials-section">
            <div className="container">
                <h2 className="section-title text-gradient">{t("testimonials.title")}</h2>

                <div className="carousel-wrapper">
                    {/* Navigation Controls (Visible mainly on larger screens) */}
                    {canScrollLeft && (
                        <button className="nav-btn prev" onClick={() => scrollByAmount(-350)} aria-label="Previous">
                            <ChevronLeft size={24} />
                        </button>
                    )}

                    <div
                        className="carousel-container"
                        ref={carouselRef}
                        onScroll={checkScroll}
                    >
                        {testimonials.map((item: any, idx: number) => (
                            <div key={idx} className="testimonial-card">
                                <Quote size={32} className="quote-icon text-accent-cyan" />
                                <p className="testimonial-content">"{item.content}"</p>
                                <div className="testimonial-author">
                                    <div className="author-avatar-placeholder">
                                        {item.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="author-name">{item.name}</h4>
                                        <p className="author-role">{item.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {canScrollRight && testimonials.length > 0 && (
                        <button className="nav-btn next" onClick={() => scrollByAmount(350)} aria-label="Next">
                            <ChevronRight size={24} />
                        </button>
                    )}
                </div>
            </div>

            <style jsx>{`
        .testimonials-section {
          padding: 6rem 0;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.01);
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 2.5rem);
          text-align: center;
          margin-bottom: 3rem;
        }

        .carousel-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .carousel-container {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          padding: 1rem 1rem 2rem 1rem;
          margin: 0 -1rem; /* Negative margin to allow shadow bleed */
          /* Hide Scrollbar */
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
          width: 100%;
        }

        .carousel-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }

        .testimonial-card {
          flex: 0 0 calc(100% - 2rem);
          max-width: 400px;
          min-width: 280px;
          scroll-snap-align: center;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: relative;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.4);
        }

        .quote-icon {
          opacity: 0.6;
          margin-bottom: -0.5rem;
        }

        .testimonial-content {
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--text-primary);
          font-style: italic;
          flex-grow: 1;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 1.5rem;
        }

        .author-avatar-placeholder {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--accent-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.25rem;
          color: white;
          flex-shrink: 0;
        }

        .author-name {
          font-size: 1rem;
          font-weight: 700;
          margin: 0 0 0.1rem 0;
        }

        .author-role {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Nav Buttons */
        .nav-btn {
          position: absolute;
          z-index: 10;
          background: rgba(11, 15, 25, 0.8);
          border: 1px solid var(--border-color);
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }

        .nav-btn:hover {
          background: var(--text-primary);
          color: var(--bg-dark);
          transform: scale(1.05);
        }

        .nav-btn.prev {
          left: -1.5rem;
        }

        .nav-btn.next {
          right: -1.5rem;
        }

        /* Desktop specific tweaks */
        @media (min-width: 768px) {
          .testimonial-card {
            flex: 0 0 calc(50% - 1.5rem);
            scroll-snap-align: start;
          }
        }
        
        @media (min-width: 1024px) {
          .testimonial-card {
            flex: 0 0 calc(33.333% - 1.5rem);
          }
        }

        /* Hide buttons on mobile where native touch swipe is better */
        @media (max-width: 767px) {
          .nav-btn {
            display: none;
          }
          .carousel-container {
            gap: 1rem;
          }
        }
      `}</style>
        </section>
    );
}
