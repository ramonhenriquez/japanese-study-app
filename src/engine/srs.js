// A deliberately small spaced-repetition system.
//
// Every studied concept sits in a box. Answer correctly and it moves up a box and waits
// longer before coming back; answer wrong and it drops two boxes and returns almost
// immediately. That is the whole idea: things you keep missing keep showing up.

import { storage, todayKey } from './storage.js';

const DAY = 86400000;
// Box 0 comes back in the same session; the rest are days.
export const INTERVALS = [0, 1, 2, 4, 8, 16, 32, 64, 120];
export const MAX_BOX = INTERVALS.length - 1;

// A concept counts as "known" once it has survived to box 3 (a gap of several days).
export const KNOWN_BOX = 3;

export function getItem(id) {
  return storage.state.items[id] || null;
}

export function ensureItem(id, type) {
  return storage.update(s => {
    if (!s.items[id]) {
      s.items[id] = {
        id, type,
        box: 0,
        due: Date.now(),
        reps: 0, correct: 0, wrong: 0, lapses: 0,
        streak: 0,
        introducedAt: Date.now(),
        lastSeen: null,
      };
    }
  }).items[id];
}

/** Record one answer and reschedule. `quality` is true/false; `hinted` weakens the evidence. */
export function grade(id, type, isCorrect, { hinted = false } = {}) {
  return storage.update(s => {
    const it = s.items[id] || (s.items[id] = {
      id, type, box: 0, due: Date.now(), reps: 0, correct: 0, wrong: 0, lapses: 0,
      streak: 0, introducedAt: Date.now(), lastSeen: null,
    });

    it.reps += 1;
    it.lastSeen = Date.now();

    if (isCorrect) {
      it.correct += 1;
      it.streak += 1;
      // A hinted success advances only if the item is still early — it is weaker evidence.
      const advance = hinted ? (it.box < 2 ? 1 : 0) : 1;
      it.box = Math.min(MAX_BOX, it.box + advance);
    } else {
      it.wrong += 1;
      it.streak = 0;
      if (it.box >= KNOWN_BOX) it.lapses += 1;
      it.box = Math.max(0, it.box - 2);
    }

    const days = INTERVALS[it.box];
    // Box 0 is due again immediately; jitter the rest by a few hours so reviews don't clump.
    it.due = days === 0 ? Date.now() : Date.now() + days * DAY + Math.floor(Math.random() * 6 * 3600000);

    // Daily stats
    s.stats.totalAnswers += 1;
    if (isCorrect) s.stats.totalCorrect += 1;
    const key = todayKey();
    const day = s.stats.days[key] || (s.stats.days[key] = { answers: 0, correct: 0, minutes: 0 });
    day.answers += 1;
    if (isCorrect) day.correct += 1;

    touchStreak(s);
  }).items[id];
}

function touchStreak(s) {
  const key = todayKey();
  const st = s.stats.streak;
  if (st.lastDay === key) return;
  const yesterday = todayKey(new Date(Date.now() - DAY));
  st.current = st.lastDay === yesterday ? st.current + 1 : 1;
  st.longest = Math.max(st.longest, st.current);
  st.lastDay = key;
}

/** Items that are due now, hardest-first. */
export function dueItems(now = Date.now()) {
  return Object.values(storage.state.items)
    .filter(it => it.due <= now)
    .sort((a, b) => (a.box - b.box) || (a.due - b.due));
}

export function dueCount(now = Date.now()) {
  let n = 0;
  for (const it of Object.values(storage.state.items)) if (it.due <= now) n++;
  return n;
}

/** Concepts the learner keeps getting wrong — the app's weak-area signal. */
export function weakItems(minReps = 3, threshold = 0.6) {
  return Object.values(storage.state.items)
    .filter(it => it.reps >= minReps && it.correct / it.reps < threshold)
    .sort((a, b) => (a.correct / a.reps) - (b.correct / b.reps));
}

export function isKnown(id) {
  const it = getItem(id);
  return !!it && it.box >= KNOWN_BOX;
}

export function isIntroduced(id) {
  return !!getItem(id);
}

export function countByType(type, predicate = () => true) {
  return Object.values(storage.state.items).filter(it => it.type === type && predicate(it)).length;
}
