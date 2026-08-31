// Foundational grammar. Each point carries a plain-language explanation, the pattern,
// and the mistakes English speakers actually make — not a formal linguistics description.

export const GRAMMAR = [
  { id:'g:desu', title:'X は Y です', gloss:'X is Y', pattern:'[topic] は [noun] です',
    explain:'です is the polite way of saying "is". は marks what you are talking about — the topic — and is pronounced **wa** here, not ha. The predicate always comes last in Japanese, so the thing being said about the topic arrives at the end of the sentence.',
    examples:['s:001','s:002','s:003'],
    pitfalls:'After a noun, です is the copula and carries tense and negation: 学生でした, 学生じゃない. After an い-adjective it is only politeness, which is why 高いでした is wrong while 学生でした is fine.' },

  { id:'g:janai', title:'じゃないです', gloss:'is not', pattern:'[noun] じゃないです',
    explain:'The negative of です. じゃないです is the everyday polite form; ではありません is more formal and more common in writing.',
    examples:['s:004','s:005'], pitfalls:'じゃありません is also correct and sits between the two in formality.' },

  { id:'g:ka', title:'か — questions', gloss:'turns a statement into a question', pattern:'[sentence] か',
    explain:'Add か to the end. Word order does not change, and in writing a question mark is optional — か is doing that job.',
    examples:['s:006','s:007'], pitfalls:'In speech, casual questions often drop か and just use rising intonation: 学生？' },

  { id:'g:no', title:'の — possession and connection', gloss:'’s / of', pattern:'[A] の [B]',
    explain:'A modifies B. Usually possession (私の本 = my book), but it also connects any two nouns: 日本の車, 大学の先生.',
    examples:['s:008','s:009'], pitfalls:'The order matches English “Tanaka’s book” exactly — owner first. It is only reversed against the *of* pattern, “the book of Tanaka”.' },

  { id:'g:mo', title:'も — also', gloss:'too, also', pattern:'[noun] も',
    explain:'も replaces は, が **and** を — it never stacks with them. 私も学生です, never 私はも. ラーメンも食べます, never ラーメンをも.',
    examples:['s:010','s:011'], pitfalls:'It does stack with the other particles: 日本にも行きます, ここでも使えます, 友達とも話します. Only は, が and を get displaced.' },

  { id:'g:kore', title:'これ・それ・あれ', gloss:'this / that / that over there', pattern:'これ は [noun] です',
    explain:'Japanese splits "that" in two: それ is near the listener, あれ is away from both of you. これ is near you.',
    examples:['s:012','s:013','s:014'], pitfalls:'These stand alone as pronouns. To attach them to a noun you need この／その／あの.' },

  { id:'g:kono', title:'この・その・あの', gloss:'this ~ / that ~', pattern:'この [noun]',
    explain:'Same three-way distance system, but these attach to a noun: この本 = this book.',
    examples:['s:015','s:016'], pitfalls:'これ本 is wrong. これ is a pronoun; この needs a noun after it.' },

  { id:'g:koko', title:'ここ・そこ・あそこ', gloss:'here / there / over there', pattern:'[place] は ここ です',
    explain:'The same distance logic applied to places.',
    examples:['s:017','s:018'] },

  { id:'g:masu', title:'ます — polite verbs', gloss:'present and future, polite', pattern:'[verb stem] ます',
    explain:'The ます form is polite **non-past** — it covers both present and future, and Japanese does not separate them. 行きます can be "I go" or "I will go"; context decides.',
    examples:['s:019','s:020','s:021'],
    pitfalls:'Two traps. There is no separate future tense to hunt for — and ます is not progressive either: 今食べます is not "I am eating now" (that is 食べています, which comes with the て-form).' },

  { id:'g:masen', title:'ません — polite negative', gloss:'do not / will not', pattern:'[verb stem] ません',
    explain:'Swap ます for ません.',
    examples:['s:022','s:023'] },

  { id:'g:wo', title:'を — the object particle', gloss:'marks what the verb acts on', pattern:'[object] を [verb]',
    explain:'Marks the thing being eaten, read, bought, watched. Written を but pronounced **o** — this is the only job this kana has.',
    examples:['s:024','s:025','s:026'],
    pitfalls:'Some English transitive verbs take が in Japanese: 分かる and 好き both do.' },

  { id:'g:ni_he', title:'に・へ — destination', gloss:'to', pattern:'[place] に 行きます',
    explain:'Both mark where you are going. に is the default and is also used for arrival points and times; へ emphasises the direction of travel and is written へ but pronounced **e**.',
    examples:['s:027','s:028','s:029'],
    pitfalls:'For time, the test is not how specific the word is — it is whether the time is fixed by the clock or calendar, or anchored to "now". Clock and calendar times take に: 七時に, 月曜日に, 三月に, 週末に. Times measured from the present moment take nothing at all: 今日, 明日, 昨日, 毎日, 来週. 明日に行きます is wrong even though 明日 is perfectly specific.' },

  { id:'g:de', title:'で — where the action happens', gloss:'at, in, by means of', pattern:'[place] で [verb]',
    explain:'で marks where an action takes place, and also the means: バスで行きます. に marks existence and destination; で marks activity.',
    examples:['s:030','s:031','s:032'],
    pitfalls:'家にいます (I am at home — existence) vs 家で食べます (I eat at home — action). This pair is the classic particle mistake.' },

  { id:'g:iadj', title:'い-adjectives', gloss:'describing things', pattern:'[i-adj] [noun] / [noun] は [i-adj] です',
    explain:'These end in い and conjugate themselves. The negative drops the い and adds くない: 高い → 高くないです.',
    examples:['s:033','s:034','s:035'],
    pitfalls:'Never 高いじゃないです. And いい is irregular — よくないです.' },

  { id:'g:naadj', title:'な-adjectives', gloss:'describing things', pattern:'[na-adj] な [noun] / [noun] は [na-adj] です',
    explain:'These behave like nouns. They need な before a noun (静かな部屋) and negate like nouns (静かじゃないです).',
    examples:['s:036','s:037'],
    pitfalls:'きれい and 有名 end in い but are な-adjectives. The ending is not a reliable test — you learn which is which.' },

  { id:'g:aruiru', title:'ある・いる — existence', gloss:'there is / to have', pattern:'[place] に [thing] が あります',
    explain:'ある for inanimate things, いる for people and animals. The thing that exists is marked with が.',
    examples:['s:038','s:039','s:040'],
    pitfalls:'Choosing by animacy, not by grammar. A car uses ある even though it moves; a cat uses いる.' },

  { id:'g:suki', title:'好き — liking things', gloss:'to like', pattern:'[thing] が 好きです',
    explain:'好き is an adjective, not a verb, so the thing you like takes が: 音楽が好きです — literally "music is liked".',
    examples:['s:041','s:042'],
    pitfalls:'音楽を好きです is wrong. 嫌い, 上手 and 下手 are な-adjectives that work identically. 分かる takes が too, but for a different reason — it is a verb describing a state rather than an action you perform on something.' },

  { id:'g:mashita', title:'ました・ませんでした', gloss:'polite past', pattern:'[verb stem] ました',
    explain:'ます → ました for the past, ません → ませんでした for the past negative.',
    examples:['s:043','s:044','s:045'] },

  // ── The て-form and what it unlocks ───────────────────────────────────────
  { id:'g:te', title:'The て-form — る-verbs and irregulars', gloss:'the connector form of a verb', pattern:'[る-verb] − る + て',
    explain:'The て-form is not a tense — it is a **connector**. On its own it means nothing; attached to something else it becomes requests, permission, prohibition, actions in progress and joined sentences. Learning it is the single biggest step in beginner Japanese, because half a dozen structures wait on the other side of it.\n\nThe easy half first. **る-verbs**: drop る, add て — 食べる → 食べて, 見る → 見て. **The two irregulars**: する → して, 来る → 来て (read きて).',
    examples:['s:147','s:148','s:117'],
    pitfalls:'These two verbs are the whole of Group 3 — Japanese has only two irregular verb *groups*, which is why textbooks make so much of it. (A handful of other verbs are irregular in one specific form: ある has the negative ない, and 行く has an irregular て-form you will meet next lesson.)' },

  { id:'g:te_u', title:'The て-form — う-verbs', gloss:'five endings and one exception', pattern:'[う-verb] → って / んで / いて / いで / して',
    explain:'For う-verbs the dictionary-form ending decides the て-form ending. There are five patterns and they are worth memorising as a block:\n\n**う・つ・る → って**　·　**む・ぶ・ぬ → んで**　·　**く → いて**　·　**ぐ → いで**　·　**す → して**',
    examples:['s:113', 's:111', 's:116'],
    pitfalls:'One exception matters: 行く becomes **行って**, not 行いて. It is the only common く-verb that breaks the rule, and it is a very frequent verb. Watch out too for 帰る and 入る — they end in える／いる but are う-verbs: 帰って, 入って.' },

  { id:'g:tekudasai', title:'〜てください', gloss:'please do ~', pattern:'[て-form] ください',
    explain:'The workhorse request. Polite and neutral — fine with strangers, shopkeepers and colleagues.',
    examples:['s:147','s:148','s:117'],
    pitfalls:'It is a directive, not a plea — a doctor uses it with patients, a teacher with students. That also means it does not point *upward*: asking a boss or a customer for a favour wants 〜ていただけますか instead. To ask for an *object* rather than an action, use を ください: 水をください.' },

  { id:'g:teimasu', title:'〜ています', gloss:'is doing ~ / is in the state of ~', pattern:'[て-form] います',
    explain:'Two jobs. First, an action in progress right now: 今食べています — "I am eating." Second, an ongoing situation rather than a momentary act — 住んでいます "I live (there)", 働いています "I work (there)". A small group of verbs describe an instant change and use ています for the state it left behind: 結婚しています "I am married", 知っています "I know".',
    examples:['s:118','s:119','s:122'],
    pitfalls:'This is the form English speakers keep reaching for and not finding. 食べます is not "I am eating" — it is "I eat" or "I will eat". If the action is in progress, you need ています.' },

  { id:'g:temoii', title:'〜てもいいですか', gloss:'may I ~?', pattern:'[て-form] も いいです か',
    explain:'Literally "even if I do X, is it good?" — which is how Japanese asks permission. Drop the か and it grants permission instead: 食べてもいいです, "you may eat".',
    examples:['s:125','s:126','s:130'],
    pitfalls:'はい、どうぞ is the warmest way to say yes. Beware the opposite trap: a bare いいです or 結構です, with no はい in front, is how Japanese politely **declines** an offer — 「袋いりますか」「いいです」means "no thanks", not "yes please".' },

  { id:'g:tewaikemasen', title:'〜てはいけません', gloss:'must not ~', pattern:'[て-form] は いけません',
    explain:'A firm prohibition — rules, instructions, an adult to a child. It is the direct opposite of 〜てもいいです.',
    examples:['s:131','s:132','s:134'],
    pitfalls:'Strong enough that using it on someone your own age sounds high-handed. Between friends it contracts: て-forms become 〜ちゃだめ and で-forms become 〜じゃだめ — 飲んではいけません → 飲んじゃだめ, never 飲んちゃだめ. Real signage rarely uses this form at all; it prefers 〜ないでください or a bare 禁止 (立入禁止, 撮影禁止).' },

  { id:'g:teconnect', title:'Connecting actions with て', gloss:'do X, then Y', pattern:'[て-form]、[next clause]',
    explain:'End every clause but the last in て, and let the final verb carry the tense for all of them. 朝起きて、朝ご飯を食べます — "I get up and eat breakfast." Change the last verb to past and the whole sequence becomes past.',
    examples:['s:136','s:139','s:143'],
    pitfalls:'Only the last verb takes the tense. 起きました、食べました strings two finished sentences together; 起きて、食べました is one event in sequence — which is what English "I got up and ate" actually means.' },

  // ── connectors and counting ───────────────────────────────────────────────
  { id:'g:to', title:'と — and, with', gloss:'joins nouns, or names who you did it with', pattern:'[noun] と [noun]　·　[person] と [verb]',
    explain:'Two uses, and they feel like one idea: と puts two things side by side.\n\n**Joining nouns** — 卵と野菜 "eggs and vegetables". Unlike English "and", it joins *nouns only*, and it implies the list is complete.\n\n**Doing something with someone** — 友達と食べます "I eat with a friend". The person comes first, then と, then the verb.',
    examples:['s:104','s:107','s:153'],
    pitfalls:'と cannot join sentences or verbs. "I ate and went home" is the て-form (食べて、帰りました), never 食べたと. For an open-ended list — "coffee, tea, that sort of thing" — Japanese uses や instead, which implies there is more you did not mention.' },

  { id:'g:counters', title:'Counting things', gloss:'numbers need a counter word', pattern:'[number] + [counter]',
    explain:'You cannot say "three" and stop. Japanese attaches a **counter** chosen for the shape or kind of thing: 三人 three people, 三枚 three sheets, 三本 three bottles, 三台 three machines.\n\nEnglish does this in a small way — "two *slices* of bread", "three *head* of cattle" — but Japanese does it for everything, and the number and counter often fuse into a sound neither of them has alone: 一分 is いっぷん, not いちふん.',
    examples:['s:070','s:074','s:154'],
    pitfalls:'When you cannot remember the right counter, use つ — ひとつ, ふたつ, みっつ. It is the general-purpose fallback for objects and nobody will blink. It only goes up to ten, and it never counts people: that is always 人.' },

  // ── the plain form and what it unlocks ────────────────────────────────────
  { id:'g:plain', title:'The plain (dictionary) form', gloss:'the base form of a verb', pattern:'食べます ↔ 食べる　·　行きます ↔ 行く',
    explain:'Every verb you have learned has been in its ます-form. The **plain form** is the same verb with the politeness stripped out — and it is the form dictionaries list, which is why it is also called the dictionary form.\n\n**る-verbs**: ます → る. 食べます → 食べる.\n**う-verbs**: the い-row syllable shifts back to the う-row. 行きます → 行く, 飲みます → 飲む, 話します → 話す, 買います → 買う.\n**Irregulars**: します → する, 来ます(きます) → 来る(くる).',
    examples:['s:165','s:166','s:174'],
    pitfalls:'Plain is not "slang" and polite is not "correct". Plain is the **base** form: it is what goes before と思います, before ことができます, and inside a clause modifying a noun — including in the most formal writing imaginable. Register is only one of its jobs.' },

  { id:'g:casual', title:'Casual speech', gloss:'plain form as register', pattern:'[plain form] (?)',
    explain:'Between friends, family and people your own age, sentences simply end in the plain form. Questions drop か and rise in pitch instead: 明日行く？ — "going tomorrow?". です disappears too: これ、おいしい rather than これはおいしいです.',
    examples:['s:165','s:166','s:168'],
    pitfalls:'Getting this wrong downward is far worse than upward. Casual with a stranger, a shopkeeper or anyone older reads as rude; polite with a close friend reads as cold or sarcastic, which is awkward but survivable. When unsure, stay polite and let the other person drop first.' },

  { id:'g:toomou', title:'〜と思います', gloss:'I think that ~', pattern:'[plain clause] と 思います',
    explain:'This is the third job of と: **quotation**. It marks the end of a thought or something said, and what comes before it is always in the plain form — even when the sentence itself is polite.',
    examples:['s:170','s:171','s:173'],
    pitfalls:'The clause before と never takes ます. 難しいですと思います is wrong; it is 難しいと思います. Note too that Japanese uses this far more than English uses "I think" — asserting a bare opinion without it can sound blunt.' },

  { id:'g:dekiru', title:'〜ことができます', gloss:'can do ~ / is able to', pattern:'[plain form] こと が できます',
    explain:'こと turns a verb into a thing — "the act of speaking Japanese" — and できます says that thing is possible. 日本語を話すことができます: "I can speak Japanese."',
    examples:['s:174','s:175','s:176'],
    pitfalls:'The verb before こと must be plain: 話すこと, never 話しますこと. There is a shorter potential form (話せます) that native speakers use more often in conversation; this longer pattern is clearer while you are learning and is never wrong.' },

  { id:'g:relative', title:'Clauses that describe a noun', gloss:'the ~ that ~', pattern:'[plain clause] [noun]',
    explain:'English needs a relative pronoun — "the person **who** speaks Japanese". Japanese needs nothing at all: the clause goes straight in front of the noun, with its verb in the plain form. 日本語を話す人.\n\nThis is the single biggest structural difference from English, and it is why Japanese sentences can feel back-to-front: the description arrives before the thing it describes.',
    examples:['s:177','s:178','s:179'],
    pitfalls:'Inside the clause, は is normally replaced by が: 兄**が**住んでいる町. は marks the topic of the whole sentence, and a modifying clause is not a sentence.' },

  { id:'g:nai', title:'The ない-form and 〜ないでください', gloss:'plain negative, and please don’t', pattern:'[ない-form] で ください',
    explain:'The plain negative. **る-verbs** drop る and add ない: 食べる → 食べない. **う-verbs** shift the final syllable to the あ-row: 飲む → 飲まない, 行く → 行かない — with う becoming **わ**, not あ: 買う → 買わない. **Irregulars**: する → しない, 来る → 来ない (こない).\n\nAdd でください and you have a polite negative request: 写真を撮らないでください.',
    examples:['s:181','s:182','s:183'],
    pitfalls:'ある is suppletive — its negative is simply **ない**, never あらない. And 〜ないでください is much softer than 〜てはいけません: it asks, where the other forbids, which is why signage and staff use it far more often.' },
];

export const GRAMMAR_BY_ID = Object.fromEntries(GRAMMAR.map(g => [g.id, g]));
