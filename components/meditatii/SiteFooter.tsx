import React from "react";
import styles from "./meditatii.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerInner}>
          <span>© {new Date().getFullYear()} jeff.ro · Meditații AI pentru afaceri</span>
          <nav className={styles.footerLinks}>
            <a href="/confidentialitate">Confidențialitate</a>
            <a href="/ai-commerce">Proiectul anterior: AI Commerce</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
