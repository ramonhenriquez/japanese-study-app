// Content QA. Cross-checks every reference in the curriculum and re-derives every romaji
// mapping from first principles, so a broken id or a bad reading fails loudly rather than
// silently shipping as a lesson.
import { KANA, KANA_BY_ID } from '../src/content/kana.js';
import { VOCABULARY, VOCAB_BY_ID } from '../src/content/vocabulary.js';
import { KANJI, KANJI_BY_ID, KANJI_BY_CHAR } from '../src/content/kanji.js';
import { GRAMMAR, GRAMMAR_BY_ID } from '../src/content/grammar.js';
import { SENTENCES, SENTENCES_BY_ID } from '../src/content/sentences.js';
import { LESSONS } from '../src/content/lessons.js';
import { toRomaji } from '../src/engine/romaji.js';
import { teForm, naiForm, masuFromPlain } from '../src/engine/conjugation.js';
import { COUNTERS, COUNTERS_BY_ID } from '../src/content/counters.js';

const errors = [];
const untaughtKanji = new Set();
const warnings = [];
const err = m => errors.push(m);
const warn = m => warnings.push(m);

// 1 ── unique ids everywhere
for (const [name, list] of [['kana', KANA], ['vocab', VOCABULARY], ['kanji', KANJI], ['grammar', GRAMMAR], ['sentences', SENTENCES], ['lessons', LESSONS]]) {
  const seen = new Set();
  for (const x of list) {
    if (seen.has(x.id)) err(`${name}: duplicate id ${x.id}`);
    seen.add(x.id);
  }
}

// 2 ── kana completeness and romaji agreement
const hira = KANA.filter(k => k.script === 'hiragana');
const kata = KANA.filter(k => k.script === 'katakana');
if (hira.filter(k => k.group === 'base').length !== 46) err(`expected 46 base hiragana, got ${hira.filter(k => k.group === 'base').length}`);
if (hira.filter(k => k.group === 'voiced').length !== 25) err(`expected 25 voiced hiragana, got ${hira.filter(k => k.group === 'voiced').length}`);
if (hira.filter(k => k.group === 'yoon').length !== 33) err(`expected 33 yōon, got ${hira.filter(k => k.group === 'yoon').length}`);
if (hira.length !== kata.length) err(`hiragana (${hira.length}) and katakana (${kata.length}) sets differ in size`);
for (const k of KANA) {
  const derived = toRomaji(k.kana);
  if (derived !== k.romaji) err(`kana ${k.kana} (${k.id}): stored romaji "${k.romaji}" but engine derives "${derived}"`);
  for (const c of k.confusables) if (!KANA_BY_ID[c]) err(`kana ${k.id}: confusable ${c} does not exist`);
}
// katakana twins must map to the same sound as their hiragana counterpart
const toKata = s => [...s].map(c => { const cp = c.codePointAt(0); return cp >= 0x3041 && cp <= 0x3096 ? String.fromCodePoint(cp + 0x60) : c; }).join('');
for (const h of hira) {
  const twin = KANA_BY_ID[`kana:k:${toKata(h.kana)}`];
  if (!twin) err(`no katakana twin for ${h.kana}`);
  else if (twin.romaji !== h.romaji) err(`twin mismatch: ${h.kana}=${h.romaji} vs ${twin.kana}=${twin.romaji}`);
}

// 3 ── vocabulary integrity
const KANA_ONLY = /^[ぁ-んァ-ヶーゝゞ]+$/;
for (const v of VOCABULARY) {
  if (!KANA_ONLY.test(v.reading)) err(`vocab ${v.id}: reading "${v.reading}" is not pure kana`);
  if (!v.meanings?.length) err(`vocab ${v.id}: no meanings`);
  if (!v.pos) err(`vocab ${v.id}: no part of speech`);
  // If the written form is kana-only, it must equal the reading.
  if (KANA_ONLY.test(v.word) && v.word !== v.reading) err(`vocab ${v.id}: kana-only word "${v.word}" differs from reading "${v.reading}"`);
  // Declared kanji must actually appear in the written form.
  for (const c of v.kanji || []) if (!v.word.includes(c)) err(`vocab ${v.id}: declares kanji ${c} not present in "${v.word}"`);
  // …and the declaration must be complete, or the kanji index silently misses entries.
  for (const c of [...v.word].filter(c => /[一-龯]/.test(c))) {
    if (!(v.kanji || []).includes(c)) err(`vocab ${v.id} ("${v.word}"): kanji ${c} appears in the word but is not declared`);
  }
  // Reading length sanity: a reading much shorter than the word is usually a typo.
  if (v.reading.length < v.word.replace(/[^ぁ-んァ-ヶー]/g, '').length) err(`vocab ${v.id}: reading shorter than its own kana content`);
}

// 3b ── verb conjugation: every stored て-form must be re-derivable from the rules
const GROUPS = ['godan', 'ichidan', 'irregular'];
for (const v of VOCABULARY.filter(x => x.pos.startsWith('verb'))) {
  if (!v.group) { err(`vocab ${v.id}: verb has no conjugation group`); continue; }
  if (!GROUPS.includes(v.group)) err(`vocab ${v.id}: unknown group "${v.group}"`);
  if (!v.masu) err(`vocab ${v.id}: verb has no ます-form`);
  if (!v.te) { err(`vocab ${v.id}: verb has no て-form`); continue; }
  const derived = teForm(v);
  if (!derived) err(`vocab ${v.id}: て-form cannot be derived from the rules`);
  else if (derived !== v.te) err(`vocab ${v.id} (${v.word}): stored て-form "${v.te}" but the rules give "${derived}"`);
  // a る-verb's dictionary form must actually end in る
  if (v.group === 'ichidan' && !v.reading.endsWith('る')) err(`vocab ${v.id}: marked ichidan but does not end in る`);
  // the ます-form must also be derivable, which cross-checks the group assignment
  const derivedMasu = masuFromPlain(v);
  if (derivedMasu && derivedMasu !== v.masu) err(`vocab ${v.id} (${v.word}): stored ます-form "${v.masu}" but the rules give "${derivedMasu}"`);
  if (!naiForm(v)) err(`vocab ${v.id}: ない-form cannot be derived`);
}

// 3c ── counters
const KANA_ONLY_R = /^[ぁ-んー\/ ]+$/;
for (const c of COUNTERS) {
  if (!c.counter || !c.counts) err(`counter ${c.id}: missing counter or description`);
  if (!KANA_ONLY_R.test(c.reading)) err(`counter ${c.id}: reading "${c.reading}" is not kana`);
  if (!c.question || !/^[ぁ-んー]+$/.test(c.question.reading)) err(`counter ${c.id}: question form reading is not kana`);
  if (c.forms.length < 10) err(`counter ${c.id}: only ${c.forms.length} forms listed`);
  const seenN = new Set();
  for (const f of c.forms) {
    if (seenN.has(f.n)) err(`counter ${c.id}: duplicate entry for ${f.n}`);
    seenN.add(f.n);
    if (!/^[ぁ-んー]+$/.test(f.reading)) err(`counter ${c.id}: ${f.form} reading "${f.reading}" is not kana`);
    if (c.id !== 'c:tsu' && !f.form.includes(c.counter)) err(`counter ${c.id}: form ${f.form} does not contain ${c.counter}`);
  }
  for (let n = 1; n <= 10; n++) if (!seenN.has(n)) err(`counter ${c.id}: no form for ${n}`);
}
{
  // Euphonic cross-check. Counter readings are not derivable in general, but one pattern is
  // highly regular: before a counter starting with k, s, t or h, the numbers 1, 6, 8 and 10
  // geminate (っ), and an h-initial counter shifts to p. Encoding it catches transcription
  // slips in exactly the data that cannot be derived — it does not replace human review.
  const GEMINATING = { 'こ': 'っこ', 'かい': 'っかい', 'ほん': 'っぽん', 'ふん': 'っぷん' };
  const GEM_NUMBERS = { 1: 'い', 6: 'ろ', 8: 'は', 10: 'じゅ' };
  const NON_GEMINATING = ['にん', 'まい', 'だい', 'じ'];
  for (const c of COUNTERS) {
    const base = c.reading.split(' / ')[0];
    const tail = GEMINATING[base];
    if (tail) {
      for (const [n, head] of Object.entries(GEM_NUMBERS)) {
        const f = c.forms.find(x => x.n === Number(n));
        if (!f) continue;
        const expected = head + tail;
        if (f.reading !== expected) err(`counter ${c.id}: ${f.form} is "${f.reading}" but the gemination pattern gives "${expected}"`);
        if (!f.irregular) err(`counter ${c.id}: ${f.form} geminates and should be flagged irregular`);
      }
    }
    if (NON_GEMINATING.includes(base)) {
      for (const f of c.forms) {
        if (/っ/.test(f.reading) && !['c:ji'].includes(c.id)) err(`counter ${c.id}: ${f.form} reading "${f.reading}" geminates, but ${base} should not`);
      }
    }
  }
}
{
  // guard against a silent copy-paste: no two counters may share an identical form list
  const sigs = new Map();
  for (const c of COUNTERS) {
    const sig = c.forms.map(f => f.reading).join('|');
    if (sigs.has(sig)) err(`counters ${c.id} and ${sigs.get(sig)} have identical readings`);
    sigs.set(sig, c.id);
  }
}

// 4 ── kanji integrity
for (const k of KANJI) {
  if ([...k.char].length !== 1) err(`kanji ${k.id}: char must be a single character`);
  if (!k.on.length && !k.kun.length) err(`kanji ${k.id}: no readings`);
  if (!(k.strokes > 0)) err(`kanji ${k.id}: bad stroke count`);
  for (const vid of k.vocab) {
    if (!VOCAB_BY_ID[vid]) err(`kanji ${k.id}: vocab ${vid} does not exist`);
    else if (!VOCAB_BY_ID[vid].word.includes(k.char)) err(`kanji ${k.id}: linked vocab ${vid} ("${VOCAB_BY_ID[vid].word}") does not contain ${k.char}`);
  }
  // on'yomi conventionally katakana, kun'yomi hiragana
  for (const r of k.on) if (!/^[ァ-ヶー]+$/.test(r)) err(`kanji ${k.id}: on'yomi "${r}" should be katakana`);
  for (const r of k.kun) if (!/^[ぁ-ん.]+$/.test(r)) err(`kanji ${k.id}: kun'yomi "${r}" should be hiragana (with . for okurigana)`);
}

// 5 ── grammar → sentence links
for (const g of GRAMMAR) {
  for (const sid of g.examples || []) {
    if (!SENTENCES_BY_ID[sid]) err(`grammar ${g.id}: example ${sid} does not exist`);
    else if (!SENTENCES_BY_ID[sid].grammar.includes(g.id)) warn(`grammar ${g.id}: example ${sid} does not list ${g.id} in its own grammar tags`);
  }
}

// 6 ── sentence integrity
for (const s of SENTENCES) {
  if (s.parts.join('') !== s.jp.replace(/[。？]$/, '')) err(`sentence ${s.id}: parts do not reassemble into jp`);
  if (!/^[ぁ-んァ-ヶー、。？]+$/.test(s.reading)) err(`sentence ${s.id}: reading contains non-kana`);
  if (!s.en) err(`sentence ${s.id}: no translation`);
  if (s.parts.length < 2) warn(`sentence ${s.id}: only ${s.parts.length} chunk — sentence building will be trivial`);
  for (const g of s.grammar || []) if (!GRAMMAR_BY_ID[g]) err(`sentence ${s.id}: grammar ${g} does not exist`);
  for (const v of s.vocab || []) if (!VOCAB_BY_ID[v]) err(`sentence ${s.id}: vocab ${v} does not exist`);
  // Kanji used in sentences but not yet in the taught set is expected — those render with
  // their kana reading available. Collected as one summary line rather than 250 warnings.
  for (const c of [...s.jp].filter(c => /[一-龯]/.test(c))) if (!KANJI_BY_CHAR[c]) untaughtKanji.add(c);
}

// 7 ── lesson integrity
const ALL_IDS = new Set([
  ...KANA.map(k => k.id), ...VOCABULARY.map(v => v.id),
  ...KANJI.map(k => k.id), ...GRAMMAR.map(g => g.id), ...COUNTERS.map(c => c.id),
]);
const introduced = new Set();
for (const l of LESSONS) {
  if (!l.concepts.length) err(`lesson ${l.id}: introduces no concepts`);
  for (const c of l.concepts) {
    if (!ALL_IDS.has(c)) err(`lesson ${l.id}: concept ${c} does not exist`);
    if (introduced.has(c)) warn(`lesson ${l.id}: concept ${c} was already introduced earlier`);
    introduced.add(c);
  }
  for (const b of l.blocks) {
    if (b.type === 'kana') for (const id of b.ids) if (!KANA_BY_ID[id]) err(`lesson ${l.id}: kana ${id} does not exist`);
    if (b.type === 'vocab') for (const id of b.ids) if (!VOCAB_BY_ID[id]) err(`lesson ${l.id}: vocab ${id} does not exist`);
    if (b.type === 'kanji') for (const id of b.ids) if (!KANJI_BY_ID[id]) err(`lesson ${l.id}: kanji ${id} does not exist`);
    if (b.type === 'grammar' && !GRAMMAR_BY_ID[b.id]) err(`lesson ${l.id}: grammar ${b.id} does not exist`);
    if (b.type === 'sentences') for (const id of b.ids) if (!SENTENCES_BY_ID[id]) err(`lesson ${l.id}: sentence ${id} does not exist`);
    if (b.type === 'conjugation') for (const id of b.ids) {
      const v = VOCAB_BY_ID[id];
      if (!v) err(`lesson ${l.id}: conjugation entry ${id} does not exist`);
      else if (!v.te) err(`lesson ${l.id}: conjugation table includes ${id}, which is not a verb with a て-form`);
    }
    if (b.type === 'counter') for (const id of b.ids) if (!COUNTERS_BY_ID[id]) err(`lesson ${l.id}: counter ${id} does not exist`);
    if (!['text', 'kana', 'vocab', 'kanji', 'grammar', 'sentences', 'tip', 'conjugation', 'counter'].includes(b.type)) err(`lesson ${l.id}: unknown block type "${b.type}"`);
  }
}

// 7b ── curriculum order: a lesson may only show material it has already explained
const FORM_POINTS = new Set([
  'g:masu', 'g:masen', 'g:mashita', 'g:iadj', 'g:naadj', 'g:aruiru',
  'g:te', 'g:te_u', 'g:teimasu', 'g:temoii', 'g:tewaikemasen', 'g:teconnect',
]);
const earlyLexical = [];
const grammarSoFar = new Set();
const teRuleSoFar = new Set();
for (const l of LESSONS) {
  for (const c of l.concepts) {
    if (c.startsWith('g:')) grammarSoFar.add(c);
    if (c === 'g:te') teRuleSoFar.add('ichidan'), teRuleSoFar.add('irregular');
    if (c === 'g:te_u') teRuleSoFar.add('godan');
  }
  for (const b of l.blocks) {
    if (b.type === 'sentences') {
      for (const id of b.ids) {
        const s = SENTENCES_BY_ID[id];
        if (!s) continue;
        for (const g of s.grammar || []) {
          if (grammarSoFar.has(g)) continue;
          // Particles and demonstratives can appear in an example before their own lesson —
          // every textbook does this, and the lesson glosses them in passing. Conjugated
          // forms cannot: the learner has no way to parse a form whose rule is unexplained.
          if (FORM_POINTS.has(g)) err(`lesson ${l.id}: example ${id} uses ${g}, a form whose rule has not been taught yet`);
          else earlyLexical.push(`${l.id} shows ${id} using ${g} before its own lesson`);
        }
      }
    }
    if (b.type === 'conjugation') {
      for (const id of b.ids) {
        const v = VOCAB_BY_ID[id];
        if (v && !teRuleSoFar.has(v.group)) {
          err(`lesson ${l.id}: conjugation table includes ${v.word} (${v.group}), but that group's て-form rule has not been taught yet`);
        }
      }
    }
  }
}

// 8 ── coverage: every kana and every grammar point must be taught somewhere
for (const k of KANA) if (!introduced.has(k.id)) err(`kana ${k.kana} (${k.id}) is never introduced by any lesson`);
for (const g of GRAMMAR) if (!introduced.has(g.id)) err(`grammar ${g.id} is never introduced by any lesson`);
for (const k of KANJI) if (!introduced.has(k.id)) warn(`kanji ${k.char} is never introduced by a lesson`);
for (const c of COUNTERS) if (!introduced.has(c.id)) err(`counter ${c.counter} (${c.id}) is never introduced by a lesson`);
const unusedVocab = VOCABULARY.filter(v => !introduced.has(v.id));
if (unusedVocab.length) warn(`${unusedVocab.length} vocabulary items are not attached to any lesson (they still appear in Practice and Reference): ${unusedVocab.slice(0, 8).map(v => v.word).join(', ')}${unusedVocab.length > 8 ? '…' : ''}`);

if (earlyLexical.length) {
  console.log(`\nnote: ${earlyLexical.length} example(s) use a particle or demonstrative slightly before its own lesson — normal in a beginner course, and each is glossed in place:\n  ${earlyLexical.join('\n  ')}`);
}
if (untaughtKanji.size) {
  console.log(`\nnote: ${untaughtKanji.size} kanji appear in example sentences but are not in the taught set — expected at this level, and every sentence carries a kana reading:\n  ${[...untaughtKanji].join(' ')}`);
}

// ── report
console.log(`content: ${KANA.length} kana · ${COUNTERS.length} counters · ${VOCABULARY.length} vocab (${VOCABULARY.filter(v => v.pos.startsWith('verb')).length} verbs with derived て-forms) · ${KANJI.length} kanji · ${GRAMMAR.length} grammar · ${SENTENCES.length} sentences · ${LESSONS.length} lessons`);
console.log(`\nERRORS (${errors.length}):`);
console.log(errors.length ? errors.map(e => '  ✗ ' + e).join('\n') : '  none');
console.log(`\nWARNINGS (${warnings.length}):`);
console.log(warnings.length ? warnings.map(w => '  ! ' + w).join('\n') : '  none');
process.exit(errors.length ? 1 : 0);
