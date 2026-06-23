# Follow-up email — v2.1

**Subject:** Guest Ops Copilot demo — Lost Plate CS application

Hi [Name],

I applied for the Customer Service Specialist role and built a **Guest Ops Copilot** based on your actual workflow:

**Demo:** https://scofiled024-netizen.github.io/lost-plate-cs-copilot/

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
