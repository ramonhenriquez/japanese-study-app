// Kana → Hepburn romaji. Single source of truth so no romaji is ever stored by hand.

const BASE = {
  あ:'a',い:'i',う:'u',え:'e',お:'o', か:'ka',き:'ki',く:'ku',け:'ke',こ:'ko',
  さ:'sa',し:'shi',す:'su',せ:'se',そ:'so', た:'ta',ち:'chi',つ:'tsu',て:'te',と:'to',
  な:'na',に:'ni',ぬ:'nu',ね:'ne',の:'no', は:'ha',ひ:'hi',ふ:'fu',へ:'he',ほ:'ho',
  ま:'ma',み:'mi',む:'mu',め:'me',も:'mo', や:'ya',ゆ:'yu',よ:'yo',
  ら:'ra',り:'ri',る:'ru',れ:'re',ろ:'ro', わ:'wa',ゐ:'i',ゑ:'e',を:'wo',ん:'n',
  が:'ga',ぎ:'gi',ぐ:'gu',げ:'ge',ご:'go', ざ:'za',じ:'ji',ず:'zu',ぜ:'ze',ぞ:'zo',
  だ:'da',ぢ:'ji',づ:'zu',で:'de',ど:'do', ば:'ba',び:'bi',ぶ:'bu',べ:'be',ぼ:'bo',
  ぱ:'pa',ぴ:'pi',ぷ:'pu',ぺ:'pe',ぽ:'po',
  ぁ:'a',ぃ:'i',ぅ:'u',ぇ:'e',ぉ:'o',
};
const YOON = {
  き:'ky',し:'sh',ち:'ch',に:'ny',ひ:'hy',み:'my',り:'ry',
  ぎ:'gy',じ:'j',ぢ:'j',び:'by',ぴ:'py',
};
const SMALL_VOWEL = { ゃ:'a', ゅ:'u', ょ:'o' };
const VOWELS = 'aiueo';

const toHira = s => [...s].map(c => {
  const cp = c.codePointAt(0);
  return (cp >= 0x30a1 && cp <= 0x30f6) ? String.fromCodePoint(cp - 0x60) : c;
}).join('');

/** Convert a kana string to Hepburn romaji. Non-kana characters pass through. */
export function toRomaji(input) {
  if (!input) return '';
  const src = toHira(input);
  let out = '';
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    const next = src[i + 1];

    // Small っ doubles the following consonant
    if (ch === 'っ') {
      const after = romajiOf(src, i + 1);
      out += after ? after[0] : 't';
      continue;
    }
    // Prolonged sound mark repeats the previous vowel
    if (ch === 'ー') {
      const last = out[out.length - 1];
      if (VOWELS.includes(last)) out += last;
      continue;
    }
    // Yōon: consonant + small ya/yu/yo
    if (YOON[ch] && SMALL_VOWEL[next]) {
      out += YOON[ch] + SMALL_VOWEL[next];
      i++;
      continue;
    }
    // ん becomes m before b/m/p, and takes an apostrophe before a vowel or y
    if (ch === 'ん') {
      const nr = romajiOf(src, i + 1);
      if (nr && 'bmp'.includes(nr[0])) out += 'm';
      else if (nr && (VOWELS.includes(nr[0]) || nr[0] === 'y')) out += "n'";
      else out += 'n';
      continue;
    }
    out += BASE[ch] ?? ch;
  }
  return out;
}

function romajiOf(src, i) {
  const ch = src[i];
  if (!ch) return '';
  if (YOON[ch] && SMALL_VOWEL[src[i + 1]]) return YOON[ch] + SMALL_VOWEL[src[i + 1]];
  return BASE[ch] ?? '';
}

/** Loose comparison for typed answers: ignores case, spaces, apostrophes and common variants. */
export function romajiMatches(typed, expected) {
  const norm = s => (s || '').toLowerCase().trim()
    .replace(/[\s'’\-]/g, '')
    .replace(/shi/g, 'si').replace(/chi/g, 'ti').replace(/tsu/g, 'tu')
    .replace(/fu/g, 'hu').replace(/ji/g, 'zi')
    .replace(/sha/g, 'sya').replace(/shu/g, 'syu').replace(/sho/g, 'syo')
    .replace(/cha/g, 'tya').replace(/chu/g, 'tyu').replace(/cho/g, 'tyo')
    .replace(/ja/g, 'zya').replace(/ju/g, 'zyu').replace(/jo/g, 'zyo')
    .replace(/wo/g, 'o').replace(/mm/g, 'nm').replace(/mb/g, 'nb').replace(/mp/g, 'np');
  return norm(typed) === norm(expected);
}
