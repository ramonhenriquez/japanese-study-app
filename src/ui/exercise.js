// The exercise runner. Every studying surface in the app — lessons, review and practice —
// hands a list of exercises to this one component, so evidence is recorded identically
// wherever the answer was given.

import { el, clear, icon, speak, audioAvailable } from './dom.js';
import { grade } from '../engine/srs.js';
import { EXERCISE_LABELS, shuffle } from '../engine/exercises.js';
import { toRomaji } from '../engine/romaji.js';

export function runExercises(container, exercises, { title = 'Practice', note = null, onDone, showProgress = true }) {
  let index = 0;
  const results = [];
  let answered = false;
  let usedHint = false;

  const bar = el('div', { class: 'ex-bar' });
  const label = el('p', { class: 'ex-count' });
  const stage = el('div', { class: 'ex-stage' });
  const feedback = el('div', { class: 'ex-feedback', 'aria-live': 'polite' });
  const footer = el('div', { class: 'ex-footer' });

  const root = el('section', { class: 'exercise' },
    showProgress ? el('div', { class: 'ex-head' }, el('h2', { class: 'ex-title' }, title), label) : null,
    showProgress ? bar : null,
    note ? el('p', { class: 'ex-note' }, note) : null,
    stage, feedback, footer,
  );
  clear(container).append(root);
  render();

  function render() {
    answered = false;
    usedHint = false;
    clear(stage); clear(feedback); clear(footer);
    feedback.className = 'ex-feedback';

    if (index >= exercises.length) return finish();

    const ex = exercises[index];
    label.textContent = `${index + 1} / ${exercises.length} · ${EXERCISE_LABELS[ex.kind] || ex.kind}`;
    clear(bar).append(...exercises.map((_, i) => el('span', {
      class: 'ex-pip' + (i < results.length ? (results[i] ? ' ok' : ' bad') : (i === index ? ' now' : '')),
    })));

    stage.append(renderPrompt(ex));

    if (ex.kind === 'matching') return renderMatching(ex);
    if (ex.parts) return renderBuilder(ex);
    if (ex.input) return renderTyping(ex);
    return renderChoices(ex);
  }

  function renderPrompt(ex) {
    const p = ex.prompt || {};
    const box = el('div', { class: 'prompt' });
    if (p.label) box.append(el('p', { class: 'prompt-label' }, p.label));

    if (p.speak) {
      const btn = el('button', {
        class: 'speak-btn', type: 'button', 'aria-label': 'Play audio',
        onclick: () => speak(p.speak),
      }, icon('sound'), el('span', {}, 'Play'));
      box.append(btn);
      // Autoplay the first time so the exercise starts by hearing it.
      setTimeout(() => speak(p.speak), 220);
    }
    if (p.glyph) {
      box.append(el('p', { class: 'prompt-glyph' + (p.glyphSize === 'sentence' ? ' sentence' : '') }, p.glyph));
      if (p.sub) box.append(el('p', { class: 'prompt-sub jp' }, p.sub));
    }
    if (p.text) box.append(el('p', { class: 'prompt-text' + (p.text.length <= 12 ? ' short' : '') }, p.text));
    if (p.before !== undefined) {
      box.append(el('p', { class: 'prompt-glyph cloze jp' },
        p.before, el('span', { class: 'gap' }, '　'), p.after));
      if (p.sub) box.append(el('p', { class: 'prompt-sub' }, p.sub));
    }
    return box;
  }

  function renderChoices(ex) {
    const wrap = el('div', { class: 'choices' + (ex.choiceStyle === 'glyph' ? ' glyph' : ex.choiceStyle === 'jp' ? ' jp' : '') });
    for (const c of ex.choices) {
      const b = el('button', { class: 'choice', type: 'button' }, c);
      b.addEventListener('click', () => {
        if (answered) return;
        const ok = c === ex.answer;
        for (const other of wrap.children) {
          other.disabled = true;
          if (other.textContent === ex.answer) other.classList.add('right');
        }
        if (!ok) b.classList.add('wrong');
        settle(ex, ok);
      });
      wrap.append(b);
    }
    stage.append(wrap);
  }

  function renderTyping(ex) {
    const input = el('input', {
      class: 'typed', type: 'text', autocomplete: 'off', autocapitalize: 'off',
      autocorrect: 'off', spellcheck: 'false', 'aria-label': ex.prompt.label,
      placeholder: ex.input === 'romaji' ? 'romaji' : '',
    });
    const submit = el('button', { class: 'btn primary', type: 'button' }, 'Check');
    const form = el('div', { class: 'typing' }, input, submit);
    const go = () => {
      if (answered) return;
      const ok = ex.check ? ex.check(input.value) : input.value.trim() === ex.answer;
      input.disabled = true;
      input.classList.add(ok ? 'right' : 'wrong');
      submit.remove();
      settle(ex, ok);
    };
    input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.isComposing) go(); });
    submit.addEventListener('click', go);
    stage.append(form);
    setTimeout(() => input.focus({ preventScroll: true }), 30);
  }

  function renderBuilder(ex) {
    const answerRow = el('div', { class: 'build-answer', 'aria-label': 'Your sentence' });
    const pool = el('div', { class: 'build-pool' });
    const chosen = [];

    const refresh = () => {
      clear(answerRow);
      if (!chosen.length) answerRow.append(el('span', { class: 'build-placeholder' }, 'Tap the pieces in order'));
      chosen.forEach((part, i) => {
        answerRow.append(el('button', {
          class: 'chip jp', type: 'button', onclick: () => { if (!answered) { chosen.splice(i, 1); refresh(); } },
        }, part));
      });
      check.disabled = chosen.length !== ex.parts.length;
    };

    for (const part of ex.parts) {
      const b = el('button', { class: 'chip jp pool', type: 'button' }, part);
      b.addEventListener('click', () => {
        if (answered) return;
        b.disabled = true;
        chosen.push(part);
        b.dataset.slot = chosen.length - 1;
        refresh();
      });
      pool.append(b);
    }

    const check = el('button', { class: 'btn primary', type: 'button', disabled: true }, 'Check');
    check.addEventListener('click', () => {
      if (answered) return;
      const ok = chosen.join('') === ex.answer;
      answerRow.classList.add(ok ? 'right' : 'wrong');
      for (const b of pool.children) b.disabled = true;
      check.remove();
      settle(ex, ok, ok ? null : ex.answer + ex.tail);
    });

    stage.append(answerRow, pool, el('div', { class: 'build-actions' }, check));
    refresh();
  }

  function renderMatching(ex) {
    const leftCol = el('div', { class: 'match-col' });
    const rightCol = el('div', { class: 'match-col' });
    let selected = null;
    let solved = 0;
    const total = ex.pairs.length;

    for (const p of ex.pairs) {
      const b = el('button', { class: 'match jp', type: 'button' }, p.left);
      b.dataset.key = p.left;
      b.addEventListener('click', () => {
        if (b.disabled) return;
        for (const o of leftCol.children) o.classList.remove('sel');
        b.classList.add('sel');
        selected = p;
      });
      leftCol.append(b);
    }
    for (const r of ex.rights) {
      const b = el('button', { class: 'match', type: 'button' }, r);
      b.addEventListener('click', () => {
        if (b.disabled || !selected) return;
        const ok = selected.right === r;
        const leftBtn = [...leftCol.children].find(x => x.dataset.key === selected.left);
        if (ok) {
          b.disabled = true; b.classList.add('right');
          leftBtn.disabled = true; leftBtn.classList.add('right'); leftBtn.classList.remove('sel');
          grade(selected.conceptId, ex.conceptType, true);
          solved++;
          selected = null;
          if (solved === total) settle(ex, true);
        } else {
          b.classList.add('shake');
          setTimeout(() => b.classList.remove('shake'), 400);
          grade(selected.conceptId, ex.conceptType, false);
        }
      });
      rightCol.append(b);
    }
    stage.append(el('div', { class: 'match-grid' }, leftCol, rightCol));
  }

  function settle(ex, ok, correction) {
    answered = true;
    results.push(ok);
    if (ex.conceptId) grade(ex.conceptId, ex.conceptType, ok, { hinted: usedHint });

    feedback.className = 'ex-feedback ' + (ok ? 'ok' : 'bad');
    const lines = [el('p', { class: 'verdict' }, ok ? 'Correct' : 'Not quite')];
    if (!ok) {
      lines.push(el('p', { class: 'answer jp' }, correction || ex.answer));
      if (ex.kind === 'kana-recognition' || ex.kind === 'kana-type') {
        // nothing extra — the romaji is the answer
      } else if (ex.answer && /[ぁ-んァ-ヶー]/.test(ex.answer)) {
        lines.push(el('p', { class: 'answer-romaji' }, toRomaji(ex.answer)));
      }
    }
    if (ex.explain) lines.push(el('p', { class: 'explain' }, ex.explain));
    feedback.append(...lines);

    const next = el('button', { class: 'btn primary', type: 'button' },
      index === exercises.length - 1 ? 'Finish' : 'Next');
    next.addEventListener('click', () => { index++; render(); });
    clear(footer).append(next);
    setTimeout(() => next.focus({ preventScroll: true }), 30);
  }

  function finish() {
    const correct = results.filter(Boolean).length;
    const pct = results.length ? Math.round((correct / results.length) * 100) : 0;
    clear(stage); clear(feedback); clear(footer); clear(bar);
    label.textContent = '';
    stage.append(
      el('div', { class: 'session-summary' },
        el('p', { class: 'summary-score' }, `${correct} / ${results.length}`),
        el('p', { class: 'summary-pct' }, `${pct}% correct`),
        el('p', { class: 'summary-note' },
          pct === 100 ? 'Clean run. Those items will come back later, spaced further out.'
          : pct >= 70 ? 'Good. The ones you missed will come back sooner than the rest.'
          : 'The items you missed have dropped back down the queue and will return shortly.'),
      ),
    );
    if (onDone) onDone({ correct, total: results.length, pct });
  }

  return { root };
}

/** Add a "listening" variant to a pool only when the device actually has a Japanese voice. */
export const canListen = () => audioAvailable();
export { shuffle };
