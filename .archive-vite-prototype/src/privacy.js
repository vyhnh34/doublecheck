// ───────────────────────────  Privacy analysis  ──────────────────────────
// Mock, rule-based analysis of the draft text. It finds personal details,
// scores how revealing the message is, and turns that into a letter grade.
// Swap the rules / scoring for a real model later — the shape of analyze()'s
// return value is the contract the UI depends on.

// Each category: how severe it is, how many points it costs the grade, and a
// short human label shown in the nudge. `desc` is the longer "why" (kept for a
// future per-word tooltip).
const CATEGORIES = {
  person:   { severity: 'high', weight: 18, label: 'Name',         desc: 'Names can identify specific people you mention.' },
  contact:  { severity: 'high', weight: 35, label: 'Contact',      desc: 'Emails or numbers can directly identify or reach someone.' },
  health:   { severity: 'high', weight: 30, label: 'Health',       desc: 'Health and medical details are especially sensitive.' },
  finance:  { severity: 'med',  weight: 14, label: 'Financial',    desc: 'Pay, debt, and money details reveal a lot about you.' },
  employer: { severity: 'med',  weight: 12, label: 'Employer',     desc: 'Naming an employer narrows down who you are.' },
  location: { severity: 'med',  weight: 10, label: 'Location',     desc: 'Sharing where you are reveals your whereabouts.' },
  family:   { severity: 'med',  weight: 8,  label: 'Relationship', desc: 'Mentioning family can identify other people.' },
  time:     { severity: 'med',  weight: 6,  label: 'Timing',       desc: 'Paired with a place, timing can reveal your plans.' },
  age:      { severity: 'low',  weight: 6,  label: 'Age',          desc: 'Your age helps narrow down who you are.' },
}

export const SEVERITY_COLOR = { high: '#cc4036', med: '#c9892f', low: '#6f8e4a' }

// Small mock dictionaries — enough to drive the prototype scenarios.
const NAMES = ['sam', 'alex', 'sarah', 'john', 'mike', 'michael', 'emma', 'olivia',
  'liam', 'noah', 'chris', 'david', 'anna', 'kate', 'tom', 'jenny', 'sophia', 'james']
const LOCATIONS = ['sf', 'san francisco', 'nyc', 'new york', 'la', 'los angeles',
  'seattle', 'chicago', 'boston', 'oakland', 'berkeley', 'palo alto', 'the mission', 'soma']
const TIMES = ['tomorrow', 'today', 'tonight', 'this weekend', 'next week', 'this afternoon',
  'this evening', 'this morning', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
// Sensitive personal disclosures that come up naturally in real conversations.
const HEALTH = ['medical leave', 'sick leave', 'surgery', 'chemo', 'chemotherapy', 'cancer',
  'depression', 'anxiety', 'burnout', 'therapy', 'therapist', 'rehab', 'addiction', 'diagnosis',
  'diagnosed', 'disability', 'mental health', 'miscarriage', 'maternity leave', 'paternity leave',
  'pregnancy', 'hospitalized', 'stroke', 'adhd', 'ptsd', 'bipolar']
const EMPLOYERS = ['google', 'amazon', 'microsoft', 'facebook', 'meta', 'netflix', 'uber', 'airbnb',
  'tesla', 'ibm', 'oracle', 'salesforce', 'deloitte', 'accenture', 'spotify', 'stripe', 'openai',
  'anthropic', 'nike', 'starbucks', 'twitter', 'linkedin', 'adobe', 'intel', 'nvidia']
const FAMILY = ['my mom', 'my mother', 'my dad', 'my father', 'my wife', 'my husband', 'my son',
  'my daughter', 'my kids', 'my kid', 'my children', 'my child', 'my partner', 'my boyfriend',
  'my girlfriend', 'my fiance', 'my fiancee']

const EMAIL = /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g
const PHONE = /\b\+?\d[\d\s().-]{7,}\d\b/g
// Money: "$95,000", "$95k", "$1.2M", or a bare salary shorthand like "95k".
const MONEY = /\$\s?\d[\d,]*(?:\.\d+)?\s?[kmb]?\b|\b\d{2,3}k\b/gi
// Age: "34 years old" / "I'm 34" (guarded to 13–99 so "I'm 5 min late" won't match).
const AGE_OLD = /\b(?:1[3-9]|[2-9]\d)\s*(?:years?|yrs?)\s*old\b/gi
const AGE_IM = /\b(?:i['’]?m|i am|aged)\s+(?:1[3-9]|[2-9]\d)\b/gi

// Build a case-insensitive, word-boundary regex from a word list. Longer
// phrases are tried first so "san francisco" wins over a bare "francisco".
function listRegex(list) {
  const escaped = list
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .sort((a, b) => b.length - a.length)
  return new RegExp(`\\b(?:${escaped.join('|')})\\b`, 'gi')
}

const RULES = [
  { category: 'person',   typeLabel: 'Name',         re: listRegex(NAMES) },
  { category: 'location', typeLabel: 'Location',     re: listRegex(LOCATIONS) },
  { category: 'time',     typeLabel: 'Timing',       re: listRegex(TIMES) },
  { category: 'health',   typeLabel: 'Health',       re: listRegex(HEALTH) },
  { category: 'employer', typeLabel: 'Employer',     re: listRegex(EMPLOYERS) },
  { category: 'family',   typeLabel: 'Relationship', re: listRegex(FAMILY) },
  { category: 'contact',  typeLabel: 'Email',        re: EMAIL },
  { category: 'contact',  typeLabel: 'Phone',        re: PHONE },
  { category: 'finance',  typeLabel: 'Financial',    re: MONEY },
  { category: 'age',      typeLabel: 'Age',          re: AGE_OLD },
  { category: 'age',      typeLabel: 'Age',          re: AGE_IM },
]

const GRADES = [
  { min: 90, grade: 'A', label: 'Looks private',           color: '#4a8a5a' },
  { min: 78, grade: 'B', label: 'Minor details',           color: '#6f8e4a' },
  { min: 66, grade: 'C', label: 'Some personal details',   color: '#c9892f' },
  { min: 50, grade: 'D', label: 'Fairly revealing',        color: '#cf6f2e' },
  { min: 0,  grade: 'F', label: 'Sensitive — review first', color: '#cc4036' },
]

const toGrade = (score) => GRADES.find((g) => score >= g.min)

// Returns null for empty input, otherwise:
//   { score, grade, gradeLabel, color, findings: [{ category, term, start, end,
//     severity, weight, label, desc }] }  — findings are sorted by position.
export function analyze(text) {
  if (!text || !text.trim()) return null

  // Collect every match across all rules.
  const raw = []
  for (const rule of RULES) {
    rule.re.lastIndex = 0
    let m
    while ((m = rule.re.exec(text)) !== null) {
      raw.push({
        category: rule.category,
        typeLabel: rule.typeLabel,
        term: m[0],
        start: m.index,
        end: m.index + m[0].length,
      })
      if (m.index === rule.re.lastIndex) rule.re.lastIndex++ // guard against zero-length loops
    }
  }

  // Resolve overlaps: earliest start first, longer match wins, then drop any
  // match that starts inside an already-accepted one.
  raw.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start))
  const findings = []
  let lastEnd = -1
  for (const r of raw) {
    if (r.start < lastEnd) continue
    findings.push({ ...r, ...CATEGORIES[r.category] })
    lastEnd = r.end
  }

  // Score: start clean at 100 and deduct each finding's weight.
  let score = 100
  for (const f of findings) score -= f.weight
  score = Math.max(0, Math.min(100, score))

  const g = toGrade(score)
  return { score, grade: g.grade, gradeLabel: g.label, color: g.color, findings }
}
