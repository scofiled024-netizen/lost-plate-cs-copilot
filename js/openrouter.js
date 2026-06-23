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
