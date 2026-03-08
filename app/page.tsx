"use client";

import React from "react";
import Hero from "../components/Hero";
import FOMOBanner from "../components/FOMOBanner";
import HowItWorks from "../components/HowItWorks";
import BeforeAfter from "../components/BeforeAfter";
import TargetAudience from "../components/TargetAudience";
import CourseFeatures from "../components/CourseFeatures";
import Curriculum from "../components/Curriculum";
import ValueStack from "../components/ValueStack";
import Authors from "../components/Authors";
import Testimonials from "../components/Testimonials";
import Guarantee from "../components/Guarantee";
import FAQ from "../components/FAQ";
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
      <HowItWorks />
      <BeforeAfter />
      <TargetAudience />
      <CourseFeatures />
      <Curriculum />
      <ValueStack />
      <Authors />
      <Testimonials />
      <Guarantee />
      <FAQ />
      <Footer />
    </main>
  );
}
