// The curriculum. Lessons are data — no lesson content lives in a UI component.
// Each lesson introduces `concepts` (which become SRS items on completion) and is built
// from blocks the lesson player knows how to render.
//
// Block types: text | kana | vocab | grammar | sentences | tip
// After the blocks, the player generates practice from the lesson's own concepts.

import { KANA } from './kana.js';

const hira = row => KANA.filter(k => k.script === 'hiragana' && k.row === row && k.group === 'base').map(k => k.id);
const kata = row => KANA.filter(k => k.script === 'katakana' && k.row === row && k.group === 'base').map(k => k.id);
const hiraGroup = g => KANA.filter(k => k.script === 'hiragana' && k.group === g).map(k => k.id);
const kataGroup = g => KANA.filter(k => k.script === 'katakana' && k.group === g).map(k => k.id);

export const STAGES = [
  { id: 0, name: 'Foundations', blurb: 'The sound system, both kana scripts, and enough real Japanese to say something on day one.' },
  { id: 1, name: 'First Japanese', blurb: 'Sentences you can actually use: describing, asking, doing things, and talking about yesterday.' },
  { id: 2, name: 'The て-form', blurb: 'One verb form, six new things you can say: requests, permission, prohibition, actions in progress, and sentences that join together.' },
  { id: 3, name: 'The plain form', blurb: 'The base form underneath the polite one — and the four structures that require it: casual speech, opinions, ability, and describing nouns.' },
];

export const LESSONS = [
  // ─────────────────────────── STAGE 0 ───────────────────────────
  {
    id: 'l:01', stage: 0, unit: 1, title: 'Japanese sounds and あいうえお',
    subtitle: 'Five vowels, one beat each',
    concepts: hira('a'),
    blocks: [
      { type: 'text', body: 'Japanese is not spelled with letters. It is spelled with **syllables**, and almost every one is a consonant plus a vowel. Learn the five vowels and you already know how most of the other forty kana will sound.' },
      { type: 'text', body: 'There are exactly five vowel sounds, they never change, and each one takes **one beat** — the same length as every other. Not stressed and unstressed like English.' },
      { type: 'kana', ids: hira('a') },
      { type: 'tip', title: 'The two that give you away', body: 'う is not English "oo" — the lips stay flat rather than pushing forward. And お does not glide: English "oh" slides into a w, but Japanese お holds one position and stops.' },
      { type: 'text', body: 'That order — **a, i, u, e, o** — never changes. It is the spine of every kana chart, every dictionary, and every verb conjugation you will ever meet. Learning it now saves months later.' },
    ],
  },
  {
    id: 'l:02', stage: 0, unit: 1, title: 'かきくけこ',
    subtitle: 'Your first consonant row — and your first words',
    concepts: [...hira('k'), 'v:kore', 'v:koko'],
    blocks: [
      { type: 'text', body: 'Every consonant row follows the same vowel order you just learned. か・き・く・け・こ is simply **k** placed in front of a, i, u, e, o.' },
      { type: 'kana', ids: hira('k') },
      { type: 'tip', title: 'Two things that are not obvious', body: 'Japanese k is lighter than English k — less of a puff of air. And き is made further forward in the mouth than か or こ, closer to the sound in English *cute*.' },
      { type: 'text', body: 'Ten kana is already enough for real words.' },
      { type: 'vocab', ids: ['v:kore', 'v:koko'] },
    ],
  },
  {
    id: 'l:03', stage: 0, unit: 1, title: 'Greetings you can use today',
    subtitle: 'No new kana — just useful Japanese',
    concepts: ['v:ohayou', 'v:konnichiwa', 'v:konbanwa', 'v:arigatou', 'v:sumimasen', 'v:hai', 'v:iie', 'v:sayounara', 'v:oyasumi', 'v:onegaishimasu'],
    blocks: [
      { type: 'text', body: 'You do not have to finish the alphabet before you can say anything. These are written in kana you have not formally met — read them as whole shapes for now and take them apart later.' },
      { type: 'vocab', ids: ['v:ohayou', 'v:konnichiwa', 'v:konbanwa', 'v:arigatou', 'v:sumimasen', 'v:hai', 'v:iie', 'v:sayounara', 'v:oyasumi', 'v:onegaishimasu'] },
      { type: 'tip', title: 'こんにちは ends in は but sounds like *wa*', body: 'It began as 今日は… — "as for today…" — with は as the topic particle, which shifted to a *wa* sound centuries ago while the spelling stayed put. When spelling was modernised in 1946, は, へ and を were deliberately left in their old forms. You will meet this は again as real grammar.' },
      { type: 'tip', title: 'Getting politeness wrong in the casual direction is the one that stings', body: 'おはようございます with a stranger or a boss; plain おはよう with friends and family. Over-politeness is merely stiff. Under-politeness is rude.' },
    ],
  },
  {
    id: 'l:04', stage: 0, unit: 1, title: 'さしすせそ',
    subtitle: 'Where romaji starts lying to you',
    concepts: [...hira('s'), 'v:sore', 'v:soko', 'v:suki'],
    blocks: [
      { type: 'text', body: 'This row breaks the pattern once: し is **shi**, not "si". Romaji hides that, which is one reason to stop leaning on it early.' },
      { type: 'kana', ids: hira('s') },
      { type: 'tip', title: 'す is barely voiced', body: 'The u in す often disappears almost entirely between voiceless sounds — closer to a whispered "s" than to "soo". You will hear it in 好き (すき), which sounds much more like *ski* than most beginners expect.' },
      { type: 'vocab', ids: ['v:sore', 'v:soko', 'v:suki'] },
    ],
  },
  {
    id: 'l:05', stage: 0, unit: 1, title: 'たちつてと',
    subtitle: 'The hardest sound in the language',
    concepts: [...hira('t'), 'v:tomodachi', 'v:tokei'],
    blocks: [
      { type: 'text', body: 'Two irregularities here: ち is **chi**, and つ is **tsu**. Neither is "ti" or "tu".' },
      { type: 'kana', ids: hira('t') },
      { type: 'tip', title: 'つ takes practice', body: 'The t and s are a single sound, not two. Say "cats" and hold the final *ts* — then put a u after it. This is usually the last kana English speakers get comfortable with, so do not expect it today.' },
      { type: 'vocab', ids: ['v:tomodachi', 'v:tokei'] },
    ],
  },
  {
    id: 'l:06', stage: 0, unit: 2, title: 'なにぬねの',
    subtitle: 'A completely regular row',
    concepts: [...hira('n'), 'v:namae', 'v:nani', 'v:niku'],
    blocks: [
      { type: 'text', body: 'No surprises: na, ni, nu, ne, no.' },
      { type: 'kana', ids: hira('n') },
      { type: 'tip', title: 'Watch ぬ and め', body: 'They differ by one loop. Confusable pairs like this get drilled against each other in practice rather than in isolation.' },
      { type: 'vocab', ids: ['v:namae', 'v:nani', 'v:niku'] },
    ],
  },
  {
    id: 'l:07', stage: 0, unit: 2, title: 'はひふへほ',
    subtitle: 'And two kana that lead double lives',
    concepts: [...hira('h'), 'v:hon', 'v:hito', 'v:heya'],
    blocks: [
      { type: 'kana', ids: hira('h') },
      { type: 'tip', title: 'ふ is not quite f', body: 'It sits between f and h — blow gently between nearly-closed lips. Your bottom lip should never touch your teeth.' },
      { type: 'tip', title: 'は and へ change job', body: 'As grammar particles, は is pronounced *wa* and へ is pronounced *e*. As ordinary syllables inside words they are *ha* and *he*. Context tells you which.' },
      { type: 'vocab', ids: ['v:hon', 'v:hito', 'v:heya'] },
    ],
  },
  {
    id: 'l:08', stage: 0, unit: 2, title: 'まみむめも',
    subtitle: 'Regular again',
    concepts: [...hira('m'), 'v:mizu', 'v:mise', 'v:machi'],
    blocks: [
      { type: 'kana', ids: hira('m') },
      { type: 'vocab', ids: ['v:mizu', 'v:mise', 'v:machi'] },
      { type: 'tip', title: 'You are past halfway', body: 'Thirty-five of the forty-six base kana. Only や (3), ら (5) and わ・を・ん (3) are left.' },
    ],
  },
  {
    id: 'l:09', stage: 0, unit: 2, title: 'やゆよ・らりるれろ',
    subtitle: 'A short row and a difficult one',
    concepts: [...hira('y'), ...hira('r'), 'v:yasai', 'v:yoru', 'v:raamen'],
    blocks: [
      { type: 'text', body: 'The や row has only three kana. The ら row has five, and one genuinely new sound.' },
      { type: 'kana', ids: [...hira('y'), ...hira('r')] },
      { type: 'tip', title: 'The Japanese "r" is not an r', body: 'It is a single quick tap of the tongue against the ridge behind your teeth — somewhere between English r, l and d. The nearest English sound is the middle of "butter" said quickly in American English. Do not curl your tongue back as you would for an English r.' },
      { type: 'vocab', ids: ['v:yasai', 'v:yoru', 'v:raamen'] },
    ],
  },
  {
    id: 'l:10', stage: 0, unit: 2, title: 'わ・を・ん',
    subtitle: 'Hiragana complete',
    concepts: [...hira('w'), 'v:watashi', 'v:wakaru'],
    blocks: [
      { type: 'kana', ids: hira('w') },
      { type: 'tip', title: 'を has exactly one job', body: 'It is never used inside a word. It exists only as the object particle, and it is pronounced *o*.' },
      { type: 'tip', title: 'ん is a full beat', body: 'Unlike English n, it takes its own beat and changes shape depending on what follows: **n** before t, d and n; **m** before b, m and p; **ng** before k and g; and at the end of a word a nasal made further back in the throat than any English sound. Say にほん, しんぶん and にほんご and feel three different places.' },
      { type: 'vocab', ids: ['v:watashi', 'v:wakaru'] },
      { type: 'text', body: 'That is all 46 base hiragana. Everything from here builds on them with small marks.' },
    ],
  },
  {
    id: 'l:11', stage: 0, unit: 3, title: 'Dakuten and handakuten',
    subtitle: 'Two small marks, twenty-five new kana',
    concepts: hiraGroup('voiced'),
    blocks: [
      { type: 'text', body: 'Two tiny marks in the top right corner change a kana\'s consonant. **Dakuten** (a double quote) voices it: か→が, さ→ざ, た→だ. **Handakuten** (a small circle) turns は into ぱ.' },
      { type: 'text', body: 'You are not learning 25 new shapes — you already know all of them. You are learning one rule.' },
      { type: 'tip', title: 'は→ば is the odd one out', body: 'か→が, さ→ざ and た→だ are true voicing pairs. は→ば is not: b is the voiced partner of **p**, not h. The は row was pronounced /p/ in Old Japanese and softened to /h/ later, leaving its voiced form behind — which is also why the ぱ row needs a mark of its own.' },
      { type: 'kana', ids: hiraGroup('voiced') },
      { type: 'tip', title: 'じ / ぢ and ず / づ', body: 'Each pair sounds identical in modern standard Japanese. じ and ず are the normal spellings; ぢ and づ appear only in a handful of words, usually where a compound caused the change.' },
    ],
  },
  {
    id: 'l:12', stage: 0, unit: 3, title: 'Yōon, small っ, long vowels',
    subtitle: 'Rhythm under pressure',
    concepts: hiraGroup('yoon'),
    blocks: [
      { type: 'text', body: 'A small ゃ・ゅ・ょ after an i-row kana squeezes two kana into **one beat**: き + ゃ = きゃ (kya), not ki-ya. This is the one place the one-kana-one-beat rule bends.' },
      { type: 'kana', ids: hiraGroup('yoon') },
      { type: 'tip', title: 'Small っ is a beat of silence', body: 'A small つ doubles the next consonant and takes a full beat of its own. がっこう is *ga-k-ko-u*, four beats — the pause is real, and dropping it is one of the most audible foreign-accent markers.' },
      { type: 'tip', title: 'Long vowels are two beats', body: 'おおきい is four beats, not two. とうきょう is four, not two. English speakers routinely halve these and it makes the word unrecognisable.' },
    ],
  },
  {
    id: 'l:13', stage: 0, unit: 3, title: 'Reading without romaji',
    subtitle: 'The integrated hiragana challenge',
    concepts: ['v:daijoubu', 'v:shukudai', 'v:zasshi', 'v:kippu', 'v:shinbun', 'v:yukkuri',
               'v:gakkou', 'v:kyou', 'v:ashita', 'v:kinou', 'v:ima', 'v:chotto', 'v:asa', 'v:hiru', 'v:mainichi'],
    blocks: [
      { type: 'text', body: 'This lesson has a specific job: **it is where romaji starts coming off.** You have met all 104 hiragana spellings — 46 base characters, plus the voiced forms and the small-kana combinations built from them. Individually you can probably read most of them. Reading them at speed, inside real words, with dakuten and small kana and long vowels all happening at once, is a different skill — and it is the one that actually matters.' },
      { type: 'text', body: 'From here the app fades romaji out **per kana**: once a kana has survived a few spaced reviews, its romaji stops appearing. Get everything below solid and the romaji will be gone within a week or two. (Settings can force it always on or always off if you would rather decide yourself.)' },

      { type: 'tip', title: 'The four things that break beginners', body: '**っ** — a full beat of silence, not a decoration. **Long vowels** — おう and えい are two beats, not one. **Dakuten** — が is not か, and the mark is easy to skim past. **ん** — its own beat, and it changes sound depending on what follows.' },

      { type: 'text', body: 'These six words were chosen because each one stresses a different weak point. Read every one aloud before you look at the meaning.' },
      { type: 'vocab', ids: ['v:daijoubu', 'v:shukudai', 'v:zasshi', 'v:kippu', 'v:shinbun', 'v:yukkuri'] },

      { type: 'tip', title: 'What each one is testing', body: '**だいじょうぶ** — three dakuten inside five beats, easy to skim past. **しゅくだい** — a yōon and a dakuten in the same word. **ざっし・きっぷ・ゆっくり** — the small っ, which almost everyone under-holds; きっぷ adds a handakuten on top. **しんぶん** — ん twice, and pronounced differently each time: [m] before ぶ, and a further-back nasal at the end, which is why it is romanised *shimbun*.' },

      { type: 'text', body: 'Nine more everyday words, chosen because between them they use most of the hiragana chart. Read each one aloud before checking the meaning.' },
      { type: 'vocab', ids: ['v:gakkou', 'v:kyou', 'v:ashita', 'v:kinou', 'v:ima', 'v:chotto', 'v:asa', 'v:hiru', 'v:mainichi'] },

      { type: 'tip', title: 'How to know you have passed', body: 'Not "I recognised them all" — that is the easy half. The bar is **production**: given a sound, you can write the kana without checking. The practice below asks in both directions, and typing the reading of a whole word is deliberately harder than picking one from four.' },
    ],
  },
  {
    id: 'l:14', stage: 0, unit: 4, title: 'Katakana ア〜ソ',
    subtitle: 'The second script, same sounds',
    concepts: [...kata('a'), ...kata('k'), ...kata('s')],
    blocks: [
      { type: 'text', body: 'Katakana represents exactly the same sounds as hiragana. Different shapes, identical system. It is used for words borrowed from other languages, for emphasis, for onomatopoeia, and for many plant and animal names.' },
      { type: 'text', body: 'The shapes are more angular — straight lines and sharp corners where hiragana curves.' },
      { type: 'kana', ids: [...kata('a'), ...kata('k'), ...kata('s')] },
      { type: 'tip', title: 'シ and ツ', body: 'The classic confusion. シ\'s strokes come in from the left and sit low; ツ\'s come down from the top. Look at where the two short strokes point.' },
    ],
  },
  {
    id: 'l:15', stage: 0, unit: 4, title: 'Katakana タ〜ホ',
    subtitle: 'And the loanwords they unlock',
    concepts: [...kata('t'), ...kata('n'), ...kata('h'), 'v:pan', 'v:basu'],
    blocks: [
      { type: 'kana', ids: [...kata('t'), ...kata('n'), ...kata('h')] },
      { type: 'vocab', ids: ['v:pan', 'v:basu'] },
      { type: 'tip', title: 'ク, ケ and タ', body: 'Another cluster worth drilling against each other rather than alone.' },
    ],
  },
  {
    id: 'l:16', stage: 0, unit: 4, title: 'Katakana マ〜ン',
    subtitle: 'Katakana complete',
    concepts: [...kata('m'), ...kata('y'), ...kata('r'), ...kata('w'), 'v:terebi', 'v:anime'],
    blocks: [
      { type: 'kana', ids: [...kata('m'), ...kata('y'), ...kata('r'), ...kata('w')] },
      { type: 'tip', title: 'ソ and ン', body: 'ソ\'s short stroke comes down from the top; ン\'s sweeps up from the lower left. Together with シ / ツ these four cause more katakana mistakes than everything else combined.' },
      { type: 'vocab', ids: ['v:terebi', 'v:anime'] },
    ],
  },
  {
    id: 'l:17', stage: 0, unit: 4, title: 'Katakana marks and loanwords',
    subtitle: 'ー, dakuten, and how English becomes Japanese',
    concepts: [...kataGroup('voiced'), ...kataGroup('yoon'), 'v:koohii', 'v:pasokon', 'v:sumaho', 'v:geemu', 'v:biiru', 'v:takushii'],
    blocks: [
      { type: 'text', body: 'Dakuten and yōon work exactly as they do in hiragana. Katakana adds one mark of its own: **ー**, which lengthens the vowel before it. コーヒー is *ko-o-hi-i*, four beats.' },
      { type: 'kana', ids: [...kataGroup('voiced'), ...kataGroup('yoon')] },
      { type: 'text', body: 'Loanwords are the fastest early win in Japanese — you already know the meanings, you just have to hear them through the sound system. Japanese has almost no standalone consonants — only ん and the small っ — so every borrowed consonant picks up a vowel, and words get clipped aggressively.' },
      { type: 'vocab', ids: ['v:koohii', 'v:pasokon', 'v:sumaho', 'v:geemu', 'v:biiru', 'v:takushii'] },
      { type: 'tip', title: 'Do not assume the meaning survived', body: 'パン is bread, from Portuguese *pão* — nothing to do with a pan. マンション is an apartment, not a mansion. Loanwords drift.' },
    ],
  },

  // ─────────────────────────── STAGE 1 ───────────────────────────
  {
    id: 'l:18', stage: 1, unit: 5, title: 'X は Y です',
    subtitle: 'Your first sentence pattern',
    concepts: ['g:desu', 'v:gakusei', 'v:sensei', 'v:hajimemashite', 'v:yoroshiku', 'v:anata', 'v:kazoku', 'v:kodomo', 'v:otokonohito', 'v:onnanohito'],
    blocks: [
      { type: 'grammar', id: 'g:desu' },
      { type: 'sentences', ids: ['s:001', 's:002', 's:003'] },
      { type: 'vocab', ids: ['v:gakusei', 'v:sensei', 'v:hajimemashite', 'v:yoroshiku', 'v:anata', 'v:kazoku', 'v:kodomo', 'v:otokonohito', 'v:onnanohito'] },
      { type: 'tip', title: 'Japanese drops pronouns constantly', body: '学生です on its own is a complete sentence meaning "I am a student" when the context is obvious. Saying 私は in every sentence marks you as a beginner faster than almost anything else.' },
    ],
  },
  {
    id: 'l:19', stage: 1, unit: 5, title: 'じゃないです — saying it is not',
    subtitle: 'The negative',
    concepts: ['g:janai'],
    blocks: [
      { type: 'grammar', id: 'g:janai' },
      { type: 'sentences', ids: ['s:004', 's:005', 's:109'] },
    ],
  },
  {
    id: 'l:20', stage: 1, unit: 5, title: 'Questions with か',
    subtitle: 'And asking 何',
    concepts: ['g:ka', 'v:dare', 'v:doko', 'v:itsu', 'v:dou'],
    blocks: [
      { type: 'grammar', id: 'g:ka' },
      { type: 'sentences', ids: ['s:006', 's:007', 's:047'] },
      { type: 'vocab', ids: ['v:nani', 'v:dare', 'v:doko', 'v:itsu', 'v:dou'] },
      { type: 'tip', title: 'Word order does not change', body: 'Unlike English, nothing moves. これは本です → これは本ですか. That is the entire operation.' },
    ],
  },
  {
    id: 'l:21', stage: 1, unit: 5, title: 'の — whose is it',
    subtitle: 'Connecting two nouns',
    concepts: ['g:no', 'v:kuruma', 'v:kaban', 'v:kasa', 'v:kutsu', 'v:denwa', 'v:kagi', 'v:isu', 'v:mado'],
    blocks: [
      { type: 'grammar', id: 'g:no' },
      { type: 'sentences', ids: ['s:008', 's:071', 's:081', 's:082'] },
      { type: 'vocab', ids: ['v:kuruma', 'v:kaban', 'v:kasa', 'v:kutsu', 'v:denwa', 'v:kagi', 'v:isu', 'v:mado'] },
    ],
  },
  {
    id: 'l:22', stage: 1, unit: 5, title: 'も — me too',
    subtitle: 'A particle that replaces another',
    concepts: ['g:mo'],
    blocks: [
      { type: 'grammar', id: 'g:mo' },
      { type: 'sentences', ids: ['s:010', 's:150', 's:152'] },
    ],
  },
  {
    id: 'l:23', stage: 1, unit: 6, title: 'これ・それ・あれ',
    subtitle: 'Japanese splits "that" in two',
    concepts: ['g:kore', 'v:are'],
    blocks: [
      { type: 'grammar', id: 'g:kore' },
      { type: 'sentences', ids: ['s:012', 's:013', 's:014'] },
      { type: 'tip', title: 'The こ・そ・あ・ど system', body: 'It runs through the whole language: これ／それ／あれ／どれ, ここ／そこ／あそこ／どこ, この／その／あの／どの. Learn the pattern once and four sets come free.' },
    ],
  },
  {
    id: 'l:24', stage: 1, unit: 6, title: 'この・その・あの and ここ・そこ・あそこ',
    subtitle: 'The same system, applied',
    concepts: ['g:kono', 'g:koko', 'v:asoko', 'v:eki', 'v:byouin', 'v:toshokan', 'v:ie', 'v:uchi'],
    blocks: [
      { type: 'grammar', id: 'g:kono' },
      { type: 'grammar', id: 'g:koko' },
      { type: 'sentences', ids: ['s:151', 's:016', 's:017', 's:018'] },
      { type: 'vocab', ids: ['v:eki', 'v:mise', 'v:byouin', 'v:toshokan'] },
    ],
  },
  {
    id: 'l:25', stage: 1, unit: 6, title: 'Numbers and your first kanji',
    subtitle: '一 to 十',
    concepts: ['k:一', 'k:二', 'k:三', 'k:四', 'k:五', 'k:六', 'k:七', 'k:八', 'k:九', 'k:十',
               'v:ichi', 'v:ni', 'v:san', 'v:yon', 'v:go', 'v:roku', 'v:nana', 'v:hachi', 'v:kyuu', 'v:juu'],
    blocks: [
      { type: 'text', body: 'Kanji are best learned through the words that use them, not as isolated reading lists. Numbers are the gentlest possible start: ten characters, immediately useful, and several are almost pictures of what they mean.' },
      { type: 'kanji', ids: ['k:一', 'k:二', 'k:三', 'k:四', 'k:五', 'k:六', 'k:七', 'k:八', 'k:九', 'k:十'] },
      { type: 'tip', title: 'Two numbers have two readings for a reason', body: 'When counting out loud, よん and なな are preferred over し and しち — し is a homophone of 死 (death) and しち is easily misheard as いち. But this is a preference in **bare counting only**. Clock and calendar readings are fixed and do not follow it: 四時 is よじ, 七時 is しちじ, 九時 is くじ, 四月 is しがつ. Learn those as whole words rather than assembling them.' },
    ],
  },
  {
    id: 'l:26', stage: 1, unit: 6, title: 'Verbs and ます',
    subtitle: 'Present and future at the same time',
    concepts: ['g:masu', 'v:iku', 'v:kuru', 'v:suru', 'v:miru', 'v:taberu', 'v:nomu', 'v:kiku', 'v:hanasu', 'v:matsu', 'v:benkyou'],
    blocks: [
      { type: 'grammar', id: 'g:masu' },
      { type: 'vocab', ids: ['v:iku', 'v:kuru', 'v:suru', 'v:miru', 'v:taberu', 'v:nomu', 'v:kiku', 'v:hanasu', 'v:matsu', 'v:benkyou'] },
      { type: 'sentences', ids: ['s:019', 's:020', 's:021'] },
      { type: 'tip', title: 'There is no future tense', body: '明日行きます and 毎日行きます use the identical verb form. Japanese marks time with words like 明日, not with the verb. Learners lose weeks looking for a future tense that does not exist.' },
      { type: 'tip', title: 'Two particles you will notice here', body: 'The examples contain を (marking what the verb acts on) and に (marking where you are going). Take them on trust for now — each gets a lesson of its own in the next few.' },
    ],
  },
  {
    id: 'l:27', stage: 1, unit: 7, title: 'ません — the polite negative',
    subtitle: 'And the politest way to invite someone',
    concepts: ['g:masen', 'v:hataraku', 'v:issho'],
    blocks: [
      { type: 'grammar', id: 'g:masen' },
      { type: 'sentences', ids: ['s:022', 's:023', 's:084'] },
      { type: 'tip', title: 'Negative questions are invitations', body: '一緒に行きませんか is not "won\'t you go" in a reproachful sense — it is the standard, softly polite way to say "shall we go together?". Asking in the negative leaves the other person room to decline.' },
    ],
  },
  {
    id: 'l:28', stage: 1, unit: 7, title: 'を — the object particle',
    subtitle: 'What the verb acts on',
    concepts: ['g:wo', 'v:yomu', 'v:kaku', 'v:kau', 'v:gohan', 'v:ocha', 'v:sakana', 'v:tamago', 'v:kudamono', 'v:asagohan', 'v:hirugohan', 'v:bangohan', 'v:itadakimasu', 'v:gochisousama'],
    blocks: [
      { type: 'grammar', id: 'g:wo' },
      { type: 'sentences', ids: ['s:024', 's:025', 's:026'] },
      { type: 'vocab', ids: ['v:yomu', 'v:kaku', 'v:kau', 'v:gohan', 'v:ocha', 'v:sakana', 'v:tamago', 'v:kudamono', 'v:asagohan', 'v:hirugohan', 'v:bangohan'] },
      { type: 'tip', title: 'Two phrases that bracket every meal', body: 'いただきます before eating and ごちそうさまでした after. They are said even when eating alone, and skipping them is noticeable.' },
      { type: 'tip', title: 'Some English objects are Japanese subjects', body: '日本語が分かります and ラーメンが好きです both take が, not を. 分かる and 好き describe a state, not an action you perform on something.' },
    ],
  },
  {
    id: 'l:29', stage: 1, unit: 7, title: 'に and へ — going places',
    subtitle: 'Destinations, times, and meeting people',
    concepts: ['g:ni_he', 'v:kaeru', 'v:au', 'v:okiru', 'v:neru'],
    blocks: [
      { type: 'grammar', id: 'g:ni_he' },
      { type: 'sentences', ids: ['s:027', 's:028', 's:029', 's:098'] },
      { type: 'vocab', ids: ['v:kaeru', 'v:au', 'v:okiru', 'v:neru'] },
      { type: 'tip', title: 'Which time words take に', body: 'The test is not how specific the time is — it is where the time is measured from. Times fixed by the clock or calendar take に: 七時に, 月曜日に, 三月に, 週末に. Times measured from right now take **no particle at all**: 今日, 明日, 昨日, 毎日, 来週. 明日に行きます is wrong, even though 明日 is perfectly specific.' },
    ],
  },
  {
    id: 'l:44', stage: 1, unit: 7, title: 'Telling the time',
    subtitle: 'Your first counters: 時 and 分',
    concepts: ['g:counters', 'c:ji', 'c:fun'],
    blocks: [
      { type: 'text', body: 'You have the numbers and you have に for clock times. What is missing is the piece between them: Japanese never uses a bare number to count anything. It attaches a **counter** — a small word chosen for the kind of thing being counted.' },
      { type: 'grammar', id: 'g:counters' },
      { type: 'text', body: 'Time is the place to start, because you will use it every day and because it shows the pattern that runs through every counter: most combinations are regular, and a handful fuse into a sound you simply have to know.' },
      { type: 'counter', ids: ['c:ji'] },
      { type: 'tip', title: 'Three hours you cannot work out', body: '四時 is **よじ**, 七時 is **しちじ**, 九時 is **くじ**. Note that this cuts across the よん／なな preference you learned with the numbers — that preference is for bare counting only, and clock readings ignore it.' },
      { type: 'counter', ids: ['c:fun'] },
      { type: 'tip', title: 'Why 分 alternates', body: 'ふん becomes ぷん after certain numbers, and the number itself often shortens: 一分 いっぷん, 六分 ろっぷん, 十分 じゅっぷん. This same fusion appears again in 本, 個 and 回 later — learn the pattern here and those come cheaper.' },
      { type: 'sentences', ids: ['s:164', 's:021', 's:067'] },
    ],
  },
  {
    id: 'l:30', stage: 1, unit: 7, title: 'で — where things happen',
    subtitle: 'The particle pair that trips everyone',
    concepts: ['g:de', 'v:kaisha', 'v:resutoran', 'v:tsukau'],
    blocks: [
      { type: 'grammar', id: 'g:de' },
      { type: 'sentences', ids: ['s:030', 's:031', 's:065', 's:052'] },
      { type: 'vocab', ids: ['v:kaisha', 'v:resutoran', 'v:tsukau', 'v:takushii'] },
      { type: 'tip', title: 'に is existence, で is activity', body: '家にいます — I am at home. 家で食べます — I eat at home. If a verb describes something *happening*, the place takes で.' },
    ],
  },
  {
    id: 'l:45', stage: 1, unit: 7, title: 'と — and, with',
    subtitle: 'One particle, two everyday jobs',
    concepts: ['g:to', 'v:inu', 'v:ringo'],
    blocks: [
      { type: 'text', body: 'You have been reading と in example sentences for a while without it ever being explained. It does two jobs, and they are close enough that learning them together makes sense.' },
      { type: 'grammar', id: 'g:to' },
      { type: 'text', body: 'First, joining nouns.' },
      { type: 'sentences', ids: ['s:155', 's:187'] },
      { type: 'text', body: 'Second, naming who you did something with. The person comes first, then と, then the rest of the sentence — which is exactly where で would sit if you had travelled by bus instead.' },
      { type: 'sentences', ids: ['s:186', 's:107'] },
      { type: 'tip', title: 'と does not join sentences', body: 'English "and" links anything — nouns, verbs, whole clauses. と links **nouns only**. "I ate and went home" needs the て-form (食べて、帰りました), which is coming in Stage 2. Trying to use と there is one of the most common beginner errors.' },
      { type: 'tip', title: 'A complete list vs. a suggestive one', body: 'と implies the list is exhaustive: パンと卵 means bread and eggs, that is all. For "bread, eggs, that sort of thing" Japanese uses **や** instead, which leaves the list open.' },
      { type: 'vocab', ids: ['v:inu', 'v:ringo'] },
    ],
  },
  {
    id: 'l:31', stage: 1, unit: 8, title: 'い-adjectives',
    subtitle: 'Words that conjugate themselves',
    concepts: ['g:iadj', 'v:ookii', 'v:chiisai', 'v:takai', 'v:yasui', 'v:atarashii', 'v:furui', 'v:oishii', 'v:ii', 'v:muzukashii', 'v:isogashii', 'v:samui', 'v:atsui'],
    blocks: [
      { type: 'grammar', id: 'g:iadj' },
      { type: 'vocab', ids: ['v:ookii', 'v:chiisai', 'v:takai', 'v:yasui', 'v:atarashii', 'v:furui', 'v:oishii', 'v:ii', 'v:muzukashii', 'v:isogashii', 'v:samui', 'v:atsui'] },
      { type: 'sentences', ids: ['s:033', 's:034', 's:056', 's:087'] },
      { type: 'tip', title: 'い-adjectives carry the tense', body: 'In English the verb changes: "it was expensive". In Japanese the adjective does: 高かったです. です never carries the past for an い-adjective.' },
    ],
  },
  {
    id: 'l:32', stage: 1, unit: 8, title: 'な-adjectives and 好き',
    subtitle: 'The other kind of describing word',
    concepts: ['g:naadj', 'g:suki', 'v:shizuka', 'v:genki', 'v:yuumei', 'v:benri', 'v:kirei', 'v:kantan'],
    blocks: [
      { type: 'grammar', id: 'g:naadj' },
      { type: 'vocab', ids: ['v:shizuka', 'v:genki', 'v:yuumei', 'v:benri', 'v:kirei', 'v:kantan'] },
      { type: 'sentences', ids: ['s:036', 's:037', 's:075'] },
      { type: 'grammar', id: 'g:suki' },
      { type: 'sentences', ids: ['s:041', 's:042', 's:105'] },
      { type: 'tip', title: 'The い ending is not a reliable test', body: 'きれい and 有名 end in い but are な-adjectives. There is no shortcut — you learn which is which, and this app tracks them separately.' },
    ],
  },
  {
    id: 'l:33', stage: 1, unit: 8, title: 'ある and いる',
    subtitle: 'What is there',
    concepts: ['g:aruiru', 'v:aru', 'v:iru', 'v:tsukue', 'v:jikan', 'v:okane'],
    blocks: [
      { type: 'grammar', id: 'g:aruiru' },
      { type: 'sentences', ids: ['s:038', 's:039', 's:040', 's:095', 's:096'] },
      { type: 'vocab', ids: ['v:tsukue', 'v:jikan', 'v:okane', 'v:kagi'] },
      { type: 'tip', title: 'Choose by aliveness, not by movement', body: 'A car takes ある even though it drives. A cat takes いる even when asleep. The line is animate versus inanimate.' },
    ],
  },
  {
    id: 'l:46', stage: 1, unit: 8, title: 'Counting people and things',
    subtitle: '人 and つ — the two counters you cannot avoid',
    concepts: ['c:nin', 'c:tsu'],
    blocks: [
      { type: 'text', body: 'You have just learned to say what exists. The obvious next question is *how many* — and answering it needs two counters that between them cover most everyday situations.' },
      { type: 'counter', ids: ['c:nin'] },
      { type: 'tip', title: 'ひとり and ふたり are not numbers plus a counter', body: 'They are survivals of the older native Japanese counting system, which is why they look nothing like 一 and 二. From three onwards the pattern becomes regular — with 四人 よにん as the one to watch.' },
      { type: 'counter', ids: ['c:tsu'] },
      { type: 'tip', title: 'つ is your escape hatch', body: 'There are hundreds of counters in Japanese, and nobody expects a learner to know them all. When you cannot remember the right one for an object, use つ. It is natural, it is polite, and it never counts people — that is always 人.' },
      { type: 'sentences', ids: ['s:157', 's:164', 's:070'] },
    ],
  },
  {
    id: 'l:34', stage: 1, unit: 8, title: 'ました — talking about yesterday',
    subtitle: 'The polite past',
    concepts: ['g:mashita', 'v:shuumatsu'],
    blocks: [
      { type: 'grammar', id: 'g:mashita' },
      { type: 'sentences', ids: ['s:043', 's:044', 's:045', 's:079', 's:080'] },
      { type: 'vocab', ids: ['v:kinou', 'v:shuumatsu', 'v:mainichi'] },
    ],
  },
  {
    id: 'l:35', stage: 1, unit: 8, title: 'Kanji: 日 月 火 水 木 金 土',
    subtitle: 'The days of the week',
    concepts: ['k:日', 'k:月', 'k:火', 'k:水', 'k:木', 'k:金', 'k:土', 'v:getsuyoubi', 'v:doyoubi', 'v:nichiyoubi'],
    blocks: [
      { type: 'text', body: 'These seven kanji name the days of the week, running through the sun, the moon and the five classical planets. 日曜日 is the sun\'s day; Sunday. 月曜日 is the moon\'s day; Monday. 土曜日 is Saturn\'s day; Saturday. English inherits the same ancient scheme, but kept the planets only for those three — Tuesday through Friday were swapped for Germanic gods.' },
      { type: 'kanji', ids: ['k:日', 'k:月', 'k:火', 'k:水', 'k:木', 'k:金', 'k:土'] },
      { type: 'vocab', ids: ['v:getsuyoubi', 'v:doyoubi', 'v:nichiyoubi'] },
      { type: 'tip', title: '日 is the most common kanji in the language', body: 'And its reading changes constantly: 日曜日 is にちようび — the same character read two different ways in one word. This is exactly why the app teaches kanji through vocabulary instead of through reading lists.' },
    ],
  },
  {
    id: 'l:47', stage: 1, unit: 8, title: 'Counting shapes, machines and events',
    subtitle: '枚・本・個・台・回',
    concepts: ['c:mai', 'c:hon', 'c:ko', 'c:dai', 'c:kai', 'v:maishuu'],
    blocks: [
      { type: 'text', body: 'Five more counters, chosen because between them they cover most of what a beginner actually needs to count. Two are completely regular; three fuse with the number the way 分 did.' },
      { type: 'text', body: 'Start with the easy pair.' },
      { type: 'counter', ids: ['c:mai', 'c:dai'] },
      { type: 'text', body: 'Then the three that change shape. If 一分 いっぷん and 六分 ろっぷん already feel familiar, these will too — it is the same fusion.' },
      { type: 'counter', ids: ['c:hon', 'c:ko', 'c:kai'] },
      { type: 'tip', title: '本 does not count books', body: 'It counts long thin things — bottles, pens, umbrellas, trains, bananas. Books take 冊 (さつ). The kanji 本 means "origin" and "main" as much as it means "book", and this is one of its other lives.' },
      { type: 'tip', title: 'Where the counter goes', body: 'After the noun and its particle, not before the noun: 切符を二枚ください. Putting the number first (二枚の切符) is grammatical but sounds like an inventory list rather than a request.' },
      { type: 'sentences', ids: ['s:154', 's:161', 's:160', 's:158', 's:159'] },
    ],
  },
  {
    id: 'l:36', stage: 1, unit: 8, title: 'Putting it together',
    subtitle: 'No new grammar — everything at once',
    concepts: ['k:人', 'k:大', 'k:小', 'k:本', 'k:中', 'k:上', 'k:下', 'k:山', 'k:川', 'v:nihon', 'v:kuni', 'v:tanoshii', 'v:totemo', 'v:sukoshi', 'v:takusan', 'v:amari', 'v:zenzen', 'v:mata'],
    blocks: [
      { type: 'text', body: 'Everything in this lesson uses only patterns you already know. It mixes particles, both adjective types, past and present, and questions — which is what real Japanese does.' },
      { type: 'kanji', ids: ['k:人', 'k:大', 'k:小', 'k:本', 'k:中', 'k:上', 'k:下', 'k:山', 'k:川'] },
      { type: 'sentences', ids: ['s:051', 's:058', 's:086', 's:100', 's:103', 's:110'] },
      { type: 'vocab', ids: ['v:nihon', 'v:kuni', 'v:tanoshii', 'v:totemo', 'v:sukoshi', 'v:takusan', 'v:amari', 'v:zenzen', 'v:mata'] },
      { type: 'tip', title: 'あまり and 全然 set up a negative', body: 'あまり高くないです, 全然分かりません. Both feel unfinished without the negative, and forgetting it is a very common beginner slip. One caveat: in casual speech 全然 is now used with positives too — 全然大丈夫, 全然いいよ. That is genuinely common, but it is spoken register, not something to write.' },
      { type: 'tip', title: 'What comes next', body: 'Stage 2 opens with the て-form — the gateway to requests, permission, prohibition, actions in progress, and joining sentences together.' },
    ],
  },

  // ─────────────────────────── STAGE 2 ───────────────────────────
  {
    id: 'l:37', stage: 2, unit: 9, title: 'The て-form, part 1',
    subtitle: 'る-verbs, the irregulars, and your first request',
    concepts: ['g:te', 'g:tekudasai', 'v:deru'],
    blocks: [
      { type: 'text', body: 'Everything you have learned so far uses ます. This lesson opens a different door. The **て-form** is not a tense and means nothing on its own — it is a connector, and half a dozen of the most useful structures in Japanese are waiting on the other side of it: requests, permission, prohibition, actions in progress, and joining sentences together.' },
      { type: 'text', body: 'Because it is that important, we build it over two lessons. Today: the easy half.' },
      { type: 'grammar', id: 'g:te' },
      { type: 'text', body: '**る-verbs** are trivial — drop る, add て. **する** and **来る** make up the whole of Group 3, the only irregular verb group, so there is nothing to work out: you learn the two of them and you are done. (A few other verbs are irregular in one form each — ある has the negative ない, and 行く has a て-form you will meet next lesson — but they are not a group.)' },
      { type: 'conjugation', ids: ['v:taberu', 'v:miru', 'v:okiru', 'v:neru', 'v:deru', 'v:suru', 'v:kuru', 'v:benkyou'] },
      { type: 'tip', title: '来て is read きて', body: 'The kanji stays 来 but its reading shifts with the form: くる in the dictionary form, き in 来ます and 来て. A third reading, こ, turns up later in 来ない (こない). One character, three stems — which is exactly what makes it irregular.' },
      { type: 'text', body: 'Now put it to work. Add ください and you have a polite request — probably the single most useful thing you can say to a stranger.' },
      { type: 'grammar', id: 'g:tekudasai' },
      { type: 'sentences', ids: ['s:147', 's:148', 's:117'] },
      { type: 'vocab', ids: ['v:deru'] },
      { type: 'tip', title: 'Why the examples are all る-verbs', body: 'Every verb above is a る-verb or an irregular, so you can derive each て-form yourself with what you learned today. う-verbs — which is most verbs — get the whole of the next lesson.' },
    ],
  },
  {
    id: 'l:38', stage: 2, unit: 9, title: 'The て-form, part 2',
    subtitle: 'う-verbs — five endings and one exception',
    concepts: ['g:te_u', 'v:oyogu', 'v:asobu', 'v:hairu', 'v:tatsu', 'v:suwaru', 'v:toru', 'v:shashin', 'v:kanji'],
    blocks: [
      { type: 'text', body: 'う-verbs are where the て-form earns its reputation. The ending of the dictionary form decides the ending of the て-form, and there are five patterns. They are worth memorising as a block — many learners chant them.' },
      { type: 'grammar', id: 'g:te_u' },
      { type: 'conjugation', ids: ['v:kau', 'v:matsu', 'v:kaeru', 'v:nomu', 'v:asobu', 'v:kaku', 'v:oyogu', 'v:hanasu', 'v:iku'] },
      { type: 'tip', title: 'One exception, and it matters', body: '行く should become 行いて by the く rule. It does not — it is **行って**. That is the only common exception in the whole system, and 行く is one of the most frequent verbs in the language, so you will meet it constantly.' },
      { type: 'tip', title: 'Two verbs that look like る-verbs and are not', body: '帰る (かえる) ends in える and 入る (はいる) ends in いる — the shape that normally marks a る-verb. Both are う-verbs: 帰って, 入って, never 帰て. The ending alone cannot tell you the group; there are only a handful of these and you learn them by heart.' },
      { type: 'sentences', ids: ['s:111', 's:113', 's:114', 's:115', 's:116'] },
      { type: 'vocab', ids: ['v:oyogu', 'v:asobu', 'v:hairu', 'v:tatsu', 'v:suwaru', 'v:toru', 'v:shashin', 'v:kanji'] },
    ],
  },
  {
    id: 'l:39', stage: 2, unit: 10, title: '〜ています — happening now',
    subtitle: 'The form English speakers keep looking for',
    concepts: ['g:teimasu', 'v:sumu', 'v:ani', 'v:ongaku', 'v:neko'],
    blocks: [
      { type: 'text', body: 'Back in the ます lesson there was a warning: 食べます is not "I am eating". This is the form that is. Attach います to the て-form and the action becomes ongoing.' },
      { type: 'grammar', id: 'g:teimasu' },
      { type: 'sentences', ids: ['s:118', 's:120', 's:122', 's:123'] },
      { type: 'text', body: 'The second job is less obvious to English speakers. Where English uses a plain present for an ongoing situation — where you live, where you work — Japanese uses ています, because the situation is continuing rather than momentary.' },
      { type: 'sentences', ids: ['s:119', 's:121'] },
      { type: 'tip', title: 'Where English and Japanese disagree', body: '住んでいます is "I live there", not "I am living there". A smaller group of verbs describe an instant change and use ています for the state it leaves behind: 結婚しています "I am married", 知っています "I know". Watch the negative of that last one — it is **知りません**, not 知っていません, and it is the exception everyone trips on.' },
      { type: 'vocab', ids: ['v:sumu', 'v:ani', 'v:ongaku', 'v:neko'] },
    ],
  },
  {
    id: 'l:40', stage: 2, unit: 10, title: '〜てもいいですか — asking permission',
    subtitle: 'The polite way to ask for anything',
    concepts: ['g:temoii', 'v:douzo'],
    blocks: [
      { type: 'grammar', id: 'g:temoii' },
      { type: 'text', body: 'Read it literally and the logic is clear: "even if I do X, is it good?" Japanese asks permission by checking whether the action would be acceptable, rather than by asking for it directly.' },
      { type: 'sentences', ids: ['s:125', 's:126', 's:128', 's:129', 's:130'] },
      { type: 'text', body: 'And the reply.' },
      { type: 'sentences', ids: ['s:127'] },
      { type: 'vocab', ids: ['v:douzo'] },
      { type: 'tip', title: 'The trap is いいです without はい', body: 'はい、どうぞ is the warmest yes, and はい、いいですよ is perfectly normal too — the はい settles the polarity. What catches learners out is a **bare** いいです or 結構です in reply to an *offer*: 「袋、いりますか」「いいです」means "no thanks", exactly the way English "I’m fine" declines. Same words, opposite answer, decided by whether there is a はい in front.' },
    ],
  },
  {
    id: 'l:41', stage: 2, unit: 10, title: '〜てはいけません — what you must not do',
    subtitle: 'The mirror image of permission',
    concepts: ['g:tewaikemasen', 'v:sake'],
    blocks: [
      { type: 'grammar', id: 'g:tewaikemasen' },
      { type: 'sentences', ids: ['s:131', 's:132', 's:133', 's:134', 's:135'] },
      { type: 'tip', title: 'This one has a register problem', body: 'てはいけません is genuinely strong — rules, signs, an adult to a child. Used on someone your own age it sounds like you are lecturing them. Among friends people say 〜ちゃだめ, and public notices usually soften to 〜ないでください, which comes with the ない-form later.' },
      { type: 'vocab', ids: ['v:sake'] },
    ],
  },
  {
    id: 'l:42', stage: 2, unit: 11, title: 'Connecting actions with て',
    subtitle: 'One sentence instead of three',
    concepts: ['g:teconnect', 'v:eiga', 'v:nihongo', 'v:puuru'],
    blocks: [
      { type: 'text', body: 'Until now every sentence you have built has held exactly one verb. The て-form is how Japanese strings them together — and it is the reason your Japanese has sounded clipped so far.' },
      { type: 'grammar', id: 'g:teconnect' },
      { type: 'sentences', ids: ['s:136', 's:137', 's:138', 's:142'] },
      { type: 'tip', title: 'Only the last verb carries the tense', body: '昨日映画を見て、ご飯を食べました is entirely past — 見て says nothing about when. This is why the て-form is called a connector and not a tense: it hands the tense job to the final verb and gets on with linking.' },
      { type: 'sentences', ids: ['s:139', 's:140', 's:141', 's:149'] },
      { type: 'vocab', ids: ['v:eiga', 'v:nihongo', 'v:puuru'] },
    ],
  },
  {
    id: 'l:43', stage: 2, unit: 11, title: 'A day, described',
    subtitle: 'Integrated challenge — everything at once',
    concepts: ['v:imi', 'v:tango', 'v:omoshiroi'],
    blocks: [
      { type: 'text', body: 'No new grammar. This lesson asks whether you can actually **use** the て-form rather than recite its rules: requests, permission, actions in progress and joined sequences, across all five う-verb endings and both irregulars.' },
      { type: 'sentences', ids: ['s:143', 's:144', 's:145', 's:146'] },
      { type: 'conjugation', ids: ['v:iku', 'v:kuru', 'v:suru', 'v:nomu', 'v:kaku', 'v:oyogu', 'v:hanasu', 'v:matsu', 'v:taberu', 'v:hairu'] },
      { type: 'vocab', ids: ['v:imi', 'v:tango', 'v:omoshiroi', 'v:shinbun'] },
      { type: 'tip', title: 'What the て-form has bought you', body: 'Six lessons ago you could say one thing at a time in the polite present. You can now make requests, ask permission, state prohibitions, describe what is happening right now, and join actions into a sequence — all from one form.' },
      { type: 'tip', title: 'What comes next', body: 'Stage 3 takes the plain (dictionary) form — the same kind of gateway the て-form was. It unlocks casual speech, 〜と思う, 〜ことができる, clauses that describe nouns, and the ない-form behind 〜ないでください.' },
    ],
  },
  // ─────────────────────────── STAGE 3 ───────────────────────────
  {
    id: 'l:48', stage: 3, unit: 12, title: 'The plain form',
    subtitle: 'Not slang — the base every other structure is built on',
    concepts: ['g:plain'],
    blocks: [
      { type: 'text', body: 'Every verb so far has worn its polite clothes. Underneath is the **plain form** — the form a dictionary lists, which is why it is also called the dictionary form. You already know all of them: for verbs, the plain form is exactly what this app has been printing as the headword.' },
      { type: 'grammar', id: 'g:plain' },
      { type: 'text', body: 'The mapping runs both ways, and it is worth being able to go from ます back to plain as fluently as forwards.' },
      { type: 'conjugation', ids: ['v:taberu', 'v:miru', 'v:iku', 'v:nomu', 'v:hanasu', 'v:kau', 'v:matsu', 'v:kaeru', 'v:oyogu', 'v:suru', 'v:kuru'], show: ['masu', 'plain'] },
      { type: 'tip', title: 'Why this is a gateway, not a register switch', body: 'It would be easy to file the plain form under "casual" and move on. That would be wrong. と思います, ことができます, and any clause that describes a noun **all require the plain form** — including in the stiffest business Japanese there is. Casual speech is only one of its four jobs, and the next four lessons take the others.' },
      { type: 'tip', title: 'The う-verb shift', body: 'The ます-form ends on the い-row: 行き, 飲み, 話し, 買い. The plain form pushes each back to the う-row of the same consonant: 行く, 飲む, 話す, 買う. If you learned the あいうえお order properly in Stage 0, this costs you nothing.' },
    ],
  },
  {
    id: 'l:49', stage: 3, unit: 12, title: 'Casual speech',
    subtitle: 'The plain form as register',
    concepts: ['g:casual', 'v:un', 'v:uun'],
    blocks: [
      { type: 'grammar', id: 'g:casual' },
      { type: 'sentences', ids: ['s:165', 's:166', 's:167'] },
      { type: 'text', body: 'Questions and negatives work the same way — nothing is added, things are taken away.' },
      { type: 'sentences', ids: ['s:168', 's:169'] },
      { type: 'vocab', ids: ['v:un', 'v:uun'] },
      { type: 'tip', title: 'Who drops first', body: 'Register is negotiated, not chosen unilaterally. The older person, the senior person or the host drops into casual first, and you follow. Starting casual yourself with someone you have just met is the mistake that actually causes offence — the reverse, staying polite too long, is merely a little distant.' },
      { type: 'tip', title: 'うん and ううん are one beat apart', body: 'うん is yes, ううん is no, and the only difference is length. Say them aloud until the contrast is automatic — mishearing this one in conversation is genuinely confusing.' },
    ],
  },
  {
    id: 'l:50', stage: 3, unit: 12, title: '〜と思います',
    subtitle: 'The third job of と — quotation',
    concepts: ['g:toomou', 'v:omou', 'v:ame'],
    blocks: [
      { type: 'text', body: 'You met と joining nouns and naming who you were with. Its third job is to close a quotation — and a thought counts as one.' },
      { type: 'grammar', id: 'g:toomou' },
      { type: 'sentences', ids: ['s:171', 's:172', 's:173'] },
      { type: 'text', body: 'When the quoted part ends in a noun or な-adjective, です becomes its plain form **だ**.' },
      { type: 'sentences', ids: ['s:170'] },
      { type: 'vocab', ids: ['v:omou', 'v:ame'] },
      { type: 'tip', title: 'Japanese hedges more than English', body: 'と思います appears constantly — in situations where an English speaker would simply state the fact. Leaving it off does not make you sound confident; it makes you sound like you are announcing rather than conversing.' },
    ],
  },
  {
    id: 'l:51', stage: 3, unit: 13, title: '〜ことができます',
    subtitle: 'Saying what you can do',
    concepts: ['g:dekiru'],
    blocks: [
      { type: 'grammar', id: 'g:dekiru' },
      { type: 'text', body: 'こと is a noun meaning "thing" in the abstract sense — a fact, an act, a matter. Put a plain-form verb in front of it and the verb becomes a thing that can be talked about.' },
      { type: 'sentences', ids: ['s:174', 's:175', 's:176'] },
      { type: 'tip', title: 'There is a shorter way, and you will hear it more', body: 'Japanese also has a potential form — 話せます, 泳げます, 食べられます — which is what people actually say most of the time. It has its own conjugation rules and comes later. ことができます is longer but always correct, and it gets you speaking now.' },
    ],
  },
  {
    id: 'l:52', stage: 3, unit: 13, title: 'Clauses that describe a noun',
    subtitle: 'The biggest structural difference from English',
    concepts: ['g:relative', 'v:kotoba'],
    blocks: [
      { type: 'text', body: 'English builds descriptions with a relative pronoun and hangs them off the back of the noun: "the person **who** speaks Japanese". Japanese does neither. The whole description goes in **front** of the noun, and nothing joins them.' },
      { type: 'grammar', id: 'g:relative' },
      { type: 'sentences', ids: ['s:177', 's:178'] },
      { type: 'text', body: 'The clause can be as long as you like, and it can contain its own particles and verbs.' },
      { type: 'sentences', ids: ['s:179', 's:180'] },
      { type: 'vocab', ids: ['v:kotoba'] },
      { type: 'tip', title: 'は becomes が inside the clause', body: '兄**が**住んでいる町. は marks the topic of a whole sentence, and a describing clause is not a sentence — it is a lump of description. This swap is one of the most reliable tells of a learner who has understood the structure.' },
      { type: 'tip', title: 'Read right to left', body: 'When a Japanese sentence stops making sense, find the noun at the end of the tangle and read backwards. 昨日買った本 is "book" ← "bought yesterday". Everything in front of a noun is describing it.' },
    ],
  },
  {
    id: 'l:53', stage: 3, unit: 13, title: 'The ない-form',
    subtitle: 'Plain negatives, and asking someone not to',
    concepts: ['g:nai'],
    blocks: [
      { type: 'grammar', id: 'g:nai' },
      { type: 'text', body: 'The shift mirrors the ます-form you already know: where ます pushed the final syllable to the い-row, ない pushes it to the あ-row.' },
      { type: 'conjugation', ids: ['v:taberu', 'v:miru', 'v:nomu', 'v:iku', 'v:kau', 'v:hairu', 'v:hanasu', 'v:suru', 'v:kuru', 'v:aru'], show: ['plain', 'nai'] },
      { type: 'tip', title: 'う becomes わ, not あ', body: '買う → 買**わ**ない, 会う → 会わない, 使う → 使わない. This is a fossil: these verbs ended in an older /w/ sound that survives today only in this one form.' },
      { type: 'text', body: 'Add でください and you can ask someone politely not to do something — much softer than the てはいけません from Stage 2, and far more common in real life.' },
      { type: 'sentences', ids: ['s:182', 's:183', 's:184'] },
      { type: 'text', body: 'And in casual speech the ない-form simply ends the sentence.' },
      { type: 'sentences', ids: ['s:181', 's:185'] },
      { type: 'tip', title: 'What comes next', body: 'The plain **past** (食べた, 行った — the て-form with た instead of て) completes the set, and after that the potential form, 〜たり〜たり for listing activities, giving and receiving, and conditionals. You now have every gateway a beginner needs: ます, て, plain, and ない.' },
    ],
  },

];

export const LESSONS_BY_ID = Object.fromEntries(LESSONS.map(l => [l.id, l]));

/** The next lesson that has not been completed. */
export function nextLesson(completed) {
  return LESSONS.find(l => !completed[l.id]) || null;
}
