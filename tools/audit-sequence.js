// Curriculum sequencing audit.
//
// Two different questions, deliberately kept apart:
//
//   EXPOSURE  — the learner sees something in an example while the lesson is about something
//               else. Fine, and normal in every beginner course.
//   REQUIRED  — the learner is asked to parse or produce it. Exercises are generated from a
//               lesson's own concepts, and any sentence tagged with a grammar point can be
//               served as an exercise for it.
//
// Required knowledge is enforced at serve time by `sentenceReady()` in the exercise engine:
// a sentence is only offered once every grammar point and word in it has been taught. That
// makes ordering safe, so the risk this audit checks for is the opposite one — a grammar
// point reaching its lesson with too little usable material to practise on.

import { VOCAB_BY_ID } from '../src/content/vocabulary.js';
import { GRAMMAR } from '../src/content/grammar.js';
import { SENTENCES, SENTENCES_BY_ID } from '../src/content/sentences.js';
import { KANJI_BY_CHAR } from '../src/content/kanji.js';
import { VOCABULARY } from '../src/content/vocabulary.js';
import { LESSONS } from '../src/content/lessons.js';
import { detectGrammar } from './tag-sentences.js';

const introducedAt = new Map();
LESSONS.forEach((l, i) => { for (const c of l.concepts) if (!introducedAt.has(c)) introducedAt.set(c, i); });
const at = id => (introducedAt.has(id) ? introducedAt.get(id) : Infinity);
const name = i => (i === Infinity ? 'never taught' : `${LESSONS[i].id} ${LESSONS[i].title}`);

const problems = [];
const notes = [];

// 1 ── tags must be complete, or the serve-time gate is blind
for (const s of SENTENCES) {
  const missing = [...detectGrammar(s)].filter(g => !s.grammar.includes(g));
  if (missing.length) problems.push(`${s.id}: untagged grammar ${missing.join(', ')} — run tools/tag-sentences.js`);
}

// 2 ── every grammar point must have practisable sentences by the time it is taught
console.log('═══ PRACTICE COVERAGE AT INTRODUCTION ═══\n');
console.log('  point            taught in                              usable sentences');
// These points are drilled by their own generators (conjugation tables, counter tables)
// rather than from the sentence pool, so sentence coverage is not the right measure.
const GENERATOR_DRIVEN = new Set(['g:te', 'g:te_u', 'g:plain', 'g:nai', 'g:counters']);
for (const g of GRAMMAR) {
  const gAt = at(g.id);
  const tagged = SENTENCES.filter(s => s.grammar.includes(g.id));
  const usable = tagged.filter(s =>
    s.grammar.every(x => at(x) <= gAt) && (s.vocab || []).every(v => at(v) <= gAt));
  const flag = gAt === Infinity ? '  ← never introduced by a lesson'
             : GENERATOR_DRIVEN.has(g.id) ? '  (drilled by its own generator)'
             : usable.length === 0 ? '  ← NOTHING to practise on'
             : usable.length < 2 ? '  ← thin'
             : '';
  console.log(`  ${g.id.padEnd(16)} ${name(gAt).slice(0, 38).padEnd(40)} ${String(usable.length).padStart(3)}/${String(tagged.length).padEnd(3)}${flag}`);
  if (gAt === Infinity) problems.push(`grammar ${g.id} is never introduced by any lesson`);
  else if (!GENERATOR_DRIVEN.has(g.id) && usable.length === 0 && tagged.length > 0) problems.push(`grammar ${g.id} has no sentence usable at ${name(gAt)}`);
}

// 3 ── grammar tags that no grammar point defines
const defined = new Set(GRAMMAR.map(g => g.id));
const orphan = new Set();
for (const s of SENTENCES) for (const g of s.grammar) if (!defined.has(g)) orphan.add(g);
if (orphan.size) problems.push(`sentences reference undefined grammar points: ${[...orphan].join(', ')}`);

// 4 ── exposure: kanji met inside a word before the character itself is taught
for (const v of VOCABULARY) {
  const vAt = at(v.id);
  if (vAt === Infinity) continue;
  for (const c of v.kanji || []) {
    if (!KANJI_BY_CHAR[c]) continue;
    if (at(`k:${c}`) > vAt) notes.push(`${v.word} (${name(vAt)}) contains ${c}, taught later in ${name(at(`k:${c}`))} — exposure only, the reading is always shown`);
  }
}

console.log('\n═══ PROBLEMS ═══');
console.log(problems.length ? problems.map(p => '  ✗ ' + p).join('\n') : '  none');
console.log('\n═══ EXPOSURE (acceptable, listed so it stays deliberate) ═══');
console.log(notes.length ? notes.map(n => '  · ' + n).join('\n') : '  none');
process.exit(problems.length ? 1 : 0);
