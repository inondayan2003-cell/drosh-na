export const PARASHA_ORDER = [
  "בראשית", "נח", "לך לך", "וירא", "חיי שרה", "תולדות", "ויצא", "וישלח", "וישב", "מקץ", "ויגש", "ויחי",
  "שמות", "וארא", "בא", "בשלח", "יתרו", "משפטים", "תרומה", "תצוה", "כי תשא", "ויקהל", "פקודי",
  "ויקרא", "צו", "שמיני", "תזריע", "מצרע", "אחרי מות", "קדושים", "אמור", "בהר", "בחוקותי",
  "במדבר", "נשא", "בהעלתך", "שלח", "קורח", "חוקת", "בלק", "פינחס", "מטות", "מסעי",
  "דברים", "ואתחנן", "עקב", "ראה", "שופטים", "כי תצא", "כי תבוא", "נצבים", "וילך", "האזינו", "וזאת הברכה"
];

/*
  Maps the exact Hebrew string Hebcal returns (prefix "פרשת " stripped) to
  either a single canonical name, or an array of two canonical names for a
  combined double-portion (in reading order). Hebcal sometimes spells a
  single multi-word parasha name with a maqaf (e.g. "שלח־לך", "כי־תצא"),
  which looks like a combo but isn't — those map to a plain string.
  Verified against Hebcal's live API output across multiple years.
*/
export const HEBCAL_MAP = {
  "בראשית": "בראשית", "נח": "נח", "לך לך": "לך לך", "לך־לך": "לך לך",
  "וירא": "וירא", "חיי שרה": "חיי שרה", "תולדות": "תולדות", "ויצא": "ויצא",
  "וישלח": "וישלח", "וישב": "וישב", "מקץ": "מקץ", "ויגש": "ויגש", "ויחי": "ויחי",
  "שמות": "שמות", "וארא": "וארא", "בא": "בא", "בשלח": "בשלח", "יתרו": "יתרו",
  "משפטים": "משפטים", "תרומה": "תרומה", "תצוה": "תצוה", "תצווה": "תצוה",
  "כי תשא": "כי תשא",
  "ויקהל": "ויקהל", "פקודי": "פקודי", "ויקהל־פקודי": ["ויקהל", "פקודי"], "ויקהל-פקודי": ["ויקהל", "פקודי"],
  "ויקרא": "ויקרא", "צו": "צו", "שמיני": "שמיני",
  "תזריע": "תזריע", "מצרע": "מצרע", "תזריע־מצרע": ["תזריע", "מצרע"], "תזריע-מצרע": ["תזריע", "מצרע"],
  "אחרי מות": "אחרי מות", "קדשים": "קדושים", "קדושים": "קדושים",
  "אחרי מות־קדשים": ["אחרי מות", "קדושים"], "אחרי מות-קדשים": ["אחרי מות", "קדושים"],
  "אמור": "אמור", "בהר": "בהר", "בחקתי": "בחוקותי", "בחוקותי": "בחוקותי",
  "בהר־בחקתי": ["בהר", "בחוקותי"], "בהר-בחקתי": ["בהר", "בחוקותי"],
  "במדבר": "במדבר", "נשא": "נשא", "בהעלתך": "בהעלתך",
  "שלח": "שלח", "שלח לך": "שלח", "שלח־לך": "שלח", "שלח-לך": "שלח",
  "קורח": "קורח", "קרח": "קורח", "חוקת": "חוקת", "חקת": "חוקת",
  "בלק": "בלק", "פינחס": "פינחס",
  "מטות": "מטות", "מסעי": "מסעי", "מטות־מסעי": ["מטות", "מסעי"], "מטות-מסעי": ["מטות", "מסעי"],
  "דברים": "דברים", "ואתחנן": "ואתחנן", "עקב": "עקב", "ראה": "ראה", "שופטים": "שופטים",
  "כי תצא": "כי תצא", "כי־תצא": "כי תצא", "כי-תצא": "כי תצא",
  "כי תבוא": "כי תבוא", "כי־תבוא": "כי תבוא", "כי-תבוא": "כי תבוא",
  "נצבים": "נצבים", "וילך": "וילך", "נצבים־וילך": ["נצבים", "וילך"], "נצבים-וילך": ["נצבים", "וילך"],
  "האזינו": "האזינו", "וזאת הברכה": "וזאת הברכה"
};

export const WORDS_PER_MINUTE = 120;

export function wordCount(paragraphs) {
  const text = (paragraphs || []).join(' ');
  const m = text.trim().match(/\S+/g);
  return m ? m.length : 0;
}

export function minutesFor(paragraphs) {
  const n = wordCount(paragraphs);
  if (n === 0) return 0;
  return Math.max(1, Math.round(n / WORDS_PER_MINUTE));
}

export function hasAny(entry) {
  return !!(entry && (entry.short || entry.long));
}

function todayISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function nextSaturdayISO(from) {
  const d = new Date(from.getTime());
  const day = d.getDay(); // 0=Sun ... 6=Sat
  const diff = (6 - day + 7) % 7;
  d.setDate(d.getDate() + diff);
  return todayISO(d);
}

function resolveHebrewName(rawHebrew) {
  const stripped = rawHebrew.replace(/^פרשת\s+/, '').trim();
  let mapped = HEBCAL_MAP[stripped];
  if (!mapped) {
    const normalized = stripped.replace(/־/g, ' ');
    mapped = HEBCAL_MAP[normalized] || normalized;
  }
  return mapped;
}

function pickFromMapped(mapped, parashot) {
  if (Array.isArray(mapped)) {
    for (const name of mapped) {
      if (hasAny(parashot[name])) return name;
    }
    return mapped[0];
  }
  return mapped;
}

/*
  Fetches the upcoming parasha from Hebcal (Israel diaspora=off calendar,
  35-day window). Returns { resolved, holidayNotice } or throws.
  If the earliest parashat-category item isn't next Saturday, the next
  Shabbat falls on/around a holiday and we surface that explicitly.
*/
export async function detectParasha(parashot) {
  const today = new Date();
  const start = todayISO(today);
  const end = new Date(today.getTime());
  end.setDate(end.getDate() + 35);
  const endStr = todayISO(end);

  const url = 'https://www.hebcal.com/hebcal?v=1&cfg=json&s=on&i=on&maj=off&min=off&mod=off&nx=off&mf=off&ss=off&c=off&geo=none'
    + `&start=${start}&end=${endStr}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('bad response');
  const json = await res.json();

  const items = (json.items || []).filter((it) => it.category === 'parashat');
  items.sort((a, b) => (a.date < b.date ? -1 : 1));
  if (items.length === 0) throw new Error('no parashat items');

  const first = items[0];
  const mapped = resolveHebrewName(first.hebrew);
  const resolved = pickFromMapped(mapped, parashot);

  const expectedSaturday = nextSaturdayISO(today);
  let holidayNotice = null;
  if (first.date !== expectedSaturday) {
    holidayNotice = `השבת הקרובה חלה בחג. הפרשה הבאה: פרשת ${resolved}`;
  }

  return { resolved, holidayNotice };
}
