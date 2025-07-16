# BrandForge Build Plan (Aligned with PRD v1.1)

## 1. Introduction & Vision
- **Product:** AI Personal Brand Co-pilot
- **Goal:** Help users build an authentic, impactful personal brand by ingesting their professional data, generating a tailored strategy, and providing ongoing content and co-authoring tools.
- **Source of Truth:** All features, flows, and requirements are governed by the Product Requirements Document (PRD) v1.1.

## 2. Core User Flow & Feature Breakdown

### Phase 1: Onboarding & Data Ingestion
- **Landing Page:** Communicate value proposition clearly.
- **Authentication:** LinkedIn SSO (primary), Twitter/Google (alternatives).
- **Consent Screen:** Explicit, clear consent before any data fetching. State what data is fetched and why.
- **Social Account Connection:**
  - Required: LinkedIn (profile, experience, post history)
  - Optional: Twitter (post history, tone), Blog (via URL)
- **Backend Data Ingestion:**
  - Asynchronous jobs fetch data via official APIs.
  - Store raw data in `user_data` table (LinkedIn, Twitter, Blog content).
- **Guided Onboarding for Sparse Data:**
  - If fetched data is insufficient, trigger a conversational flow to collect keywords, tone, and other persona inputs.

### Phase 2: AI Persona & Goal Definition
- **Persona Generation:**
  - Use ingested or manually provided data to generate a structured persona (JSON schema TBD).
- **Goal Capture:**
  - Conversational UI or guided form to capture user's primary branding goal.

### Phase 3: Strategy & Content Calendar Generation
- **AI Strategy Generation:**
  - Generate a multi-platform strategy (posting frequency, content pillars, tone, interaction strategy) as structured JSON (schema TBD).
- **Content Calendar:**
  - Generate a 30-day content plan of daily post topics.
  - Store and display on dashboard.

### Phase 4: Dashboard & Ongoing Engagement
- **Dashboard:**
  - Visual calendar view of content plan.
  - Display strategy and persona.
- **Email Reminders:**
  - Daily emails with next day's topic (cron job).

### Phase 5: Co-Authoring Editor
- **Three-Panel Layout:**
  - Left: Outline
  - Center: Main Editor
  - Right: AI chat/tools
- **Core Features:**
  - Context-aware AI generation via chat
  - "Add to Editor" button
  - In-line AI actions (rephrase, expand, etc.)
  - Specialized generators (hashtags, titles)
  - Premium tools: plagiarism check, tone check, richer drafts
  - "Refine My Strategy" chat to update goals and regenerate strategy/calendar

## 3. Monetization: Free vs. Premium Tiers

### Free Tier
- Full onboarding, data connection, persona/strategy generation
- Full access to strategy and content calendar
- Daily email reminders
- Unlimited high-level idea generation (titles, outlines, brainstorming)
- 3 free credits for full-draft generation (e.g., LinkedIn post, Twitter thread)

### Premium Tier (Subscription)
- Unlimited full-draft generation
- Advanced co-authoring tools (plagiarism check, tone check)
- Richer, more detailed AI drafts
- Stripe/Razorpay integration for payments

## 4. Non-Functional Requirements
- **UI/UX:** Modern, clean, mobile-first, responsive, interactive (spinners, toasts)
- **Performance:** Async data ingestion, optimized dashboard queries
- **Security:**
  - All secrets in environment variables
  - Supabase Row Level Security
- **User Consent:** Explicit consent before data fetching; clear data usage explanation
- **Error Handling:** Graceful API failure handling, user-friendly messages

## 5. Technical Stack & Architecture
- **Frontend:** Next.js (Vercel)
- **Styling:** TailwindCSS
- **Backend/DB:** Supabase (Auth, DB, Storage, Edge Functions)
- **AI/LLM:** OpenAI API (GPT-4, GPT-3.5-Turbo)
- **Social APIs:** LinkedIn API, Twitter API v2
- **Payment:** Stripe or Razorpay
- **Email:** Resend / SendGrid

## 6. Out of Scope for v1.0
- Direct auto-posting to social platforms
- Advanced analytics (post-performance tracking)
- Native mobile apps
- Team/agency accounts

---

**Always refer to the PRD v1.1 for UI/UX, structure, and feature requirements. Prioritize mobile-first, modern, and interactive design in every component.** 