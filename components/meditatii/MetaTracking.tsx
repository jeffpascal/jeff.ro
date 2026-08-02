"use client";

import React, { useEffect, useState } from "react";
import styles from "./meditatii.module.css";

const KEY = "mkt-consent";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function loadPixel(id: string) {
  if (window.fbq) return;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const n: any = (window.fbq = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue.push(args);
  });
  /* eslint-enable @typescript-eslint/no-explicit-any */
  window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  window.fbq("init", id);
  window.fbq("track", "PageView");
}

export function getConsent(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export default function MetaTracking() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const [choice, setChoice] = useState<string | null | "pending">("pending");

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const c = getConsent();
      setChoice(c);
      if (c === "granted" && pixelId) loadPixel(pixelId);
    });
    return () => cancelAnimationFrame(id);
  }, [pixelId]);

  if (!pixelId || choice !== null) return null;

  const decide = (value: "granted" | "denied") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* privat mode etc. — tratăm ca refuz de sesiune */
    }
    setChoice(value);
    if (value === "granted") loadPixel(pixelId);
  };

  return (
    <div className={styles.consentBar} role="dialog" aria-label="Cookie-uri de măsurare">
      <p className={styles.consentText}>
        Folosesc cookie-uri doar ca să măsor dacă reclamele aduc înscrieri —
        nimic altceva. Detalii în{" "}
        <a href="/confidentialitate" target="_blank">politica de confidențialitate</a>.
      </p>
      <div className={styles.consentActions}>
        <button className={styles.btnPrimary} onClick={() => decide("granted")}>
          Accept
        </button>
        <button className={styles.consentDeny} onClick={() => decide("denied")}>
          Refuz
        </button>
      </div>
    </div>
  );
}
