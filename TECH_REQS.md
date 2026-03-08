# Technical Requirements (TECH_REQS.md)

## 1. Arhitectură și Framework
- **Framework**: Vite + React (sau Next.js dacă e nevoie de SSR în viitor, dar pentru un landing page modern cu i18n dinamic în browser, Vite este foarte rapid).
- **Design System**: Vanilla CSS cu variabile CSS moderne pentru tema Dark Mode. Aspectul trebuie să fie "SaaS-like" – margini rotunjite, gradients subtile, glow effects pe Dark Mode, glassmorphism pentru navbar, fonturi moderne (ex: Inter sau Plus Jakarta Sans).
- **NU** se va folosi TailwindCSS (conform directivelor generale de design pentru flexibilitate maximă și curățenie a codului, bazându-ne pe Vanilla CSS de calitate).

## 2. Internationalizare (i18n)
- **Centralizare**: Se va folosi un fișier de tip "dictionar", ex: `src/i18n/translations.json`, care conține chei pentru toate string-urile din text.
- **Limbi**: Limba implicită este Româna (RO), cu traducere disponibilă în Engleza (EN).
- **Language Switcher**: Componentă de UI clară care permite schimbarea rapidă a limbii (ex. un dropdown cu steag / text în colțul dreapta-sus). Selectarea limbii trebuie să declanșeze o actualizare imediată a UI-ului (fără reload, folosind context din React).
- **Extensibilitate**: Orice limbă nouă adăugată în `translations.json` trebuie să apară automat în lista din Language Switcher.

## 3. UI/UX - Reguli și Estetică
- **Temă**: Dark Mode nativ. Background-uri "deep dark" (ex. `#0B0F19`), elemente tip card (`#1A1F2B`), accente vibrante pentru call-to-action (ex. neon purple/indigo `#6366F1` sau un cyan "AI-vibe").
- **Animații**: Micro-interacțiuni pe butoane, hover states fluide, animații de fade-in la scroll, efecte progresive pentru a ilustra "Inteligența Artificială".
- **Link-uri Externe**: Butoanele de achiziție nu necesită backend propriu – ele vor redirecționa exclusiv către o platformă terță de cursuri. Aceasta este o platformă de tip **Landing Page**, fără un coș de cumpărături propriu.
- **Responsivitate**: Fluiditate totală pentru Mobile, Tablet și Desktop, cu meniu hamburger curat și adaptat pe mobile.
