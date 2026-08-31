// て-form construction, as a rule rather than a stored string. The vocabulary file stores
// each verb's て-form so it can be displayed, and tools/verify-content.js re-derives every
// one of them from here — so a typo in the data fails the build rather than teaching a
// learner a form that does not exist.

export const TE_ENDINGS = [
  { match: ['う', 'つ', 'る'], ending: 'って' },
  { match: ['む', 'ぶ', 'ぬ'], ending: 'んで' },
  { match: ['く'],             ending: 'いて' },
  { match: ['ぐ'],             ending: 'いで' },
  { match: ['す'],             ending: 'して' },
];

// 行く is the only common く-verb that does not follow the く → いて rule.
const IRREGULAR_TE = { '行く': '行って', '来る': '来て' };

/** The て-form of a verb entry ({ word, reading, group }). Returns null if it cannot be derived. */
export function teForm(v) {
  if (!v || !v.group) return null;
  if (IRREGULAR_TE[v.word]) return IRREGULAR_TE[v.word];

  if (v.group === 'irregular') {
    if (v.word.endsWith('する')) return v.word.slice(0, -2) + 'して';
    return null;
  }
  if (v.group === 'ichidan') return v.word.slice(0, -1) + 'て';

  const last = v.reading.slice(-1);
  const rule = TE_ENDINGS.find(r => r.match.includes(last));
  return rule ? v.word.slice(0, -1) + rule.ending : null;
}

/** Plausible wrong forms of the same verb — far better distractors than other verbs' forms. */
export function teDistractors(v) {
  const correct = teForm(v);
  if (!correct) return [];
  const stem = v.word.endsWith('する') ? v.word.slice(0, -2) : v.word.slice(0, -1);
  const all = ['って', 'んで', 'いて', 'いで', 'して', 'て'].map(e => stem + e);
  return [...new Set(all)].filter(x => x !== correct);
}

// ── plain (dictionary) form ↔ ます-form ──────────────────────────────────────
// The dictionary form is what `word` already holds, so the interesting direction is the
// mapping itself: which ます-form corresponds to which plain form, and why.

const U_ROW = { 'う':'い','つ':'ち','る':'り','む':'み','ぶ':'び','ぬ':'に','く':'き','ぐ':'ぎ','す':'し' };
const A_ROW = { 'う':'わ','つ':'た','る':'ら','む':'ま','ぶ':'ば','ぬ':'な','く':'か','ぐ':'が','す':'さ' };

/** The plain non-past (dictionary) form. For verbs this is simply the stored word. */
export function plainForm(v) {
  return v?.word ?? null;
}

const IRREGULAR_NAI = { 'する': 'しない', '来る': '来ない', 'ある': 'ない' };

/**
 * The plain negative (ない-form).
 * る-verbs drop る. う-verbs shift the final kana to the あ-row — except う, which becomes わ,
 * a fossil of an older わ that survives only here. ある is suppletive: its negative is ない.
 */
export function naiForm(v) {
  if (!v || !v.group) return null;
  if (IRREGULAR_NAI[v.word]) return IRREGULAR_NAI[v.word];
  if (v.group === 'irregular') {
    if (v.word.endsWith('する')) return v.word.slice(0, -2) + 'しない';
    return null;
  }
  if (v.group === 'ichidan') return v.word.slice(0, -1) + 'ない';
  const last = v.reading.slice(-1);
  const shifted = A_ROW[last];
  return shifted ? v.word.slice(0, -1) + shifted + 'ない' : null;
}

/** Plausible wrong ない-forms of the same verb, for multiple-choice distractors. */
export function naiDistractors(v) {
  const correct = naiForm(v);
  if (!correct) return [];
  const stem = v.word.endsWith('する') ? v.word.slice(0, -2) : v.word.slice(0, -1);
  const all = [...new Set(Object.values(A_ROW))].map(k => stem + k + 'ない').concat(stem + 'ない');
  return [...new Set(all)].filter(x => x !== correct);
}

/** Sanity: the ます-form should be derivable from the plain form the same way. */
export function masuFromPlain(v) {
  if (!v || !v.group) return null;
  if (v.word === '来る') return '来ます';
  if (v.group === 'irregular') return v.word.endsWith('する') ? v.word.slice(0, -2) + 'します' : null;
  if (v.group === 'ichidan') return v.word.slice(0, -1) + 'ます';
  const last = v.reading.slice(-1);
  const shifted = U_ROW[last];
  return shifted ? v.word.slice(0, -1) + shifted + 'ます' : null;
}
