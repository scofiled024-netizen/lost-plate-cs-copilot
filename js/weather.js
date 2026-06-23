const MOCK_WEATHER = {
  beijing: "Clear skies expected in Beijing — comfortable for an evening walk.",
  chengdu: "Light rain possible in Chengdu tomorrow evening — bring an umbrella.",
  shanghai: "Warm and humid in Shanghai — dress light and stay hydrated.",
  xian: "Pleasant evening in Xi'an — great weather for street food.",
  bangkok: "Warm with a chance of showers in Bangkok — umbrella recommended.",
  hanoi: "Typical humid evening in Hanoi — light breathable clothing suggested.",
  portland: "Mild morning in Portland — perfect for food carts and patios.",
  "siem-reap": "Hot and sunny in Siem Reap — hat and water recommended.",
};

export async function getWeatherLine(cityId, lat, lng) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,precipitation_probability_max&forecast_days=1&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("weather fetch failed");
    const data = await res.json();
    const code = data.daily?.weathercode?.[0];
    const precip = data.daily?.precipitation_probability_max?.[0];
    const temp = data.daily?.temperature_2m_max?.[0];
    const cityLabel = cityId.replace("-", " ");

    if (precip >= 50) {
      return `**Weather:** Rain likely (${precip}% chance, ~${Math.round(temp)}°C) — please bring an umbrella.`;
    }
    if (code === 0 || code === 1) {
      return `**Weather:** Clear and pleasant (~${Math.round(temp)}°C) — perfect for a food tour!`;
    }
    return `**Weather:** Mixed conditions (~${Math.round(temp)}°C) — dress in layers for ${cityLabel}.`;
  } catch {
    return `**Weather:** ${MOCK_WEATHER[cityId] || "Check local forecast before your tour — we run rain or shine!"}`;
  }
}
