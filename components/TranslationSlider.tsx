"use client";

import React, { useCallback, useRef, useState } from "react";
import { useLanguage } from "../app/i18n/LanguageContext";
import { MoveHorizontal } from "lucide-react";
import styles from "./styles/TranslationSlider.module.css";

export default function TranslationSlider() {
  const { t } = useLanguage();
  const [pos, setPos] = useState(50); // percent of RO (left) revealed
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <section className={styles.section} id="translation">
      <div className="container">
        <h2 className={`${styles.title} text-gradient`}>{t("translation.title")}</h2>
        <p className={styles.subtitle}>{t("translation.subtitle")}</p>

        <div ref={containerRef} className={styles.slider}>
          {/* Base layer: EN (shown on the right) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/translation-demo/en.jpg" alt="Product image — English" className={styles.image} draggable={false} />

          {/* Overlay: RO (shown on the left), clipped to `pos` */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/translation-demo/ro.jpg"
            alt="Imagine produs — română"
            className={styles.overlay}
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            draggable={false}
          />

          <span className={`${styles.tag} ${styles.tagLeft}`}>{t("translation.leftLabel")}</span>
          <span className={`${styles.tag} ${styles.tagRight}`}>{t("translation.rightLabel")}</span>

          {/* Divider + drag handle */}
          <div
            className={styles.divider}
            style={{ left: `${pos}%` }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            role="slider"
            aria-label={t("translation.title")}
            aria-valuenow={Math.round(pos)}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
              if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
            }}
          >
            <div className={styles.handle}>
              <MoveHorizontal size={20} />
            </div>
          </div>
        </div>

        <p className={styles.note}>{t("translation.note")}</p>
      </div>
    </section>
  );
}
