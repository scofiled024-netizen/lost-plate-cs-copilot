export const GUIDES = [
  { id: "bj-winnie", city: "Beijing", cityId: "beijing", name: "Winnie", channel: "wechat" },
  { id: "cd-liwei", city: "Chengdu", cityId: "chengdu", name: "Li Wei", channel: "wechat" },
  { id: "sh-ming", city: "Shanghai", cityId: "shanghai", name: "Ming", channel: "wechat" },
  { id: "xa-haitao", city: "Xi'an", cityId: "xian", name: "Haitao", channel: "wechat" },
  { id: "bk-nok", city: "Bangkok", cityId: "bangkok", name: "Nok", channel: "whatsapp" },
  { id: "hn-lan", city: "Hanoi", cityId: "hanoi", name: "Lan", channel: "whatsapp" },
  { id: "pdx-herb", city: "Portland", cityId: "portland", name: "Herb", channel: "whatsapp" },
];

export function formatWeChat(guide, update, tourTime) {
  return `[Lost Plate — ${guide.city}]
Guide: ${guide.name}
Time: ${tourTime || "see schedule"}

${update.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => `• ${l}`).join("\n")}

Please confirm receipt. Thanks!`;
}

export function formatWhatsApp(guide, update, tourTime) {
  return `Hi ${guide.name}! Lost Plate update for ${guide.city}:

${update.trim()}

Tour time: ${tourTime || "TBC"}
Please reply to confirm you've got this. Thank you!`;
}

export function formatRezdyNote(guide, update) {
  return `Guide sync (${guide.city}/${guide.name}): ${update.replace(/\s+/g, " ").trim()}`;
}
