// Beginner kanji, taught through the vocabulary that uses them rather than as isolated reading lists.
// Readings are given in the conventional notation: on'yomi in katakana, kun'yomi in hiragana,
// with okurigana (the part written in kana) after a dot.

export const KANJI = [
  { id:'k:一', char:'一', meanings:['one'], on:['イチ','イツ'], kun:['ひと.つ'], strokes:1, vocab:['v:ichi','v:issho'], note:'One horizontal stroke. 一緒に (いっしょに) shows the reading shifting under compounding.' },
  { id:'k:二', char:'二', meanings:['two'], on:['ニ'], kun:['ふた.つ'], strokes:2, vocab:['v:ni'] },
  { id:'k:三', char:'三', meanings:['three'], on:['サン'], kun:['み','みっ.つ'], strokes:3, vocab:['v:san'] },
  { id:'k:四', char:'四', meanings:['four'], on:['シ'], kun:['よ','よん','よっ.つ'], strokes:5, vocab:['v:yon'], note:'Usually counted as よん — し is avoided because it is a homophone of 死 (death).' },
  { id:'k:五', char:'五', meanings:['five'], on:['ゴ'], kun:['いつ.つ'], strokes:4, vocab:['v:go'] },
  { id:'k:六', char:'六', meanings:['six'], on:['ロク'], kun:['むっ.つ'], strokes:4, vocab:['v:roku'] },
  { id:'k:七', char:'七', meanings:['seven'], on:['シチ'], kun:['なな','なな.つ'], strokes:2, vocab:['v:nana'] },
  { id:'k:八', char:'八', meanings:['eight'], on:['ハチ'], kun:['やっ.つ'], strokes:2, vocab:['v:hachi'] },
  { id:'k:九', char:'九', meanings:['nine'], on:['キュウ','ク'], kun:['ここの.つ'], strokes:2, vocab:['v:kyuu'] },
  { id:'k:十', char:'十', meanings:['ten'], on:['ジュウ','ジッ'], kun:['とお'], strokes:2, vocab:['v:juu'] },

  { id:'k:日', char:'日', meanings:['day','sun'], on:['ニチ','ジツ'], kun:['ひ','か'], strokes:4, vocab:['v:kyou','v:ashita','v:kinou','v:mainichi','v:nihon','v:nichiyoubi'], note:'The single most common kanji in Japanese. Its reading changes constantly by compound — learn it inside words, never as a list.' },
  { id:'k:月', char:'月', meanings:['moon','month'], on:['ゲツ','ガツ'], kun:['つき'], strokes:4, vocab:['v:getsuyoubi'], note:'月曜日 (Monday) is literally "moon day". The Japanese weekday names run through the sun, moon and five classical planets; English kept that pattern only for Sunday, Monday and Saturday and swapped Germanic gods in for the rest.' },
  { id:'k:火', char:'火', meanings:['fire'], on:['カ'], kun:['ひ'], strokes:4, vocab:[], note:'火曜日 = Tuesday (Mars day).' },
  { id:'k:水', char:'水', meanings:['water'], on:['スイ'], kun:['みず'], strokes:4, vocab:['v:mizu'], note:'水曜日 = Wednesday (Mercury day).' },
  { id:'k:木', char:'木', meanings:['tree','wood'], on:['モク','ボク'], kun:['き'], strokes:4, vocab:[], note:'木曜日 = Thursday (Jupiter day).' },
  { id:'k:金', char:'金', meanings:['gold','money','metal'], on:['キン','コン'], kun:['かね'], strokes:8, vocab:['v:okane'], note:'金曜日 = Friday (Venus day).' },
  { id:'k:土', char:'土', meanings:['earth','soil'], on:['ド','ト'], kun:['つち'], strokes:3, vocab:['v:doyoubi'], note:'土曜日 = Saturday (Saturn day).' },

  { id:'k:人', char:'人', meanings:['person'], on:['ジン','ニン'], kun:['ひと'], strokes:2, vocab:['v:hito','v:otokonohito','v:onnanohito'], note:'Nationalities use it: 日本人 (にほんじん) = Japanese person.' },
  { id:'k:大', char:'大', meanings:['big','large'], on:['ダイ','タイ'], kun:['おお.きい'], strokes:3, vocab:['v:ookii'] },
  { id:'k:小', char:'小', meanings:['small'], on:['ショウ'], kun:['ちい.さい','こ','お'], strokes:3, vocab:['v:chiisai'] },
  { id:'k:中', char:'中', meanings:['middle','inside'], on:['チュウ'], kun:['なか'], strokes:4, vocab:[], note:'中国 (ちゅうごく) = China, literally "middle country".' },
  { id:'k:上', char:'上', meanings:['up','above'], on:['ジョウ'], kun:['うえ','あ.がる','のぼ.る'], strokes:3, vocab:[] },
  { id:'k:下', char:'下', meanings:['down','below'], on:['カ','ゲ'], kun:['した','さ.がる','くだ.さる'], strokes:3, vocab:[], note:'下さる is the source of ください. Modern convention writes 下さい when it means "please give me X", and plain kana ください when it attaches to a verb.' },
  { id:'k:山', char:'山', meanings:['mountain'], on:['サン'], kun:['やま'], strokes:3, vocab:[], note:'富士山 is ふじさん — the on’yomi, not やま.' },
  { id:'k:川', char:'川', meanings:['river'], on:['セン'], kun:['かわ'], strokes:3, vocab:[] },
  { id:'k:本', char:'本', meanings:['book','origin','main'], on:['ホン'], kun:['もと'], strokes:5, vocab:['v:hon','v:nihon'], note:'日本 = "sun origin" — where the sun comes from. Also a counter for long thin objects.' },
];

export const KANJI_BY_ID = Object.fromEntries(KANJI.map(k => [k.id, k]));
export const KANJI_BY_CHAR = Object.fromEntries(KANJI.map(k => [k.char, k]));
