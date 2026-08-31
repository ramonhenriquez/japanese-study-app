// Exercise generation. Every exercise is a plain object; the UI renders it by `kind`,
// so adding a new exercise type means adding a generator here and a branch in the renderer.
//
// Each exercise reports which concept it tested, so any exercise anywhere in the app
// (lesson, review or practice) feeds the same SRS evidence.

import { KANA, KANA_BY_ID } from '../content/kana.js';
import { VOCABULARY, VOCAB_BY_ID } from '../content/vocabulary.js';
import { KANJI, KANJI_BY_ID } from '../content/kanji.js';
import { GRAMMAR_BY_ID } from '../content/grammar.js';
import { COUNTERS, COUNTERS_BY_ID } from '../content/counters.js';
import { SENTENCES, SENTENCES_BY_ID } from '../content/sentences.js';
import { toRomaji, romajiMatches } from './romaji.js';
import { isIntroduced } from './srs.js';
import { teForm, teDistractors, naiForm, naiDistractors, masuFromPlain } from './conjugation.js';

export const EXERCISE_LABELS = {
  'kana-recognition': 'Kana → sound',
  'kana-recall': 'Sound → kana',
  'kana-type': 'Type the reading',
  'vocab-jp-en': 'Word → meaning',
  'vocab-en-jp': 'Meaning → word',
  'vocab-reading': 'Word → reading',
  'kanji-meaning': 'Kanji → meaning',
  'kanji-reading': 'Kanji → reading',
  'particle': 'Fill in the particle',
  'cloze': 'Fill in the blank',
  'sentence-build': 'Build the sentence',
  'translate': 'Sentence → meaning',
  'matching': 'Match the pairs',
  'conjugation': 'Make the て-form',
  'counter': 'Read the count',
  'plain': 'ます → plain',
  'nai': 'Make the ない-form',
  'listening': 'Listen and choose',
};

export const PARTICLES = ['は', 'が', 'を', 'に', 'で', 'へ', 'と', 'も', 'の', 'か'];

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const sample = (arr, n) => shuffle(arr).slice(0, n);

/**
 * A sentence may only be served as an exercise once every grammar point and word in it has
 * been taught. Sentence tags are kept complete by tools/tag-sentences.js, so this single
 * check covers particles, conjugated forms and counters as well as vocabulary — a learner is
 * never asked to parse or produce something the curriculum has not reached.
 */
export function sentenceReady(s) {
  const known = id => isIntroduced(id) || !!CONTEXT?.has(id);
  return (s.grammar || []).every(known) && (s.vocab || []).every(known);
}

/** Sentences usable right now for a given grammar point, with a graceful fallback. */
function readySentences(conceptId) {
  const tagged = SENTENCES.filter(s => s.grammar.includes(conceptId));
  const ready = tagged.filter(sentenceReady);
  // Before anything is introduced (a cold session, or the very first lesson) fall back to the
  // simplest tagged sentences rather than returning nothing at all.
  if (ready.length) return ready;
  return tagged.slice().sort((a, b) => a.grammar.length - b.grammar.length).slice(0, 3);
}

/**
 * Narrow a candidate pool to material the learner has actually been introduced to.
 * Offering だ and ふ as decoys in the very first lesson makes the answer guessable and
 * teaches nothing; falling back to the full set only when there isn't enough material yet.
 */
let CONTEXT = null;   // ids the current session should treat as familiar (e.g. this lesson's own concepts)

function familiar(items, idOf, minimum = 4) {
  const seen = items.filter(x => {
    const id = idOf(x);
    return isIntroduced(id) || CONTEXT?.has(id);
  });
  return seen.length >= minimum ? seen : items;
}

/** Build distractors, preferring genuinely confusable options over random ones. */
function distractors(correct, pool, n, preferred = []) {
  const out = [];
  for (const p of shuffle(preferred)) {
    if (p !== undefined && p !== null && p !== correct && !out.includes(p)) out.push(p);
    if (out.length >= n) break;
  }
  for (const p of shuffle(pool)) {
    if (out.length >= n) break;
    if (p !== correct && !out.includes(p)) out.push(p);
  }
  return out.slice(0, n);
}

// ── individual generators ────────────────────────────────────────────────────

function kanaRecognition(k) {
  const pool = familiar(KANA.filter(x => x.script === k.script), x => x.id).map(x => x.romaji);
  const confuse = k.confusables.map(id => KANA_BY_ID[id]?.romaji).filter(Boolean);
  const choices = shuffle([k.romaji, ...distractors(k.romaji, pool, 3, confuse)]);
  return {
    kind: 'kana-recognition', conceptId: k.id, conceptType: 'kana',
    prompt: { glyph: k.kana, label: 'What sound is this?' },
    choices, answer: k.romaji,
    explain: k.note || null,
  };
}

function kanaRecall(k) {
  const pool = familiar(KANA.filter(x => x.script === k.script), x => x.id).map(x => x.kana);
  const confuse = k.confusables.map(id => KANA_BY_ID[id]?.kana).filter(Boolean);
  const choices = shuffle([k.kana, ...distractors(k.kana, pool, 3, confuse)]);
  return {
    kind: 'kana-recall', conceptId: k.id, conceptType: 'kana',
    prompt: { text: k.romaji, label: `Which ${k.script} is this?` },
    choices, answer: k.kana, choiceStyle: 'glyph',
    explain: k.note || null,
  };
}

function kanaType(k) {
  return {
    kind: 'kana-type', conceptId: k.id, conceptType: 'kana',
    prompt: { glyph: k.kana, label: 'Type the reading in romaji' },
    input: 'romaji', answer: k.romaji,
    check: v => romajiMatches(v, k.romaji),
    explain: k.note || null,
  };
}

/** Has the learner been taught the て-form rule that governs this verb's group? */
function teRuleKnown(v) {
  const point = v.group === 'godan' ? 'g:te_u' : 'g:te';
  return isIntroduced(point) || !!CONTEXT?.has(point);
}

function conjugationPlain(v) {
  const answer = v.word;
  const stem = v.masu.replace(/ます$/, '');
  // plausible wrong dictionary forms built from the same ます-stem
  const wrong = ['る', 'う', 'く', 'む', 'す', 'つ'].map(e => stem + e).filter(x => x !== answer);
  const choices = shuffle([answer, ...distractors(answer, wrong, 3)]);
  return {
    kind: 'plain', conceptId: 'g:plain', conceptType: 'grammar',
    prompt: { glyph: v.masu, sub: v.meanings[0], label: 'What is the plain (dictionary) form?' },
    choices, answer, choiceStyle: 'jp',
    explain: `${v.masu} → ${answer} · ${v.group === 'ichidan' ? 'る-verb: ます → る' : v.group === 'godan' ? 'う-verb: the い-row shifts back to the う-row' : 'irregular'}`,
  };
}

function conjugationNai(v) {
  const answer = naiForm(v);
  if (!answer) return null;
  const choices = shuffle([answer, ...distractors(answer, naiDistractors(v), 3)]);
  return {
    kind: 'nai', conceptId: 'g:nai', conceptType: 'grammar',
    prompt: { glyph: v.word, sub: v.reading, label: 'What is the ない-form?' },
    choices, answer, choiceStyle: 'jp',
    explain: `${v.word} (${v.meanings[0]}) → ${answer}`,
  };
}

function counterReading(c) {
  // Weight the irregular forms — those are the ones that cannot be worked out.
  const irregulars = c.forms.filter(f => f.irregular);
  const f = irregulars.length && Math.random() < 0.7 ? pick(irregulars) : pick(c.forms);
  const others = c.forms.filter(x => x.reading !== f.reading).map(x => x.reading);
  const choices = shuffle([f.reading, ...distractors(f.reading, others, 3)]);
  return {
    kind: 'counter', conceptId: c.id, conceptType: 'counter',
    prompt: { glyph: f.form, label: `How is this read? (counting ${c.counts})` },
    choices, answer: f.reading, choiceStyle: 'jp',
    explain: f.irregular ? `Irregular — ${f.form} is ${f.reading}, not the pattern you would expect.` : `${c.counter} counts ${c.counts}.`,
  };
}

function counterChoice(c) {
  // Which counter does this thing take?
  const others = COUNTERS.filter(x => x.id !== c.id).map(x => x.counter);
  const choices = shuffle([c.counter, ...distractors(c.counter, others, 3)]);
  return {
    kind: 'counter', conceptId: c.id, conceptType: 'counter',
    prompt: { text: `Counting ${c.counts}`, label: 'Which counter?' },
    choices, answer: c.counter, choiceStyle: 'jp',
    explain: c.note,
  };
}

function conjugationTe(v, conceptId) {
  const answer = teForm(v);
  if (!answer) return null;
  const choices = shuffle([answer, ...distractors(answer, teDistractors(v), 3)]);
  const groupLabel = v.group === 'ichidan' ? 'る-verb' : v.group === 'godan' ? 'う-verb' : 'irregular';
  return {
    kind: 'conjugation', conceptId: conceptId || (v.group === 'godan' ? 'g:te_u' : 'g:te'), conceptType: 'grammar',
    prompt: { glyph: v.word, sub: v.reading, label: `What is the て-form? (${groupLabel})` },
    choices, answer, choiceStyle: 'jp',
    explain: `${v.word} (${v.meanings[0]}) → ${answer}`,
  };
}

function vocabJpEn(v) {
  const known = familiar(VOCABULARY, x => x.id);
  const pool = known.filter(x => x.pos === v.pos).map(x => x.meanings[0]);
  const wide = known.map(x => x.meanings[0]);
  const choices = shuffle([v.meanings[0], ...distractors(v.meanings[0], wide, 3, pool)]);
  return {
    kind: 'vocab-jp-en', conceptId: v.id, conceptType: 'vocab',
    prompt: { glyph: v.word, sub: v.reading !== v.word ? v.reading : null, label: 'What does this mean?' },
    choices, answer: v.meanings[0],
    explain: v.note || null,
  };
}

function vocabEnJp(v) {
  const known = familiar(VOCABULARY, x => x.id);
  const pool = known.filter(x => x.pos === v.pos).map(x => x.word);
  const wide = known.map(x => x.word);
  const choices = shuffle([v.word, ...distractors(v.word, wide, 3, pool)]);
  return {
    kind: 'vocab-en-jp', conceptId: v.id, conceptType: 'vocab',
    prompt: { text: v.meanings.join(', '), label: 'Which word is this?' },
    choices, answer: v.word, choiceStyle: 'jp',
    explain: v.note || null,
  };
}

function vocabReading(v) {
  const known = familiar(VOCABULARY, x => x.id);
  const pool = known.filter(x => x.reading.length === v.reading.length).map(x => x.reading);
  const wide = known.map(x => x.reading);
  const choices = shuffle([v.reading, ...distractors(v.reading, wide, 3, pool)]);
  return {
    kind: 'vocab-reading', conceptId: v.id, conceptType: 'vocab',
    prompt: { glyph: v.word, label: 'How is this read?' },
    choices, answer: v.reading, choiceStyle: 'jp',
    explain: `${v.meanings[0]} · ${toRomaji(v.reading)}`,
  };
}

function kanjiMeaning(k) {
  const wide = familiar(KANJI, x => x.id, 4).map(x => x.meanings[0]);
  const choices = shuffle([k.meanings[0], ...distractors(k.meanings[0], wide, 3)]);
  return {
    kind: 'kanji-meaning', conceptId: k.id, conceptType: 'kanji',
    prompt: { glyph: k.char, label: 'What does this kanji mean?' },
    choices, answer: k.meanings[0],
    explain: k.note || null,
  };
}

function kanjiReading(k) {
  // Ask through a word that uses it wherever one exists — vocabulary-first, as the curriculum says.
  const word = (k.vocab || []).map(id => VOCAB_BY_ID[id]).filter(Boolean)[0];
  if (word) {
    const wide = familiar(VOCABULARY, x => x.id).map(x => x.reading);
    const choices = shuffle([word.reading, ...distractors(word.reading, wide, 3)]);
    return {
      kind: 'kanji-reading', conceptId: k.id, conceptType: 'kanji',
      prompt: { glyph: word.word, label: `How is this read? (${k.char} = ${k.meanings[0]})` },
      choices, answer: word.reading, choiceStyle: 'jp',
      explain: `${word.meanings[0]} · ${toRomaji(word.reading)}`,
    };
  }
  const all = KANJI.flatMap(x => [...x.on, ...x.kun]);
  const answer = k.kun[0] || k.on[0];
  const choices = shuffle([answer, ...distractors(answer, all, 3)]);
  return {
    kind: 'kanji-reading', conceptId: k.id, conceptType: 'kanji',
    prompt: { glyph: k.char, label: 'Which reading belongs to this kanji?' },
    choices, answer, choiceStyle: 'jp',
    explain: k.meanings.join(', '),
  };
}

function particleExercise(s) {
  // Particles are found through the sentence's own chunk boundaries, never by scanning
  // raw text. Scanning finds the で inside です and the と inside ちょっと; chunk-final
  // characters do not. A chunk qualifies only when what remains after removing the
  // particle is itself a word we know — a vocabulary entry, or something with a kanji in it.
  const BLANKABLE = ['は', 'が', 'を', 'に', 'で', 'へ', 'と', 'も', 'の', 'か'];
  const stripped = p => p.replace(/[、。]/g, '');

  const candidates = [];
  let cursor = 0;
  for (const raw of s.parts) {
    const part = stripped(raw);
    const particle = part.slice(-1);
    const stem = part.slice(0, -1);
    const isWord = stem.length > 0 && (
      /[一-龯]/.test(stem) ||
      VOCABULARY.some(v => v.word === stem || v.reading === stem)
    );
    if (BLANKABLE.includes(particle) && isWord) {
      candidates.push({ p: particle, i: cursor + raw.indexOf(part) + part.length - 1 });
    }
    cursor += raw.length;
  }
  if (!candidates.length) return null;

  const chosen = pick(candidates);
  const before = s.jp.slice(0, chosen.i);
  const after = s.jp.slice(chosen.i + 1);
  const gid = s.grammar[0];

  // は and も are interchangeable in far too many of these frames to use as decoys
  // for one another — a learner would be marked wrong for a correct answer.
  const ambiguous = { 'は': 'も', 'も': 'は' };
  const pool = BLANKABLE.filter(x => x !== 'か' && x !== ambiguous[chosen.p]);
  const choices = shuffle([chosen.p, ...distractors(chosen.p, pool, 3)]);

  return {
    kind: 'particle', conceptId: gid || s.id, conceptType: gid ? 'grammar' : 'sentence',
    prompt: { before, after, label: 'Which particle goes in the gap?', sub: s.en },
    choices, answer: chosen.p, choiceStyle: 'jp',
    explain: gid ? GRAMMAR_BY_ID[gid]?.gloss : null,
    sentenceId: s.id,
  };
}

function sentenceBuild(s) {
  const scrambled = shuffle(s.parts);
  return {
    kind: 'sentence-build', conceptId: s.grammar[0] || s.id, conceptType: s.grammar[0] ? 'grammar' : 'sentence',
    prompt: { text: s.en, label: 'Build this sentence' },
    parts: scrambled, answer: s.parts.join(''), tail: /[。？]$/.test(s.jp) ? s.jp.slice(-1) : '',
    explain: `${s.jp} · ${s.reading}`,
    sentenceId: s.id,
  };
}

function translate(s) {
  // Prefer sentences whose grammar the learner has met, but never let the pool shrink below
  // what a four-way choice needs — otherwise the question degenerates into a single option.
  const seen = SENTENCES.filter(sentenceReady);
  const wide = (seen.length >= 6 ? seen : SENTENCES).map(x => x.en);
  const choices = shuffle([s.en, ...distractors(s.en, wide, 3)]);
  return {
    kind: 'translate', conceptId: s.grammar[0] || s.id, conceptType: s.grammar[0] ? 'grammar' : 'sentence',
    prompt: { glyph: s.jp, sub: s.reading, glyphSize: 'sentence', label: 'What does this mean?' },
    choices, answer: s.en,
    sentenceId: s.id,
  };
}

function listening(s) {
  const wide = SENTENCES.map(x => x.jp);
  const choices = shuffle([s.jp, ...distractors(s.jp, wide, 3)]);
  return {
    kind: 'listening', conceptId: s.grammar[0] || s.id, conceptType: s.grammar[0] ? 'grammar' : 'sentence',
    prompt: { speak: s.jp, label: 'Listen, then choose what you heard' },
    choices, answer: s.jp, choiceStyle: 'jp',
    explain: `${s.reading} — ${s.en}`,
    sentenceId: s.id,
  };
}

function matching(items) {
  const pairs = items.map(it => {
    if (it.kind === 'kana') return { left: it.data.kana, right: it.data.romaji, conceptId: it.data.id };
    if (it.kind === 'kanji') return { left: it.data.char, right: it.data.meanings[0], conceptId: it.data.id };
    return { left: it.data.word, right: it.data.meanings[0], conceptId: it.data.id };
  });
  return {
    kind: 'matching', conceptId: null, conceptIds: pairs.map(p => p.conceptId), conceptType: items[0].kind,
    prompt: { label: 'Match each pair' },
    pairs, rights: shuffle(pairs.map(p => p.right)),
  };
}

// ── public API ───────────────────────────────────────────────────────────────

const KANA_KINDS = [kanaRecognition, kanaRecall, kanaType];

/** Build an exercise for one concept id. `variety` picks a different angle each time. */
export function exerciseFor(conceptId, { allowTyping = true, allowAudio = false } = {}) {
  if (conceptId.startsWith('kana:')) {
    const k = KANA_BY_ID[conceptId];
    if (!k) return null;
    const kinds = allowTyping ? KANA_KINDS : KANA_KINDS.slice(0, 2);
    return pick(kinds)(k);
  }
  if (conceptId.startsWith('v:')) {
    const v = VOCAB_BY_ID[conceptId];
    if (!v) return null;
    const opts = [vocabJpEn, vocabEnJp];
    if (v.word !== v.reading) opts.push(vocabReading);
    // A verb may be asked as a conjugation question only once the rule for *its group*
    // has been taught — る-verbs and irregulars in one lesson, う-verbs in the next.
    if (v.te && teRuleKnown(v)) opts.push(conjugationTe);
    return pick(opts)(v);
  }
  if (conceptId.startsWith('k:')) {
    const k = KANJI_BY_ID[conceptId];
    if (!k) return null;
    return pick([kanjiMeaning, kanjiReading])(k);
  }
  if (conceptId.startsWith('c:')) {
    const c = COUNTERS_BY_ID[conceptId];
    if (!c) return null;
    return pick([counterReading, counterReading, counterChoice])(c);
  }
  if (conceptId === 'g:counters') {
    const known = familiar(COUNTERS, c => c.id, 1);
    return counterReading(pick(known));
  }
  if (conceptId === 'g:plain' || conceptId === 'g:nai') {
    const pool = familiar(VOCABULARY.filter(v => v.te && v.masu), v => v.id, 3);
    if (pool.length) {
      const ex = (conceptId === 'g:plain' ? conjugationPlain : conjugationNai)(pick(pool));
      if (ex) return ex;
    }
  }
  if (conceptId === 'g:te' || conceptId === 'g:te_u') {
    const wanted = conceptId === 'g:te_u' ? 'godan' : null;
    const pool = VOCABULARY.filter(v => v.te && (wanted ? v.group === 'godan' : v.group !== 'godan'));
    const verbs = familiar(pool, v => v.id, 3);
    if (verbs.length) {
      const ex = conjugationTe(pick(verbs), conceptId);
      if (ex) return ex;
    }
  }
  if (conceptId.startsWith('g:')) {
    const g = GRAMMAR_BY_ID[conceptId];
    if (!g) return null;
    const pool = readySentences(conceptId);
    if (!pool.length) return null;
    const s = pick(pool);
    const builders = [sentenceBuild, translate];
    const p = particleExercise(s);
    if (p) builders.push(() => p);
    if (allowAudio) builders.push(listening);
    return pick(builders)(s);
  }
  return null;
}

/** A mixed set of exercises over a list of concepts, deduplicated and shuffled. */
export function buildSession(conceptIds, { limit = 12, allowTyping = true, allowAudio = false, context = conceptIds } = {}) {
  const previous = CONTEXT;
  CONTEXT = new Set(context || []);
  try {
    const out = [];
    for (const id of shuffle([...new Set(conceptIds)])) {
      if (out.length >= limit) break;
      const ex = exerciseFor(id, { allowTyping, allowAudio });
      if (ex) out.push(ex);
    }
    return out;
  } finally {
    CONTEXT = previous;
  }
}

/** Practice-mode pools. Each returns concept ids the mode can draw on. */
export function practicePool(mode, { isIntroduced }) {
  const seen = id => isIntroduced(id);
  switch (mode) {
    case 'kana-hiragana': return KANA.filter(k => k.script === 'hiragana' && seen(k.id)).map(k => k.id);
    case 'kana-katakana': return KANA.filter(k => k.script === 'katakana' && seen(k.id)).map(k => k.id);
    case 'vocabulary':    return VOCABULARY.filter(v => seen(v.id)).map(v => v.id);
    case 'kanji':         return KANJI.filter(k => seen(k.id)).map(k => k.id);
    case 'grammar':       return Object.keys(GRAMMAR_BY_ID).filter(seen);
    default:              return [];
  }
}

export function makeMatching(conceptIds, size = 4) {
  const items = sample(conceptIds, size).map(id => {
    if (id.startsWith('kana:')) return { kind: 'kana', data: KANA_BY_ID[id] };
    if (id.startsWith('k:')) return { kind: 'kanji', data: KANJI_BY_ID[id] };
    return { kind: 'vocab', data: VOCAB_BY_ID[id] };
  }).filter(x => x.data);
  return items.length >= 3 ? matching(items) : null;
}

export function particleDrill(introducedGrammar) {
  const pool = SENTENCES.filter(sentenceReady);
  const src = pool.length ? pool : SENTENCES;
  for (const s of shuffle(src)) {
    const ex = particleExercise(s);
    if (ex) return ex;
  }
  return null;
}

export { sentenceBuild, translate, listening, particleExercise };
