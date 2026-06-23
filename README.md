# Lost Plate Guest Ops Copilot

A lightweight demo for guest operations workflows: email replies, daily reminders, guide comms, and an interactive ops board.

**Live demo:** https://lost-plate-cs-copilot.vercel.app/

## Features

- **Email Reply** — paste a guest email, auto-detect intents, generate a warm English reply (optional OpenRouter AI)
- **Daily Reminders** — mock tomorrow's bookings with weather → batch reminder drafts
- **Guide Comms** — format updates for WeChat, WhatsApp, and Rezdy notes
- **Ops Board** — priority queue with Mark Done and one-click upsell follow-ups
- **First 30 Days** — process improvement memo for onboarding
- **Eng / 中** — UI language toggle (guest reply drafts stay English)

## Run locally

```bash
cd ~/lost-plate-cs-copilot
python3 -m http.server 8080
```

Open http://localhost:8080 (ES modules require a local server).

## Tech

Static HTML, CSS, and JavaScript — no build step. Optional OpenRouter API key is stored in `sessionStorage` only.
