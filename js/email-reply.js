import { INQUIRY_TYPES, CITIES, TOURS } from "./data.js";
import { fillTemplate, getCutoffDescription, copyText, getApiKey, formatEmailForCopy, $, $$ } from "./utils.js";
import { chatCompletion, LOST_PLATE_SYSTEM } from "./openrouter.js";
import { t, INTENT_LABEL_KEYS, onLangChange } from "./i18n.js";
import { openModal, closeModal } from "./modal.js";

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
  const ta = $("#guest-email");
  if (ta && emailText) ta.value = emailText;
  renderIntentCheckboxes(new Set(["multi-day"]));
  onGuestEmailInput();
  $$(".intent-cb").forEach((cb) => {
    cb.checked = cb.value === "multi-day";
  });
  // Scroll the intents column into view
  $("#intent-list")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export async function generateEmailReply() {
  const emailText = $("#guest-email")?.value?.trim() || "";
  const intentIds = getSelectedIntentIds();
  const entities = extractEntities(emailText);
  const statusEl = $("#email-status");
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

  // Open modal with draft instead of writing inline
  btn.disabled = false;

  let sourceLabel = "";
  if (source === "openrouter") sourceLabel = t("status_ready_ai");
  else if (source === "template") sourceLabel = t("status_ready_tpl");
  else sourceLabel = t("status_ready_fallback");
  statusEl.textContent = sourceLabel;

  openEmailDraftModal({ draft, checklist: templateResult.checklist, entities });
}

function openEmailDraftModal({ draft, checklist, entities }) {
  const checklistHtml = checklist.length
    ? `<ul class="modal-checklist">${checklist.map((item) => `<li>${fillTemplate(item, entities)}</li>`).join("")}</ul>`
    : "";

  const bodyHtml = `
    <div class="modal-draft" id="modal-draft-body">${escapeHtml(draft)}</div>
    <h3 class="subhead" data-i18n="checklist_title">${t("checklist_title")}</h3>
    ${checklistHtml}
  `;

  const footerHtml = `
    <button type="button" class="btn btn-primary" id="modal-copy-btn" data-i18n="modal_copy">一键复制 / Copy email</button>
  `;

  openModal({
    title: t("modal_title"),
    bodyHtml,
    footerHtml,
    onClose: () => {
      const statusEl = $("#email-status");
      if (statusEl) statusEl.textContent = "";
    },
  });

  // Wire copy button after modal is in DOM
  setTimeout(() => {
    const copyBtn = $("#modal-copy-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const draftEl = $("#modal-draft-body");
        if (draftEl) {
          const plainText = formatEmailForCopy(draftEl.textContent || draftEl.innerText || "");
          copyText(plainText, t("toast_copied"));
        }
      });
    }
  }, 0);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export function initEmailReply() {
  renderIntentCheckboxes();
  $("#guest-email")?.addEventListener("input", onGuestEmailInput);
  $("#email-generate-btn")?.addEventListener("click", generateEmailReply);

  onLangChange(() => {
    const detected = detectIntents($("#guest-email")?.value || "");
    renderIntentCheckboxes(detected);
  });

  // Default example email
  $("#guest-email").value = `Hi,

I'm traveling solo to Chengdu next week and would love to join the evening food tour on July 12. I'm vegetarian — is that okay?

Also, I tried to book online but it said cutoff passed. Can you still help?

Thanks,
Sarah`;
  onGuestEmailInput();
}
