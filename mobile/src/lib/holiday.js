export const HOLIDAY_ORDER = [
  "ראש השנה", "יום כיפור", "סוכות", "שמחת תורה", "חנוכה", "ט\"ו בשבט", "פורים", "פסח",
  "יום העצמאות", "יום הזיכרון", "יום ירושלים", "ל\"ג בעומר", "שבועות", "תשעה באב"
];

/*
  Maps the exact Hebrew string Hebcal returns (category "holiday") to a
  canonical name in HOLIDAY_ORDER. Verified against Hebcal's live API
  (maj=on&min=on&mod=on, Israel calendar) across several years. Multi-day
  holidays (Sukkot, Pesach, Chanukah) collapse every sub-day to one
  canonical entry; "ערב X" days already point at X so prep starts a day
  early, matching how the parasha screen looks ahead. Anything not in this
  map (Sigd, Rabin memorial day, minor fasts, Purim Katan, Pesach Sheni,
  Tu B'Av, etc.) is deliberately left unmapped and skipped by
  detectHoliday — this app only surfaces days people typically prepare a
  דבר תורה for.
*/
export const HOLIDAY_MAP = {
  "ראש השנה": "ראש השנה", "ערב ראש השנה": "ראש השנה", "ראש השנה א'": "ראש השנה", "ראש השנה ב'": "ראש השנה",
  "ערב יום כיפור": "יום כיפור", "יום כיפור": "יום כיפור",
  "ערב סוכות": "סוכות", "סוכות א'": "סוכות",
  "סוכות ב' (חוה\"מ)": "סוכות", "סוכות ג' (חוה\"מ)": "סוכות", "סוכות ד' (חוה\"מ)": "סוכות",
  "סוכות ה' (חוה\"מ)": "סוכות", "סוכות ו' (חוה\"מ)": "סוכות", "סוכות ז' (הושענא רבה)": "סוכות",
  "שמיני עצרת": "שמחת תורה",
  "חנוכה: א' נר": "חנוכה", "חנוכה: ב' נרות": "חנוכה", "חנוכה: ג' נרות": "חנוכה", "חנוכה: ד' נרות": "חנוכה",
  "חנוכה: ה' נרות": "חנוכה", "חנוכה: ו' נרות": "חנוכה", "חנוכה: ז' נרות": "חנוכה", "חנוכה: ח' נרות": "חנוכה",
  "חנוכה: יום ח'": "חנוכה",
  "ט\"ו בשבט": "ט\"ו בשבט",
  "ערב פורים": "פורים", "פורים": "פורים", "שושן פורים": "פורים",
  "ערב פסח": "פסח", "פסח א'": "פסח",
  "פסח ב' (חוה\"מ)": "פסח", "פסח ג' (חוה\"מ)": "פסח", "פסח ד' (חוה\"מ)": "פסח",
  "פסח ה' (חוה\"מ)": "פסח", "פסח ו' (חוה\"מ)": "פסח", "פסח ז'": "פסח",
  "יום הזכרון": "יום הזיכרון",
  "יום העצמאות": "יום העצמאות",
  "יום ירושלים": "יום ירושלים",
  "ל\"ג בעומר": "ל\"ג בעומר",
  "ערב שבועות": "שבועות", "שבועות": "שבועות",
  "ערב תשעה באב": "תשעה באב", "תשעה באב": "תשעה באב"
};

function todayISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function resolveHolidayName(rawHebrew) {
  const normalized = rawHebrew.replace(/״/g, '"').replace(/׳/g, "'").trim();
  return HOLIDAY_MAP[normalized] || null;
}

/*
  Fetches the nearest upcoming holiday from Hebcal (Israel calendar,
  60-day window — holidays are sparser than weekly parashot). Skips any
  item that isn't in HOLIDAY_MAP rather than stopping at the first one.
  Returns the canonical name, or throws if nothing in the window maps.
*/
export async function detectHoliday() {
  const today = new Date();
  const start = todayISO(today);
  const end = new Date(today.getTime());
  end.setDate(end.getDate() + 60);
  const endStr = todayISO(end);

  const url = 'https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=off&mf=off&ss=off&c=off&s=off&i=on&geo=none'
    + `&start=${start}&end=${endStr}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('bad response');
  const json = await res.json();

  const items = (json.items || []).filter((it) => it.category === 'holiday');
  items.sort((a, b) => (a.date < b.date ? -1 : 1));

  for (const item of items) {
    const name = resolveHolidayName(item.hebrew);
    if (name) return name;
  }
  throw new Error('no mappable holiday found');
}
