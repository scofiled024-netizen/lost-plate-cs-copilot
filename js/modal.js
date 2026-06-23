/**
 * Shared modal shell — open/close/Esc/overlay-click
 */
import { $ } from "./utils.js";

export function openModal({ title, bodyHtml, footerHtml, onClose }) {
  const overlay = $("#modal-overlay");
  const body = $("#modal-body");
  const titleEl = $("#modal-title");
  if (!overlay || !body) return;

  if (titleEl) titleEl.textContent = title;
  body.innerHTML = bodyHtml || "";

  const footer = $("#modal-footer");
  if (footer) {
    footer.innerHTML = footerHtml || "";
  }

  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");

  // Focus trap: focus first focusable or close button
  const firstFocusable = overlay.querySelector("button, input, select, textarea, [tabindex]:not([tabindex='-1'])");
  if (firstFocusable) firstFocusable.focus();
  else overlay.querySelector(".modal-close")?.focus();

  // Store onClose callback
  if (onClose) overlay._onClose = onClose;
}

export function closeModal() {
  const overlay = $("#modal-overlay");
  if (!overlay || overlay.classList.contains("hidden")) return;

  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");

  // Clear body content
  const body = $("#modal-body");
  if (body) body.innerHTML = "";

  // Fire onClose callback
  if (overlay._onClose) {
    overlay._onClose();
    delete overlay._onClose;
  }
}

export function initModal() {
  const overlay = $("#modal-overlay");
  if (!overlay) return;

  // Close on overlay click (not on modal click)
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  // Close on Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Close button
  overlay.querySelector(".modal-close")?.addEventListener("click", closeModal);
}
