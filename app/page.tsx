"use client";

import React from "react";
import Hero from "../components/Hero";
import FOMOBanner from "../components/FOMOBanner";
import CourseFeatures from "../components/CourseFeatures";
import Authors from "../components/Authors";
import Footer from "../components/Footer";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Home() {
  return (
    <main className="min-h-screen">
      <FOMOBanner />

      <header className="glass-nav">
        <div className="container nav-inner">
          <div className="logo-placeholder">
            <div className="logo-dot"></div>
            <span className="font-bold">AI Mastery</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <Hero />
      <CourseFeatures />
      <Authors />
      <Footer />

      <style jsx>{`
        .min-h-screen {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1rem;
          padding-bottom: 1rem;
        }

        .logo-placeholder {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: -0.02em;
        }

        .logo-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--accent-cyan);
          box-shadow: 0 0 10px var(--accent-cyan);
        }
        
        .font-bold {
          font-weight: 700;
        }
      `}</style>
    </main>
  );
}
