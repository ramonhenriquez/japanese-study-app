// All persistence lives here. Version 1 uses localStorage; swapping in IndexedDB or a
// server later means replacing read()/write() only — nothing else touches the storage layer.

const KEY = 'nihongo.state.v1';
const SCHEMA_VERSION = 1;

const EMPTY = () => ({
  schemaVersion: SCHEMA_VERSION,
  createdAt: Date.now(),
  settings: {
    theme: 'system',          // system | light | dark
    romaji: 'fade',           // always | fade | never
    dailyGoalMinutes: 15,
    audio: true,
    reducedMotion: false,
  },
  // concept id -> study record
  items: {},
  lessons: {},                // lessonId -> { completedAt, score, attempts }
  stats: {
    totalAnswers: 0,
    totalCorrect: 0,
    minutesStudied: 0,
    streak: { current: 0, longest: 0, lastDay: null },
    days: {},                 // 'YYYY-MM-DD' -> { answers, correct, minutes }
  },
});

let cache = null;
let available = true;

function read() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? migrate(JSON.parse(raw)) : EMPTY();
  } catch (err) {
    // Private windows and blocked site data both land here. The app still works,
    // it just cannot remember anything between sessions — and it says so.
    available = false;
    cache = EMPTY();
  }
  return cache;
}

function write() {
  if (!cache) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch (err) {
    available = false;
  }
}

function migrate(state) {
  if (!state || typeof state !== 'object') return EMPTY();
  if (state.schemaVersion === SCHEMA_VERSION) return { ...EMPTY(), ...state, settings: { ...EMPTY().settings, ...state.settings } };
  // Future schema bumps add their migration steps here.
  return { ...EMPTY(), ...state, schemaVersion: SCHEMA_VERSION };
}

export const storage = {
  get state() { return read(); },
  get persistent() { read(); return available; },
  save() { write(); },
  update(fn) { const s = read(); fn(s); write(); return s; },
  reset() { cache = EMPTY(); write(); return cache; },
  export() { return JSON.stringify(read(), null, 2); },
  import(json) {
    const parsed = JSON.parse(json);
    cache = migrate(parsed);
    write();
    return cache;
  },
};

export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
