"use client";

import React, { useState } from "react";
import { useLanguage } from "../app/i18n/LanguageContext";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import styles from "./styles/WaitlistForm.module.css";

type Props = { source?: string };

export default function WaitlistForm({ source = "hero" }: Props) {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "loading" || state === "done") return;
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setState("error");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source, lang: language }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className={styles.successBox}>
        <CheckCircle2 size={22} className={styles.successIcon} />
        <span>{t("waitlist.success")}</span>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.inputRow}>
        <input
          type="email"
          className={styles.input}
          placeholder={t("waitlist.placeholder")}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          aria-label={t("waitlist.placeholder")}
          required
        />
        <button type="submit" className={`btn-primary ${styles.button}`} disabled={state === "loading"}>
          {state === "loading" ? (
            <Loader2 size={18} className={styles.spin} />
          ) : (
            <>
              {t("waitlist.cta")}
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
      <p className={state === "error" ? styles.errorNote : styles.note}>
        {state === "error" ? t("waitlist.error") : t("waitlist.note")}
      </p>
    </form>
  );
}
