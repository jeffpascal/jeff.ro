"use client";

import React, { useEffect, useState } from "react";
import styles from "./meditatii.module.css";

/** Checkout pentru grupa pilot: nume + contact → plată Revolut.
 *  Aceleași convenții ca Booking (honeypot, fallback vizibil pentru redirect). */
export default function GrupaCheckout({ priceLei }: { priceLei: number }) {
  const [left, setLeft] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [payUrl, setPayUrl] = useState("");

  useEffect(() => {
    let alive = true;
    fetch("/api/grupa")
      .then((r) => r.json())
      .then((d) => alive && setLeft(typeof d.left === "number" ? d.left : null))
      .catch(() => alive && setLeft(null));
    return () => {
      alive = false;
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/grupa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), email: email.trim(), phone: phone.trim(), website,
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

  if (left === 0) {
    return (
      <p className={styles.formHint}>
        Locurile din grupa asta s-au ocupat. Scrie-mi la{" "}
        <a href="mailto:jeffpascal96@gmail.com?subject=Lista%20de%20a%C8%99teptare%20grupa">
          jeffpascal96@gmail.com
        </a>{" "}
        și te anunț primul când deschid următoarea grupă.
      </p>
    );
  }

  return (
    <form onSubmit={submit}>
      {typeof left === "number" && left > 0 && (
        <p className={styles.formHint} style={{ marginBottom: "0.8rem" }}>
          {left === 1 ? "A mai rămas 1 loc." : `Au mai rămas ${left} locuri din 5.`}
        </p>
      )}
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="g-name">Numele tău</label>
          <input id="g-name" className={styles.input} value={name}
            onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="g-email">Email</label>
          <input id="g-email" className={styles.input} type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="g-phone">Telefon</label>
          <input id="g-phone" className={styles.input} type="tel" value={phone}
            onChange={(e) => setPhone(e.target.value)} autoComplete="tel"
            placeholder="07xx xxx xxx" required />
        </div>
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="g-website">Website</label>
          <input id="g-website" tabIndex={-1} autoComplete="off"
            value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
      </div>
      <div style={{ marginTop: "1.2rem" }}>
        <button type="submit" className={styles.btnPrimary} disabled={state === "loading"}>
          {state === "loading" ? "Se deschide plata…" : `Rezervă locul — ${priceLei} lei`}
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
          Locul e al tău doar după ce plata trece; dacă grupa nu pornește,
          primești toți banii înapoi.
        </p>
      )}
    </form>
  );
}
