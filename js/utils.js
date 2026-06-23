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
