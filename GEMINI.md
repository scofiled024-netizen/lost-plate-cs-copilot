# Lost Plate Guest Ops Copilot — Context for Gemini

> **Read this file first.** It explains the project so you can suggest updates, improvements, or interview prep advice.

---

## 1. What this project is

**Name:** Lost Plate Guest Ops Copilot v2.1  
**Purpose:** Job-application demo for **Lost Plate Food Tours** Customer Service Specialist role  
**URL (local):** `http://localhost:8080` after `python3 -m http.server 8080`  
**Disclaimer:** Independent demo — not affiliated with Lost Plate

**Business context:** Lost Plate runs small-group food tours in 10+ cities (China, SEA, Portland OR) using **Rezdy** for bookings. CS handles English email/phone/chat, daily guest reminders, guide sync, solo-traveler outreach, and multi-day upsells.

---

## 2. Tech stack (constraints)

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | Static HTML + CSS + ES modules | **No build step**, no React/Next.js |
| AI | OpenRouter (`openai/gpt-4o-mini`) | Optional; key in `sessionStorage` only |
| Weather | Open-Meteo API | Free, no key; mock fallback on failure |
| Data | Local JS modules | No backend, no database |
| Deploy | GitHub Pages / Vercel static | See `FOLLOW_UP_EMAIL.md` deploy section |

**Do not suggest:** Next.js rewrite, Rezdy API integration, database, unless user explicitly asks.

---

## 3. Architecture

```
index.html          → 5 tabs, loads js/app.js
js/app.js           → orchestrator (init only)
js/utils.js         → DOM helpers, fillTemplate, API key sessionStorage
js/data.js          → INQUIRY_TYPES, TOURS, CITIES, MOCK_BOOKINGS (11 inquiry types)
js/openrouter.js    → chatCompletion() to OpenRouter
js/i18n.js           → UI strings EN/中 (guest drafts stay English)
js/email-reply.js   → Idea 1: paste email, stitchTemplates(), loadUpsellContext()
js/reminders.js     → Idea 2: batch tomorrow reminders
js/reminder-data.js → TOMORROW_BOOKINGS mock sheet
js/weather.js       → Open-Meteo + MOCK_WEATHER fallback
js/guide-comms.js   → Idea 3: WeChat/WhatsApp/Rezdy formatting
js/guide-data.js    → GUIDES roster per city
js/ops-board.js     → Mutable queue: Mark Done, Draft Upsell, live stats
css/styles.css      → Lost Plate red/cream branding
```

### Tab → module mapping

| Tab | Module | User flow |
|-----|--------|-----------|
| Email Reply | `email-reply.js` | Paste guest email → auto-detect intents (keywords) → Generate → OpenRouter or template merge |
| Daily Reminders | `reminders.js` | Mock table → Generate all → weather line per city |
| Guide Comms | `guide-comms.js` | Select city/guide → English update → copy WeChat/WhatsApp/Rezdy |
| Ops Board | `ops-board.js` | Interactive queue: Mark Done decrements stats; Draft Upsell → Email Reply tab |
| First 30 Days | `index.html` | Static process memo |

### AI fallback chain

```
User clicks Generate
  → if OpenRouter key in sessionStorage → chatCompletion()
  → on failure or no key → fillTemplate() from INQUIRY_TYPES in data.js
  → never blank output
```

---

## 4. Key data structures (`js/data.js`)

- **INQUIRY_TYPES** — `{ id, label, template, checklist }` with `{{guestName}}`, `{{tourName}}`, etc.
- **TOURS** — `{ id, city, name, schedule: "evening"|"morning"|"full-day" }`
- **MOCK_BOOKINGS** — 8 rows for ops board (solo-alert, sold-out, waitlist flags)
- **Cutoff rules:** evening tours 2–6 hr Rezdy cutoff; morning/full-day 24 hr

---

## 5. What's done vs not done

| Done (v2.1) | Not done (user action) |
|-------------|------------------------|
| 5-tab UI + Eng/中 toggle | Deploy to public URL (`vercel login` then `npx vercel`) |
| `stitchTemplates()` — no `---` dividers | Record 90s Loom (script in `FOLLOW_UP_EMAIL.md`) |
| Actionable Ops Board (Mark Done, Draft Upsell) | Send follow-up email with live link |
| `loadUpsellContext()` cross-tab upsell | Gift card inquiry type |
| OpenRouter optional AI | Chinese guide message translation |
| Batch reminders + weather | Serverless OpenRouter proxy |
| Guide WeChat/WhatsApp formats | |

---

## 6. Known limitations (good improvement targets)

1. Intent detection is keyword-only (no NLP beyond OpenRouter generation step)
2. Entity extraction is regex-based (names, dates, party size)
3. ~~Multi-intent replies joined with `---` in template mode~~ — fixed in v2.1 via `stitchTemplates()`
4. API key exposed client-side (demo only — production needs serverless proxy)
5. Ops board queue is in-memory (resets on refresh), not linked to reminder sheet
6. No mobile-specific polish beyond responsive CSS grid

---

## 7. How to run & test

```bash
cd ~/lost-plate-cs-copilot
python3 -m http.server 8080
# Open http://localhost:8080 (file:// will NOT work — ES modules)
```

Paste OpenRouter key via header button → session only.

---

## 8. Prompt template for asking Gemini for advice

Copy this into Gemini along with `GEMINI_FULL_CONTEXT.md` (generate via `./scripts/export-for-gemini.sh`):

```
I'm building a job-application demo for Lost Plate Food Tours CS role.
Read GEMINI.md and the bundled source.

Please suggest:
1. [3-5 highest-impact UI/UX improvements for recruiters]
2. [Features that would better match their job description]
3. [What to cut to keep scope tight]
4. [Interview talking points for a 90s demo walkthrough]

Constraints: stay static HTML/JS, no build step, optional OpenRouter only.
```

---

## 9. Job description alignment (for advice context)

Lost Plate CS Specialist typically:
- Answers English email/phone/chat
- Sends **daily email reminders** for all guests
- Manages tour inventory + **guide communications** across China/SEA
- Creates **response templates**, standardizes processes
- Uses **AI tools** efficiently, suggests process improvements
- Proactive multi-day trip follow-ups, solo traveler handling

---

## 10. Related docs in repo

| File | Content |
|------|---------|
| `README.md` | Quick start |
| `FOLLOW_UP_EMAIL.md` | Email + Loom script |
| `PLAN-B.md` | Why static vs Next.js |
| `GEMINI_FULL_CONTEXT.md` | Auto-generated: all source inlined (run export script) |
