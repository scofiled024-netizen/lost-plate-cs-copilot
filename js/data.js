// Lost Plate tour & inquiry data (from lostplate.com)

export const CITIES = [
  { id: "beijing", name: "Beijing", region: "China" },
  { id: "chengdu", name: "Chengdu", region: "China" },
  { id: "shanghai", name: "Shanghai", region: "China" },
  { id: "xian", name: "Xi'an", region: "China" },
  { id: "bangkok", name: "Bangkok", region: "Thailand" },
  { id: "hanoi", name: "Hanoi", region: "Vietnam" },
  { id: "siem-reap", name: "Siem Reap", region: "Cambodia" },
  { id: "portland", name: "Portland, OR", region: "USA" },
];

export const TOURS = [
  { id: "bj-evening", city: "beijing", name: "Beijing Hutong Evening Food Tour", schedule: "evening" },
  { id: "bj-breakfast", city: "beijing", name: "Beijing Hutong Breakfast Food Tour", schedule: "morning" },
  { id: "cd-evening", city: "chengdu", name: "Chengdu Evening Food Tour by Tuktuk", schedule: "evening" },
  { id: "cd-panda", city: "chengdu", name: "Chengdu Full-Day Panda, Teahouse & Evening Food Tour", schedule: "full-day" },
  { id: "sh-evening", city: "shanghai", name: "Shanghai Evening Food Tour", schedule: "evening" },
  { id: "xa-evening", city: "xian", name: "Xi'an Evening Food Tour by Tuktuk", schedule: "evening" },
  { id: "bk-evening", city: "bangkok", name: "Bangkok Evening Food Tour by Tuktuk", schedule: "evening" },
  { id: "hn-evening", city: "hanoi", name: "Hanoi Old-Quarter Evening Food Tour", schedule: "evening" },
  { id: "sr-evening", city: "siem-reap", name: "Siem Reap Evening Food Tour by Tuktuk", schedule: "evening" },
  { id: "pdx-carts", city: "portland", name: "Portland Food Carts, Pods, & Patios Tour", schedule: "morning" },
];

export const INQUIRY_TYPES = [
  {
    id: "last-minute",
    label: "Last-minute booking (past Rezdy cutoff)",
    template: `Hi {{guestName}},

Thank you for reaching out about joining us on the {{tourName}} on {{tourDate}}!

Our online booking system typically closes {{cutoffDescription}}, but I'd be happy to check availability with our team for your party of {{partySize}}. Could you confirm your preferred start time and any dietary restrictions?

If we have space, I can send a manual payment link to secure your spots.

Warm regards,
Lost Plate Guest Services`,
    checklist: ["Verify availability with guide", "Confirm party size", "Send manual payment link if approved"],
  },
  {
    id: "solo-traveler",
    label: "Solo traveler / minimum 2 guests",
    template: `Hi {{guestName}},

Thanks for your interest in the {{tourName}} on {{tourDate}}!

Our public tours require a minimum of 2 guests to run. As a solo traveler, you have two options:
1. Purchase 2 tickets to guarantee the tour runs for you
2. Join our waitlist — if another guest books, we'll confirm you at the single-guest rate

Would either option work for you? We're happy to help find the best fit.

Best,
Lost Plate Guest Services`,
    checklist: ["Check current bookings for date", "Offer waitlist or 2-ticket option", "Note in Rezdy if confirmed"],
  },
  {
    id: "dietary",
    label: "Dietary restrictions",
    template: `Hi {{guestName}},

Thank you for letting us know about your dietary needs: {{dietaryNotes}}.

For the {{tourName}}, our guides can accommodate many restrictions by adjusting dishes at each stop. I've flagged this for your guide so they can plan alternatives in advance.

Please note some traditional stops may have limited options — we'll ensure you still enjoy a full experience!

Cheers,
Lost Plate Guest Services`,
    checklist: ["Notify guide of dietary needs", "Confirm substitutions possible", "Update booking notes in Rezdy"],
  },
  {
    id: "private-tour",
    label: "Private tour / group event",
    template: `Hi {{guestName}},

We'd love to host your group of {{partySize}} for a private food experience in {{cityName}}!

Private tours can be customized for timing, dietary preferences, and pace. For the {{tourName}} or a fully bespoke route, I'll connect you with our private tours team with a few date options: {{tourDate}} and nearby dates.

Could you share your ideal start time and any must-have cuisines?

Best,
Lost Plate Guest Services`,
    checklist: ["Loop in private tours contact", "Provide pricing range", "Suggest 2–3 date alternatives"],
  },
  {
    id: "meeting-point",
    label: "Meeting point / what to bring",
    template: `Hi {{guestName}},

Great question! For your {{tourName}} on {{tourDate}}:

**Meeting point:** We'll send the exact address and guide contact in your reminder email 24 hours before the tour.
**What to bring:** Comfortable walking shoes, appetite, and a light layer. Cash/card for optional extras.
**Duration:** Approximately 3 hours with {{partySize}} in your party.

See you soon!
Lost Plate Guest Services`,
    checklist: ["Include exact meeting pin in reminder", "Confirm guide name", "Send reminder 24h before"],
  },
  {
    id: "weather-cancel",
    label: "Weather / cancellation policy",
    template: `Hi {{guestName}},

Our tours run rain or shine — some of the best local spots are cozy in any weather! If conditions are unsafe, we'll contact you directly.

**Cancellation policy:** Free cancellation up to 24 hours before your {{tourName}} on {{tourDate}}. Inside 24 hours, tickets are non-refundable but we can help reschedule subject to availability.

Let me know if you'd like to move your booking.

Warm regards,
Lost Plate Guest Services`,
    checklist: ["Verify cancellation window", "Check reschedule availability", "Process refund if eligible"],
  },
  {
    id: "multi-day",
    label: "Multi-day trip follow-up",
    template: `Hi {{guestName}},

Following up on your interest in our multi-day trips — since you're visiting {{cityName}}, you might love pairing your {{tourName}} with our "Best of China in 11 Days" or a 4-day {{cityName}} itinerary.

Happy to share sample day-by-day routes and pricing. Are you traveling solo or with a group of {{partySize}}?

Looking forward to helping plan your food adventure!
Lost Plate Guest Services`,
    checklist: ["Send relevant multi-day PDF/link", "Log follow-up in CRM", "Offer 10% multi-tour discount if booking 2+"],
  },
  {
    id: "multi-tour-discount",
    label: "Book 2+ tours (10% discount)",
    template: `Hi {{guestName}},

Great news — when you book 2 or more Lost Plate tours, you receive **10% off** the total!

For your plans around {{tourDate}}, I'd suggest combining the {{tourName}} with another evening or morning tour in {{cityName}}. I can hold both dates while you decide.

Would you like recommendations based on your {{partySize}} guests and {{dietaryNotes}}?

Best,
Lost Plate Guest Services`,
    checklist: ["Apply 10% discount code", "Confirm both dates available", "Send combined confirmation"],
  },
  {
    id: "contact-routing",
    label: "Portland vs China/SEA routing",
    template: `Hi {{guestName}},

Thanks for reaching out! Lost Plate routes inquiries by region so you reach the right team quickly:

**China & Southeast Asia tours** (including {{cityName}}):
- Email: info@lostplate.com
- Phone/WhatsApp: +86 156 9210 9030
- WeChat: lostplate

**Portland, OR tours** (food carts, wine, coffee):
- Phone: +1 503-409-5593
- Email: info@lostplate.com
- WeChat: lostplate

I've noted your question about the {{tourName}} and can help from here if you're booking in Asia. For Portland tours, our US team will follow up directly.

Warm regards,
Lost Plate Guest Services`,
    checklist: ["Route to correct regional inbox", "Include phone + WeChat for Asia guests", "Confirm guest timezone"],
  },
  {
    id: "sold-out",
    label: "Apologize — sold out / waitlist",
    template: `Hi {{guestName}},

Thank you for your interest in the {{tourName}} on {{tourDate}}!

Unfortunately, this date is currently sold out. I'd love to help you still join us:
1. **Waitlist** — I'll notify you immediately if a spot opens
2. **Nearby dates** — I can check July 9 or 11 for the same tour
3. **Alternative tour** — our morning or nearby-city options may have availability

Which would work best for your party of {{partySize}}?

Warm regards,
Lost Plate Guest Services`,
    checklist: ["Check waitlist in Rezdy", "Offer 2 alternate dates", "Note dietary: {{dietaryNotes}}"],
  },
  {
    id: "review-request",
    label: "Post-tour review request",
    template: `Hi {{guestName}},

We hope you loved the {{tourName}}! If you have a moment, a Google or TripAdvisor review helps other food lovers discover local gems through Lost Plate.

{{guideName}} and our restaurant partners truly appreciate the shout-out.

Thank you for exploring with us — we'd welcome you back anytime in {{cityName}} or our other 10+ cities!

Cheers,
Lost Plate Guest Services`,
    checklist: ["Personalize with guide name", "Include review links", "Send 24–48h after tour"],
  },
];

export const MOCK_BOOKINGS = [
  {
    id: 1,
    guest: "Sarah Chen",
    tour: "Chengdu Evening Food Tour by Tuktuk",
    city: "Chengdu",
    time: "7:00 PM",
    guests: 1,
    flags: ["solo-alert", "reminder"],
    dietary: "Vegetarian",
    guideNote: "2 vegetarians — confirm tofu dishes at stops 3 & 5",
  },
  {
    id: 2,
    guest: "James & Emma Walsh",
    tour: "Beijing Hutong Evening Food Tour",
    city: "Beijing",
    time: "5:30 PM",
    guests: 2,
    flags: ["reminder"],
    dietary: "None",
    guideNote: null,
  },
  {
    id: 3,
    guest: "Marcus Rivera",
    tour: "Bangkok Evening Food Tour by Tuktuk",
    city: "Bangkok",
    time: "6:00 PM",
    guests: 4,
    flags: ["reminder", "guide-sync"],
    dietary: "1 pescatarian",
    guideNote: "Group of 4 — pescatarian at stop 2",
  },
  {
    id: 4,
    guest: "Linda Park",
    tour: "Portland Food Carts, Pods, & Patios Tour",
    city: "Portland",
    time: "11:00 AM",
    guests: 2,
    flags: ["reminder"],
    dietary: "Gluten-free",
    guideNote: null,
  },
  {
    id: 5,
    guest: "Tom Nguyen",
    tour: "Hanoi Old-Quarter Evening Food Tour",
    city: "Hanoi",
    time: "5:00 PM",
    guests: 1,
    flags: ["solo-alert", "follow-up"],
    dietary: "None",
    guideNote: "Solo — sent waitlist offer, awaiting reply",
    upsellEmail: `Hi,

I'm a solo traveler interested in the Hanoi Old-Quarter Evening Food Tour. Are there any other guests booked for July 15? If not, I'd consider buying 2 tickets.

Thanks,
Tom`,
  },
  {
    id: 6,
    guest: "Anna Kowalski",
    tour: "Best of China inquiry",
    city: "Multi-city",
    time: "—",
    guests: 2,
    flags: ["follow-up"],
    dietary: "None",
    guideNote: "Multi-day inquiry from 3 days ago — no reply yet",
    upsellEmail: `Hi,

I inquired about your Best of China 11-day trip last week. Still interested — can you send pricing for September for 2 people?

Thanks,
Anna`,
  },
  {
    id: 7,
    guest: "David Kim",
    tour: "Xi'an Evening Food Tour by Tuktuk",
    city: "Xi'an",
    time: "6:30 PM",
    guests: 3,
    flags: ["reminder"],
    dietary: "None",
    guideNote: null,
  },
  {
    id: 8,
    guest: "Rachel M. + Bruno T. (waitlist)",
    tour: "Beijing Hutong Evening Food Tour — SOLD OUT",
    city: "Beijing",
    time: "5:30 PM",
    guests: 0,
    flags: ["sold-out", "waitlist", "follow-up"],
    dietary: "None",
    guideNote: "July 8 sold out — 2 waitlist inquiries; offer July 9 evening or breakfast tour",
    upsellEmail: `Hi,

We were waitlisted for the Beijing Hutong Evening Food Tour on July 8. If that date is full, could you suggest July 9 evening or the breakfast tour instead?

Thanks,
Rachel`,
  },
];

export const PREVIEW_EXAMPLES = {
  "last-minute": `Hi Alex,

Thank you for reaching out about joining us on the Chengdu Evening Food Tour by Tuktuk on June 28!

Our online booking system typically closes 2–6 hours before start for evening tours, but I'd be happy to check availability with our team for your party of 2. Could you confirm your preferred start time and any dietary restrictions?

If we have space, I can send a manual payment link to secure your spots.

Warm regards,
Lost Plate Guest Services`,
  "solo-traveler": `Hi Sarah,

Thanks for your interest in the Chengdu Evening Food Tour by Tuktuk on July 12!

Our public tours require a minimum of 2 guests to run. As a solo traveler, you have two options:
1. Purchase 2 tickets to guarantee the tour runs for you
2. Join our waitlist — if another guest books, we'll confirm you at the single-guest rate

Would either option work for you? We're happy to help find the best fit.

Best,
Lost Plate Guest Services`,
  "dietary": `Hi James,

Thank you for letting us know about your dietary needs: vegetarian, no shellfish.

For the Beijing Hutong Evening Food Tour on July 5, our guides can accommodate many restrictions by adjusting dishes at each stop. I've flagged this for your guide so they can plan alternatives in advance.

Please note some traditional stops may have limited options — we'll ensure you still enjoy a full experience!

Cheers,
Lost Plate Guest Services`,
  "multi-day": `Hi Anna,

Following up on your interest in our multi-day trips — since you're visiting Chengdu, you might love pairing a city food tour with our "Chengdu in 4 Days" itinerary or our "Best of China in 11 Days" trip.

Happy to share a sample day-by-day route and pricing for your party of 2. Are you flexible on dates in September, or do you have fixed travel windows?

Looking forward to helping plan your food adventure!
Lost Plate Guest Services`,
};
