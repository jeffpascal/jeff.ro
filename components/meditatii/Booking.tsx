"use client";

import React, { useEffect, useState } from "react";
import styles from "./meditatii.module.css";

type Slot = { iso: string; label: string };

export default function Booking() {
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [price, setPrice] = useState(480);
  const [chosen, setChosen] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  // Fallback vizibil: pe unele mobile redirectul nu pornește (văzut live pe iOS
  // Safari) — păstrăm linkul de checkout ca ancoră pe care userul poate apăsa.
  const [payUrl, setPayUrl] = useState("");

  useEffect(() => {
    let alive = true;
    fetch("/api/sloturi")
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        setSlots(d.slots ?? []);
        if (d.priceLei) setPrice(d.priceLei);
        if (d.slots?.length === 1) setChosen(d.slots[0].iso);
      })
      .catch(() => alive && setSlots([]));
    return () => {
      alive = false;
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "loading") return;
    if (!chosen) {
      setErrorMsg("Alege un interval.");
      setState("error");
      return;
    }
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/rezervare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), email: email.trim(), phone: phone.trim(),
          topic: topic.trim(), slotIso: chosen, website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.checkoutUrl) {
        setPayUrl(data.checkoutUrl);
        window.location.assign(data.checkoutUrl);
        return;
      }
      setErrorMsg(data?.error || "Nu am putut porni plata. Încearcă din nou.");
      setState("error");
    } catch {
      setErrorMsg("Verifică conexiunea și încearcă din nou.");
      setState("error");
    }
  };

  return (
    <div className={styles.bookingCard}>
      <div className={styles.bookingHead}>
        <div>
          <p className={styles.bookingTitle}>Sesiune 1 la 1</p>
          <p className={styles.bookingMeta}>60 de minute · online · doar noi doi</p>
        </div>
        <p className={styles.bookingPrice}>
          {price} <span>lei</span>
        </p>
      </div>

      <form onSubmit={submit}>
        <p className={styles.label} style={{ marginBottom: "0.6rem" }}>
          Alege intervalul
        </p>
        {slots === null && <p className={styles.formHint}>Se încarcă intervalele…</p>}
        {slots?.length === 0 && (
          <p className={styles.formHint}>
            Nu mai e niciun interval liber săptămâna asta. Revino peste câteva zile
            sau scrie-mi prin formularul de înscriere.
          </p>
        )}
        {slots && slots.length > 0 && (
          <div className={styles.slotGrid}>
            {slots.map((s) => (
              <button
                type="button"
                key={s.iso}
                className={`${styles.slot} ${chosen === s.iso ? styles.slotOn : ""}`}
                onClick={() => {
                  setChosen(s.iso);
                  if (state === "error") setState("idle");
                }}
                aria-pressed={chosen === s.iso}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {slots && slots.length > 0 && (
          <>
            <div className={styles.formGrid} style={{ marginTop: "1.4rem" }}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="b-name">Numele tău</label>
                <input id="b-name" className={styles.input} value={name}
                  onChange={(e) => setName(e.target.value)} autoComplete="name" required />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="b-email">Email</label>
                <input id="b-email" className={styles.input} type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="b-phone">Telefon</label>
                <input id="b-phone" className={styles.input} type="tel" value={phone}
                  onChange={(e) => setPhone(e.target.value)} autoComplete="tel"
                  placeholder="07xx xxx xxx" required />
              </div>
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.label} htmlFor="b-topic">
                  Ce vrei să rezolvăm în ora asta?
                </label>
                <textarea id="b-topic" className={styles.textarea} value={topic}
                  onChange={(e) => setTopic(e.target.value)} required rows={5}
                  placeholder="Scrie cât ai nevoie. Cu cât e mai concret, cu atât pregătesc mai bine ora." />
              </div>
              <div className={styles.honeypot} aria-hidden="true">
                <label htmlFor="b-website">Website</label>
                <input id="b-website" tabIndex={-1} autoComplete="off"
                  value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
            </div>

            <div style={{ marginTop: "1.2rem" }}>
              <button type="submit" className={styles.btnPrimary} disabled={state === "loading"}>
                {state === "loading" ? "Se deschide plata…" : `Rezervă și plătește ${price} lei`}
              </button>
            </div>
            {payUrl && (
              <p className={styles.formHint} style={{ marginTop: "0.8rem" }} role="alert">
                Nu s-a deschis pagina de plată?{" "}
                <a href={payUrl}>Apasă aici ca să o deschizi →</a>
              </p>
            )}
            {state === "error" ? (
              <p className={styles.formError} style={{ marginTop: "0.8rem" }} role="alert">
                {errorMsg}
              </p>
            ) : (
              <p className={styles.formHint} style={{ marginTop: "0.8rem" }}>
                Te duc la pagina securizată Revolut: card, Apple Pay sau Google Pay.
                Ora se blochează pe numele tău doar după ce plata trece.
              </p>
            )}
          </>
        )}
      </form>
    </div>
  );
}
