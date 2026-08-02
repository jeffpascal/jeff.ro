"use client";

import React, { useState } from "react";
import styles from "./meditatii.module.css";

type Props = {
  sessionSlug: string;
  sessionLabel: string;
};

const AI_EXPERIENCE_OPTIONS: Array<[string, string]> = [
  ["none", "N-am folosit AI deloc"],
  ["chat_only", "Doar ChatGPT, ocazional"],
  ["regular", "Folosesc des, dar simt că sub potențial"],
  ["advanced", "Destul de avansat"],
];

function readUtm() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    source: p.get("utm_source") ?? "",
    medium: p.get("utm_medium") ?? "",
    campaign: p.get("utm_campaign") ?? "",
    content: p.get("utm_content") ?? "",
  };
}

export default function RegisterForm({ sessionSlug, sessionLabel }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [business, setBusiness] = useState("");
  const [outcome, setOutcome] = useState("");
  const [aiExperience, setAiExperience] = useState("chat_only");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "loading" || state === "done") return;

    if (!privacyAccepted) {
      setErrorMsg("Bifează acordul pentru politica de confidențialitate.");
      setState("error");
      return;
    }

    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/inscriere", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          business: business.trim(),
          outcome: outcome.trim(),
          aiExperience,
          privacyAccepted,
          marketingConsent,
          website,
          sessionSlug,
          utm: readUtm(),
          referrer: typeof document !== "undefined" ? document.referrer : "",
          landingPath: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      });
      if (res.ok) {
        setState("done");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data?.error || "Nu am putut trimite. Încearcă din nou.");
        setState("error");
      }
    } catch {
      setErrorMsg("Nu am putut trimite. Verifică conexiunea și încearcă din nou.");
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className={styles.success} role="status">
        <p className={styles.successTitle}>Gata — ți-am păstrat loc.</p>
        <p className={styles.successBody}>
          Ești înscris la sesiunea de {sessionLabel}. Te contactez înainte de
          sesiune cu linkul de participare. Dacă între timp vrei să adaugi
          ceva la ce ai scris, răspunde-mi la emailul de contact.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="reg-name">Numele tău</label>
          <input
            id="reg-name"
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="reg-phone">
            Telefon / WhatsApp
          </label>
          <input
            id="reg-phone"
            className={styles.input}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            placeholder="07xx xxx xxx"
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="reg-business">
            Afacerea și rolul tău
          </label>
          <input
            id="reg-business"
            className={styles.input}
            type="text"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="ex: restaurant în Cluj, sunt proprietar"
          />
        </div>
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.labelQuestion} htmlFor="reg-outcome">
            Dacă sesiunea ar ieși perfect pentru tine, cu ce rezultat concret
            ai pleca?
          </label>
          <textarea
            id="reg-outcome"
            className={styles.textarea}
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder="Scrie liber, așa cum îți vine. De aici pornim."
            maxLength={2000}
            required
          />
        </div>
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.label} htmlFor="reg-exp">
            Cât ai folosit AI până acum?
          </label>
          <select
            id="reg-exp"
            className={styles.select}
            value={aiExperience}
            onChange={(e) => setAiExperience(e.target.value)}
          >
            {AI_EXPERIENCE_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="reg-website">Website</label>
          <input
            id="reg-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <label className={`${styles.checkRow} ${styles.fieldFull}`}>
          <input
            type="checkbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            required
          />
          <span>
            Sunt de acord cu prelucrarea datelor conform{" "}
            <a href="/confidentialitate" target="_blank">politicii de confidențialitate</a>.
          </span>
        </label>
        <label className={`${styles.checkRow} ${styles.fieldFull}`}>
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
          />
          <span>Vreau să aflu și despre sesiunile viitoare, pe email. (opțional)</span>
        </label>

        <div className={styles.fieldFull}>
          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={state === "loading"}
          >
            {state === "loading" ? "Se trimite…" : "Rezervă-mi loc la sesiunea gratuită"}
          </button>
        </div>

        {state === "error" ? (
          <p className={`${styles.formError} ${styles.fieldFull}`} role="alert">
            {errorMsg}
          </p>
        ) : (
          <p className={`${styles.formHint} ${styles.fieldFull}`}>
            Două minute de completat. Cu cât scrii mai concret, cu atât pot
            pregăti sesiunea pe cazurile voastre.
          </p>
        )}
      </div>
    </form>
  );
}
