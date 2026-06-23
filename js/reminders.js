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
