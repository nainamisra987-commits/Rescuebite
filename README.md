# 🍃 RescueBite — Surplus Food Rescue Platform

> Connecting food donors (wedding caterers, restaurants, hostel messes, and canteens) with nearby NGOs and volunteers so surplus food can be safely collected and delivered before it spoils.

---

## 📌 Project Overview

Urban centers produce immense amounts of high-quality prepared food daily from wedding banquets, student hostel messes, and corporate cafeterias. At the same time, nearby night shelters and community homes face persistent food shortages. 

Standard recovery networks often fail because **cooked food has a strict 3-to-4-hour safety window**. Without rapid, local logistics, safe food is discarded.

**RescueBite** solves this problem by:
1. **AI Vision Food Intake**: Donors upload a photo or tap camera capture; the vision model automatically classifies dishes, estimates portions, and auto-fills the listing.
2. **Saved Donor Profiles & 1-Click Repeat**: Store organization and location preferences in browser storage (`localStorage`) and reload past donation templates in one click.
3. **Auto-Calculated Safe Deadlines**: Select preparation time with quick buttons (`Just now`, `1 hr ago`, etc.) and automatically derive FSSAI-compliant pickup deadlines based on food category.
4. **Heuristic NGO Matching Engine**: Automatically ranking nearby NGOs based on distance, pickup ETA, available capacity, and urgent transit capabilities.
5. **End-to-End Chain of Custody Tracker**: A 4-stage tracking pipeline (`Posted` → `Claimed` → `Picked Up` → `Delivered`) to ensure transparency and accountability.

---

## 💻 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a custom sustainability palette (warm white, deep forest, and emerald green)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Server Route**: `/api/analyze-food` with AI vision model integration (`GEMINI_API_KEY` / `VISION_API_KEY`) and robust offline fallback

---

## 🚀 Setup Guide

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) installed on your system:
```bash
node -v
npm -v
```

### 2. Install Dependencies
```bash
npm install
```

### 3. (Optional) Vision API Key Configuration
Add your Google Gemini API key to `.env.local` if you wish to use live cloud vision:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Note**: If no API key is set or network is offline, `/api/analyze-food` gracefully returns contextual mock analysis so your demonstration never breaks.

### 4. Start the Local Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 📂 Project Structure & Key Files Explained

```
RESCUEBITE/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze-food/
│   │   │       └── route.ts   # Server-side vision API route with fallback
│   │   ├── layout.tsx         # Root HTML layout, Geist fonts, and meta tags
│   │   ├── globals.css        # Sustainability color tokens & custom styling
│   │   └── page.tsx           # Main application page connecting state & modules
│   ├── components/
│   │   ├── Navbar.tsx         # Navigation header with live status
│   │   ├── HeroSection.tsx    # Value proposition, problem summary, and key CTAs
│   │   ├── StatsDashboard.tsx # Platform statistics (kg rescued, meals served, CO2 offset)
│   │   ├── DonationListings.tsx# Filterable & searchable surplus food marketplace with photo previews
│   │   ├── DonationForm.tsx   # Intake form: Photo upload, AI suggestions, profile & quick buttons
│   │   ├── NgoRecommendations.tsx # Top 3 heuristic NGO matches with rationale
│   │   ├── StatusTracker.tsx  # 4-stage interactive lifecycle stepper
│   │   ├── HowItWorks.tsx     # 4-step protocol & FSSAI safety guidelines
│   │   └── Footer.tsx         # Resource links and platform mission
│   ├── data/
│   │   └── mockData.ts        # Sample listings & heuristic matching algorithm
│   └── types/
│       └── index.ts           # Clean TypeScript interfaces (Donations, NGOs, Profiles, Metrics)
├── public/                    # Static assets & icons
├── package.json               # Project dependencies and script commands
└── tsconfig.json              # TypeScript compiler configuration
```
