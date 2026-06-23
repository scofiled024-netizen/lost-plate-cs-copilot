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
