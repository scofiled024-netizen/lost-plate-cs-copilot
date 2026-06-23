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
