# Lost Plate Guest Ops Copilot — Full Source Bundle

Generated: 2026-06-23T08:16:47Z

Read `GEMINI.md` first for architecture and constraints.

---

## File: `GEMINI.md`

```text
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

```

---

## File: `README.md`

```text
# Lost Plate Guest Ops Copilot v2.1

Unified CS demo: email replies, daily reminders, guide comms, interactive ops board, Eng/中 UI.

## Run locally

```bash
cd ~/lost-plate-cs-copilot
python3 -m http.server 8080
```

Open http://localhost:8080 (required — ES modules do not work via `file://`).

## v2.1 polish

- **Template stitching** — multi-intent replies merge into one natural email (no `---` blocks)
- **Ops Board** — Mark Done removes rows and updates stats; Draft Upsell jumps to Email Reply with multi-day intent
- **Eng / 中** — header toggle translates UI chrome; guest reply drafts stay English
- **Loom script** — Hospitality First + Failsafe walkthrough in `FOLLOW_UP_EMAIL.md`

## Tabs

1. **Email Reply** — paste guest email, auto-detect intents, generate warm reply (OpenRouter optional)
2. **Daily Reminders** — mock tomorrow's bookings + weather → batch reminder drafts
3. **Guide Comms** — format updates for WeChat / WhatsApp / Rezdy notes
4. **Ops Board** — interactive priority queue with Mark Done and Draft Upsell
5. **First 30 Days** — process improvement memo

## OpenRouter (optional)

Click **OpenRouter API key** in the header, paste your key (`sk-or-v1-…`). Stored in `sessionStorage` only — never committed to git.

Without a key, stitched templates work for all features.

## Deploy (public URL)

```bash
cd ~/lost-plate-cs-copilot
npx vercel login    # once
npx vercel --yes    # prints https://….vercel.app
```

Or push to GitHub and enable **Pages** → source: main branch, root `/`.

Replace `[YOUR-LINK-HERE]` in `FOLLOW_UP_EMAIL.md` with the live URL before sending.

## Ask Gemini for advice

1. Read **`GEMINI.md`** — architecture, constraints, prompt template
2. Run `./scripts/export-for-gemini.sh` — creates **`GEMINI_FULL_CONTEXT.md`**
3. Upload both files to [Gemini](https://gemini.google.com)

Static — no build step.

```

---

## File: `FOLLOW_UP_EMAIL.md`

```text
# Follow-up email — v2.1

**Subject:** Guest Ops Copilot demo — Lost Plate CS application

Hi [Name],

I applied for the Customer Service Specialist role and built a **Guest Ops Copilot** based on your actual workflow:

**Demo:** [YOUR-LINK-HERE]

It covers email replies (paste guest email → auto-detect intents → warm English draft), batch daily reminders with weather, guide WeChat/WhatsApp formatting, and an interactive ops board with one-click upsell follow-ups.

Happy to walk through it in 5 minutes. Either way, I'm excited about the role.

Best,
[Your name]

---

## 90s Loom — Hospitality First + Failsafe

### Part A: Failsafe (start WITHOUT API key)

| Time | Action | Say |
|------|--------|-----|
| 0:00 | Open Email Reply tab, no key | "CS isn't about typing faster — it's about treating guests like royalty" |
| 0:10 | Sarah sample email loaded, intents auto-checked | "Paste a real guest email — solo, dietary, and last-minute cutoff detected automatically" |
| 0:20 | Click **Generate Reply** (templates only) | "If OpenRouter is down, the team keeps working — templates stitch into one natural email, not robotic blocks" |
| 0:30 | Show single greeting + one sign-off | "One cohesive reply, ready for human review" |

### Part B: AI layer (paste key)

| Time | Action | Say |
|------|--------|-----|
| 0:35 | Paste OpenRouter key in header | "And to elevate the tone, we can inject AI — optional layer, not a dependency" |
| 0:40 | Generate again | "Same facts, warmer voice — but humans always review before send" |

### Part C: Rest of workflow

| Time | Action | Say |
|------|--------|-----|
| 0:50 | Daily Reminders → Generate all | "Batch reminders with weather — mechanical work automated, time for VIP problems" |
| 1:05 | Guide Comms → copy WeChat | "Guide updates formatted in seconds across cities" |
| 1:15 | Ops Board → **Mark Done** on one row | "Interactive queue — clear priorities, satisfying workflow" |
| 1:20 | Click **Draft Upsell** on Anna | "One click jumps to multi-day upsell draft — revenue with zero friction" |
| 1:28 | Flash 中 language toggle (optional) | "UI also available in Chinese for internal review" |
| 1:30 | Close | "AI assists, CS leads — hospitality first" |

---

## Deploy

```bash
cd ~/lost-plate-cs-copilot
python3 -m http.server 8080   # local
# OR: push to GitHub → enable Pages
# OR: npx vercel --yes
```

## OpenRouter key

Paste in demo header (session only). Never commit to git.

```

---

## File: `PLAN-B.md`

```text
# Plan B: Lost Plate Guest Ops Copilot (Static Demo)

## Why Plan A failed

| Blocker | Evidence |
|---------|----------|
| MCP `move_agent_to_root` hangs | Tool interrupted after ~163s |
| `create-next-app` too heavy | Never completed; partial `.git` only |
| Status-check loop | Agent kept running `ls` instead of writing files |
| Sandbox log writes | Debug log path blocked in sandbox |

## New approach (same demo value, simpler delivery)

| Layer | Plan A | Plan B |
|-------|--------|--------|
| Framework | Next.js 14 | **Static HTML + CSS + JS** |
| AI replies | OpenAI API | **Template engine + 3 pre-written examples** |
| Deploy | Vercel | **Open `index.html` locally OR `npx serve` OR GitHub Pages** |
| Data | TypeScript libs | **`js/data.js`** |
| Build step | Required | **None** |

## What stays the same

- 3 panels: Inquiry Hub, Daily Ops Board, First 30 Days memo
- 10 inquiry types from Lost Plate FAQ
- Real tour/city names from lostplate.com
- Mock bookings with solo alerts, reminders, guide notes
- Warm food-travel branding + disclaimer

## Files

```
lost-plate-cs-copilot/
├── index.html
├── css/styles.css
├── js/data.js
├── js/app.js
└── README.md
```

## Present to Lost Plate

1. Host on GitHub Pages or Vercel (static) — drag-and-drop works
2. Record 90s Loom walking through one inquiry + ops board
3. Send follow-up email with link

```

---

## File: `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lost Plate Guest Ops Copilot v2.1</title>
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <header>
    <div class="header-top">
      <div id="lang-switch" class="lang-switch">
        <button type="button" data-lang="en" class="active">EN</button>
        <button type="button" data-lang="zh">中</button>
      </div>
    </div>
    <h1 data-i18n="title">Lost Plate Guest Ops Copilot</h1>
    <p data-i18n="subtitle">Email replies · daily reminders · guide comms · ops board</p>
    <p class="disclaimer" data-i18n="disclaimer">Demo built independently — not affiliated with Lost Plate Food Tours</p>
    <div class="api-key-bar">
      <button type="button" id="api-key-toggle" class="btn btn-secondary btn-sm" data-i18n="api_key_toggle">OpenRouter API key (session only)</button>
      <div id="api-key-panel" class="hidden">
        <input id="api-key" type="password" data-i18n-placeholder="api_key_ph" placeholder="sk-or-v1-…" autocomplete="off" />
        <p class="hint" data-i18n="api_key_hint">Key stays in this browser tab only.</p>
      </div>
    </div>
  </header>

  <nav class="tabs">
    <button class="active" data-panel="panel-email" data-i18n="tab_email">Email Reply</button>
    <button data-panel="panel-reminders" data-i18n="tab_reminders">Daily Reminders</button>
    <button data-panel="panel-guide" data-i18n="tab_guide">Guide Comms</button>
    <button data-panel="panel-ops" data-i18n="tab_ops">Ops Board</button>
    <button data-panel="panel-memo" data-i18n="tab_memo">First 30 Days</button>
  </nav>

  <main>
    <section id="panel-email" class="panel active">
      <div class="grid-3">
        <div class="card">
          <h2><span data-i18n="email_guest_title">Guest email</span> <span class="ai-badge" data-i18n="badge_paste">paste</span></h2>
          <textarea id="guest-email" class="tall" data-i18n-placeholder="guest_email_ph" placeholder="Paste the guest's English email here…"></textarea>
        </div>
        <div class="card">
          <h2><span data-i18n="email_intents_title">Intents</span> <span class="ai-badge" data-i18n="badge_autodetect">auto-detect</span></h2>
          <div id="intent-list" class="intent-list"></div>
          <button type="button" id="email-generate-btn" class="btn btn-primary" data-i18n="btn_generate_reply">Generate Reply</button>
          <p id="email-status" class="status-line"></p>
        </div>
        <div class="card">
          <h2 data-i18n="email_draft_title">Reply draft</h2>
          <div id="email-draft-output" class="draft-output"></div>
          <button type="button" id="email-copy-btn" class="btn btn-secondary" data-i18n="btn_copy">Copy to clipboard</button>
          <h3 class="subhead" data-i18n="checklist_title">Human edit checklist</h3>
          <ul id="email-checklist" class="checklist"></ul>
        </div>
      </div>
    </section>

    <section id="panel-reminders" class="panel">
      <div class="card">
        <h2><span data-i18n="reminders_title">Tomorrow's tours</span> <span class="ai-badge" data-i18n="badge_mock">mock sheet</span></h2>
        <p class="hint" data-i18n="reminders_hint">Production: Rezdy export or Google Sheet.</p>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th data-i18n="th_guest">Guest</th>
                <th data-i18n="th_tour">Tour</th>
                <th data-i18n="th_city">City</th>
                <th data-i18n="th_time">Time</th>
                <th data-i18n="th_dietary">Dietary</th>
                <th data-i18n="th_guide">Guide</th>
              </tr>
            </thead>
            <tbody id="reminder-table-body"></tbody>
          </table>
        </div>
        <button type="button" id="reminder-generate-btn" class="btn btn-primary" data-i18n="btn_generate_reminders">Generate all reminders</button>
        <p id="reminder-status" class="status-line"></p>
      </div>
      <div id="reminder-drafts"></div>
    </section>

    <section id="panel-guide" class="panel">
      <div class="grid-2">
        <div class="card">
          <h2 data-i18n="guide_update_title">Guide update</h2>
          <label for="guide-city" data-i18n="label_city">City</label>
          <select id="guide-city"></select>
          <label for="guide-name" data-i18n="label_guide">Guide</label>
          <select id="guide-name"></select>
          <label for="guide-tour-time" data-i18n="label_tour_time">Tour time</label>
          <input id="guide-tour-time" type="text" value="7:00 PM" />
          <label for="guide-update" data-i18n="label_english_update">English update</label>
          <textarea id="guide-update" class="tall"></textarea>
          <button type="button" id="guide-generate-btn" class="btn btn-primary" data-i18n="btn_refresh_formats">Refresh formats</button>
        </div>
        <div class="card">
          <h2><span data-i18n="guide_wechat">WeChat</span> <button type="button" id="guide-copy-wechat" class="btn btn-secondary btn-sm" data-i18n="btn_copy">Copy</button></h2>
          <pre id="guide-wechat-output" class="draft-output"></pre>
          <h2 class="subhead"><span data-i18n="guide_whatsapp">WhatsApp</span> <button type="button" id="guide-copy-whatsapp" class="btn btn-secondary btn-sm" data-i18n="btn_copy">Copy</button></h2>
          <pre id="guide-whatsapp-output" class="draft-output"></pre>
          <h2 class="subhead"><span data-i18n="guide_rezdy">Rezdy note</span> <button type="button" id="guide-copy-rezdy" class="btn btn-secondary btn-sm" data-i18n="btn_copy">Copy</button></h2>
          <pre id="guide-rezdy-output" class="draft-output short"></pre>
        </div>
      </div>
    </section>

    <section id="panel-ops" class="panel">
      <div class="ops-summary">
        <div class="stat"><div class="num" id="stat-tours">0</div><div class="lbl" data-i18n="stat_tours">Tours today</div></div>
        <div class="stat"><div class="num" id="stat-reminders">0</div><div class="lbl" data-i18n="stat_reminders">Reminders</div></div>
        <div class="stat"><div class="num" id="stat-solo">0</div><div class="lbl" data-i18n="stat_solo">Solo alerts</div></div>
        <div class="stat"><div class="num" id="stat-followups">0</div><div class="lbl" data-i18n="stat_followups">Follow-ups</div></div>
      </div>
      <div class="card">
        <h2 data-i18n="ops_title">Today's priorities</h2>
        <div id="bookings-list"></div>
      </div>
    </section>

    <section id="panel-memo" class="panel">
      <div class="card">
        <h2 data-i18n="memo_title">First 30 Days — Process improvements</h2>
        <div class="memo-section">
          <h3 data-i18n="memo_h1">1. Template library + AI reply assistant</h3>
          <p data-i18n="memo_p1">Email Reply tab indexes templates by intent.</p>
        </div>
        <div class="memo-section">
          <h3 data-i18n="memo_h2">2. Daily 9am ops checklist</h3>
          <ul>
            <li data-i18n="memo_li1">Batch tomorrow's reminders</li>
            <li data-i18n="memo_li2">Flag solo-traveler bookings</li>
            <li data-i18n="memo_li3">Sync guide notes</li>
            <li data-i18n="memo_li4">Clear follow-up queue</li>
          </ul>
        </div>
        <div class="memo-section">
          <h3 data-i18n="memo_h3">3. Multi-day upsell trigger</h3>
          <p data-i18n="memo_p3">Auto-suggest multi-day trips after city tour booking.</p>
        </div>
      </div>
    </section>
  </main>

  <div id="toast" class="toast"></div>
  <script type="module" src="js/app.js"></script>
</body>
</html>

```

---

## File: `css/styles.css`

```css
:root {
  --lp-red: #c0392b;
  --lp-red-dark: #96281b;
  --lp-cream: #faf6f0;
  --lp-warm: #f5ebe0;
  --lp-brown: #5c4033;
  --lp-text: #2c2420;
  --lp-muted: #7a6b63;
  --lp-border: #e8ddd4;
  --lp-warn: #e67e22;
  --shadow: 0 2px 12px rgba(92, 64, 51, 0.08);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  background: var(--lp-cream);
  color: var(--lp-text);
  line-height: 1.55;
}

header {
  background: linear-gradient(135deg, var(--lp-red) 0%, var(--lp-red-dark) 100%);
  color: white;
  padding: 2rem 1.5rem;
  text-align: center;
}

header h1 { font-size: 1.75rem; font-weight: 700; }
header p { opacity: 0.92; margin-top: 0.35rem; font-size: 0.95rem; }
.disclaimer { font-size: 0.75rem; opacity: 0.75; margin-top: 0.75rem; font-style: italic; }

nav.tabs {
  display: flex; justify-content: center; gap: 0.5rem;
  padding: 1rem 1rem 0; background: var(--lp-warm);
  border-bottom: 1px solid var(--lp-border); flex-wrap: wrap;
}

nav.tabs button {
  background: transparent; border: none; padding: 0.65rem 1.25rem;
  font-size: 0.9rem; font-weight: 600; color: var(--lp-muted);
  cursor: pointer; border-radius: 8px 8px 0 0;
}

nav.tabs button.active { background: white; color: var(--lp-red); box-shadow: var(--shadow); }

main { max-width: 1200px; margin: 0 auto; padding: 1.5rem; }
.panel { display: none; }
.panel.active { display: block; }

.card {
  background: white; border-radius: 12px; padding: 1.5rem;
  box-shadow: var(--shadow); border: 1px solid var(--lp-border); margin-bottom: 1.25rem;
}

.card h2 {
  font-size: 1.15rem; color: var(--lp-brown); margin-bottom: 1rem;
  padding-bottom: 0.5rem; border-bottom: 2px solid var(--lp-warm);
}

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
@media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } }

label {
  display: block; font-size: 0.8rem; font-weight: 600;
  color: var(--lp-muted); margin-bottom: 0.35rem; margin-top: 0.75rem;
}
label:first-child { margin-top: 0; }

input, select, textarea {
  width: 100%; padding: 0.55rem 0.75rem; border: 1px solid var(--lp-border);
  border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: var(--lp-cream);
}
textarea { min-height: 80px; resize: vertical; }

.btn {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.6rem 1.2rem; border: none; border-radius: 8px;
  font-size: 0.9rem; font-weight: 600; cursor: pointer;
}
.btn-primary { background: var(--lp-red); color: white; margin-top: 1rem; }
.btn-primary:hover { background: var(--lp-red-dark); }
.btn-secondary { background: var(--lp-warm); color: var(--lp-brown); border: 1px solid var(--lp-border); margin-top: 0.75rem; }

.draft-output {
  background: var(--lp-cream); border: 1px solid var(--lp-border); border-radius: 8px;
  padding: 1rem; white-space: pre-wrap; font-size: 0.88rem; min-height: 200px;
  font-family: Georgia, serif; line-height: 1.65;
}

.checklist { list-style: none; margin-top: 0.75rem; }
.checklist li { padding: 0.4rem 0; font-size: 0.85rem; display: flex; gap: 0.5rem; }
.checklist li::before { content: "☐"; color: var(--lp-red); font-weight: bold; }

.toast {
  position: fixed; bottom: 1.5rem; right: 1.5rem; background: var(--lp-brown);
  color: white; padding: 0.75rem 1.25rem; border-radius: 8px; font-size: 0.85rem;
  opacity: 0; transform: translateY(10px); transition: all 0.25s; z-index: 100;
}
.toast.show { opacity: 1; transform: translateY(0); }

.ops-summary { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
.stat {
  flex: 1; min-width: 120px; background: white; border-radius: 10px;
  padding: 1rem; text-align: center; border: 1px solid var(--lp-border);
}
.stat .num { font-size: 1.75rem; font-weight: 700; color: var(--lp-red); }
.stat .lbl { font-size: 0.75rem; color: var(--lp-muted); text-transform: uppercase; }

header { position: relative; }
.header-top { display: flex; justify-content: flex-end; margin-bottom: 0.5rem; }
.lang-switch { display: inline-flex; background: rgba(0,0,0,0.2); border-radius: 8px; overflow: hidden; }
.lang-switch button {
  background: transparent; border: none; color: white; padding: 0.35rem 0.75rem;
  font-size: 0.8rem; font-weight: 600; cursor: pointer;
}
.lang-switch button.active { background: white; color: var(--lp-red); }

.booking-row {
  display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;
  padding: 1rem; border-bottom: 1px solid var(--lp-warm);
}
.booking-row:last-child { border-bottom: none; }
.booking-main { flex: 1; min-width: 0; }
.booking-actions { display: flex; flex-direction: column; gap: 0.35rem; flex-shrink: 0; }
.btn-done { margin-top: 0 !important; }
.booking-meta { font-size: 0.82rem; color: var(--lp-muted); margin-top: 0.25rem; }
.tags { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.5rem; }
.tag { font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 4px; text-transform: uppercase; }
.tag-reminder { background: #dbeafe; color: #1e40af; }
.tag-solo { background: #fee2e2; color: #991b1b; }
.tag-guide { background: #fef3c7; color: #92400e; }
.tag-followup { background: #ede9fe; color: #5b21b6; }
.tag-sold-out { background: #fecaca; color: #7f1d1d; }
.tag-waitlist { background: #ffedd5; color: #9a3412; }
.guide-note { font-size: 0.82rem; color: var(--lp-warn); font-style: italic; margin-top: 0.35rem; }

.memo-section { margin-bottom: 1.5rem; }
.memo-section h3 { color: var(--lp-red); font-size: 1rem; margin-bottom: 0.5rem; }
.memo-section p, .memo-section ul { font-size: 0.92rem; }
.memo-section ul { margin-left: 1.25rem; margin-top: 0.5rem; }
.ai-badge { font-size: 0.7rem; background: var(--lp-warm); color: var(--lp-muted); padding: 0.15rem 0.5rem; border-radius: 4px; margin-left: 0.5rem; }

.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.25rem; }
@media (max-width: 960px) { .grid-3 { grid-template-columns: 1fr; } }

.hidden { display: none !important; }
.api-key-bar { margin-top: 1rem; }
.api-key-bar input { max-width: 420px; margin: 0.5rem auto 0; display: block; }
.hint { font-size: 0.75rem; color: var(--lp-muted); margin-top: 0.35rem; }
header .hint { color: rgba(255,255,255,0.75); }
.status-line { font-size: 0.82rem; color: var(--lp-muted); margin-top: 0.75rem; }
.subhead { font-size: 0.95rem; color: var(--lp-brown); margin: 1rem 0 0.5rem; }
textarea.tall { min-height: 220px; }
.draft-output.short { min-height: 60px; }
.intent-list { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 0.5rem; }
.intent-label { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.85rem; font-weight: 500; color: var(--lp-text); margin: 0; cursor: pointer; }
.intent-label input { width: auto; margin-top: 0.15rem; }
.btn-sm { padding: 0.35rem 0.75rem; font-size: 0.78rem; margin-top: 0; margin-left: 0.5rem; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.table-wrap { overflow-x: auto; margin: 1rem 0; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.data-table th, .data-table td { padding: 0.6rem 0.75rem; text-align: left; border-bottom: 1px solid var(--lp-border); }
.data-table th { background: var(--lp-warm); color: var(--lp-brown); font-size: 0.75rem; text-transform: uppercase; }
.reminder-card { background: white; border: 1px solid var(--lp-border); border-radius: 10px; padding: 1rem; margin-bottom: 1rem; }
.reminder-card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem; }
.reminder-card pre { margin: 0; white-space: pre-wrap; font-family: Georgia, serif; font-size: 0.88rem; background: var(--lp-cream); border: 1px solid var(--lp-border); border-radius: 8px; padding: 1rem; }

```

---

## File: `js/app.js`

```javascript
import { initTabs, initApiKeyField } from "./utils.js";
import { initI18n } from "./i18n.js";
import { initEmailReply } from "./email-reply.js";
import { initReminders } from "./reminders.js";
import { initGuideComms } from "./guide-comms.js";
import { initOpsBoard } from "./ops-board.js";

document.addEventListener("DOMContentLoaded", () => {
  initI18n();
  initTabs();
  initApiKeyField();
  initEmailReply();
  initReminders();
  initGuideComms();
  initOpsBoard();
});

```

---

## File: `js/utils.js`

```javascript
export const $ = (sel) => document.querySelector(sel);
export const $$ = (sel) => document.querySelectorAll(sel);

export function fillTemplate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `[${key}]`);
}

export function getCutoffDescription(tour) {
  if (!tour?.schedule || tour.schedule === "evening") {
    return "2–6 hours before start for evening tours";
  }
  return "24 hours before start for morning and full-day tours";
}

export function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

export function switchTab(panelId) {
  $$(".tabs button").forEach((btn) => {
    const active = btn.dataset.panel === panelId;
    btn.classList.toggle("active", active);
  });
  $$(".panel").forEach((p) => p.classList.remove("active"));
  $(`#${panelId}`)?.classList.add("active");
}

export function initTabs() {
  $$(".tabs button").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.panel));
  });
}

export function copyText(text, toastMsg) {
  return navigator.clipboard.writeText(text).then(() => showToast(toastMsg || "Copied to clipboard!"));
}

const API_KEY_STORAGE = "lp_openrouter_key";

export function getApiKey() {
  return sessionStorage.getItem(API_KEY_STORAGE) || "";
}

export function setApiKey(key) {
  if (key) sessionStorage.setItem(API_KEY_STORAGE, key.trim());
  else sessionStorage.removeItem(API_KEY_STORAGE);
}

export function initApiKeyField() {
  const input = $("#api-key");
  const toggle = $("#api-key-toggle");
  if (!input) return;
  input.value = getApiKey();
  input.addEventListener("change", () => setApiKey(input.value));
  input.addEventListener("input", () => setApiKey(input.value));
  toggle?.addEventListener("click", () => {
    const panel = $("#api-key-panel");
    panel?.classList.toggle("hidden");
  });
}

```

---

## File: `js/data.js`

```javascript
// Lost Plate tour & inquiry data (from lostplate.com)

export const CITIES = [
  { id: "beijing", name: "Beijing", region: "China" },
  { id: "chengdu", name: "Chengdu", region: "China" },
  { id: "shanghai", name: "Shanghai", region: "China" },
  { id: "xian", name: "Xi'an", region: "China" },
  { id: "bangkok", name: "Bangkok", region: "Thailand" },
  { id: "hanoi", name: "Hanoi", region: "Vietnam" },
  { id: "siem-reap", name: "Siem Reap", region: "Cambodia" },
  { id: "portland", name: "Portland, OR", region: "USA" },
];

export const TOURS = [
  { id: "bj-evening", city: "beijing", name: "Beijing Hutong Evening Food Tour", schedule: "evening" },
  { id: "bj-breakfast", city: "beijing", name: "Beijing Hutong Breakfast Food Tour", schedule: "morning" },
  { id: "cd-evening", city: "chengdu", name: "Chengdu Evening Food Tour by Tuktuk", schedule: "evening" },
  { id: "cd-panda", city: "chengdu", name: "Chengdu Full-Day Panda, Teahouse & Evening Food Tour", schedule: "full-day" },
  { id: "sh-evening", city: "shanghai", name: "Shanghai Evening Food Tour", schedule: "evening" },
  { id: "xa-evening", city: "xian", name: "Xi'an Evening Food Tour by Tuktuk", schedule: "evening" },
  { id: "bk-evening", city: "bangkok", name: "Bangkok Evening Food Tour by Tuktuk", schedule: "evening" },
  { id: "hn-evening", city: "hanoi", name: "Hanoi Old-Quarter Evening Food Tour", schedule: "evening" },
  { id: "sr-evening", city: "siem-reap", name: "Siem Reap Evening Food Tour by Tuktuk", schedule: "evening" },
  { id: "pdx-carts", city: "portland", name: "Portland Food Carts, Pods, & Patios Tour", schedule: "morning" },
];

export const INQUIRY_TYPES = [
  {
    id: "last-minute",
    label: "Last-minute booking (past Rezdy cutoff)",
    template: `Hi {{guestName}},

Thank you for reaching out about joining us on the {{tourName}} on {{tourDate}}!

Our online booking system typically closes {{cutoffDescription}}, but I'd be happy to check availability with our team for your party of {{partySize}}. Could you confirm your preferred start time and any dietary restrictions?

If we have space, I can send a manual payment link to secure your spots.

Warm regards,
Lost Plate Guest Services`,
    checklist: ["Verify availability with guide", "Confirm party size", "Send manual payment link if approved"],
  },
  {
    id: "solo-traveler",
    label: "Solo traveler / minimum 2 guests",
    template: `Hi {{guestName}},

Thanks for your interest in the {{tourName}} on {{tourDate}}!

Our public tours require a minimum of 2 guests to run. As a solo traveler, you have two options:
1. Purchase 2 tickets to guarantee the tour runs for you
2. Join our waitlist — if another guest books, we'll confirm you at the single-guest rate

Would either option work for you? We're happy to help find the best fit.

Best,
Lost Plate Guest Services`,
    checklist: ["Check current bookings for date", "Offer waitlist or 2-ticket option", "Note in Rezdy if confirmed"],
  },
  {
    id: "dietary",
    label: "Dietary restrictions",
    template: `Hi {{guestName}},

Thank you for letting us know about your dietary needs: {{dietaryNotes}}.

For the {{tourName}}, our guides can accommodate many restrictions by adjusting dishes at each stop. I've flagged this for your guide so they can plan alternatives in advance.

Please note some traditional stops may have limited options — we'll ensure you still enjoy a full experience!

Cheers,
Lost Plate Guest Services`,
    checklist: ["Notify guide of dietary needs", "Confirm substitutions possible", "Update booking notes in Rezdy"],
  },
  {
    id: "private-tour",
    label: "Private tour / group event",
    template: `Hi {{guestName}},

We'd love to host your group of {{partySize}} for a private food experience in {{cityName}}!

Private tours can be customized for timing, dietary preferences, and pace. For the {{tourName}} or a fully bespoke route, I'll connect you with our private tours team with a few date options: {{tourDate}} and nearby dates.

Could you share your ideal start time and any must-have cuisines?

Best,
Lost Plate Guest Services`,
    checklist: ["Loop in private tours contact", "Provide pricing range", "Suggest 2–3 date alternatives"],
  },
  {
    id: "meeting-point",
    label: "Meeting point / what to bring",
    template: `Hi {{guestName}},

Great question! For your {{tourName}} on {{tourDate}}:

**Meeting point:** We'll send the exact address and guide contact in your reminder email 24 hours before the tour.
**What to bring:** Comfortable walking shoes, appetite, and a light layer. Cash/card for optional extras.
**Duration:** Approximately 3 hours with {{partySize}} in your party.

See you soon!
Lost Plate Guest Services`,
    checklist: ["Include exact meeting pin in reminder", "Confirm guide name", "Send reminder 24h before"],
  },
  {
    id: "weather-cancel",
    label: "Weather / cancellation policy",
    template: `Hi {{guestName}},

Our tours run rain or shine — some of the best local spots are cozy in any weather! If conditions are unsafe, we'll contact you directly.

**Cancellation policy:** Free cancellation up to 24 hours before your {{tourName}} on {{tourDate}}. Inside 24 hours, tickets are non-refundable but we can help reschedule subject to availability.

Let me know if you'd like to move your booking.

Warm regards,
Lost Plate Guest Services`,
    checklist: ["Verify cancellation window", "Check reschedule availability", "Process refund if eligible"],
  },
  {
    id: "multi-day",
    label: "Multi-day trip follow-up",
    template: `Hi {{guestName}},

Following up on your interest in our multi-day trips — since you're visiting {{cityName}}, you might love pairing your {{tourName}} with our "Best of China in 11 Days" or a 4-day {{cityName}} itinerary.

Happy to share sample day-by-day routes and pricing. Are you traveling solo or with a group of {{partySize}}?

Looking forward to helping plan your food adventure!
Lost Plate Guest Services`,
    checklist: ["Send relevant multi-day PDF/link", "Log follow-up in CRM", "Offer 10% multi-tour discount if booking 2+"],
  },
  {
    id: "multi-tour-discount",
    label: "Book 2+ tours (10% discount)",
    template: `Hi {{guestName}},

Great news — when you book 2 or more Lost Plate tours, you receive **10% off** the total!

For your plans around {{tourDate}}, I'd suggest combining the {{tourName}} with another evening or morning tour in {{cityName}}. I can hold both dates while you decide.

Would you like recommendations based on your {{partySize}} guests and {{dietaryNotes}}?

Best,
Lost Plate Guest Services`,
    checklist: ["Apply 10% discount code", "Confirm both dates available", "Send combined confirmation"],
  },
  {
    id: "contact-routing",
    label: "Portland vs China/SEA routing",
    template: `Hi {{guestName}},

Thanks for reaching out! Lost Plate routes inquiries by region so you reach the right team quickly:

**China & Southeast Asia tours** (including {{cityName}}):
- Email: info@lostplate.com
- Phone/WhatsApp: +86 156 9210 9030
- WeChat: lostplate

**Portland, OR tours** (food carts, wine, coffee):
- Phone: +1 503-409-5593
- Email: info@lostplate.com
- WeChat: lostplate

I've noted your question about the {{tourName}} and can help from here if you're booking in Asia. For Portland tours, our US team will follow up directly.

Warm regards,
Lost Plate Guest Services`,
    checklist: ["Route to correct regional inbox", "Include phone + WeChat for Asia guests", "Confirm guest timezone"],
  },
  {
    id: "sold-out",
    label: "Apologize — sold out / waitlist",
    template: `Hi {{guestName}},

Thank you for your interest in the {{tourName}} on {{tourDate}}!

Unfortunately, this date is currently sold out. I'd love to help you still join us:
1. **Waitlist** — I'll notify you immediately if a spot opens
2. **Nearby dates** — I can check July 9 or 11 for the same tour
3. **Alternative tour** — our morning or nearby-city options may have availability

Which would work best for your party of {{partySize}}?

Warm regards,
Lost Plate Guest Services`,
    checklist: ["Check waitlist in Rezdy", "Offer 2 alternate dates", "Note dietary: {{dietaryNotes}}"],
  },
  {
    id: "review-request",
    label: "Post-tour review request",
    template: `Hi {{guestName}},

We hope you loved the {{tourName}}! If you have a moment, a Google or TripAdvisor review helps other food lovers discover local gems through Lost Plate.

{{guideName}} and our restaurant partners truly appreciate the shout-out.

Thank you for exploring with us — we'd welcome you back anytime in {{cityName}} or our other 10+ cities!

Cheers,
Lost Plate Guest Services`,
    checklist: ["Personalize with guide name", "Include review links", "Send 24–48h after tour"],
  },
];

export const MOCK_BOOKINGS = [
  {
    id: 1,
    guest: "Sarah Chen",
    tour: "Chengdu Evening Food Tour by Tuktuk",
    city: "Chengdu",
    time: "7:00 PM",
    guests: 1,
    flags: ["solo-alert", "reminder"],
    dietary: "Vegetarian",
    guideNote: "2 vegetarians — confirm tofu dishes at stops 3 & 5",
  },
  {
    id: 2,
    guest: "James & Emma Walsh",
    tour: "Beijing Hutong Evening Food Tour",
    city: "Beijing",
    time: "5:30 PM",
    guests: 2,
    flags: ["reminder"],
    dietary: "None",
    guideNote: null,
  },
  {
    id: 3,
    guest: "Marcus Rivera",
    tour: "Bangkok Evening Food Tour by Tuktuk",
    city: "Bangkok",
    time: "6:00 PM",
    guests: 4,
    flags: ["reminder", "guide-sync"],
    dietary: "1 pescatarian",
    guideNote: "Group of 4 — pescatarian at stop 2",
  },
  {
    id: 4,
    guest: "Linda Park",
    tour: "Portland Food Carts, Pods, & Patios Tour",
    city: "Portland",
    time: "11:00 AM",
    guests: 2,
    flags: ["reminder"],
    dietary: "Gluten-free",
    guideNote: null,
  },
  {
    id: 5,
    guest: "Tom Nguyen",
    tour: "Hanoi Old-Quarter Evening Food Tour",
    city: "Hanoi",
    time: "5:00 PM",
    guests: 1,
    flags: ["solo-alert", "follow-up"],
    dietary: "None",
    guideNote: "Solo — sent waitlist offer, awaiting reply",
    upsellEmail: `Hi,

I'm a solo traveler interested in the Hanoi Old-Quarter Evening Food Tour. Are there any other guests booked for July 15? If not, I'd consider buying 2 tickets.

Thanks,
Tom`,
  },
  {
    id: 6,
    guest: "Anna Kowalski",
    tour: "Best of China inquiry",
    city: "Multi-city",
    time: "—",
    guests: 2,
    flags: ["follow-up"],
    dietary: "None",
    guideNote: "Multi-day inquiry from 3 days ago — no reply yet",
    upsellEmail: `Hi,

I inquired about your Best of China 11-day trip last week. Still interested — can you send pricing for September for 2 people?

Thanks,
Anna`,
  },
  {
    id: 7,
    guest: "David Kim",
    tour: "Xi'an Evening Food Tour by Tuktuk",
    city: "Xi'an",
    time: "6:30 PM",
    guests: 3,
    flags: ["reminder"],
    dietary: "None",
    guideNote: null,
  },
  {
    id: 8,
    guest: "Rachel M. + Bruno T. (waitlist)",
    tour: "Beijing Hutong Evening Food Tour — SOLD OUT",
    city: "Beijing",
    time: "5:30 PM",
    guests: 0,
    flags: ["sold-out", "waitlist", "follow-up"],
    dietary: "None",
    guideNote: "July 8 sold out — 2 waitlist inquiries; offer July 9 evening or breakfast tour",
    upsellEmail: `Hi,

We were waitlisted for the Beijing Hutong Evening Food Tour on July 8. If that date is full, could you suggest July 9 evening or the breakfast tour instead?

Thanks,
Rachel`,
  },
];

export const PREVIEW_EXAMPLES = {
  "last-minute": `Hi Alex,

Thank you for reaching out about joining us on the Chengdu Evening Food Tour by Tuktuk on June 28!

Our online booking system typically closes 2–6 hours before start for evening tours, but I'd be happy to check availability with our team for your party of 2. Could you confirm your preferred start time and any dietary restrictions?

If we have space, I can send a manual payment link to secure your spots.

Warm regards,
Lost Plate Guest Services`,
  "solo-traveler": `Hi Sarah,

Thanks for your interest in the Chengdu Evening Food Tour by Tuktuk on July 12!

Our public tours require a minimum of 2 guests to run. As a solo traveler, you have two options:
1. Purchase 2 tickets to guarantee the tour runs for you
2. Join our waitlist — if another guest books, we'll confirm you at the single-guest rate

Would either option work for you? We're happy to help find the best fit.

Best,
Lost Plate Guest Services`,
  "dietary": `Hi James,

Thank you for letting us know about your dietary needs: vegetarian, no shellfish.

For the Beijing Hutong Evening Food Tour on July 5, our guides can accommodate many restrictions by adjusting dishes at each stop. I've flagged this for your guide so they can plan alternatives in advance.

Please note some traditional stops may have limited options — we'll ensure you still enjoy a full experience!

Cheers,
Lost Plate Guest Services`,
  "multi-day": `Hi Anna,

Following up on your interest in our multi-day trips — since you're visiting Chengdu, you might love pairing a city food tour with our "Chengdu in 4 Days" itinerary or our "Best of China in 11 Days" trip.

Happy to share a sample day-by-day route and pricing for your party of 2. Are you flexible on dates in September, or do you have fixed travel windows?

Looking forward to helping plan your food adventure!
Lost Plate Guest Services`,
};

```

---

## File: `js/openrouter.js`

```javascript
import { getApiKey } from "./utils.js";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-4o-mini";

export async function chatCompletion(systemPrompt, userPrompt) {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": window.location.origin || "http://localhost",
      "X-Title": "Lost Plate Guest Ops Copilot",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 800,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${err.slice(0, 120)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}

export const LOST_PLATE_SYSTEM = `You are a Customer Service Specialist for Lost Plate Food Tours — small-group food tours across China, Southeast Asia, and Portland, OR.

Write warm, helpful English email replies. Tone: professional but friendly, treating guests like royalty. Never be robotic. Sign off as "Lost Plate Guest Services".

Rules:
- Use facts from the guest email and context provided; do not invent booking confirmations
- If unsure about availability, say you'll check with the team
- Keep replies concise (150–250 words unless multiple topics)
- Do not use markdown headers; plain email format only`;

```

---

## File: `js/email-reply.js`

```javascript
import { INQUIRY_TYPES, CITIES, TOURS } from "./data.js";
import { fillTemplate, getCutoffDescription, copyText, getApiKey, switchTab, $, $$ } from "./utils.js";
import { chatCompletion, LOST_PLATE_SYSTEM } from "./openrouter.js";
import { t, INTENT_LABEL_KEYS, onLangChange } from "./i18n.js";

export const INTENT_OPTIONS = [
  { id: "last-minute" },
  { id: "solo-traveler" },
  { id: "dietary" },
  { id: "meeting-point" },
  { id: "sold-out" },
  { id: "weather-cancel" },
  { id: "multi-day" },
  { id: "private-tour" },
];

const KEYWORD_RULES = [
  { ids: ["solo-traveler"], words: ["solo", "alone", "by myself", "just me", "one person", "traveling alone"] },
  { ids: ["dietary"], words: ["vegetarian", "vegan", "gluten", "allergy", "allergic", "halal", "dietary", "can't eat", "shellfish", "nut"] },
  { ids: ["last-minute"], words: ["last minute", "last-minute", "today", "tonight", "cutoff", "cut-off", "still book"] },
  { ids: ["sold-out"], words: ["sold out", "full", "no availability", "waitlist", "any spots left"] },
  { ids: ["meeting-point"], words: ["meeting point", "where do we meet", "what to bring", "address", "location"] },
  { ids: ["weather-cancel"], words: ["cancel", "refund", "rain", "weather", "reschedule"] },
  { ids: ["multi-day"], words: ["multi-day", "multiday", "11 days", "4 days", "itinerary", "trip package"] },
  { ids: ["private-tour"], words: ["private", "group event", "corporate", "bachelor", "birthday"] },
];

function intentLabel(id) {
  return t(INTENT_LABEL_KEYS[id] || id);
}

function splitTemplateParts(text) {
  const signOffRe = /\n(Warm regards,|Best,|Cheers,)\s*\nLost Plate Guest Services\s*$/;
  let signOff = "Warm regards,\nLost Plate Guest Services";
  let rest = text.trim();
  const signIdx = rest.search(signOffRe);
  if (signIdx >= 0) {
    signOff = rest.slice(signIdx).trim();
    rest = rest.slice(0, signIdx).trim();
  }
  const greetingMatch = rest.match(/^Hi .+?,?\s*\n/i);
  let greeting = "";
  let body = rest;
  if (greetingMatch) {
    greeting = greetingMatch[0].trim();
    body = rest.slice(greetingMatch[0].length).trim();
  }
  return { greeting, body, signOff };
}

export function stitchTemplates(parts) {
  if (!parts.length) return "";
  if (parts.length === 1) return parts[0];
  const parsed = parts.map(splitTemplateParts);
  const greeting = parsed[0].greeting;
  const bodies = parsed.map((p) => p.body).filter(Boolean);
  const signOff = parsed[parsed.length - 1].signOff;
  return [greeting, ...bodies, signOff].filter(Boolean).join("\n\n");
}

export function detectIntents(text) {
  const lower = text.toLowerCase();
  const detected = new Set();
  KEYWORD_RULES.forEach(({ ids, words }) => {
    if (words.some((w) => lower.includes(w))) ids.forEach((id) => detected.add(id));
  });
  if (!detected.size && text.trim()) detected.add("meeting-point");
  return detected;
}

export function extractEntities(text) {
  const entities = {
    guestName: "Guest",
    partySize: "2",
    tourDate: "your requested date",
    dietaryNotes: "none noted",
    cityName: "your destination",
    tourName: "Lost Plate Food Tour",
    guideName: "your guide",
  };

  const nameMatch = text.match(/(?:my name is|i'm|i am|this is|^thanks,\s*\n)([A-Z][a-z]+)/im);
  if (nameMatch) entities.guestName = nameMatch[1];

  const partyMatch = text.match(/(\d+)\s+(?:people|guests|persons|of us|in our group)/i);
  if (partyMatch) entities.partySize = partyMatch[1];
  if (/\bsolo\b|just me|by myself|alone\b/i.test(text)) entities.partySize = "1";

  const dateMatch = text.match(/(?:on|for)\s+((?:July|June|August|September|October|Nov|Dec)[a-z]*\s+\d{1,2}(?:,? \d{4})?|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)/i);
  if (dateMatch) entities.tourDate = dateMatch[1];

  const dietaryMatch = text.match(/(?:i am|i'm|we are|we're)\s+(vegetarian|vegan|gluten[- ]free|pescatarian)/i);
  if (dietaryMatch) entities.dietaryNotes = dietaryMatch[1];
  if (/allerg/i.test(text)) {
    const allergy = text.match(/allerg(?:y|ies)\s+(?:to\s+)?([^.,\n]+)/i);
    if (allergy) entities.dietaryNotes = allergy[1].trim();
  }

  for (const city of CITIES) {
    if (text.toLowerCase().includes(city.name.toLowerCase()) || text.toLowerCase().includes(city.id.replace("-", " "))) {
      entities.cityName = city.name;
      const tour = TOURS.find((tr) => tr.city === city.id);
      if (tour) entities.tourName = tour.name;
      break;
    }
  }

  for (const tour of TOURS) {
    if (text.toLowerCase().includes(tour.name.toLowerCase().slice(0, 12))) {
      entities.tourName = tour.name;
      const city = CITIES.find((c) => c.id === tour.city);
      if (city) entities.cityName = city.name;
      break;
    }
  }

  return entities;
}

function getSelectedIntentIds() {
  return [...$$(".intent-cb:checked")].map((cb) => cb.value);
}

function buildTemplateDraft(intentIds, entities) {
  const tour = TOURS.find((tr) => tr.name === entities.tourName) || TOURS[0];
  const vars = { ...entities, cutoffDescription: getCutoffDescription(tour) };
  const parts = [];
  const checklist = [];

  intentIds.forEach((id) => {
    const inquiry = INQUIRY_TYPES.find((tr) => tr.id === id);
    if (!inquiry) return;
    parts.push(fillTemplate(inquiry.template, vars));
    checklist.push(...inquiry.checklist);
  });

  if (!parts.length) {
    const fallback = INQUIRY_TYPES.find((tr) => tr.id === "meeting-point");
    parts.push(fillTemplate(fallback.template, vars));
    checklist.push(...fallback.checklist);
  }

  return {
    draft: stitchTemplates(parts),
    checklist: [...new Set(checklist)],
    source: "template",
  };
}

export function renderIntentCheckboxes(detected = new Set()) {
  const container = $("#intent-list");
  if (!container) return;
  container.innerHTML = INTENT_OPTIONS.map(
    (opt) => `<label class="intent-label"><input type="checkbox" class="intent-cb" value="${opt.id}" ${detected.has(opt.id) ? "checked" : ""} /> ${intentLabel(opt.id)}</label>`
  ).join("");
}

export function onGuestEmailInput() {
  const text = $("#guest-email")?.value || "";
  renderIntentCheckboxes(detectIntents(text));
}

export function loadUpsellContext({ emailText }) {
  switchTab("panel-email");
  const ta = $("#guest-email");
  if (ta && emailText) ta.value = emailText;
  renderIntentCheckboxes(new Set(["multi-day"]));
  onGuestEmailInput();
  $$(".intent-cb").forEach((cb) => {
    cb.checked = cb.value === "multi-day";
  });
  $("#email-generate-btn")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export async function generateEmailReply() {
  const emailText = $("#guest-email")?.value?.trim() || "";
  const intentIds = getSelectedIntentIds();
  const entities = extractEntities(emailText);
  const statusEl = $("#email-status");
  const outputEl = $("#email-draft-output");
  const checklistEl = $("#email-checklist");
  const btn = $("#email-generate-btn");

  if (!emailText) {
    statusEl.textContent = t("status_paste_first");
    return;
  }
  if (!intentIds.length) {
    statusEl.textContent = t("status_select_intent");
    return;
  }

  btn.disabled = true;
  statusEl.textContent = getApiKey() ? t("status_generating_ai") : t("status_generating_tpl");

  const templateResult = buildTemplateDraft(intentIds, entities);
  let draft = templateResult.draft;
  let source = templateResult.source;

  if (getApiKey()) {
    try {
      const intentLabels = intentIds.map((id) => intentLabel(id)).join(", ");
      const userPrompt = `Guest email:\n---\n${emailText}\n---\n\nIntents to address: ${intentLabels}\n\nExtracted context: ${JSON.stringify(entities)}\n\nTemplate reference (use facts, rewrite warmly):\n${templateResult.draft.slice(0, 1200)}`;
      const aiDraft = await chatCompletion(LOST_PLATE_SYSTEM, userPrompt);
      if (aiDraft) {
        draft = aiDraft;
        source = "openrouter";
      }
    } catch (err) {
      statusEl.textContent = `AI unavailable (${err.message}) — using templates.`;
      source = "template-fallback";
    }
  }

  outputEl.textContent = draft;
  checklistEl.innerHTML = templateResult.checklist.map((item) => `<li>${fillTemplate(item, entities)}</li>`).join("");
  if (source === "openrouter") statusEl.textContent = t("status_ready_ai");
  else if (source === "template") statusEl.textContent = t("status_ready_tpl");
  else statusEl.textContent = t("status_ready_fallback");

  btn.disabled = false;
}

export function initEmailReply() {
  renderIntentCheckboxes();
  $("#guest-email")?.addEventListener("input", onGuestEmailInput);
  $("#email-generate-btn")?.addEventListener("click", generateEmailReply);
  $("#email-copy-btn")?.addEventListener("click", () => {
    copyText($("#email-draft-output")?.textContent || "", t("toast_copied"));
  });

  onLangChange(() => {
    const detected = detectIntents($("#guest-email")?.value || "");
    renderIntentCheckboxes(detected);
  });

  $("#guest-email").value = `Hi,

I'm traveling solo to Chengdu next week and would love to join the evening food tour on July 12. I'm vegetarian — is that okay?

Also, I tried to book online but it said cutoff passed. Can you still help?

Thanks,
Sarah`;
  onGuestEmailInput();
}

```

---

## File: `js/i18n.js`

```javascript
import { $, $$ } from "./utils.js";

const LANG_KEY = "lp_lang";
let currentLang = "en";
const callbacks = [];

export const STRINGS = {
  en: {
    title: "Lost Plate Guest Ops Copilot",
    subtitle: "Email replies · daily reminders · guide comms · ops board",
    disclaimer: "Demo built independently — not affiliated with Lost Plate Food Tours",
    api_key_toggle: "OpenRouter API key (session only)",
    api_key_ph: "sk-or-v1-… (optional — templates work without)",
    api_key_hint: "Key stays in this browser tab only. Never share a public link with your key saved.",
    tab_email: "Email Reply",
    tab_reminders: "Daily Reminders",
    tab_guide: "Guide Comms",
    tab_ops: "Ops Board",
    tab_memo: "First 30 Days",
    email_guest_title: "Guest email",
    badge_paste: "paste",
    email_intents_title: "Intents",
    badge_autodetect: "auto-detect",
    btn_generate_reply: "Generate Reply",
    email_draft_title: "Reply draft",
    btn_copy: "Copy to clipboard",
    checklist_title: "Human edit checklist",
    guest_email_ph: "Paste the guest's English email here…",
    status_paste_first: "Paste a guest email first.",
    status_select_intent: "Select at least one intent.",
    status_generating_ai: "Generating with AI…",
    status_generating_tpl: "Generating from templates…",
    status_ready_ai: "Draft ready (AI). Review before sending.",
    status_ready_tpl: "Draft ready (templates). Add API key for AI polish.",
    status_ready_fallback: "Draft ready (template fallback).",
    intent_last_minute: "Last-minute / past Rezdy cutoff",
    intent_solo: "Solo traveler options",
    intent_dietary: "Dietary restrictions",
    intent_meeting: "Confirm booking / meeting point",
    intent_sold_out: "Apologize — sold out",
    intent_weather: "Weather / cancellation policy",
    intent_multi_day: "Multi-day trip upsell",
    intent_private: "Private tour inquiry",
    reminders_title: "Tomorrow's tours",
    badge_mock: "mock sheet",
    reminders_hint: "Production: Rezdy export or Google Sheet. Demo uses mock data.",
    th_guest: "Guest",
    th_tour: "Tour",
    th_city: "City",
    th_time: "Time",
    th_dietary: "Dietary",
    th_guide: "Guide",
    btn_generate_reminders: "Generate all reminders",
    status_fetching: "Fetching weather and generating reminders…",
    status_generated: "Generated {n} reminder drafts.",
    guide_update_title: "Guide update",
    label_city: "City",
    label_guide: "Guide",
    label_tour_time: "Tour time",
    label_english_update: "English update",
    btn_refresh_formats: "Refresh formats",
    guide_wechat: "WeChat",
    guide_whatsapp: "WhatsApp",
    guide_rezdy: "Rezdy note",
    stat_tours: "Tours today",
    stat_reminders: "Reminders",
    stat_solo: "Solo alerts",
    stat_followups: "Follow-ups",
    ops_title: "Today's priorities",
    btn_mark_done: "Mark Done",
    btn_draft_upsell: "Draft Upsell",
    tag_reminder: "Send reminder",
    tag_solo: "Solo alert",
    tag_guide: "Guide sync",
    tag_followup: "Follow-up",
    tag_sold_out: "Sold out",
    tag_waitlist: "Waitlist",
    guest_waitlist: "waitlist",
    guests_one: "guest",
    guests_many: "guests",
    memo_title: "First 30 Days — Process improvements",
    memo_h1: "1. Template library + AI reply assistant",
    memo_p1: "Email Reply tab indexes templates by intent. AI polishes tone; humans always review before send.",
    memo_h2: "2. Daily 9am ops checklist",
    memo_li1: "Batch tomorrow's reminders (with weather) from Rezdy export",
    memo_li2: "Flag solo-traveler bookings — outreach or 2-ticket option",
    memo_li3: "Sync guide notes via WeChat/WhatsApp formats",
    memo_li4: "Clear follow-up queue (multi-day inquiries, sold-out waitlists)",
    memo_h3: "3. Multi-day upsell trigger",
    memo_p3: 'When a guest books a city tour, auto-suggest a relevant multi-day trip in confirmation or follow-up — e.g. Chengdu evening → "Chengdu in 4 Days".',
    toast_copied: "Copied to clipboard!",
  },
  zh: {
    title: "Lost Plate 客诉运营助手",
    subtitle: "邮件回复 · 每日提醒 · 导游沟通 · 运营看板",
    disclaimer: "独立演示项目 — 与 Lost Plate Food Tours 无官方关联",
    api_key_toggle: "OpenRouter API 密钥（仅本会话）",
    api_key_ph: "sk-or-v1-…（可选 — 无密钥时使用模板）",
    api_key_hint: "密钥仅保存在当前浏览器标签页，请勿在公开链接中保存密钥。",
    tab_email: "邮件回复",
    tab_reminders: "每日提醒",
    tab_guide: "导游沟通",
    tab_ops: "运营看板",
    tab_memo: "前 30 天",
    email_guest_title: "客人邮件",
    badge_paste: "粘贴",
    email_intents_title: "意图",
    badge_autodetect: "自动识别",
    btn_generate_reply: "生成回复",
    email_draft_title: "回复草稿",
    btn_copy: "复制到剪贴板",
    checklist_title: "人工核对清单",
    guest_email_ph: "在此粘贴客人的英文邮件…",
    status_paste_first: "请先粘贴客人邮件。",
    status_select_intent: "请至少选择一个意图。",
    status_generating_ai: "AI 生成中…",
    status_generating_tpl: "模板生成中…",
    status_ready_ai: "草稿已就绪（AI）。发送前请人工审阅。",
    status_ready_tpl: "草稿已就绪（模板）。可添加 API 密钥优化语气。",
    status_ready_fallback: "草稿已就绪（模板备用）。",
    intent_last_minute: "临期预订 / 已过 Rezdy 截止",
    intent_solo: "独行客人选项",
    intent_dietary: "饮食限制",
    intent_meeting: "确认预订 / 集合地点",
    intent_sold_out: "致歉 — 已满员",
    intent_weather: "天气 / 取消政策",
    intent_multi_day: "多日行程 upsell",
    intent_private: "私人团咨询",
    reminders_title: "明日行程",
    badge_mock: "模拟表格",
    reminders_hint: "正式环境：Rezdy 导出或 Google Sheet。演示使用模拟数据。",
    th_guest: "客人",
    th_tour: "行程",
    th_city: "城市",
    th_time: "时间",
    th_dietary: "饮食",
    th_guide: "导游",
    btn_generate_reminders: "批量生成提醒",
    status_fetching: "获取天气并生成提醒中…",
    status_generated: "已生成 {n} 封提醒草稿。",
    guide_update_title: "导游更新",
    label_city: "城市",
    label_guide: "导游",
    label_tour_time: "行程时间",
    label_english_update: "英文更新内容",
    btn_refresh_formats: "刷新格式",
    guide_wechat: "微信",
    guide_whatsapp: "WhatsApp",
    guide_rezdy: "Rezdy 备注",
    stat_tours: "今日行程",
    stat_reminders: "待提醒",
    stat_solo: "独行预警",
    stat_followups: "待跟进",
    ops_title: "今日优先级",
    btn_mark_done: "标记完成",
    btn_draft_upsell: "起草 Upsell",
    tag_reminder: "发送提醒",
    tag_solo: "独行预警",
    tag_guide: "同步导游",
    tag_followup: "待跟进",
    tag_sold_out: "已满员",
    tag_waitlist: "候补",
    guest_waitlist: "候补",
    guests_one: "位客人",
    guests_many: "位客人",
    memo_title: "前 30 天 — 流程改进",
    memo_h1: "1. 模板库 + AI 回复助手",
    memo_p1: "邮件回复页按意图索引模板。AI 优化语气；发送前必须人工审阅。",
    memo_h2: "2. 每日上午 9 点运营清单",
    memo_li1: "从 Rezdy 导出批量发送明日提醒（含天气）",
    memo_li2: "标记独行预订 — 主动联系或购买 2 张票",
    memo_li3: "通过微信/WhatsApp 格式同步导游",
    memo_li4: "清空跟进队列（多日咨询、满员候补）",
    memo_h3: "3. 多日行程 upsell 触发",
    memo_p3: "客人预订城市行程后，在确认或跟进邮件中自动推荐相关多日行程 — 如成都晚间团 →「成都 4 日游」。",
    toast_copied: "已复制到剪贴板！",
  },
};

export const INTENT_LABEL_KEYS = {
  "last-minute": "intent_last_minute",
  "solo-traveler": "intent_solo",
  dietary: "intent_dietary",
  "meeting-point": "intent_meeting",
  "sold-out": "intent_sold_out",
  "weather-cancel": "intent_weather",
  "multi-day": "intent_multi_day",
  "private-tour": "intent_private",
};

export const TAG_LABEL_KEYS = {
  reminder: "tag_reminder",
  "solo-alert": "tag_solo",
  "guide-sync": "tag_guide",
  "follow-up": "tag_followup",
  "sold-out": "tag_sold_out",
  waitlist: "tag_waitlist",
};

export function t(key, vars = {}) {
  let s = STRINGS[currentLang]?.[key] ?? STRINGS.en[key] ?? key;
  Object.entries(vars).forEach(([k, v]) => {
    s = s.replace(`{${k}}`, v);
  });
  return s;
}

export function getLang() {
  return currentLang;
}

export function onLangChange(fn) {
  callbacks.push(fn);
}

function applyStaticI18n() {
  $$("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
  });
  $$("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) el.placeholder = t(key);
  });
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
}

export function setLang(lang) {
  if (!STRINGS[lang]) return;
  currentLang = lang;
  sessionStorage.setItem(LANG_KEY, lang);
  applyStaticI18n();
  $$(".lang-switch button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
  callbacks.forEach((fn) => fn(lang));
}

export function initI18n() {
  currentLang = sessionStorage.getItem(LANG_KEY) || "en";
  if (!STRINGS[currentLang]) currentLang = "en";

  const bar = $("#lang-switch");
  if (bar) {
    bar.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });
  }

  applyStaticI18n();
  $$(".lang-switch button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
}

```

---

## File: `js/reminders.js`

```javascript
import { TOMORROW_BOOKINGS, REMINDER_TEMPLATE } from "./reminder-data.js";
import { fillTemplate, copyText, getApiKey, $ } from "./utils.js";
import { getWeatherLine } from "./weather.js";
import { chatCompletion, LOST_PLATE_SYSTEM } from "./openrouter.js";
import { t, onLangChange } from "./i18n.js";

function renderReminderTable() {
  const tbody = $("#reminder-table-body");
  if (!tbody) return;
  tbody.innerHTML = TOMORROW_BOOKINGS.map(
    (b) => `<tr>
      <td>${b.guest}</td>
      <td>${b.tour}</td>
      <td>${b.city}</td>
      <td>${b.time}</td>
      <td>${b.dietary}</td>
      <td>${b.guideName}</td>
    </tr>`
  ).join("");
}

async function buildReminderDraft(booking, weatherLine) {
  const vars = {
    guestName: booking.guest.split("&")[0].trim(),
    tourName: booking.tour,
    tourDate: booking.tourDate,
    tourTime: booking.time,
    meetingPoint: booking.meetingPoint,
    guideName: booking.guideName,
    weatherLine,
    dietaryNotes: booking.dietary,
  };
  let draft = fillTemplate(REMINDER_TEMPLATE, vars);
  if (booking.dietary !== "None") {
    draft = draft.replace("Reply if you have", `We've noted your dietary needs (${booking.dietary}). Reply if you have`);
  }

  if (getApiKey()) {
    try {
      const ai = await chatCompletion(
        LOST_PLATE_SYSTEM,
        `Write a pre-tour reminder email. Use this data:\n${JSON.stringify({ ...vars, weatherLine })}\n\nKeep under 180 words. Include weather line naturally.`
      );
      if (ai) draft = ai;
    } catch { /* keep template */ }
  }
  return draft;
}

export async function generateAllReminders() {
  const container = $("#reminder-drafts");
  const btn = $("#reminder-generate-btn");
  const status = $("#reminder-status");
  if (!container) return;

  btn.disabled = true;
  status.textContent = t("status_fetching");
  container.innerHTML = "";

  for (const booking of TOMORROW_BOOKINGS) {
    const weatherLine = await getWeatherLine(booking.cityId, booking.lat, booking.lng);
    const draft = await buildReminderDraft(booking, weatherLine);
    const card = document.createElement("div");
    card.className = "reminder-card";
    card.innerHTML = `
      <div class="reminder-card-head">
        <strong>${booking.guest}</strong> — ${booking.city} · ${booking.time}
        <button type="button" class="btn btn-secondary btn-sm copy-reminder">${t("btn_copy")}</button>
      </div>
      <pre class="draft-output">${draft.replace(/</g, "&lt;")}</pre>`;
    card.querySelector(".copy-reminder").addEventListener("click", () => copyText(draft, t("toast_copied")));
    container.appendChild(card);
  }

  status.textContent = t("status_generated", { n: TOMORROW_BOOKINGS.length });
  btn.disabled = false;
}

export function initReminders() {
  renderReminderTable();
  $("#reminder-generate-btn")?.addEventListener("click", generateAllReminders);
  onLangChange(() => renderReminderTable());
}

```

---

## File: `js/reminder-data.js`

```javascript
export const REMINDER_TEMPLATE = `Hi {{guestName}},

This is a friendly reminder about your upcoming Lost Plate tour!

**Tour:** {{tourName}}
**Date & time:** {{tourDate}} at {{tourTime}}
**Meeting point:** {{meetingPoint}}
**Guide:** {{guideName}}

**What to bring:** Comfortable walking shoes, appetite, and a light layer.

{{weatherLine}}

We can't wait to eat with you! Reply if you have any last-minute questions.

Cheers,
Lost Plate Guest Services`;

export const TOMORROW_BOOKINGS = [
  {
    id: 1,
    guest: "James & Emma Walsh",
    email: "j.walsh@email.com",
    tour: "Beijing Hutong Evening Food Tour",
    city: "Beijing",
    cityId: "beijing",
    lat: 39.9042,
    lng: 116.4074,
    time: "5:30 PM",
    tourDate: "Tomorrow, July 10",
    meetingPoint: "Beijing hutong meeting point (exact pin sent 24h prior)",
    guideName: "Winnie",
    dietary: "None",
  },
  {
    id: 2,
    guest: "Sarah Chen",
    email: "s.chen@email.com",
    tour: "Chengdu Evening Food Tour by Tuktuk",
    city: "Chengdu",
    cityId: "chengdu",
    lat: 30.5728,
    lng: 104.0668,
    time: "7:00 PM",
    tourDate: "Tomorrow, July 10",
    meetingPoint: "Tuktuk pickup near Kuanzhai Alley",
    guideName: "Li Wei",
    dietary: "Vegetarian",
  },
  {
    id: 3,
    guest: "Marcus Rivera",
    email: "m.rivera@email.com",
    tour: "Bangkok Evening Food Tour by Tuktuk",
    city: "Bangkok",
    cityId: "bangkok",
    lat: 13.7563,
    lng: 100.5018,
    time: "6:00 PM",
    tourDate: "Tomorrow, July 10",
    meetingPoint: "BTS station exit — guide will have Lost Plate sign",
    guideName: "Nok",
    dietary: "1 pescatarian",
  },
  {
    id: 4,
    guest: "Linda Park",
    email: "l.park@email.com",
    tour: "Portland Food Carts, Pods, & Patios Tour",
    city: "Portland",
    cityId: "portland",
    lat: 45.5152,
    lng: -122.6784,
    time: "11:00 AM",
    tourDate: "Tomorrow, July 10",
    meetingPoint: "Eastside food pod cluster — details in confirmation",
    guideName: "Herb",
    dietary: "Gluten-free",
  },
  {
    id: 5,
    guest: "David Kim",
    email: "d.kim@email.com",
    tour: "Xi'an Evening Food Tour by Tuktuk",
    city: "Xi'an",
    cityId: "xian",
    lat: 34.3416,
    lng: 108.9398,
    time: "6:30 PM",
    tourDate: "Tomorrow, July 10",
    meetingPoint: "Muslim Quarter meeting spot",
    guideName: "Haitao",
    dietary: "None",
  },
];

```

---

## File: `js/weather.js`

```javascript
const MOCK_WEATHER = {
  beijing: "Clear skies expected in Beijing — comfortable for an evening walk.",
  chengdu: "Light rain possible in Chengdu tomorrow evening — bring an umbrella.",
  shanghai: "Warm and humid in Shanghai — dress light and stay hydrated.",
  xian: "Pleasant evening in Xi'an — great weather for street food.",
  bangkok: "Warm with a chance of showers in Bangkok — umbrella recommended.",
  hanoi: "Typical humid evening in Hanoi — light breathable clothing suggested.",
  portland: "Mild morning in Portland — perfect for food carts and patios.",
  "siem-reap": "Hot and sunny in Siem Reap — hat and water recommended.",
};

export async function getWeatherLine(cityId, lat, lng) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,precipitation_probability_max&forecast_days=1&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("weather fetch failed");
    const data = await res.json();
    const code = data.daily?.weathercode?.[0];
    const precip = data.daily?.precipitation_probability_max?.[0];
    const temp = data.daily?.temperature_2m_max?.[0];
    const cityLabel = cityId.replace("-", " ");

    if (precip >= 50) {
      return `**Weather:** Rain likely (${precip}% chance, ~${Math.round(temp)}°C) — please bring an umbrella.`;
    }
    if (code === 0 || code === 1) {
      return `**Weather:** Clear and pleasant (~${Math.round(temp)}°C) — perfect for a food tour!`;
    }
    return `**Weather:** Mixed conditions (~${Math.round(temp)}°C) — dress in layers for ${cityLabel}.`;
  } catch {
    return `**Weather:** ${MOCK_WEATHER[cityId] || "Check local forecast before your tour — we run rain or shine!"}`;
  }
}

```

---

## File: `js/guide-comms.js`

```javascript
import { GUIDES, formatWeChat, formatWhatsApp, formatRezdyNote } from "./guide-data.js";
import { copyText, getApiKey, $ } from "./utils.js";
import { chatCompletion, LOST_PLATE_SYSTEM } from "./openrouter.js";
import { t } from "./i18n.js";

function populateGuideSelects() {
  const citySel = $("#guide-city");
  const guideSel = $("#guide-name");
  if (!citySel || !guideSel) return;

  const cities = [...new Set(GUIDES.map((g) => g.city))];
  citySel.innerHTML = cities.map((c) => `<option value="${c}">${c}</option>`).join("");

  function refreshGuides() {
    const city = citySel.value;
    const guides = GUIDES.filter((g) => g.city === city);
    guideSel.innerHTML = guides.map((g) => `<option value="${g.id}">${g.name}</option>`).join("");
    generateGuideComms();
  }

  citySel.addEventListener("change", refreshGuides);
  guideSel.addEventListener("change", generateGuideComms);
  refreshGuides();
}

async function generateGuideComms() {
  const guideId = $("#guide-name")?.value;
  const update = $("#guide-update")?.value?.trim() || "";
  const tourTime = $("#guide-tour-time")?.value || "7:00 PM";
  const guide = GUIDES.find((g) => g.id === guideId);
  if (!guide || !update) return;

  let wechat = formatWeChat(guide, update, tourTime);
  let whatsapp = formatWhatsApp(guide, update, tourTime);
  const rezdy = formatRezdyNote(guide, update);

  if (getApiKey()) {
    try {
      const ai = await chatCompletion(
        LOST_PLATE_SYSTEM,
        `Format this guide update for ${guide.name} in ${guide.city}. Tour time: ${tourTime}.\nUpdate: ${update}\n\nReturn exactly two sections separated by "---WECHAT---" and "---WHATSAPP---". WeChat: short bullets. WhatsApp: slightly warmer, 2-3 sentences + bullets. No markdown.`
      );
      if (ai) {
        const parts = ai.split(/---WHATSAPP---|---WECHAT---/i).map((p) => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          wechat = parts[0].replace(/^WeChat:?\s*/i, "");
          whatsapp = parts[1].replace(/^WhatsApp:?\s*/i, "");
        } else if (parts.length === 1) {
          wechat = parts[0];
        }
      }
    } catch { /* keep templates */ }
  }

  $("#guide-wechat-output").textContent = wechat;
  $("#guide-whatsapp-output").textContent = whatsapp;
  $("#guide-rezdy-output").textContent = rezdy;
}

export function initGuideComms() {
  populateGuideSelects();
  $("#guide-update")?.addEventListener("input", generateGuideComms);
  $("#guide-tour-time")?.addEventListener("input", generateGuideComms);
  $("#guide-generate-btn")?.addEventListener("click", generateGuideComms);

  $("#guide-copy-wechat")?.addEventListener("click", () => copyText($("#guide-wechat-output")?.textContent || "", t("toast_copied")));
  $("#guide-copy-whatsapp")?.addEventListener("click", () => copyText($("#guide-whatsapp-output")?.textContent || "", t("toast_copied")));
  $("#guide-copy-rezdy")?.addEventListener("click", () => copyText($("#guide-rezdy-output")?.textContent || "", t("toast_copied")));

  $("#guide-update").value = "Party of 4 on 7pm tour. 2 vegetarians — please confirm tofu/alternate dishes at stops 3 and 5. One guest gluten-free.";
  generateGuideComms();
}

```

---

## File: `js/guide-data.js`

```javascript
export const GUIDES = [
  { id: "bj-winnie", city: "Beijing", cityId: "beijing", name: "Winnie", channel: "wechat" },
  { id: "cd-liwei", city: "Chengdu", cityId: "chengdu", name: "Li Wei", channel: "wechat" },
  { id: "sh-ming", city: "Shanghai", cityId: "shanghai", name: "Ming", channel: "wechat" },
  { id: "xa-haitao", city: "Xi'an", cityId: "xian", name: "Haitao", channel: "wechat" },
  { id: "bk-nok", city: "Bangkok", cityId: "bangkok", name: "Nok", channel: "whatsapp" },
  { id: "hn-lan", city: "Hanoi", cityId: "hanoi", name: "Lan", channel: "whatsapp" },
  { id: "pdx-herb", city: "Portland", cityId: "portland", name: "Herb", channel: "whatsapp" },
];

export function formatWeChat(guide, update, tourTime) {
  return `[Lost Plate — ${guide.city}]
Guide: ${guide.name}
Time: ${tourTime || "see schedule"}

${update.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => `• ${l}`).join("\n")}

Please confirm receipt. Thanks!`;
}

export function formatWhatsApp(guide, update, tourTime) {
  return `Hi ${guide.name}! Lost Plate update for ${guide.city}:

${update.trim()}

Tour time: ${tourTime || "TBC"}
Please reply to confirm you've got this. Thank you!`;
}

export function formatRezdyNote(guide, update) {
  return `Guide sync (${guide.city}/${guide.name}): ${update.replace(/\s+/g, " ").trim()}`;
}

```

---

## File: `js/ops-board.js`

```javascript
import { MOCK_BOOKINGS } from "./data.js";
import { $ } from "./utils.js";
import { loadUpsellContext } from "./email-reply.js";
import { t, TAG_LABEL_KEYS, onLangChange } from "./i18n.js";

let queue = [];

function guestLabel(guests) {
  if (guests === 0) return t("guest_waitlist");
  return `${guests} ${guests > 1 ? t("guests_many") : t("guests_one")}`;
}

function updateStats() {
  let solo = 0, reminder = 0, followup = 0;
  queue.forEach((b) => {
    b.flags.forEach((f) => {
      if (f === "solo-alert") solo++;
      if (f === "reminder") reminder++;
      if (f === "follow-up") followup++;
    });
  });
  $("#stat-tours").textContent = queue.filter((b) => b.time !== "—").length;
  $("#stat-reminders").textContent = reminder;
  $("#stat-solo").textContent = solo;
  $("#stat-followups").textContent = followup;
}

function renderRows() {
  const container = $("#bookings-list");
  if (!container) return;
  container.innerHTML = "";

  queue.forEach((b) => {
    const row = document.createElement("div");
    row.className = "booking-row";
    row.dataset.flags = JSON.stringify(b.flags);
    row.dataset.hasTour = b.time !== "—" ? "1" : "0";

    const tagMap = {
      reminder: "tag-reminder",
      "solo-alert": "tag-solo",
      "guide-sync": "tag-guide",
      "follow-up": "tag-followup",
      "sold-out": "tag-sold-out",
      waitlist: "tag-waitlist",
    };

    const tags = b.flags.map((f) => {
      const cls = tagMap[f] || "";
      const key = TAG_LABEL_KEYS[f];
      return `<span class="tag ${cls}">${t(key || f)}</span>`;
    }).join("");

    const actions = document.createElement("div");
    actions.className = "booking-actions";

    const doneBtn = document.createElement("button");
    doneBtn.type = "button";
    doneBtn.className = "btn btn-secondary btn-sm btn-done";
    doneBtn.textContent = t("btn_mark_done");
    doneBtn.addEventListener("click", () => {
      row.remove();
      queue = queue.filter((x) => x.id !== b.id);
      updateStats();
    });
    actions.appendChild(doneBtn);

    if (b.flags.includes("follow-up") && b.upsellEmail) {
      const upsellBtn = document.createElement("button");
      upsellBtn.type = "button";
      upsellBtn.className = "btn btn-primary btn-sm";
      upsellBtn.textContent = t("btn_draft_upsell");
      upsellBtn.addEventListener("click", () => loadUpsellContext({ emailText: b.upsellEmail }));
      actions.appendChild(upsellBtn);
    }

    row.innerHTML = `
      <div class="booking-main">
        <strong>${b.guest}</strong> — ${b.tour}
        <div class="booking-meta">${b.city} · ${b.time} · ${guestLabel(b.guests)}${b.dietary !== "None" ? ` · ${b.dietary}` : ""}</div>
        <div class="tags">${tags}</div>
        ${b.guideNote ? `<div class="guide-note">📋 ${b.guideNote}</div>` : ""}
      </div>`;
    row.appendChild(actions);
    container.appendChild(row);
  });

  updateStats();
}

export function renderOpsBoard() {
  queue = MOCK_BOOKINGS.map((b) => ({ ...b }));
  renderRows();
}

export function initOpsBoard() {
  renderOpsBoard();
  onLangChange(() => renderRows());
}

```

---

