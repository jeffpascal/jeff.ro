"use client";

import React from "react";
import Hero from "../components/Hero";
import FOMOBanner from "../components/FOMOBanner";
import PainPoints from "../components/PainPoints";
import HowItWorks from "../components/HowItWorks";
import TranslationSlider from "../components/TranslationSlider";
import AIStudio from "../components/AIStudio";
import SocialProofOrders from "../components/SocialProofOrders";
import CourseFeatures from "../components/CourseFeatures";
import Curriculum from "../components/Curriculum";
import BeforeAfter from "../components/BeforeAfter";
import Tiers from "../components/Tiers";
import TargetAudience from "../components/TargetAudience";
import Authors from "../components/Authors";
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
            <span className={styles.fontBold}>AI Commerce</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <Hero />
      <PainPoints />
      <HowItWorks />
      <TranslationSlider />
      <AIStudio />
      <SocialProofOrders />
      <CourseFeatures />
      <Curriculum />
      <BeforeAfter />
      <Tiers />
      <TargetAudience />
      <Authors />
      <FAQ />
      <Footer />
    </main>
  );
}
