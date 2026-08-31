import { el, clear, richText, icon, speak, audioAvailable } from './dom.js';
import { storage } from '../engine/storage.js';
import * as SRS from '../engine/srs.js';
import { KANA, KANA_BY_ID } from '../content/kana.js';
import { VOCABULARY, VOCAB_BY_ID } from '../content/vocabulary.js';
import { KANJI, KANJI_BY_ID } from '../content/kanji.js';
import { GRAMMAR, GRAMMAR_BY_ID } from '../content/grammar.js';
import { COUNTERS_BY_ID } from '../content/counters.js';
import { SENTENCES_BY_ID } from '../content/sentences.js';
import { LESSONS, LESSONS_BY_ID, STAGES, nextLesson } from '../content/lessons.js';
import { buildSession, exerciseFor, practicePool, makeMatching, particleDrill, shuffle } from '../engine/exercises.js';
import { runExercises, canListen } from './exercise.js';
import { toRomaji } from '../engine/romaji.js';
import { teForm, naiForm, plainForm } from '../engine/conjugation.js';

// ── shared bits ──────────────────────────────────────────────────────────────

const showRomajiFor = id => {
  const mode = storage.state.settings.romaji;
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return !SRS.isKnown(id);           // 'fade' — romaji disappears once the kana is known
};

function card(...children) { return el('section', { class: 'card' }, ...children); }
function sectionHead(title, sub) {
  return el('div', { class: 'sec-head' },
    el('h2', {}, title), sub ? el('p', { class: 'sec-sub' }, sub) : null);
}
function progressBar(value, max) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return el('div', { class: 'meter', role: 'img', 'aria-label': `${value} of ${max}` },
    el('span', { style: { width: pct + '%' } }));
}
function statTile(label, value, sub) {
  return el('div', { class: 'stat' },
    el('p', { class: 'stat-value' }, String(value)),
    el('p', { class: 'stat-label' }, label),
    sub ? el('p', { class: 'stat-sub' }, sub) : null);
}
function speakButton(text) {
  if (!audioAvailable() || !storage.state.settings.audio) return null;
  return el('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Play audio', onclick: e => { e.stopPropagation(); speak(text); } }, icon('sound'));
}

const known = type => Object.values(storage.state.items).filter(i => i.type === type && i.box >= SRS.KNOWN_BOX).length;
const seen = type => Object.values(storage.state.items).filter(i => i.type === type).length;

// ── HOME ─────────────────────────────────────────────────────────────────────

export function renderHome(root, nav) {
  const s = storage.state;
  const due = SRS.dueCount();
  const next = nextLesson(s.lessons);
  const done = Object.keys(s.lessons).length;
  const weak = SRS.weakItems().slice(0, 3);
  const streak = s.stats.streak.current;

  const wrap = el('div', { class: 'screen' });

  wrap.append(el('header', { class: 'screen-head' },
    el('p', { class: 'eyebrow' }, greeting()),
    el('h1', {}, next ? 'Continue learning' : 'Curriculum complete'),
  ));

  // Primary call to action
  if (next) {
    wrap.append(el('button', { class: 'hero', type: 'button', onclick: () => nav(`#/lesson/${next.id}`) },
      el('span', { class: 'hero-eyebrow' }, `Lesson ${LESSONS.indexOf(next) + 1} of ${LESSONS.length} · ${STAGES[next.stage].name}`),
      el('span', { class: 'hero-title jp' }, next.title),
      el('span', { class: 'hero-sub' }, next.subtitle),
      el('span', { class: 'hero-go' }, 'Start →'),
    ));
  } else {
    wrap.append(el('div', { class: 'hero done' },
      el('span', { class: 'hero-title' }, 'You have finished every lesson'),
      el('span', { class: 'hero-sub' }, 'Keep the reviews going — that is where the retention happens.')));
  }

  // Reviews + quick practice
  const actions = el('div', { class: 'grid two' },
    el('button', { class: 'action' + (due ? ' accent' : ''), type: 'button', onclick: () => nav('#/review') },
      el('span', { class: 'action-value' }, String(due)),
      el('span', { class: 'action-label' }, due === 1 ? 'review due' : 'reviews due'),
      el('span', { class: 'action-sub' }, due > 20 ? 'Start — 20 per session' : due ? 'Start review' : 'Nothing due — come back later')),
    el('button', { class: 'action', type: 'button', onclick: () => nav('#/practice') },
      el('span', { class: 'action-value' }, icon('practice')),
      el('span', { class: 'action-label' }, 'Quick practice'),
      el('span', { class: 'action-sub' }, 'Free practice, no schedule')),
  );
  wrap.append(actions);

  // Progress snapshot
  const hiraTotal = KANA.filter(k => k.script === 'hiragana').length;
  const kataTotal = KANA.filter(k => k.script === 'katakana').length;
  const kanaKnown = id => Object.values(storage.state.items).filter(i => i.type === 'kana' && i.box >= SRS.KNOWN_BOX && KANA_BY_ID[i.id]?.script === id).length;

  wrap.append(card(
    sectionHead('Where you are'),
    el('div', { class: 'stat-row' },
      statTile('Hiragana', `${kanaKnown('hiragana')}/${hiraTotal}`),
      statTile('Katakana', `${kanaKnown('katakana')}/${kataTotal}`),
      statTile('Vocabulary', `${known('vocab')}/${VOCABULARY.length}`),
      statTile('Kanji', `${known('kanji')}/${KANJI.length}`),
    ),
    el('div', { class: 'meter-row' },
      el('p', { class: 'meter-label' }, `Lessons ${done} / ${LESSONS.length}`),
      progressBar(done, LESSONS.length)),
  ));

  // Weak areas — only shown when there is real evidence
  if (weak.length) {
    wrap.append(card(
      sectionHead('Needs attention', 'Items you have got wrong more often than right'),
      el('div', { class: 'weak-list' }, ...weak.map(it => {
        const c = conceptDisplay(it.id);
        return el('div', { class: 'weak-item' },
          el('span', { class: 'weak-glyph jp' }, c.glyph),
          el('span', { class: 'weak-meta' },
            el('span', { class: 'weak-name' }, c.label),
            el('span', { class: 'weak-rate' }, `${it.correct}/${it.reps} correct`)));
      })),
      el('button', { class: 'btn ghost full', type: 'button', onclick: () => nav('#/practice/weak') }, 'Practise these'),
    ));
  }

  if (streak > 0) {
    wrap.append(el('p', { class: 'streak-note' },
      `${streak} day${streak === 1 ? '' : 's'} in a row · ${s.stats.totalAnswers} answers all time`));
  }
  if (!storage.persistent) {
    wrap.append(el('p', { class: 'warn-note' },
      'This browser is not saving progress (private window or blocked site data). You can still study, but nothing will be here next time.'));
  }

  clear(root).append(wrap);
}

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return 'おはようございます';
  if (h < 18) return 'こんにちは';
  return 'こんばんは';
}

function conceptDisplay(id) {
  if (id.startsWith('kana:')) { const k = KANA_BY_ID[id]; return { glyph: k?.kana || '?', label: k ? `${k.kana} — ${k.romaji}` : id }; }
  if (id.startsWith('v:')) { const v = VOCAB_BY_ID[id]; return { glyph: v?.word || '?', label: v ? `${v.word} — ${v.meanings[0]}` : id }; }
  if (id.startsWith('k:')) { const k = KANJI_BY_ID[id]; return { glyph: k?.char || '?', label: k ? `${k.char} — ${k.meanings[0]}` : id }; }
  if (id.startsWith('g:')) { const g = GRAMMAR_BY_ID[id]; return { glyph: '文', label: g ? g.title : id }; }
  return { glyph: '?', label: id };
}

// ── LEARN (curriculum list) ──────────────────────────────────────────────────

export function renderLearn(root, nav) {
  const s = storage.state;
  const wrap = el('div', { class: 'screen' });
  wrap.append(el('header', { class: 'screen-head' },
    el('p', { class: 'eyebrow' }, 'Curriculum'),
    el('h1', {}, 'Learn'),
    el('p', { class: 'lede' }, 'Lessons unlock in order. Each one introduces new material, then makes you produce it before it counts as done.')));

  const nextId = nextLesson(s.lessons)?.id;

  for (const stage of STAGES) {
    const lessons = LESSONS.filter(l => l.stage === stage.id);
    const doneCount = lessons.filter(l => s.lessons[l.id]).length;
    wrap.append(el('div', { class: 'stage-head' },
      el('div', {},
        el('h2', {}, `Stage ${stage.id} · ${stage.name}`),
        el('p', { class: 'sec-sub' }, stage.blurb)),
      el('span', { class: 'stage-count' }, `${doneCount}/${lessons.length}`)));

    let unit = null;
    const list = el('ol', { class: 'lesson-list' });
    for (const l of lessons) {
      if (l.unit !== unit) { unit = l.unit; list.append(el('li', { class: 'unit-label' }, `Unit ${unit}`)); }
      const record = s.lessons[l.id];
      const isNext = l.id === nextId;
      const locked = !record && !isNext;
      list.append(el('li', {},
        el('button', {
          class: 'lesson-row' + (record ? ' done' : '') + (isNext ? ' next' : '') + (locked ? ' locked' : ''),
          type: 'button',
          onclick: () => nav(`#/lesson/${l.id}`),
        },
          el('span', { class: 'lesson-num' }, record ? '✓' : String(LESSONS.indexOf(l) + 1)),
          el('span', { class: 'lesson-body' },
            el('span', { class: 'lesson-title jp' }, l.title),
            el('span', { class: 'lesson-sub' }, l.subtitle)),
          el('span', { class: 'lesson-meta' }, record ? `${record.score}%` : `${l.concepts.length} items`),
        )));
    }
    wrap.append(list);
  }
  clear(root).append(wrap);
}

// ── LESSON player ────────────────────────────────────────────────────────────

export function renderLesson(root, nav, lessonId) {
  const lesson = LESSONS_BY_ID[lessonId];
  if (!lesson) return nav('#/learn');
  let phase = 'study';

  function draw() {
    const wrap = el('div', { class: 'screen lesson' });
    wrap.append(el('header', { class: 'screen-head' },
      el('button', { class: 'back', type: 'button', onclick: () => nav('#/learn') }, '← Learn'),
      el('p', { class: 'eyebrow' }, `Stage ${lesson.stage} · Unit ${lesson.unit} · Lesson ${LESSONS.indexOf(lesson) + 1}`),
      el('h1', { class: 'jp' }, lesson.title),
      lesson.subtitle ? el('p', { class: 'lede' }, lesson.subtitle) : null));

    if (phase === 'study') {
      for (const b of lesson.blocks) wrap.append(renderBlock(b));
      wrap.append(el('div', { class: 'lesson-actions' },
        el('button', { class: 'btn primary full', type: 'button', onclick: () => { phase = 'practice'; draw(); } },
          'Practise this lesson →')));
    } else {
      const host = el('div', {});
      wrap.append(host);
      clear(root).append(wrap);
      const exercises = buildSession(lesson.concepts, {
        limit: Math.min(14, Math.max(6, lesson.concepts.length)),
        allowTyping: true,
        allowAudio: canListen() && storage.state.settings.audio,
      });
      runExercises(host, exercises, {
        title: 'Practice',
        onDone: ({ pct }) => {
          storage.update(st => {
            const prev = st.lessons[lesson.id];
            st.lessons[lesson.id] = {
              completedAt: Date.now(),
              score: Math.max(pct, prev?.score || 0),
              attempts: (prev?.attempts || 0) + 1,
            };
          });
          // Anything not exercised still enters the review queue, so nothing is silently dropped.
          for (const c of lesson.concepts) SRS.ensureItem(c, typeOf(c));
          host.append(el('div', { class: 'lesson-done' },
            el('p', { class: 'done-title' }, 'Lesson complete'),
            el('p', { class: 'done-sub' }, `${lesson.concepts.length} items added to your review queue.`),
            el('div', { class: 'done-actions' },
              el('button', { class: 'btn primary', type: 'button', onclick: () => nav('#/learn') }, 'Back to curriculum'),
              nextLesson(storage.state.lessons)
                ? el('button', { class: 'btn ghost', type: 'button', onclick: () => nav(`#/lesson/${nextLesson(storage.state.lessons).id}`) }, 'Next lesson →')
                : null)));
          host.querySelector('.lesson-done').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        },
      });
      return;
    }
    clear(root).append(wrap);
  }
  draw();
}

function typeOf(id) {
  if (id.startsWith('kana:')) return 'kana';
  if (id.startsWith('v:')) return 'vocab';
  if (id.startsWith('k:')) return 'kanji';
  if (id.startsWith('g:')) return 'grammar';
  return 'other';
}

function renderBlock(b) {
  switch (b.type) {
    case 'text':
      return el('p', { class: 'prose', html: richText(b.body) });
    case 'tip':
      return el('aside', { class: 'tip' },
        el('p', { class: 'tip-title' }, b.title),
        el('p', { class: 'tip-body', html: richText(b.body) }));
    case 'kana':
      return el('div', { class: 'kana-grid' }, ...b.ids.map(id => {
        const k = KANA_BY_ID[id]; if (!k) return null;
        return el('div', { class: 'kana-cell' },
          el('span', { class: 'kana-glyph jp' }, k.kana),
          showRomajiFor(k.id) ? el('span', { class: 'kana-romaji' }, k.romaji) : null,
          k.note ? el('span', { class: 'kana-note', title: k.note }, '·') : null);
      }));
    case 'vocab':
      return el('div', { class: 'vocab-list' }, ...b.ids.map(id => {
        const v = VOCAB_BY_ID[id]; if (!v) return null;
        return el('div', { class: 'vocab-row' },
          el('div', { class: 'vocab-main' },
            el('span', { class: 'vocab-word jp' }, v.word),
            v.reading !== v.word ? el('span', { class: 'vocab-reading jp' }, v.reading) : null,
            showRomajiFor(v.id) ? el('span', { class: 'vocab-romaji' }, toRomaji(v.reading)) : null),
          el('div', { class: 'vocab-side' },
            el('span', { class: 'vocab-meaning' }, v.meanings.join(', ')),
            v.register ? el('span', { class: 'pill' }, v.register) : null,
            speakButton(v.reading)),
          v.note ? el('p', { class: 'vocab-note' }, v.note) : null);
      }));
    case 'kanji':
      return el('div', { class: 'kanji-grid' }, ...b.ids.map(id => {
        const k = KANJI_BY_ID[id]; if (!k) return null;
        return el('div', { class: 'kanji-card' },
          el('span', { class: 'kanji-char jp' }, k.char),
          el('span', { class: 'kanji-meaning' }, k.meanings.join(', ')),
          el('span', { class: 'kanji-readings jp' }, [k.on.join('・'), k.kun.join('・')].filter(Boolean).join(' / ')),
          el('span', { class: 'kanji-strokes' }, `${k.strokes} strokes`),
          k.note ? el('span', { class: 'kanji-note' }, k.note) : null);
      }));
    case 'counter':
      return el('div', { class: 'counter-block' }, ...b.ids.map(id => {
        const c = COUNTERS_BY_ID[id]; if (!c) return null;
        return el('div', { class: 'counter-card' },
          el('div', { class: 'counter-head' },
            el('span', { class: 'counter-glyph jp' }, c.counter),
            el('span', { class: 'counter-meta' },
              el('span', { class: 'counter-reading jp' }, c.reading),
              el('span', { class: 'counter-counts' }, `counts ${c.counts}`))),
          el('div', { class: 'counter-forms' }, ...c.forms.map(f =>
            el('span', { class: 'counter-form' + (f.irregular ? ' irregular' : '') },
              el('span', { class: 'cf-form jp' }, f.form),
              el('span', { class: 'cf-reading jp' }, f.reading))),
            el('span', { class: 'counter-form question' },
              el('span', { class: 'cf-form jp' }, c.question.form),
              el('span', { class: 'cf-reading jp' }, c.question.reading))),
          c.note ? el('p', { class: 'counter-note' }, c.note) : null,
          el('p', { class: 'counter-legend' }, 'Highlighted forms change sound in a way you cannot predict — those are the ones to memorise.'));
      }));
    case 'conjugation': {
      const COLUMNS = {
        masu:  { label: 'ます-form', get: v => v.masu },
        te:    { label: 'て-form',   get: v => teForm(v) },
        plain: { label: 'plain',     get: v => plainForm(v) },
        nai:   { label: 'ない-form',  get: v => naiForm(v) },
      };
      const cols = (b.show || ['masu', 'te']).map(k => COLUMNS[k]).filter(Boolean);
      return el('div', { class: 'conj-scroll' },
        el('table', { class: 'conj' },
          el('thead', {}, el('tr', {},
            el('th', {}, 'Verb'), el('th', {}, 'Group'), el('th', {}, 'Meaning'),
            ...cols.map(c => el('th', {}, c.label)))),
          el('tbody', {}, ...b.ids.map(id => {
            const v = VOCAB_BY_ID[id]; if (!v) return null;
            const group = v.group === 'ichidan' ? 'る-verb' : v.group === 'godan' ? 'う-verb' : 'irregular';
            return el('tr', {},
              el('td', { class: 'jp conj-word' }, v.word, el('span', { class: 'conj-reading' }, v.reading)),
              el('td', { class: 'conj-group' }, group),
              el('td', { class: 'conj-mean' }, v.meanings[0]),
              ...cols.map((c, i) => el('td', { class: 'jp' + (i === cols.length - 1 ? ' conj-te' : '') }, c.get(v) || '—')));
          }))));
    }
    case 'grammar': {
      const g = GRAMMAR_BY_ID[b.id]; if (!g) return el('div');
      return el('div', { class: 'grammar-card' },
        el('p', { class: 'grammar-pattern jp' }, g.pattern),
        el('h3', { class: 'jp' }, g.title),
        el('p', { class: 'grammar-gloss' }, g.gloss),
        el('p', { class: 'prose', html: richText(g.explain) }),
        g.pitfalls ? el('p', { class: 'grammar-pitfall' }, g.pitfalls) : null);
    }
    case 'sentences':
      return el('div', { class: 'sentence-list' }, ...b.ids.map(id => {
        const s = SENTENCES_BY_ID[id]; if (!s) return null;
        return el('div', { class: 'sentence-row' },
          el('div', { class: 'sentence-main' },
            el('p', { class: 'sentence-jp jp' }, s.jp),
            el('p', { class: 'sentence-reading jp' }, s.reading),
            el('p', { class: 'sentence-en' }, s.en),
            s.note ? el('p', { class: 'sentence-note' }, s.note) : null),
          speakButton(s.jp));
      }));
    default:
      return el('div');
  }
}

// ── REVIEW ───────────────────────────────────────────────────────────────────

export function renderReview(root, nav) {
  const due = SRS.dueItems();
  const wrap = el('div', { class: 'screen' });

  if (!due.length) {
    wrap.append(el('header', { class: 'screen-head' },
      el('p', { class: 'eyebrow' }, 'Review'),
      el('h1', {}, 'Nothing due right now')));
    const soonest = Object.values(storage.state.items).sort((a, b) => a.due - b.due)[0];
    wrap.append(card(
      el('p', { class: 'prose' }, soonest
        ? `Your next review is ${relativeTime(soonest.due)}. Reviews are spaced deliberately — coming back too early does not help retention.`
        : 'Finish a lesson and its items will start appearing here.'),
      el('button', { class: 'btn primary full', type: 'button', onclick: () => nav(soonest ? '#/practice' : '#/learn') },
        soonest ? 'Free practice instead' : 'Go to lessons')));
    clear(root).append(wrap);
    return;
  }

  const SESSION_CAP = 20;
  const inSession = Math.min(SESSION_CAP, due.length);
  const backlog = due.length - inSession;

  wrap.append(el('header', { class: 'screen-head' },
    el('p', { class: 'eyebrow' }, 'Review'),
    el('h1', {}, backlog ? `${inSession} of ${due.length} due` : `${due.length} due`),
    el('p', { class: 'lede' }, backlog
      ? `Sessions are capped at ${SESSION_CAP} so they stay finishable. ${backlog} more will still be waiting afterwards — you can start another session straight away.`
      : 'Weakest items first. Getting one wrong sends it back to the start of the schedule.')));

  const host = el('div', {});
  wrap.append(host);
  clear(root).append(wrap);

  const exercises = buildSession(due.slice(0, SESSION_CAP).map(i => i.id), {
    limit: SESSION_CAP, allowTyping: true, allowAudio: canListen() && storage.state.settings.audio,
  });
  runExercises(host, exercises, {
    title: 'Review',
    note: backlog ? `${backlog} more due after this session` : null,
    onDone: () => {
      const left = SRS.dueCount();
      host.append(el('div', { class: 'lesson-done' },
        el('p', { class: 'done-title' }, 'Review finished'),
        el('p', { class: 'done-sub' }, left
          ? `${left} still due — including anything you just missed, which comes back almost immediately.`
          : 'Queue clear. Nothing else is due right now.'),
        el('div', { class: 'done-actions' },
          left ? el('button', { class: 'btn primary', type: 'button', onclick: () => renderReview(root, nav) }, `Next ${Math.min(SESSION_CAP, left)}`) : null,
          el('button', { class: 'btn ghost', type: 'button', onclick: () => nav('#/') }, 'Home'))));
    },
  });
}

function relativeTime(ts) {
  const diff = ts - Date.now();
  if (diff <= 0) return 'now';
  const h = Math.round(diff / 3600000);
  if (h < 1) return 'in under an hour';
  if (h < 24) return `in about ${h} hour${h === 1 ? '' : 's'}`;
  const d = Math.round(h / 24);
  return `in about ${d} day${d === 1 ? '' : 's'}`;
}

// ── PRACTICE ─────────────────────────────────────────────────────────────────

// Top-level practice modes. Translation and matching still exist as exercise generators —
// mixed lesson and review sessions use them for variety — but neither is strong enough on its
// own to earn a place in the menu.
const PRACTICE_MODES = [
  { id: 'kana-hiragana', name: 'Hiragana', sub: 'Recognition, recall and typing' },
  { id: 'kana-katakana', name: 'Katakana', sub: 'Including the confusable pairs' },
  { id: 'vocabulary',    name: 'Vocabulary', sub: 'Both directions, plus readings' },
  { id: 'kanji',         name: 'Kanji', sub: 'Meaning and reading, through words' },
  { id: 'grammar',       name: 'Grammar', sub: 'Patterns in whole sentences' },
  { id: 'particles',     name: 'Particles', sub: 'Fill the gap in a real sentence' },
  { id: 'build',         name: 'Sentence building', sub: 'Assemble it from pieces' },
  { id: 'listening',     name: 'Listening', sub: 'Hear it, then choose', audio: true },
  { id: 'weak',          name: 'Weak areas', sub: 'Only what you keep missing' },
];

export function renderPractice(root, nav, mode) {
  if (!mode) return renderPracticeMenu(root, nav);
  const wrap = el('div', { class: 'screen' });
  const conf = PRACTICE_MODES.find(m => m.id === mode);
  wrap.append(el('header', { class: 'screen-head' },
    el('button', { class: 'back', type: 'button', onclick: () => nav('#/practice') }, '← Practice'),
    el('h1', {}, conf?.name || 'Practice')));

  const exercises = buildPractice(mode);
  const host = el('div', {});
  wrap.append(host);
  clear(root).append(wrap);

  if (!exercises.length) {
    clear(host).append(card(
      el('p', { class: 'prose' }, mode === 'weak'
        ? 'No weak areas yet — you need a few more answers on record before the app can tell what you are actually struggling with.'
        : 'Nothing to practise here yet. Complete the lessons that introduce this material first.'),
      el('button', { class: 'btn primary full', type: 'button', onclick: () => nav('#/learn') }, 'Go to lessons')));
    return;
  }
  runExercises(host, exercises, {
    title: conf?.name || 'Practice',
    onDone: () => host.append(el('div', { class: 'lesson-done' },
      el('div', { class: 'done-actions' },
        el('button', { class: 'btn primary', type: 'button', onclick: () => renderPractice(root, nav, mode) }, 'Again'),
        el('button', { class: 'btn ghost', type: 'button', onclick: () => nav('#/practice') }, 'Other modes')))),
  });
}

function buildPractice(mode) {
  const opts = { limit: 12, allowTyping: true, allowAudio: canListen() && storage.state.settings.audio };
  const isIntroduced = SRS.isIntroduced;

  if (mode === 'weak') {
    const weak = SRS.weakItems(3, 0.7).map(i => i.id);
    return buildSession(weak, opts);
  }
  if (mode === 'particles') {
    const g = GRAMMAR.map(x => x.id).filter(isIntroduced);
    const out = [];
    for (let i = 0; i < 12; i++) { const ex = particleDrill(g); if (ex) out.push(ex); }
    return dedupeByPrompt(out);
  }
  if (mode === 'matching') {
    const pool = [...practicePool('kana-hiragana', { isIntroduced }), ...practicePool('vocabulary', { isIntroduced }), ...practicePool('kanji', { isIntroduced })];
    if (pool.length < 4) return [];
    return Array.from({ length: 5 }, () => makeMatching(pool, 4)).filter(Boolean);
  }
  if (mode === 'build' || mode === 'translate' || mode === 'listening') {
    const g = GRAMMAR.map(x => x.id).filter(isIntroduced);
    if (!g.length) return [];
    if (mode === 'listening' && !canListen()) return [];
    const out = [];
    for (const id of shuffle([...g, ...g])) {
      if (out.length >= 12) break;
      const ex = exerciseFor(id, opts);
      if (!ex) continue;
      if (mode === 'build' && ex.kind !== 'sentence-build') continue;
      if (mode === 'translate' && ex.kind !== 'translate') continue;
      if (mode === 'listening' && ex.kind !== 'listening') continue;
      out.push(ex);
    }
    // Fall back to any grammar exercise rather than showing an empty screen.
    return out.length ? out : buildSession(g, opts);
  }
  const pool = practicePool(mode, { isIntroduced });
  return buildSession(pool, opts);
}

const dedupeByPrompt = list => {
  const seenKeys = new Set();
  return list.filter(x => {
    const k = (x.prompt?.before || '') + '|' + (x.prompt?.after || '') + '|' + x.answer;
    if (seenKeys.has(k)) return false;
    seenKeys.add(k);
    return true;
  });
};

function renderPracticeMenu(root, nav) {
  const wrap = el('div', { class: 'screen' });
  wrap.append(el('header', { class: 'screen-head' },
    el('p', { class: 'eyebrow' }, 'Free practice'),
    el('h1', {}, 'Practice'),
    el('p', { class: 'lede' }, 'Practice never changes your review schedule for the worse — but it does record what you got right and wrong.')));

  const grid = el('div', { class: 'mode-grid' });
  for (const m of PRACTICE_MODES) {
    const disabled = m.audio && !canListen();
    grid.append(el('button', {
      class: 'mode' + (disabled ? ' disabled' : ''), type: 'button',
      disabled: disabled || false,
      onclick: () => nav(`#/practice/${m.id}`),
    },
      el('span', { class: 'mode-name' }, m.name),
      el('span', { class: 'mode-sub' }, disabled ? 'No Japanese voice on this device' : m.sub)));
  }
  wrap.append(grid);
  clear(root).append(wrap);
}

// ── PROGRESS ─────────────────────────────────────────────────────────────────

export function renderProgress(root) {
  const s = storage.state;
  const wrap = el('div', { class: 'screen' });
  wrap.append(el('header', { class: 'screen-head' },
    el('p', { class: 'eyebrow' }, 'Progress'),
    el('h1', {}, 'Where you stand')));

  const hira = KANA.filter(k => k.script === 'hiragana');
  const kata = KANA.filter(k => k.script === 'katakana');
  const kanaKnown = script => hira.concat(kata).filter(k => k.script === script && SRS.isKnown(k.id)).length;
  const acc = s.stats.totalAnswers ? Math.round((s.stats.totalCorrect / s.stats.totalAnswers) * 100) : 0;

  wrap.append(card(
    sectionHead('Learned', 'An item counts as learned once it has survived a review several days later — not when you first see it.'),
    el('div', { class: 'progress-rows' },
      progressRow('Hiragana', kanaKnown('hiragana'), hira.length),
      progressRow('Katakana', kanaKnown('katakana'), kata.length),
      progressRow('Vocabulary', known('vocab'), VOCABULARY.length),
      progressRow('Kanji', known('kanji'), KANJI.length),
      progressRow('Grammar', known('grammar'), GRAMMAR.length),
      progressRow('Lessons', Object.keys(s.lessons).length, LESSONS.length),
    )));

  wrap.append(card(
    sectionHead('Activity'),
    el('div', { class: 'stat-row' },
      statTile('Answers', s.stats.totalAnswers),
      statTile('Accuracy', acc + '%'),
      statTile('Streak', s.stats.streak.current, `best ${s.stats.streak.longest}`),
      statTile('Reviews due', SRS.dueCount()),
    ),
    renderActivity(s)));

  const weak = SRS.weakItems();
  wrap.append(card(
    sectionHead('Weak areas', weak.length ? 'Ranked by how often you miss them' : null),
    weak.length
      ? el('div', { class: 'weak-list' }, ...weak.slice(0, 12).map(it => {
          const c = conceptDisplay(it.id);
          return el('div', { class: 'weak-item' },
            el('span', { class: 'weak-glyph jp' }, c.glyph),
            el('span', { class: 'weak-meta' },
              el('span', { class: 'weak-name' }, c.label),
              el('span', { class: 'weak-rate' }, `${it.correct}/${it.reps} correct · ${it.lapses} lapse${it.lapses === 1 ? '' : 's'}`)));
        }))
      : el('p', { class: 'prose' }, 'Nothing yet. The app waits for at least three answers on an item before calling it a weakness — one bad guess is not evidence.')));

  clear(root).append(wrap);
}

function progressRow(label, value, total) {
  return el('div', { class: 'progress-row' },
    el('p', { class: 'progress-label' }, label),
    progressBar(value, total),
    el('p', { class: 'progress-value' }, `${value}/${total}`));
}

function renderActivity(s) {
  const days = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    days.push({ key, ...(s.stats.days[key] || { answers: 0, correct: 0 }) });
  }
  const max = Math.max(10, ...days.map(d => d.answers));
  return el('div', { class: 'activity' },
    el('p', { class: 'meter-label' }, 'Last 28 days'),
    el('div', { class: 'activity-bars' }, ...days.map(d =>
      el('span', {
        class: 'activity-bar' + (d.answers ? ' on' : ''),
        style: { height: Math.max(3, Math.round((d.answers / max) * 40)) + 'px' },
        title: `${d.key}: ${d.answers} answers`,
      }))));
}

// ── REFERENCE ────────────────────────────────────────────────────────────────

export function renderReference(root) {
  const wrap = el('div', { class: 'screen' });
  let tab = 'vocab';
  let query = '';

  const results = el('div', { class: 'ref-results' });
  const search = el('input', {
    class: 'search', type: 'search', placeholder: 'Search Japanese, reading or English…',
    'aria-label': 'Search',
  });
  search.addEventListener('input', () => { query = search.value.trim().toLowerCase(); draw(); });

  const tabs = el('div', { class: 'tabs' }, ...[
    ['vocab', 'Vocabulary'], ['kanji', 'Kanji'], ['grammar', 'Grammar'], ['kana', 'Kana'],
  ].map(([id, name]) => el('button', {
    class: 'tab', type: 'button', 'aria-pressed': String(id === tab),
    onclick: e => { tab = id; for (const b of tabs.children) b.setAttribute('aria-pressed', String(b === e.currentTarget)); draw(); },
  }, name)));

  wrap.append(
    el('header', { class: 'screen-head' },
      el('p', { class: 'eyebrow' }, 'Reference'),
      el('h1', {}, 'Everything you have met'),
      el('p', { class: 'lede' }, 'Items you have been introduced to. Search by kanji, kana, romaji or English.')),
    search, tabs, results);

  function draw() {
    clear(results);
    const q = query;
    const match = (...fields) => !q || fields.filter(Boolean).some(f => String(f).toLowerCase().includes(q));

    if (tab === 'vocab') {
      const list = VOCABULARY.filter(v => SRS.isIntroduced(v.id))
        .filter(v => match(v.word, v.reading, toRomaji(v.reading), ...v.meanings));
      if (!list.length) return results.append(emptyRef(q));
      for (const v of list) {
        results.append(el('article', { class: 'ref-card' },
          el('div', { class: 'ref-top' },
            el('span', { class: 'ref-jp jp' }, v.word),
            v.reading !== v.word ? el('span', { class: 'ref-reading jp' }, v.reading) : null,
            el('span', { class: 'ref-romaji' }, toRomaji(v.reading)),
            speakButton(v.reading)),
          el('p', { class: 'ref-meaning' }, v.meanings.join(', ')),
          el('p', { class: 'ref-tags' }, [v.pos, v.register, ...(v.tags || [])].filter(Boolean).join(' · ')),
          v.note ? el('p', { class: 'ref-note' }, v.note) : null,
          exampleFor(v.id)));
      }
    } else if (tab === 'kanji') {
      const list = KANJI.filter(k => SRS.isIntroduced(k.id))
        .filter(k => match(k.char, ...k.meanings, ...k.on, ...k.kun));
      if (!list.length) return results.append(emptyRef(q));
      for (const k of list) {
        results.append(el('article', { class: 'ref-card kanji' },
          el('div', { class: 'ref-top' },
            el('span', { class: 'ref-kanji jp' }, k.char),
            el('span', { class: 'ref-meaning' }, k.meanings.join(', '))),
          el('p', { class: 'ref-readings jp' }, `音 ${k.on.join('・') || '—'}　訓 ${k.kun.join('・') || '—'}`),
          el('p', { class: 'ref-tags' }, `${k.strokes} strokes`),
          k.vocab?.length ? el('p', { class: 'ref-words jp' }, k.vocab.map(id => VOCAB_BY_ID[id]?.word).filter(Boolean).join('　')) : null,
          k.note ? el('p', { class: 'ref-note' }, k.note) : null));
      }
    } else if (tab === 'grammar') {
      const list = GRAMMAR.filter(g => SRS.isIntroduced(g.id))
        .filter(g => match(g.title, g.gloss, g.pattern, g.explain));
      if (!list.length) return results.append(emptyRef(q));
      for (const g of list) {
        results.append(el('article', { class: 'ref-card' },
          el('p', { class: 'grammar-pattern jp' }, g.pattern),
          el('h3', { class: 'jp' }, g.title),
          el('p', { class: 'ref-meaning' }, g.gloss),
          el('p', { class: 'prose', html: richText(g.explain) }),
          g.pitfalls ? el('p', { class: 'grammar-pitfall' }, g.pitfalls) : null,
          el('div', { class: 'sentence-list' }, ...(g.examples || []).slice(0, 3).map(id => {
            const s = SENTENCES_BY_ID[id]; if (!s) return null;
            return el('div', { class: 'sentence-row' },
              el('div', { class: 'sentence-main' },
                el('p', { class: 'sentence-jp jp' }, s.jp),
                el('p', { class: 'sentence-reading jp' }, s.reading),
                el('p', { class: 'sentence-en' }, s.en)),
              speakButton(s.jp));
          }))));
      }
    } else {
      const list = KANA.filter(k => SRS.isIntroduced(k.id)).filter(k => match(k.kana, k.romaji));
      if (!list.length) return results.append(emptyRef(q));
      results.append(el('div', { class: 'kana-grid ref' }, ...list.map(k =>
        el('div', { class: 'kana-cell' },
          el('span', { class: 'kana-glyph jp' }, k.kana),
          el('span', { class: 'kana-romaji' }, k.romaji),
          SRS.isKnown(k.id) ? el('span', { class: 'kana-known', 'aria-label': 'learned' }, '●') : null))));
    }
  }
  function emptyRef(q) {
    return el('p', { class: 'prose empty' }, q
      ? `Nothing here matches “${q}”. Reference only shows material you have already been introduced to in a lesson.`
      : 'Nothing here yet — finish a lesson and its material will appear.');
  }
  function exampleFor(vid) {
    const s = Object.values(SENTENCES_BY_ID).find(x => x.vocab?.includes(vid));
    if (!s) return null;
    return el('div', { class: 'ref-example' },
      el('p', { class: 'sentence-jp jp' }, s.jp),
      el('p', { class: 'sentence-en' }, s.en));
  }

  clear(root).append(wrap);
  draw();
}

// ── SETTINGS ─────────────────────────────────────────────────────────────────

export function renderSettings(root, nav, applyTheme) {
  const s = storage.state;
  const wrap = el('div', { class: 'screen' });
  wrap.append(el('header', { class: 'screen-head' },
    el('p', { class: 'eyebrow' }, 'Settings'),
    el('h1', {}, 'Settings')));

  wrap.append(card(
    sectionHead('Appearance'),
    radioGroup('Theme', ['system', 'light', 'dark'], s.settings.theme, v => {
      storage.update(st => { st.settings.theme = v; }); applyTheme();
    })));

  wrap.append(card(
    sectionHead('Romaji', 'Romaji is a crutch. The default removes it from each kana as soon as you know that kana.'),
    radioGroup('Show romaji', ['always', 'fade', 'never'], s.settings.romaji, v => {
      storage.update(st => { st.settings.romaji = v; });
    }, { fade: 'until learned' })));

  wrap.append(card(
    sectionHead('Audio', audioAvailable()
      ? 'Uses your device’s Japanese speech voice. It is synthetic, not a native recording.'
      : 'No Japanese voice is installed on this device, so audio is unavailable.'),
    toggle('Enable audio', s.settings.audio && audioAvailable(), v => {
      storage.update(st => { st.settings.audio = v; });
    }, !audioAvailable())));

  wrap.append(card(
    sectionHead('Your data', storage.persistent
      ? 'Everything is stored in this browser only. Nothing is uploaded anywhere.'
      : 'This browser is blocking storage, so progress will not survive a reload.'),
    el('div', { class: 'settings-actions' },
      el('button', { class: 'btn ghost', type: 'button', onclick: exportData }, 'Export progress'),
      el('label', { class: 'btn ghost file' }, 'Import progress',
        el('input', { type: 'file', accept: 'application/json', onchange: importData })),
      el('button', { class: 'btn danger', type: 'button', onclick: () => resetAll(nav) }, 'Reset everything'))));

  wrap.append(el('p', { class: 'footnote' },
    `${KANA.length} kana · ${VOCABULARY.length} words · ${KANJI.length} kanji · ${GRAMMAR.length} grammar points · ${LESSONS.length} lessons. `
    + 'Example sentences were written for this app; kana, readings and grammar explanations are checked by an automated content validator before release.'));

  clear(root).append(wrap);
}

function radioGroup(label, values, current, onChange, labels = {}) {
  const row = el('div', { class: 'radio-row', role: 'group', 'aria-label': label });
  for (const v of values) {
    const b = el('button', { class: 'radio', type: 'button', 'aria-pressed': String(v === current) },
      labels[v] || v);
    b.addEventListener('click', () => {
      for (const o of row.children) o.setAttribute('aria-pressed', String(o === b));
      onChange(v);
    });
    row.append(b);
  }
  return el('div', { class: 'setting' }, el('p', { class: 'setting-label' }, label), row);
}

function toggle(label, value, onChange, disabled) {
  const b = el('button', {
    class: 'switch', type: 'button', role: 'switch', 'aria-checked': String(!!value),
    disabled: disabled || false,
  }, el('span', { class: 'knob' }));
  b.addEventListener('click', () => {
    const v = b.getAttribute('aria-checked') !== 'true';
    b.setAttribute('aria-checked', String(v));
    onChange(v);
  });
  return el('div', { class: 'setting' }, el('p', { class: 'setting-label' }, label), b);
}

function exportData() {
  const blob = new Blob([storage.export()], { type: 'application/json' });
  const a = el('a', { href: URL.createObjectURL(blob), download: 'japanese-progress.json' });
  document.body.append(a); a.click(); a.remove();
}

function importData(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try { storage.import(String(reader.result)); location.reload(); }
    catch { alert('That file could not be read as progress data.'); }
  };
  reader.readAsText(file);
}

function resetAll(nav) {
  if (!confirm('Delete all progress? This cannot be undone.')) return;
  storage.reset();
  nav('#/');
  location.reload();
}
