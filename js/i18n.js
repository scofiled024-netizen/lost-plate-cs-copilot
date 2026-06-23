import { $, $$ } from "./utils.js";

const LANG_KEY = "lp_lang";
let currentLang = "en";
const callbacks = [];

export const STRINGS = {
  en: {
    title: "Lost Plate Guest Ops Copilot",
    nav_tagline: "Guest Ops Copilot",
    subtitle: "Email · Reminders · Guide · Ops",
    disclaimer: "Demo built independently — not affiliated with Lost Plate Food Tours",
    tab_email: "Email Reply",
    tab_reminders: "Daily Reminders",
    tab_guide: "Guide Comms",
    tab_ops: "Ops Board",
    email_guest_title: "Guest email",
    badge_paste: "paste",
    email_intents_title: "Intents",
    badge_autodetect: "auto-detect",
    btn_generate_reply: "Generate Reply",
    btn_copy: "Copy to clipboard",
    checklist_title: "Human edit checklist",
    guest_email_ph: "Paste the guest's English email here…",
    modal_title: "Reply draft",
    modal_copy: "一键复制 / Copy email",
    modal_close: "Close",
    status_paste_first: "Paste a guest email first.",
    status_select_intent: "Select at least one intent.",
    status_generating_ai: "Generating with AI…",
    status_generating_tpl: "Generating from templates…",
    status_ready_ai: "Draft ready (AI). Review before sending.",
    status_ready_tpl: "Draft ready (templates). Review before sending.",
    status_ready_fallback: "Draft ready (template fallback).",
    intent_last_minute: "Last-minute / past Rezdy cutoff",
    intent_solo: "Solo traveler options",
    intent_dietary: "Dietary restrictions",
    intent_meeting: "Confirm booking / meeting point",
    intent_sold_out: "Apologize — sold out",
    intent_weather: "Weather / cancellation policy",
    intent_multi_day: "Multi-day trip upsell",
    intent_private: "Private tour inquiry",
    reminders_title: "Tomorrow's tours",
    badge_mock: "mock sheet",
    reminders_hint: "Production: Rezdy export or Google Sheet. Demo uses mock data.",
    th_guest: "Guest",
    th_tour: "Tour",
    th_city: "City",
    th_time: "Time",
    th_dietary: "Dietary",
    th_guide: "Guide",
    btn_generate_reminders: "Generate all reminders",
    status_fetching: "Fetching weather and generating reminders…",
    status_generated: "Generated {n} reminder drafts.",
    guide_update_title: "Guide update",
    label_city: "City",
    label_guide: "Guide",
    label_tour_time: "Tour time",
    label_english_update: "English update",
    btn_refresh_formats: "Refresh formats",
    guide_wechat: "WeChat",
    guide_whatsapp: "WhatsApp",
    guide_rezdy: "Rezdy note",
    stat_tours: "Tours today",
    stat_reminders: "Reminders",
    stat_solo: "Solo alerts",
    stat_followups: "Follow-ups",
    ops_title: "Today's priorities",
    ops_detail_tours: "Tours today",
    ops_detail_tours_intro: "Today's scheduled tours across cities. Review time and guide assignments before sending reminders.",
    ops_detail_reminders: "Reminders",
    ops_detail_reminders_intro: "Guests needing 24h reminder emails. Check dietary notes and weather before sending.",
    ops_detail_solo: "Solo alerts",
    ops_detail_solo_intro: "Solo bookings — reach out with waitlist options or 2-ticket purchase link.",
    ops_detail_followups: "Follow-ups",
    ops_detail_followups_intro: "Multi-day inquiries, sold-out waitlists, and no-reply queue. Priority outreach.",
    ops_detail_empty: "No items in this queue.",
    btn_mark_done: "Mark Done",
    btn_draft_upsell: "Draft Upsell",
    tag_reminder: "Send reminder",
    tag_solo: "Solo alert",
    tag_guide: "Guide sync",
    tag_followup: "Follow-up",
    tag_sold_out: "Sold out",
    tag_waitlist: "Waitlist",
    guest_waitlist: "waitlist",
    guests_one: "guest",
    guests_many: "guests",
    toast_copied: "Copied to clipboard!",
  },
  zh: {
    title: "Lost Plate 客户管理助手",
    nav_tagline: "客户管理助手",
    subtitle: "邮件 · 提醒 · 导游 · 看板",
    disclaimer: "独立演示项目 — 与 Lost Plate Food Tours 无官方关联",
    tab_email: "邮件回复",
    tab_reminders: "每日提醒",
    tab_guide: "导游沟通",
    tab_ops: "运营看板",
    email_guest_title: "客人邮件",
    badge_paste: "粘贴",
    email_intents_title: "意图",
    badge_autodetect: "自动识别",
    btn_generate_reply: "生成回复",
    btn_copy: "复制到剪贴板",
    checklist_title: "人工核对清单",
    guest_email_ph: "在此粘贴客人的英文邮件…",
    modal_title: "回复草稿",
    modal_copy: "一键复制 / Copy email",
    modal_close: "关闭",
    status_paste_first: "请先粘贴客人邮件。",
    status_select_intent: "请至少选择一个意图。",
    status_generating_ai: "AI 生成中…",
    status_generating_tpl: "模板生成中…",
    status_ready_ai: "草稿已就绪（AI）。发送前请人工审阅。",
    status_ready_tpl: "草稿已就绪（模板）。发送前请人工审阅。",
    status_ready_fallback: "草稿已就绪（模板备用）。",
    intent_last_minute: "临期预订 / 已过 Rezdy 截止",
    intent_solo: "独行客人选项",
    intent_dietary: "饮食限制",
    intent_meeting: "确认预订 / 集合地点",
    intent_sold_out: "致歉 — 已满员",
    intent_weather: "天气 / 取消政策",
    intent_multi_day: "多日行程加购推荐",
    intent_private: "私人团咨询",
    reminders_title: "明日行程",
    badge_mock: "模拟表格",
    reminders_hint: "正式环境：Rezdy 导出或 Google Sheet。演示使用模拟数据。",
    th_guest: "客人",
    th_tour: "行程",
    th_city: "城市",
    th_time: "时间",
    th_dietary: "饮食",
    th_guide: "导游",
    btn_generate_reminders: "批量生成提醒",
    status_fetching: "获取天气并生成提醒中…",
    status_generated: "已生成 {n} 封提醒草稿。",
    guide_update_title: "导游更新",
    label_city: "城市",
    label_guide: "导游",
    label_tour_time: "行程时间",
    label_english_update: "英文更新内容",
    btn_refresh_formats: "刷新格式",
    guide_wechat: "微信",
    guide_whatsapp: "WhatsApp",
    guide_rezdy: "Rezdy 备注",
    stat_tours: "今日行程",
    stat_reminders: "待提醒",
    stat_solo: "独行预警",
    stat_followups: "待跟进",
    ops_title: "今日优先级",
    ops_detail_tours: "今日行程",
    ops_detail_tours_intro: "今日各城市已排行程。发送提醒前请核对时间和导游安排。",
    ops_detail_reminders: "待提醒",
    ops_detail_reminders_intro: "需发送 24h 提醒的客人。发送前检查饮食备注和天气情况。",
    ops_detail_solo: "独行预警",
    ops_detail_solo_intro: "独行客人 — 联系告知候补选项或提供 2 张票的购买链接。",
    ops_detail_followups: "待跟进",
    ops_detail_followups_intro: "多日行程咨询、满员候补、未回复队列。优先跟进。",
    ops_detail_empty: "此队列暂无项目。",
    btn_mark_done: "标记完成",
    btn_draft_upsell: "起草加购邮件",
    tag_reminder: "发送提醒",
    tag_solo: "独行预警",
    tag_guide: "同步导游",
    tag_followup: "待跟进",
    tag_sold_out: "已满员",
    tag_waitlist: "候补",
    guest_waitlist: "候补",
    guests_one: "位客人",
    guests_many: "位客人",
    toast_copied: "已复制到剪贴板！",
  },
};

export const INTENT_LABEL_KEYS = {
  "last-minute": "intent_last_minute",
  "solo-traveler": "intent_solo",
  dietary: "intent_dietary",
  "meeting-point": "intent_meeting",
  "sold-out": "intent_sold_out",
  "weather-cancel": "intent_weather",
  "multi-day": "intent_multi_day",
  "private-tour": "intent_private",
};

export const TAG_LABEL_KEYS = {
  reminder: "tag_reminder",
  "solo-alert": "tag_solo",
  "guide-sync": "tag_guide",
  "follow-up": "tag_followup",
  "sold-out": "tag_sold_out",
  waitlist: "tag_waitlist",
};

export function t(key, vars = {}) {
  let s = STRINGS[currentLang]?.[key] ?? STRINGS.en[key] ?? key;
  Object.entries(vars).forEach(([k, v]) => {
    s = s.replace(`{${k}}`, v);
  });
  return s;
}

export function getLang() {
  return currentLang;
}

export function onLangChange(fn) {
  callbacks.push(fn);
}

function applyStaticI18n() {
  $$("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
  });
  $$("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) el.placeholder = t(key);
  });
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
}

export function setLang(lang) {
  if (!STRINGS[lang]) return;
  currentLang = lang;
  sessionStorage.setItem(LANG_KEY, lang);
  applyStaticI18n();
  $$(".lang-switch button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
  callbacks.forEach((fn) => fn(lang));
}

export function initI18n() {
  currentLang = sessionStorage.getItem(LANG_KEY) || "en";
  if (!STRINGS[currentLang]) currentLang = "en";

  const bar = $("#lang-switch");
  if (bar) {
    bar.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });
  }

  applyStaticI18n();
  $$(".lang-switch button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
}
