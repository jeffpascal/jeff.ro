"use client";

import React from "react";
import Hero from "../components/Hero";
import FOMOBanner from "../components/FOMOBanner";
import CourseFeatures from "../components/CourseFeatures";
import Authors from "../components/Authors";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import LanguageSwitcher from "../components/LanguageSwitcher";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.minHScreen}>
      <FOMOBanner />

      <header className="glass-nav">
        <div className={`container ${styles.navInner}`}>
          <div className={styles.logoPlaceholder}>
            <div className={styles.logoDot}></div>
            <span className={styles.fontBold}>AI Mastery</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <Hero />
      <CourseFeatures />
      <Authors />
      <Testimonials />
      <Footer />
    </main>
  );
}
