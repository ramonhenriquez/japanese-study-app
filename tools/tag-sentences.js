// Completes the grammar tags on every sentence from the forms it actually contains, so the
// runtime prerequisite gate has accurate data to work with. Idempotent — run it after adding
// sentences and it only ever adds missing tags.
import fs from 'fs';
import path from 'path';
import { SENTENCES } from '../src/content/sentences.js';
import { VOCABULARY } from '../src/content/vocabulary.js';

export const FORMS = [
  { re: /ませんでした/,                         needs: 'g:mashita' },
  { re: /ました/,                               needs: 'g:mashita' },
  { re: /ません/,                               needs: 'g:masen' },
  { re: /ます/,                                 needs: 'g:masu' },
  { re: /てはいけません|ではいけません/,        needs: 'g:tewaikemasen' },
  { re: /てもいい|でもいい/,                    needs: 'g:temoii' },
  { re: /ています|でいます/,                    needs: 'g:teimasu' },
  { re: /てください|でください/,                needs: 'g:tekudasai' },
  { re: /[てで]、/,                             needs: 'g:teconnect' },
  { re: /くないです|くありません/,              needs: 'g:iadj' },
  { re: /じゃないです|じゃありません|ではありません/, needs: 'g:janai' },
];
export const PARTICLE_POINTS = {
  'は': 'g:desu', 'の': 'g:no', 'も': 'g:mo', 'を': 'g:wo',
  'に': 'g:ni_he', 'へ': 'g:ni_he', 'で': 'g:de', 'か': 'g:ka', 'と': 'g:to',
};
export const COUNTER_RE = /[一二三四五六七八九十]\s*[人つ枚本個台回時分]|いくつ|何人|何時|何分/;

/** Grammar points a sentence's own surface demands, independent of how it was tagged. */
export function detectGrammar(s) {
  const found = new Set();
  for (const f of FORMS) if (f.re.test(s.jp)) found.add(f.needs);
  for (const raw of s.parts) {
    const part = raw.replace(/[、。]/g, '');
    const p = part.slice(-1), stem = part.slice(0, -1);
    const isWord = stem.length > 0 && (/[一-龯]/.test(stem) || VOCABULARY.some(v => v.word === stem || v.reading === stem));
    if (PARTICLE_POINTS[p] && isWord) found.add(PARTICLE_POINTS[p]);
  }
  if (COUNTER_RE.test(s.jp)) found.add('g:counters');
  // て-form itself: any て/で form implies the relevant construction rule
  if (/[てで](ください|います|も|は|、|$)/.test(s.jp) || /[てで]、/.test(s.jp)) {
    const verb = VOCABULARY.find(v => v.te && s.jp.includes(v.te));
    if (verb) found.add(verb.group === 'godan' ? 'g:te_u' : 'g:te');
  }
  return found;
}

if (process.argv[1] && process.argv[1].endsWith('tag-sentences.js')) {
  const file = path.join(process.cwd(), 'src/content/sentences.js');
  let src = fs.readFileSync(file, 'utf8');
  let added = 0, touched = 0;
  for (const s of SENTENCES) {
    const need = [...detectGrammar(s)].filter(g => !s.grammar.includes(g));
    if (!need.length) continue;
    const merged = [...s.grammar, ...need];
    const oldLit = `grammar:[${s.grammar.map(g => `'${g}'`).join(',')}]`;
    const newLit = `grammar:[${merged.map(g => `'${g}'`).join(',')}]`;
    const idx = src.indexOf(`id:'${s.id}'`);
    if (idx === -1) { console.log(`could not locate ${s.id}`); continue; }
    const end = src.indexOf('\n', idx);
    const line = src.slice(idx, end);
    if (!line.includes(oldLit)) { console.log(`tag literal not found on one line for ${s.id}`); continue; }
    src = src.slice(0, idx) + line.replace(oldLit, newLit) + src.slice(end);
    added += need.length; touched++;
  }
  fs.writeFileSync(file, src);
  console.log(`tagged ${touched} sentences with ${added} missing grammar point(s)`);
}
