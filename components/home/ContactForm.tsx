"use client";

import { useState } from "react";
import styles from "./home.module.css";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

export default function ContactForm() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState({ kind: "error", message: json.error || "Nu am putut trimite cererea." });
        return;
      }
      setState({ kind: "sent" });
    } catch {
      setState({ kind: "error", message: "Nu am putut trimite cererea. Verifică conexiunea și încearcă din nou." });
    }
  }

  if (state.kind === "sent") {
    return (
      <div className={styles.formDone} role="status">
        <p className={styles.formDoneTitle}>Am primit cererea.</p>
        <p>Mă uit pe magazinul tău și îți răspund pe emailul sau telefonul lăsat.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="c-name">Nume</label>
        <input id="c-name" name="name" autoComplete="name" required />
      </div>
      <div className={styles.field}>
        <label htmlFor="c-contact">Email sau telefon</label>
        <input id="c-contact" name="contact" autoComplete="email" inputMode="email" required />
      </div>
      <div className={styles.field}>
        <label htmlFor="c-site">Site-ul magazinului</label>
        <input id="c-site" name="site" inputMode="url" placeholder="magazinul-tau.ro" />
      </div>
      <div className={styles.field}>
        <label htmlFor="c-message">Ce vrei să rezolvi</label>
        <textarea id="c-message" name="message" rows={4} />
      </div>
      <div className={styles.hp} aria-hidden="true">
        <label htmlFor="c-company">Companie</label>
        <input id="c-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      {state.kind === "error" && (
        <p className={styles.formError} role="alert">
          {state.message}
        </p>
      )}
      <button type="submit" className={styles.btn} disabled={state.kind === "sending"}>
        {state.kind === "sending" ? "Se trimite…" : "Cere auditul gratuit"}
      </button>
      <p className={styles.formNote}>
        Folosesc datele doar ca să-ți răspund. Detalii în{" "}
        <a href="/confidentialitate">politica de confidențialitate</a>.
      </p>
    </form>
  );
}
