import { MOCK_BOOKINGS } from "./data.js";
import { $, $$ } from "./utils.js";
import { loadUpsellContext } from "./email-reply.js";
import { t, TAG_LABEL_KEYS, onLangChange } from "./i18n.js";
import { openModal, closeModal } from "./modal.js";

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

function renderBookingRow(b, container) {
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
    upsellBtn.addEventListener("click", () => {
      closeModal();
      loadUpsellContext({ emailText: b.upsellEmail });
    });
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
}

function renderRows(targetId = "bookings-list") {
  const container = $(`#${targetId}`);
  if (!container) return;
  container.innerHTML = "";
  queue.forEach((b) => renderBookingRow(b, container));
  updateStats();
}

export function renderOpsBoard() {
  queue = MOCK_BOOKINGS.map((b) => ({ ...b }));
  renderRows();
}

/* ── Stat click handlers ── */

const STAT_FILTERS = {
  tours: (b) => b.time !== "—",
  reminders: (b) => b.flags.includes("reminder"),
  solo: (b) => b.flags.includes("solo-alert"),
  followups: (b) => b.flags.includes("follow-up"),
};

function openStatModal(category) {
  const filtered = queue.filter(STAT_FILTERS[category] || (() => false));
  const title = t(`ops_detail_${category}`) || category;
  const intro = t(`ops_detail_${category}_intro`) || "";

  let bodyHtml = `<p class="hint" style="margin-bottom:1rem">${intro}</p>`;
  if (filtered.length === 0) {
    bodyHtml += `<p class="status-line">${t("ops_detail_empty")}</p>`;
  } else {
    const rows = document.createElement("div");
    rows.id = "modal-booking-rows";
    filtered.forEach((b) => renderBookingRow(b, rows));
    bodyHtml += rows.outerHTML;
  }

  openModal({
    title,
    bodyHtml,
    footerHtml: "",
  });
}

function onStatClick(e) {
  const stat = e.currentTarget;
  const category = stat.dataset.stat;
  if (category) openStatModal(category);
}

function onStatKeydown(e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    const category = e.currentTarget.dataset.stat;
    if (category) openStatModal(category);
  }
}

function initStatCards() {
  $$(".stat.clickable").forEach((el) => {
    el.addEventListener("click", onStatClick);
    el.addEventListener("keydown", onStatKeydown);
  });
}

export function initOpsBoard() {
  renderOpsBoard();
  initStatCards();
  onLangChange(() => renderRows());
}
