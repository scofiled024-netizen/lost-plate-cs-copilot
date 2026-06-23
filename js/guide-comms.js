import { GUIDES, formatWeChat, formatWhatsApp, formatRezdyNote } from "./guide-data.js";
import { copyText, getApiKey, $ } from "./utils.js";
import { chatCompletion, LOST_PLATE_SYSTEM } from "./openrouter.js";
import { t } from "./i18n.js";

function populateGuideSelects() {
  const citySel = $("#guide-city");
  const guideSel = $("#guide-name");
  if (!citySel || !guideSel) return;

  const cities = [...new Set(GUIDES.map((g) => g.city))];
  citySel.innerHTML = cities.map((c) => `<option value="${c}">${c}</option>`).join("");

  function refreshGuides() {
    const city = citySel.value;
    const guides = GUIDES.filter((g) => g.city === city);
    guideSel.innerHTML = guides.map((g) => `<option value="${g.id}">${g.name}</option>`).join("");
    generateGuideComms();
  }

  citySel.addEventListener("change", refreshGuides);
  guideSel.addEventListener("change", generateGuideComms);
  refreshGuides();
}

async function generateGuideComms() {
  const guideId = $("#guide-name")?.value;
  const update = $("#guide-update")?.value?.trim() || "";
  const tourTime = $("#guide-tour-time")?.value || "7:00 PM";
  const guide = GUIDES.find((g) => g.id === guideId);
  if (!guide || !update) return;

  let wechat = formatWeChat(guide, update, tourTime);
  let whatsapp = formatWhatsApp(guide, update, tourTime);
  const rezdy = formatRezdyNote(guide, update);

  if (getApiKey()) {
    try {
      const ai = await chatCompletion(
        LOST_PLATE_SYSTEM,
        `Format this guide update for ${guide.name} in ${guide.city}. Tour time: ${tourTime}.\nUpdate: ${update}\n\nReturn exactly two sections separated by "---WECHAT---" and "---WHATSAPP---". WeChat: short bullets. WhatsApp: slightly warmer, 2-3 sentences + bullets. No markdown.`
      );
      if (ai) {
        const parts = ai.split(/---WHATSAPP---|---WECHAT---/i).map((p) => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          wechat = parts[0].replace(/^WeChat:?\s*/i, "");
          whatsapp = parts[1].replace(/^WhatsApp:?\s*/i, "");
        } else if (parts.length === 1) {
          wechat = parts[0];
        }
      }
    } catch { /* keep templates */ }
  }

  $("#guide-wechat-output").textContent = wechat;
  $("#guide-whatsapp-output").textContent = whatsapp;
  $("#guide-rezdy-output").textContent = rezdy;
}

export function initGuideComms() {
  populateGuideSelects();
  $("#guide-update")?.addEventListener("input", generateGuideComms);
  $("#guide-tour-time")?.addEventListener("input", generateGuideComms);
  $("#guide-generate-btn")?.addEventListener("click", generateGuideComms);

  $("#guide-copy-wechat")?.addEventListener("click", () => copyText($("#guide-wechat-output")?.textContent || "", t("toast_copied")));
  $("#guide-copy-whatsapp")?.addEventListener("click", () => copyText($("#guide-whatsapp-output")?.textContent || "", t("toast_copied")));
  $("#guide-copy-rezdy")?.addEventListener("click", () => copyText($("#guide-rezdy-output")?.textContent || "", t("toast_copied")));

  $("#guide-update").value = "Party of 4 on 7pm tour. 2 vegetarians — please confirm tofu/alternate dishes at stops 3 and 5. One guest gluten-free.";
  generateGuideComms();
}
