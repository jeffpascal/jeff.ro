"use client";

import React, { useState } from "react";
import { useLanguage } from "../app/i18n/LanguageContext";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import styles from "./styles/WaitlistForm.module.css";

type Props = { source?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Loose international phone check: at least 8 digits, allows + ( ) - and spaces.
const PHONE_RE = /^[+]?[\d().\s-]{8,}$/;

export default function WaitlistForm({ source = "hero" }: Props) {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [store, setStore] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "loading" || state === "done") return;
    const emailValue = email.trim();
    const phoneValue = phone.trim();
    const digits = (phoneValue.match(/\d/g) || []).length;
    if (!EMAIL_RE.test(emailValue) || !PHONE_RE.test(phoneValue) || digits < 8) {
      setState("error");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailValue,
          phone: phoneValue,
          store: store.trim(),
          source,
          lang: language,
        }),
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

  const clearError = () => {
    if (state === "error") setState("idle");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.fields}>
        <input
          type="email"
          className={styles.input}
          placeholder={t("waitlist.placeholder")}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError();
          }}
          aria-label={t("waitlist.placeholder")}
          autoComplete="email"
          required
        />
        <input
          type="tel"
          className={styles.input}
          placeholder={t("waitlist.phonePlaceholder")}
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            clearError();
          }}
          aria-label={t("waitlist.phonePlaceholder")}
          autoComplete="tel"
          required
        />
        <textarea
          className={styles.textarea}
          placeholder={t("waitlist.storePlaceholder")}
          value={store}
          onChange={(e) => setStore(e.target.value)}
          aria-label={t("waitlist.storePlaceholder")}
          rows={2}
          maxLength={1000}
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
