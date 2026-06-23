import { initTabs, initApiKeyField } from "./utils.js";
import { initI18n } from "./i18n.js";
import { initEmailReply } from "./email-reply.js";
import { initReminders } from "./reminders.js";
import { initGuideComms } from "./guide-comms.js";
import { initOpsBoard } from "./ops-board.js";

document.addEventListener("DOMContentLoaded", () => {
  initI18n();
  initTabs();
  initApiKeyField();
  initEmailReply();
  initReminders();
  initGuideComms();
  initOpsBoard();
});
