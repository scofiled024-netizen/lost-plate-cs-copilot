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
