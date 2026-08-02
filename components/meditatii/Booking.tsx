"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./meditatii.module.css";

type Slot = { iso: string; label: string };

const PUBLIC_KEY = process.env.NEXT_PUBLIC_REVOLUT_PUBLIC_KEY;
const MODE = (process.env.NEXT_PUBLIC_REVOLUT_API_MODE === "sandbox"
  ? "sandbox"
  : "prod") as "sandbox" | "prod";

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
  const [walletReady, setWalletReady] = useState(false);
  const walletRef = useRef<HTMLDivElement>(null);
  const revolutPayRef = useRef<HTMLDivElement>(null);

  // Formularul e complet? Portofelele mint comanda la click, deci nu le montăm
  // înainte să avem datele — altfel deschid o fereastră care pică pe server.
  const formReady =
    !!chosen && name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    (phone.match(/\d/g) || []).length >= 8 && topic.trim().length >= 10;

  const fieldsRef = useRef({ name, email, phone, topic, chosen, website });
  fieldsRef.current = { name, email, phone, topic, chosen, website };

  /** Creează rezervarea + comanda Revolut; întoarce publicId pentru SDK. */
  const createOrder = useCallback(async () => {
    const f = fieldsRef.current;
    const res = await fetch("/api/rezervare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim(),
        topic: f.topic.trim(), slotIso: f.chosen, website: f.website,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.publicId) {
      throw new Error(data?.error || "Nu am putut porni plata.");
    }
    return { publicId: data.publicId as string };
  }, []);

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

  // Montăm Apple Pay / Google Pay / Revolut Pay abia când formularul e complet.
  useEffect(() => {
    if (!PUBLIC_KEY || !formReady) {
      setWalletReady(false);
      return;
    }
    let cancelled = false;
    const teardown: Array<() => void> = [];

    (async () => {
      try {
        const { default: RevolutCheckout } = await import("@revolut/checkout");
        const payments = await RevolutCheckout.payments({
          locale: "ro",
          mode: MODE,
          publicToken: PUBLIC_KEY,
        });
        if (cancelled) return;

        const done = () => {
          window.location.href = "/multumesc-rezervare";
        };
        const fail = (msg?: string) => {
          setErrorMsg(msg || "Plata nu a putut fi finalizată.");
          setState("error");
        };

        if (walletRef.current) {
          const inst = payments.paymentRequest(walletRef.current, {
            currency: "RON",
            amount: price * 100,
            createOrder,
            requestShipping: false,
            onSuccess: done,
            onError: (e: Error) => fail(e?.message),
          });
          const method = await inst.canMakePayment();
          if (!cancelled && method) {
            inst.render();
            setWalletReady(true);
            teardown.push(() => inst.destroy?.());
          } else {
            inst.destroy?.();
          }
        }

        if (revolutPayRef.current) {
          payments.revolutPay.mount(revolutPayRef.current, {
            currency: "RON",
            totalAmount: price * 100,
            createOrder,
            buttonStyle: { variant: "dark", size: "large" },
          });
          payments.revolutPay.on("payment", (p: { type: string; error?: { message?: string } }) => {
            if (p.type === "success") done();
            else if (p.type === "error") fail(p.error?.message);
          });
          teardown.push(() => payments.revolutPay.destroy?.());
        }
      } catch (err) {
        console.error("Revolut wallets:", err);
      }
    })();

    return () => {
      cancelled = true;
      for (const fn of teardown) {
        try {
          fn();
        } catch {
          /* SDK poate arunca la demontare */
        }
      }
    };
  }, [formReady, price, createOrder]);

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
        window.location.href = data.checkoutUrl;
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
                  onChange={(e) => setTopic(e.target.value)} maxLength={2000} required
                  placeholder="Cu cât e mai concret, cu atât pregătesc mai bine ora." />
              </div>
              <div className={styles.honeypot} aria-hidden="true">
                <label htmlFor="b-website">Website</label>
                <input id="b-website" tabIndex={-1} autoComplete="off"
                  value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
            </div>

            <div className={styles.wallets} data-ready={formReady ? "1" : "0"}>
              <div ref={walletRef} className={styles.walletSlot} />
              <div ref={revolutPayRef} className={styles.walletSlot} />
            </div>
            {formReady && walletReady && (
              <p className={styles.walletDivider}><span>sau cu cardul</span></p>
            )}

            <div style={{ marginTop: "1.2rem" }}>
              <button type="submit" className={styles.btnPrimary} disabled={state === "loading"}>
                {state === "loading" ? "Se deschide plata…" : `Rezervă și plătește ${price} lei`}
              </button>
            </div>
            {state === "error" ? (
              <p className={styles.formError} style={{ marginTop: "0.8rem" }} role="alert">
                {errorMsg}
              </p>
            ) : (
              <p className={styles.formHint} style={{ marginTop: "0.8rem" }}>
                Plata se face cu cardul, prin Revolut. Ora se blochează pe numele tău
                doar după ce plata trece.
              </p>
            )}
          </>
        )}
      </form>
    </div>
  );
}
