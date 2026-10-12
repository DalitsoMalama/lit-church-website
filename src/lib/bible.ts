// Links out to bible.com (YouVersion) for full chapters, so we stay within
// publisher quotation limits for copyrighted translations.

export const translations = {
  NKJV: { id: 114, label: "NKJV" },
  NIV: { id: 111, label: "NIV" },
  NLT: { id: 116, label: "NLT" },
  BEMBA: { id: 1097, label: "Bemba" }, // Revised Bemba Bible, Bible Society of Zambia
} as const;

export type TranslationKey = keyof typeof translations;

// USFM book codes used by bible.com
const books: Record<string, string> = {
  Genesis: "GEN", Psalm: "PSA", Isaiah: "ISA", Jeremiah: "JER", Joel: "JOL",
  Matthew: "MAT", Mark: "MRK", Luke: "LUK", John: "JHN", Acts: "ACT", Romans: "ROM",
  "1 Corinthians": "1CO", "2 Corinthians": "2CO", Ephesians: "EPH", Philippians: "PHP",
  "1 John": "1JN", Revelation: "REV",
};

/** "John 3:3-5" -> https://www.bible.com/bible/114/JHN.3.3-5.NKJV */
export function bibleUrl(ref: string, t: TranslationKey = "NKJV") {
  const m = ref.match(/^(.+?)\s+(\d+)(?::([\d,\-]+))?$/);
  if (!m) return "https://www.bible.com";
  const [, book, chapter, verses] = m;
  const code = books[book];
  if (!code) return "https://www.bible.com";
  const { id, label } = translations[t];
  const suffix = t === "BEMBA" ? "" : `.${label}`;
  return `https://www.bible.com/bible/${id}/${code}.${chapter}${verses ? `.${verses}` : ""}${suffix}`;
}
