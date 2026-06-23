export const REMINDER_TEMPLATE = `Hi {{guestName}},

This is a friendly reminder about your upcoming Lost Plate tour!

**Tour:** {{tourName}}
**Date & time:** {{tourDate}} at {{tourTime}}
**Meeting point:** {{meetingPoint}}
**Guide:** {{guideName}}

**What to bring:** Comfortable walking shoes, appetite, and a light layer.

{{weatherLine}}

We can't wait to eat with you! Reply if you have any last-minute questions.

Cheers,
Lost Plate Guest Services`;

export const TOMORROW_BOOKINGS = [
  {
    id: 1,
    guest: "James & Emma Walsh",
    email: "j.walsh@email.com",
    tour: "Beijing Hutong Evening Food Tour",
    city: "Beijing",
    cityId: "beijing",
    lat: 39.9042,
    lng: 116.4074,
    time: "5:30 PM",
    tourDate: "Tomorrow, July 10",
    meetingPoint: "Beijing hutong meeting point (exact pin sent 24h prior)",
    guideName: "Winnie",
    dietary: "None",
  },
  {
    id: 2,
    guest: "Sarah Chen",
    email: "s.chen@email.com",
    tour: "Chengdu Evening Food Tour by Tuktuk",
    city: "Chengdu",
    cityId: "chengdu",
    lat: 30.5728,
    lng: 104.0668,
    time: "7:00 PM",
    tourDate: "Tomorrow, July 10",
    meetingPoint: "Tuktuk pickup near Kuanzhai Alley",
    guideName: "Li Wei",
    dietary: "Vegetarian",
  },
  {
    id: 3,
    guest: "Marcus Rivera",
    email: "m.rivera@email.com",
    tour: "Bangkok Evening Food Tour by Tuktuk",
    city: "Bangkok",
    cityId: "bangkok",
    lat: 13.7563,
    lng: 100.5018,
    time: "6:00 PM",
    tourDate: "Tomorrow, July 10",
    meetingPoint: "BTS station exit — guide will have Lost Plate sign",
    guideName: "Nok",
    dietary: "1 pescatarian",
  },
  {
    id: 4,
    guest: "Linda Park",
    email: "l.park@email.com",
    tour: "Portland Food Carts, Pods, & Patios Tour",
    city: "Portland",
    cityId: "portland",
    lat: 45.5152,
    lng: -122.6784,
    time: "11:00 AM",
    tourDate: "Tomorrow, July 10",
    meetingPoint: "Eastside food pod cluster — details in confirmation",
    guideName: "Herb",
    dietary: "Gluten-free",
  },
  {
    id: 5,
    guest: "David Kim",
    email: "d.kim@email.com",
    tour: "Xi'an Evening Food Tour by Tuktuk",
    city: "Xi'an",
    cityId: "xian",
    lat: 34.3416,
    lng: 108.9398,
    time: "6:30 PM",
    tourDate: "Tomorrow, July 10",
    meetingPoint: "Muslim Quarter meeting spot",
    guideName: "Haitao",
    dietary: "None",
  },
];
