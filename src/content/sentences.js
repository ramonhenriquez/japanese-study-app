// Controlled example sentences written for this app: level-appropriate, natural modern Japanese.
// Sentences are built from curriculum vocabulary and grammar, with a small number of set phrases
// (ください, counters, と) presented as memorised chunks before they are taught as grammar.
// Every sentence carries a full kana reading, so nothing depends on knowing a kanji.
// `parts` splits the sentence into chunks for the sentence-building exercise. Joined, they equal
// `jp` without its final 。 or ？ — the builder supplies the closing punctuation, so it is never a
// draggable chunk.
// register: 'polite' (です・ます) | 'casual' | null

export const SENTENCES = [
  // g:desu
  { id:'s:001', jp:'私は学生です。', reading:'わたしはがくせいです。', en:'I am a student.', parts:['私は','学生','です'], grammar:['g:desu'], vocab:['v:watashi','v:gakusei'], register:'polite' },
  { id:'s:002', jp:'田中さんは先生です。', reading:'たなかさんはせんせいです。', en:'Tanaka is a teacher.', parts:['田中さんは','先生','です'], grammar:['g:desu'], vocab:['v:sensei'], register:'polite' },
  { id:'s:003', jp:'これは本です。', reading:'これはほんです。', en:'This is a book.', parts:['これは','本','です'], grammar:['g:desu','g:kore'], vocab:['v:kore','v:hon'], register:'polite' },
  // g:janai
  { id:'s:004', jp:'私は先生じゃないです。', reading:'わたしはせんせいじゃないです。', en:'I am not a teacher.', parts:['私は','先生','じゃないです'], grammar:['g:janai','g:desu'], vocab:['v:watashi','v:sensei'], register:'polite' },
  { id:'s:005', jp:'それは私のかばんじゃないです。', reading:'それはわたしのかばんじゃないです。', en:'That is not my bag.', parts:['それは','私の','かばん','じゃないです'], grammar:['g:janai','g:no','g:desu'], vocab:['v:sore','v:kaban'], register:'polite' },
  // g:ka
  { id:'s:006', jp:'田中さんは学生ですか。', reading:'たなかさんはがくせいですか。', en:'Is Tanaka a student?', parts:['田中さんは','学生','ですか'], grammar:['g:ka','g:desu'], vocab:['v:gakusei'], register:'polite', note:'Japanese asks with the person’s name, not あなた. Pointing あなた at the person you are talking to sounds distant or presumptuous.' },
  { id:'s:007', jp:'これは何ですか。', reading:'これはなんですか。', en:'What is this?', parts:['これは','何','ですか'], grammar:['g:ka','g:desu'], vocab:['v:kore','v:nani'], register:'polite', note:'何 is read なん before です.' },
  // g:no
  { id:'s:008', jp:'これは私の本です。', reading:'これはわたしのほんです。', en:'This is my book.', parts:['これは','私の','本','です'], grammar:['g:no','g:desu'], vocab:['v:watashi','v:hon'], register:'polite' },
  { id:'s:009', jp:'日本の車は高いです。', reading:'にほんのくるまはたかいです。', en:'Japanese cars are expensive.', parts:['日本の','車は','高い','です'], grammar:['g:no','g:iadj','g:desu'], vocab:['v:nihon','v:kuruma','v:takai'], register:'polite' },
  // g:mo
  { id:'s:010', jp:'私も学生です。', reading:'わたしもがくせいです。', en:'I am a student too.', parts:['私も','学生','です'], grammar:['g:mo'], vocab:['v:watashi','v:gakusei'], register:'polite' },
  { id:'s:011', jp:'水もお茶もあります。', reading:'みずもおちゃもあります。', en:'We have both water and tea.', parts:['水も','お茶も','あります'], grammar:['g:mo','g:aruiru','g:masu'], vocab:['v:mizu','v:ocha','v:aru'], register:'polite' },
  // g:kore
  { id:'s:012', jp:'それは時計です。', reading:'それはとけいです。', en:'That is a watch.', parts:['それは','時計','です'], grammar:['g:kore','g:desu'], vocab:['v:sore','v:tokei'], register:'polite' },
  { id:'s:013', jp:'あれは私の車です。', reading:'あれはわたしのくるまです。', en:'That over there is my car.', parts:['あれは','私の','車','です'], grammar:['g:kore','g:no','g:desu'], vocab:['v:are','v:kuruma'], register:'polite' },
  { id:'s:014', jp:'これはコーヒーですか。', reading:'これはコーヒーですか。', en:'Is this coffee?', parts:['これは','コーヒー','ですか'], grammar:['g:kore','g:ka','g:desu'], vocab:['v:kore','v:koohii'], register:'polite' },
  // g:kono
  { id:'s:015', jp:'この本は面白いです。', reading:'このほんはおもしろいです。', en:'This book is interesting.', parts:['この','本は','面白い','です'], grammar:['g:kono','g:iadj','g:desu'], vocab:['v:hon'], register:'polite' },
  { id:'s:016', jp:'あの人は誰ですか。', reading:'あのひとはだれですか。', en:'Who is that person?', parts:['あの','人は','誰','ですか'], grammar:['g:kono','g:ka','g:desu'], vocab:['v:hito','v:dare'], register:'polite' },
  // g:koko
  { id:'s:017', jp:'駅はどこですか。', reading:'えきはどこですか。', en:'Where is the station?', parts:['駅は','どこ','ですか'], grammar:['g:koko','g:ka','g:desu'], vocab:['v:eki','v:doko'], register:'polite' },
  { id:'s:018', jp:'トイレはあそこです。', reading:'トイレはあそこです。', en:'The toilet is over there.', parts:['トイレは','あそこ','です'], grammar:['g:koko'], vocab:['v:asoko'], register:'polite' },
  // g:masu
  { id:'s:019', jp:'毎日日本語を勉強します。', reading:'まいにちにほんごをべんきょうします。', en:'I study Japanese every day.', parts:['毎日','日本語を','勉強します'], grammar:['g:masu','g:wo'], vocab:['v:mainichi','v:benkyou'], register:'polite' },
  { id:'s:020', jp:'明日学校に行きます。', reading:'あしたがっこうにいきます。', en:'I will go to school tomorrow.', parts:['明日','学校に','行きます'], grammar:['g:masu','g:ni_he'], vocab:['v:ashita','v:gakkou','v:iku'], register:'polite' },
  { id:'s:021', jp:'朝六時に起きます。', reading:'あさろくじにおきます。', en:'I get up at six in the morning.', parts:['朝','六時に','起きます'], grammar:['g:masu','g:ni_he','g:counters'], vocab:['v:asa','v:okiru','v:roku'], register:'polite' },
  // g:masen
  { id:'s:022', jp:'お酒は飲みません。', reading:'おさけはのみません。', en:'I don’t drink alcohol.', parts:['お酒は','飲みません'], grammar:['g:masen','g:desu'], vocab:['v:nomu'], register:'polite' },
  { id:'s:023', jp:'今日は働きません。', reading:'きょうははたらきません。', en:'I’m not working today.', parts:['今日は','働きません'], grammar:['g:masen','g:desu'], vocab:['v:kyou','v:hataraku'], register:'polite' },
  // g:wo
  { id:'s:024', jp:'ご飯を食べます。', reading:'ごはんをたべます。', en:'I eat a meal.', parts:['ご飯を','食べます'], grammar:['g:wo','g:masu'], vocab:['v:gohan','v:taberu'], register:'polite' },
  { id:'s:025', jp:'本を読みます。', reading:'ほんをよみます。', en:'I read a book.', parts:['本を','読みます'], grammar:['g:wo','g:masu'], vocab:['v:hon','v:yomu'], register:'polite' },
  { id:'s:026', jp:'テレビを見ますか。', reading:'テレビをみますか。', en:'Do you watch television?', parts:['テレビを','見ますか'], grammar:['g:wo','g:ka','g:masu'], vocab:['v:terebi','v:miru'], register:'polite' },
  // g:ni_he
  { id:'s:027', jp:'駅に行きます。', reading:'えきにいきます。', en:'I’m going to the station.', parts:['駅に','行きます'], grammar:['g:ni_he','g:masu'], vocab:['v:eki','v:iku'], register:'polite' },
  { id:'s:028', jp:'友達に会います。', reading:'ともだちにあいます。', en:'I’m meeting a friend.', parts:['友達に','会います'], grammar:['g:ni_he','g:masu'], vocab:['v:tomodachi','v:au'], register:'polite', note:'会う takes に, not を.' },
  { id:'s:029', jp:'来年日本へ行きます。', reading:'らいねんにほんへいきます。', en:'I’m going to Japan next year.', parts:['来年','日本へ','行きます'], grammar:['g:ni_he','g:masu'], vocab:['v:nihon','v:iku'], register:'polite', note:'へ emphasises the direction of travel. It is written へ but pronounced e.' },
  // g:de
  { id:'s:030', jp:'家で映画を見ます。', reading:'いえでえいがをみます。', en:'I watch films at home.', parts:['家で','映画を','見ます'], grammar:['g:de','g:wo','g:masu'], vocab:['v:ie','v:miru'], register:'polite' },
  { id:'s:031', jp:'バスで会社に行きます。', reading:'バスでかいしゃにいきます。', en:'I go to work by bus.', parts:['バスで','会社に','行きます'], grammar:['g:de','g:ni_he','g:masu'], vocab:['v:basu','v:kaisha','v:iku'], register:'polite' },
  { id:'s:032', jp:'レストランで昼ご飯を食べました。', reading:'レストランでひるごはんをたべました。', en:'I ate lunch at a restaurant.', parts:['レストランで','昼ご飯を','食べました'], grammar:['g:de','g:mashita','g:wo'], vocab:['v:resutoran','v:hirugohan','v:taberu'], register:'polite' },
  // g:iadj
  { id:'s:033', jp:'この店は安いです。', reading:'このみせはやすいです。', en:'This shop is cheap.', parts:['この','店は','安い','です'], grammar:['g:iadj','g:kono','g:desu'], vocab:['v:mise','v:yasui'], register:'polite' },
  { id:'s:034', jp:'今日は寒くないです。', reading:'きょうはさむくないです。', en:'It isn’t cold today.', parts:['今日は','寒くない','です'], grammar:['g:iadj','g:desu'], vocab:['v:kyou','v:samui'], register:'polite' },
  { id:'s:035', jp:'新しいパソコンを買いました。', reading:'あたらしいパソコンをかいました。', en:'I bought a new computer.', parts:['新しい','パソコンを','買いました'], grammar:['g:iadj','g:mashita','g:wo'], vocab:['v:atarashii','v:pasokon','v:kau'], register:'polite' },
  // g:naadj
  { id:'s:036', jp:'静かな部屋ですね。', reading:'しずかなへやですね。', en:'It’s a quiet room, isn’t it.', parts:['静かな','部屋','ですね'], grammar:['g:naadj'], vocab:['v:shizuka','v:heya'], register:'polite' },
  { id:'s:037', jp:'このアプリは便利じゃないです。', reading:'このアプリはべんりじゃないです。', en:'This app isn’t convenient.', parts:['この','アプリは','便利','じゃないです'], grammar:['g:naadj','g:janai'], vocab:['v:benri'], register:'polite' },
  // g:aruiru
  { id:'s:038', jp:'机の上に本があります。', reading:'つくえのうえにほんがあります。', en:'There is a book on the desk.', parts:['机の','上に','本が','あります'], grammar:['g:aruiru','g:no','g:masu','g:ni_he'], vocab:['v:tsukue','v:hon','v:aru'], register:'polite' },
  { id:'s:039', jp:'部屋に猫がいます。', reading:'へやにねこがいます。', en:'There is a cat in the room.', parts:['部屋に','猫が','います'], grammar:['g:aruiru','g:masu','g:ni_he'], vocab:['v:heya','v:iru'], register:'polite' },
  { id:'s:040', jp:'時間がありません。', reading:'じかんがありません。', en:'I don’t have time.', parts:['時間が','ありません'], grammar:['g:aruiru','g:masen'], vocab:['v:jikan','v:aru'], register:'polite' },
  // g:suki
  { id:'s:041', jp:'日本の音楽が好きです。', reading:'にほんのおんがくがすきです。', en:'I like Japanese music.', parts:['日本の','音楽が','好き','です'], grammar:['g:suki','g:no'], vocab:['v:nihon','v:suki'], register:'polite' },
  { id:'s:042', jp:'ラーメンが好きですか。', reading:'ラーメンがすきですか。', en:'Do you like ramen?', parts:['ラーメンが','好き','ですか'], grammar:['g:suki','g:ka'], vocab:['v:raamen','v:suki'], register:'polite' },
  // g:mashita
  { id:'s:043', jp:'昨日映画を見ました。', reading:'きのうえいがをみました。', en:'I watched a film yesterday.', parts:['昨日','映画を','見ました'], grammar:['g:mashita','g:wo'], vocab:['v:kinou','v:miru'], register:'polite' },
  { id:'s:044', jp:'朝ご飯を食べませんでした。', reading:'あさごはんをたべませんでした。', en:'I didn’t eat breakfast.', parts:['朝ご飯を','食べませんでした'], grammar:['g:mashita','g:masen','g:wo'], vocab:['v:asagohan','v:taberu'], register:'polite' },
  { id:'s:045', jp:'週末は何をしましたか。', reading:'しゅうまつはなにをしましたか。', en:'What did you do at the weekend?', parts:['週末は','何を','しましたか'], grammar:['g:mashita','g:ka','g:wo','g:desu'], vocab:['v:shuumatsu','v:nani','v:suru'], register:'polite' },

  // ── Additional practice sentences ────────────────────────────────────────
  { id:'s:046', jp:'はじめまして。田中です。', reading:'はじめまして。たなかです。', en:'Nice to meet you. I’m Tanaka.', parts:['はじめまして。','田中','です'], grammar:['g:desu'], vocab:['v:hajimemashite'], register:'polite' },
  { id:'s:047', jp:'お名前は何ですか。', reading:'おなまえはなんですか。', en:'What is your name?', parts:['お名前は','何','ですか'], grammar:['g:ka','g:desu'], vocab:['v:namae','v:nani'], register:'polite' },
  { id:'s:048', jp:'すみません、これをください。', reading:'すみません、これをください。', en:'Excuse me, I’ll take this please.', parts:['すみません、','これを','ください'], grammar:['g:wo','g:masen'], vocab:['v:sumimasen','v:kore'], register:'polite' },
  { id:'s:049', jp:'水をお願いします。', reading:'みずをおねがいします。', en:'Water, please.', parts:['水を','お願いします'], grammar:['g:wo','g:masu'], vocab:['v:mizu','v:onegaishimasu'], register:'polite' },
  { id:'s:050', jp:'今何時ですか。', reading:'いまなんじですか。', en:'What time is it now?', parts:['今','何時','ですか'], grammar:['g:ka','g:counters'], vocab:['v:ima'], register:'polite' },
  { id:'s:051', jp:'私は毎日コーヒーを飲みます。', reading:'わたしはまいにちコーヒーをのみます。', en:'I drink coffee every day.', parts:['私は','毎日','コーヒーを','飲みます'], grammar:['g:masu','g:wo','g:desu'], vocab:['v:mainichi','v:koohii','v:nomu'], register:'polite' },
  { id:'s:052', jp:'図書館で本を読みます。', reading:'としょかんでほんをよみます。', en:'I read books at the library.', parts:['図書館で','本を','読みます'], grammar:['g:de','g:wo','g:masu'], vocab:['v:toshokan','v:hon','v:yomu'], register:'polite' },
  { id:'s:053', jp:'日本語が少し分かります。', reading:'にほんごがすこしわかります。', en:'I understand a little Japanese.', parts:['日本語が','少し','分かります'], grammar:['g:masu'], vocab:['v:sukoshi','v:wakaru'], register:'polite', note:'分かる takes が, not を.' },
  { id:'s:054', jp:'ここでバスを待ちます。', reading:'ここでバスをまちます。', en:'I’ll wait for the bus here.', parts:['ここで','バスを','待ちます'], grammar:['g:de','g:wo','g:masu'], vocab:['v:koko','v:basu','v:matsu'], register:'polite' },
  { id:'s:055', jp:'あの店は有名です。', reading:'あのみせはゆうめいです。', en:'That shop is famous.', parts:['あの','店は','有名','です'], grammar:['g:naadj','g:kono','g:desu'], vocab:['v:mise','v:yuumei'], register:'polite' },
  { id:'s:056', jp:'この魚はとてもおいしいです。', reading:'このさかなはとてもおいしいです。', en:'This fish is really delicious.', parts:['この','魚は','とても','おいしい','です'], grammar:['g:iadj','g:kono','g:desu'], vocab:['v:sakana','v:totemo','v:oishii'], register:'polite' },
  { id:'s:057', jp:'友達は会社で働きます。', reading:'ともだちはかいしゃではたらきます。', en:'My friend works at a company.', parts:['友達は','会社で','働きます'], grammar:['g:de','g:masu','g:desu'], vocab:['v:tomodachi','v:kaisha','v:hataraku'], register:'polite' },
  { id:'s:058', jp:'週末は友達に会います。', reading:'しゅうまつはともだちにあいます。', en:'I’m meeting a friend at the weekend.', parts:['週末は','友達に','会います'], grammar:['g:ni_he','g:masu','g:desu'], vocab:['v:shuumatsu','v:tomodachi','v:au'], register:'polite' },
  { id:'s:059', jp:'この漢字は難しいです。', reading:'このかんじはむずかしいです。', en:'This kanji is difficult.', parts:['この','漢字は','難しい','です'], grammar:['g:iadj','g:kono','g:desu'], vocab:['v:muzukashii'], register:'polite' },
  { id:'s:060', jp:'明日は忙しいです。', reading:'あしたはいそがしいです。', en:'I’m busy tomorrow.', parts:['明日は','忙しい','です'], grammar:['g:iadj','g:desu'], vocab:['v:ashita','v:isogashii'], register:'polite' },
  { id:'s:061', jp:'ゲームが好きですか。', reading:'ゲームがすきですか。', en:'Do you like games?', parts:['ゲームが','好き','ですか'], grammar:['g:suki','g:ka'], vocab:['v:geemu','v:suki'], register:'polite' },
  { id:'s:062', jp:'アニメをよく見ます。', reading:'アニメをよくみます。', en:'I watch anime often.', parts:['アニメを','よく','見ます'], grammar:['g:wo','g:masu'], vocab:['v:anime','v:miru'], register:'polite' },
  { id:'s:063', jp:'パソコンを使います。', reading:'パソコンをつかいます。', en:'I use a computer.', parts:['パソコンを','使います'], grammar:['g:wo','g:masu'], vocab:['v:pasokon','v:tsukau'], register:'polite' },
  { id:'s:064', jp:'この電話は古いです。', reading:'このでんわはふるいです。', en:'This phone is old.', parts:['この','電話は','古い','です'], grammar:['g:iadj','g:kono','g:desu'], vocab:['v:denwa','v:furui'], register:'polite' },
  { id:'s:065', jp:'駅で待ちます。', reading:'えきでまちます。', en:'I’ll wait at the station.', parts:['駅で','待ちます'], grammar:['g:de','g:masu'], vocab:['v:eki','v:matsu'], register:'polite' },
  { id:'s:066', jp:'何時に帰りますか。', reading:'なんじにかえりますか。', en:'What time are you going home?', parts:['何時に','帰りますか'], grammar:['g:ni_he','g:ka','g:masu','g:counters'], vocab:['v:kaeru'], register:'polite' },
  { id:'s:067', jp:'夜十一時に寝ます。', reading:'よるじゅういちじにねます。', en:'I go to bed at eleven at night.', parts:['夜','十一時に','寝ます'], grammar:['g:ni_he','g:masu','g:counters'], vocab:['v:yoru','v:neru'], register:'polite' },
  { id:'s:068', jp:'お金がありません。', reading:'おかねがありません。', en:'I don’t have money.', parts:['お金が','ありません'], grammar:['g:aruiru','g:masen'], vocab:['v:okane','v:aru'], register:'polite' },
  { id:'s:069', jp:'車がありますか。', reading:'くるまがありますか。', en:'Do you have a car?', parts:['車が','ありますか'], grammar:['g:aruiru','g:ka','g:masu'], vocab:['v:kuruma','v:aru'], register:'polite' },
  { id:'s:070', jp:'子供が三人います。', reading:'こどもがさんにんいます。', en:'I have three children.', parts:['子供が','三人','います'], grammar:['g:aruiru','g:masu','g:counters'], vocab:['v:kodomo','v:iru','v:san'], register:'polite' },
  { id:'s:071', jp:'これは日本のお茶です。', reading:'これはにほんのおちゃです。', en:'This is Japanese tea.', parts:['これは','日本の','お茶','です'], grammar:['g:no','g:kore','g:desu'], vocab:['v:nihon','v:ocha'], register:'polite' },
  { id:'s:072', jp:'あそこにバスが来ます。', reading:'あそこにバスがきます。', en:'The bus comes over there.', parts:['あそこに','バスが','来ます'], grammar:['g:ni_he','g:masu'], vocab:['v:asoko','v:basu','v:kuru'], register:'polite', note:'ます is non-past, not progressive. For a bus arriving right now a speaker would say バスが来ましたよ.' },
  { id:'s:073', jp:'私の部屋は小さいです。', reading:'わたしのへやはちいさいです。', en:'My room is small.', parts:['私の','部屋は','小さい','です'], grammar:['g:no','g:iadj','g:desu'], vocab:['v:heya','v:chiisai'], register:'polite' },
  { id:'s:074', jp:'ビールを二つお願いします。', reading:'ビールをふたつおねがいします。', en:'Two beers, please.', parts:['ビールを','二つ','お願いします'], grammar:['g:wo','g:masu','g:counters'], vocab:['v:biiru','v:onegaishimasu'], register:'polite' },
  { id:'s:075', jp:'この町はとても静かです。', reading:'このまちはとてもしずかです。', en:'This town is very quiet.', parts:['この','町は','とても','静か','です'], grammar:['g:naadj','g:kono','g:desu','g:ka'], vocab:['v:machi','v:totemo','v:shizuka'], register:'polite' },
  { id:'s:076', jp:'元気ですか。', reading:'げんきですか。', en:'Are you well?', parts:['元気','ですか'], grammar:['g:ka','g:naadj'], vocab:['v:genki'], register:'polite', note:'Not the all-purpose English “how are you?” — it asks after someone you have not seen for a while. お元気ですか is the polite form.' },
  { id:'s:077', jp:'はい、元気です。', reading:'はい、げんきです。', en:'Yes, I’m well.', parts:['はい、','元気','です'], grammar:['g:desu'], vocab:['v:hai','v:genki'], register:'polite' },
  { id:'s:078', jp:'いいえ、違います。', reading:'いいえ、ちがいます。', en:'No, that’s not right.', parts:['いいえ、','違います'], grammar:['g:masu'], vocab:['v:iie'], register:'polite' },
  { id:'s:079', jp:'昨日は何を食べましたか。', reading:'きのうはなにをたべましたか。', en:'What did you eat yesterday?', parts:['昨日は','何を','食べましたか'], grammar:['g:mashita','g:ka','g:wo','g:desu'], vocab:['v:kinou','v:nani','v:taberu'], register:'polite' },
  { id:'s:080', jp:'ラーメンを食べました。', reading:'ラーメンをたべました。', en:'I ate ramen.', parts:['ラーメンを','食べました'], grammar:['g:mashita','g:wo'], vocab:['v:raamen','v:taberu'], register:'polite' },
  { id:'s:081', jp:'その傘は誰のですか。', reading:'そのかさはだれのですか。', en:'Whose umbrella is that?', parts:['その','傘は','誰の','ですか'], grammar:['g:no','g:ka','g:kono','g:desu'], vocab:['v:kasa','v:dare'], register:'polite' },
  { id:'s:082', jp:'私のです。', reading:'わたしのです。', en:'It’s mine.', parts:['私の','です'], grammar:['g:no'], vocab:['v:watashi'], register:'polite' },
  { id:'s:083', jp:'明日も学校に行きます。', reading:'あしたもがっこうにいきます。', en:'I’m going to school tomorrow too.', parts:['明日も','学校に','行きます'], grammar:['g:mo','g:ni_he','g:masu'], vocab:['v:ashita','v:gakkou','v:iku'], register:'polite' },
  { id:'s:084', jp:'一緒に行きませんか。', reading:'いっしょにいきませんか。', en:'Would you like to go together?', parts:['一緒に','行きませんか'], grammar:['g:masen','g:ka','g:ni_he'], vocab:['v:issho','v:iku'], register:'polite', note:'A negative question is the standard polite invitation.' },
  { id:'s:085', jp:'いいですね。', reading:'いいですね。', en:'That sounds good.', parts:['いい','ですね'], grammar:['g:iadj'], vocab:['v:ii'], register:'polite' },
  { id:'s:086', jp:'今日は暑いですね。', reading:'きょうはあついですね。', en:'It’s hot today, isn’t it.', parts:['今日は','暑い','ですね'], grammar:['g:iadj','g:desu'], vocab:['v:kyou','v:atsui'], register:'polite' },
  { id:'s:087', jp:'この靴は高くないです。', reading:'このくつはたかくないです。', en:'These shoes aren’t expensive.', parts:['この','靴は','高くない','です'], grammar:['g:iadj','g:desu'], vocab:['v:kutsu','v:takai'], register:'polite' },
  { id:'s:088', jp:'野菜をたくさん食べます。', reading:'やさいをたくさんたべます。', en:'I eat a lot of vegetables.', parts:['野菜を','たくさん','食べます'], grammar:['g:wo','g:masu'], vocab:['v:yasai','v:takusan','v:taberu'], register:'polite' },
  { id:'s:089', jp:'肉はあまり食べません。', reading:'にくはあまりたべません。', en:'I don’t eat much meat.', parts:['肉は','あまり','食べません'], grammar:['g:masen','g:desu'], vocab:['v:amari','v:niku','v:taberu'], register:'polite', note:'A speaker normally topicalises here — 肉は… — rather than starting with あまり.' },
  { id:'s:090', jp:'家では日本語で話します。', reading:'いえではにほんごではなします。', en:'At home we speak in Japanese.', parts:['家では','日本語で','話します'], grammar:['g:de','g:masu','g:desu'], vocab:['v:ie','v:hanasu'], register:'polite', note:'Two different で here: the first marks the place, the second marks the means.' },
  { id:'s:091', jp:'ここに名前を書きます。', reading:'ここになまえをかきます。', en:'I write my name here.', parts:['ここに','名前を','書きます'], grammar:['g:wo','g:masu','g:ni_he'], vocab:['v:namae','v:koko','v:kaku'], register:'polite' },
  { id:'s:092', jp:'ちょっと待ってください。', reading:'ちょっとまってください。', en:'Please wait a moment.', parts:['ちょっと','待ってください'], grammar:['g:tekudasai','g:te_u'], vocab:['v:chotto','v:matsu'], register:'polite' },
  { id:'s:093', jp:'もう一度お願いします。', reading:'もういちどおねがいします。', en:'Once more, please.', parts:['もう一度','お願いします'], grammar:['g:masu'], vocab:['v:onegaishimasu','v:ichi'], register:'polite' },
  { id:'s:094', jp:'この単語の意味が分かりません。', reading:'このたんごのいみがわかりません。', en:'I don’t understand the meaning of this word.', parts:['この','単語の','意味が','分かりません'], grammar:['g:no','g:masen'], vocab:['v:wakaru'], register:'polite' },
  { id:'s:095', jp:'図書館はどこにありますか。', reading:'としょかんはどこにありますか。', en:'Where is the library?', parts:['図書館は','どこに','ありますか'], grammar:['g:aruiru','g:ka','g:masu','g:desu','g:ni_he'], vocab:['v:toshokan','v:doko','v:aru'], register:'polite' },
  { id:'s:096', jp:'病院の前にあります。', reading:'びょういんのまえにあります。', en:'It’s in front of the hospital.', parts:['病院の','前に','あります'], grammar:['g:aruiru','g:no','g:masu','g:ni_he'], vocab:['v:byouin','v:aru'], register:'polite' },
  { id:'s:097', jp:'家に帰ります。', reading:'いえにかえります。', en:'I’m going home.', parts:['家に','帰ります'], grammar:['g:ni_he','g:masu'], vocab:['v:ie','v:kaeru'], register:'polite' },
  { id:'s:098', jp:'毎朝七時に起きます。', reading:'まいあさしちじにおきます。', en:'I get up at seven every morning.', parts:['毎朝','七時に','起きます'], grammar:['g:ni_he','g:masu','g:counters'], vocab:['v:asa','v:okiru'], register:'polite', note:'七時 is しちじ, never ななじ. Clock readings are fixed and do not follow the よん／なな preference.' },
  { id:'s:099', jp:'夜はテレビを見ません。', reading:'よるはテレビをみません。', en:'I don’t watch TV at night.', parts:['夜は','テレビを','見ません'], grammar:['g:masen','g:wo','g:desu'], vocab:['v:yoru','v:terebi','v:miru'], register:'polite' },
  { id:'s:100', jp:'その本を読みましたか。', reading:'そのほんをよみましたか。', en:'Did you read that book?', parts:['その','本を','読みましたか'], grammar:['g:mashita','g:ka','g:wo'], vocab:['v:hon','v:yomu'], register:'polite' },
  { id:'s:101', jp:'いいえ、読みませんでした。', reading:'いいえ、よみませんでした。', en:'No, I didn’t read it.', parts:['いいえ、','読みませんでした'], grammar:['g:mashita','g:masen'], vocab:['v:iie','v:yomu'], register:'polite' },
  { id:'s:102', jp:'スマホで音楽を聞きます。', reading:'スマホでおんがくをききます。', en:'I listen to music on my phone.', parts:['スマホで','音楽を','聞きます'], grammar:['g:de','g:wo','g:masu'], vocab:['v:sumaho','v:kiku'], register:'polite' },
  { id:'s:103', jp:'この店のパンはおいしいです。', reading:'このみせのパンはおいしいです。', en:'The bread at this shop is delicious.', parts:['この','店の','パンは','おいしい','です'], grammar:['g:no','g:iadj','g:desu'], vocab:['v:mise','v:pan','v:oishii'], register:'polite' },
  { id:'s:104', jp:'卵と野菜を買いました。', reading:'たまごとやさいをかいました。', en:'I bought eggs and vegetables.', parts:['卵と','野菜を','買いました'], grammar:['g:mashita','g:wo','g:to'], vocab:['v:tamago','v:yasai','v:kau'], register:'polite' },
  { id:'s:105', jp:'果物が好きです。', reading:'くだものがすきです。', en:'I like fruit.', parts:['果物が','好き','です'], grammar:['g:suki'], vocab:['v:kudamono','v:suki'], register:'polite' },
  { id:'s:106', jp:'土曜日は何をしますか。', reading:'どようびはなにをしますか。', en:'What are you doing on Saturday?', parts:['土曜日は','何を','しますか'], grammar:['g:ka','g:wo','g:masu','g:desu'], vocab:['v:doyoubi','v:nani','v:suru'], register:'polite' },
  { id:'s:107', jp:'友達とご飯を食べます。', reading:'ともだちとごはんをたべます。', en:'I’m eating with a friend.', parts:['友達と','ご飯を','食べます'], grammar:['g:wo','g:masu','g:to'], vocab:['v:tomodachi','v:gohan','v:taberu'], register:'polite' },
  { id:'s:108', jp:'この時計は便利です。', reading:'このとけいはべんりです。', en:'This watch is handy.', parts:['この','時計は','便利','です'], grammar:['g:naadj','g:kono','g:desu'], vocab:['v:tokei','v:benri'], register:'polite' },
  { id:'s:109', jp:'私の国は日本じゃないです。', reading:'わたしのくにはにほんじゃないです。', en:'My country isn’t Japan.', parts:['私の','国は','日本','じゃないです'], grammar:['g:janai','g:no','g:desu'], vocab:['v:kuni','v:nihon'], register:'polite' },
  { id:'s:110', jp:'日本語の勉強は楽しいです。', reading:'にほんごのべんきょうはたのしいです。', en:'Studying Japanese is fun.', parts:['日本語の','勉強は','楽しい','です'], grammar:['g:no','g:iadj','g:desu'], vocab:['v:nihongo','v:tanoshii'], register:'polite' },

  // ── て-form: requests ─────────────────────────────────────────────────────
  { id:'s:111', jp:'ちょっと待ってください。', reading:'ちょっとまってください。', en:'Please wait a moment.', parts:['ちょっと','待って','ください'], grammar:['g:tekudasai','g:te_u'], vocab:['v:chotto','v:matsu'], register:'polite' },
  { id:'s:112', jp:'ここに名前を書いてください。', reading:'ここになまえをかいてください。', en:'Please write your name here.', parts:['ここに','名前を','書いて','ください'], grammar:['g:tekudasai','g:wo','g:ni_he','g:te_u'], vocab:['v:koko','v:namae','v:kaku'], register:'polite' },
  { id:'s:113', jp:'ゆっくり話してください。', reading:'ゆっくりはなしてください。', en:'Please speak slowly.', parts:['ゆっくり','話して','ください'], grammar:['g:tekudasai','g:te_u','g:te'], vocab:['v:yukkuri','v:hanasu'], register:'polite', note:'Worth memorising before any trip — it works on anyone, anywhere.' },
  { id:'s:114', jp:'この漢字を読んでください。', reading:'このかんじをよんでください。', en:'Please read this kanji.', parts:['この','漢字を','読んで','ください'], grammar:['g:tekudasai','g:te_u','g:kono','g:wo','g:de'], vocab:['v:kanji','v:yomu'], register:'polite' },
  { id:'s:115', jp:'ここに座ってください。', reading:'ここにすわってください。', en:'Please sit here.', parts:['ここに','座って','ください'], grammar:['g:tekudasai','g:te_u','g:ni_he'], vocab:['v:koko','v:suwaru'], register:'polite' },
  { id:'s:116', jp:'写真を撮ってください。', reading:'しゃしんをとってください。', en:'Please take a photo.', parts:['写真を','撮って','ください'], grammar:['g:tekudasai','g:te_u','g:wo'], vocab:['v:shashin','v:toru'], register:'polite' },
  { id:'s:117', jp:'明日来てください。', reading:'あしたきてください。', en:'Please come tomorrow.', parts:['明日','来て','ください'], grammar:['g:tekudasai','g:te'], vocab:['v:ashita','v:kuru'], register:'polite', note:'来る is irregular: the て-form is 来て, read きて.' },

  // ── て-form: ています ──────────────────────────────────────────────────────
  { id:'s:118', jp:'今ご飯を食べています。', reading:'いまごはんをたべています。', en:'I’m eating a meal right now.', parts:['今','ご飯を','食べて','います'], grammar:['g:teimasu','g:wo','g:masu','g:te'], vocab:['v:ima','v:gohan','v:taberu'], register:'polite' },
  { id:'s:119', jp:'兄は日本に住んでいます。', reading:'あにはにほんにすんでいます。', en:'My older brother lives in Japan.', parts:['兄は','日本に','住んで','います'], grammar:['g:teimasu','g:masu','g:desu','g:ni_he','g:de','g:te_u'], vocab:['v:ani','v:nihon','v:sumu'], register:'polite', note:'住む is nearly always ています — living somewhere is a continuing state, not an action.' },
  { id:'s:120', jp:'友達を待っています。', reading:'ともだちをまっています。', en:'I’m waiting for a friend.', parts:['友達を','待って','います'], grammar:['g:teimasu','g:wo','g:masu','g:te_u'], vocab:['v:tomodachi','v:matsu'], register:'polite' },
  { id:'s:121', jp:'兄は会社で働いています。', reading:'あにはかいしゃではたらいています。', en:'My older brother works at a company.', parts:['兄は','会社で','働いて','います'], grammar:['g:teimasu','g:de','g:masu','g:desu','g:te'], vocab:['v:ani','v:kaisha','v:hataraku'], register:'polite', note:'A job is an ongoing state, so Japanese uses ています where English uses a plain present.' },
  { id:'s:122', jp:'何をしていますか。', reading:'なにをしていますか。', en:'What are you doing?', parts:['何を','して','いますか'], grammar:['g:teimasu','g:ka','g:masu','g:wo','g:te'], vocab:['v:nani','v:suru'], register:'polite' },
  { id:'s:123', jp:'音楽を聞いています。', reading:'おんがくをきいています。', en:'I’m listening to music.', parts:['音楽を','聞いて','います'], grammar:['g:teimasu','g:wo','g:masu','g:te_u'], vocab:['v:ongaku','v:kiku'], register:'polite' },
  { id:'s:124', jp:'猫が寝ています。', reading:'ねこがねています。', en:'The cat is sleeping.', parts:['猫が','寝て','います'], grammar:['g:teimasu','g:masu','g:te'], vocab:['v:neko','v:neru'], register:'polite' },

  // ── て-form: permission ───────────────────────────────────────────────────
  { id:'s:125', jp:'ここで写真を撮ってもいいですか。', reading:'ここでしゃしんをとってもいいですか。', en:'May I take a photo here?', parts:['ここで','写真を','撮っても','いいですか'], grammar:['g:temoii','g:de','g:wo','g:mo','g:te_u'], vocab:['v:koko','v:shashin','v:toru'], register:'polite' },
  { id:'s:126', jp:'入ってもいいですか。', reading:'はいってもいいですか。', en:'May I come in?', parts:['入っても','いいですか'], grammar:['g:temoii','g:mo','g:te_u'], vocab:['v:hairu'], register:'polite' },
  { id:'s:127', jp:'はい、どうぞ。', reading:'はい、どうぞ。', en:'Yes, go ahead.', parts:['はい、','どうぞ'], grammar:[], vocab:['v:hai','v:douzo'], register:'polite', note:'The natural answer when permission is granted. はい、いいです can read as a refusal instead.' },
  { id:'s:128', jp:'この本を読んでもいいですか。', reading:'このほんをよんでもいいですか。', en:'May I read this book?', parts:['この','本を','読んでも','いいですか'], grammar:['g:temoii','g:kono','g:wo','g:mo','g:te_u'], vocab:['v:hon','v:yomu'], register:'polite' },
  { id:'s:129', jp:'ここに座ってもいいですか。', reading:'ここにすわってもいいですか。', en:'May I sit here?', parts:['ここに','座っても','いいですか'], grammar:['g:temoii','g:ni_he','g:mo','g:te_u'], vocab:['v:koko','v:suwaru'], register:'polite' },
  { id:'s:130', jp:'電話を使ってもいいですか。', reading:'でんわをつかってもいいですか。', en:'May I use the phone?', parts:['電話を','使っても','いいですか'], grammar:['g:temoii','g:wo','g:mo','g:te_u'], vocab:['v:denwa','v:tsukau'], register:'polite' },

  // ── て-form: prohibition ──────────────────────────────────────────────────
  { id:'s:131', jp:'ここに入ってはいけません。', reading:'ここにはいってはいけません。', en:'You must not go in here.', parts:['ここに','入っては','いけません'], grammar:['g:tewaikemasen','g:masen','g:ni_he','g:desu','g:te_u'], vocab:['v:koko','v:hairu'], register:'polite' },
  { id:'s:132', jp:'図書館で話してはいけません。', reading:'としょかんではなしてはいけません。', en:'You must not talk in the library.', parts:['図書館で','話しては','いけません'], grammar:['g:tewaikemasen','g:de','g:masen','g:desu','g:te'], vocab:['v:toshokan','v:hanasu'], register:'polite' },
  { id:'s:133', jp:'ここで写真を撮ってはいけません。', reading:'ここでしゃしんをとってはいけません。', en:'You must not take photos here.', parts:['ここで','写真を','撮っては','いけません'], grammar:['g:tewaikemasen','g:de','g:masen','g:wo','g:desu','g:te_u'], vocab:['v:koko','v:shashin','v:toru'], register:'polite' },
  { id:'s:134', jp:'お酒を飲んではいけません。', reading:'おさけをのんではいけません。', en:'You must not drink alcohol.', parts:['お酒を','飲んでは','いけません'], grammar:['g:tewaikemasen','g:wo','g:masen','g:desu','g:te_u'], vocab:['v:sake','v:nomu'], register:'polite' },
  { id:'s:135', jp:'ここで遊んではいけません。', reading:'ここであそんではいけません。', en:'You must not play here.', parts:['ここで','遊んでは','いけません'], grammar:['g:tewaikemasen','g:de','g:masen','g:desu','g:te_u'], vocab:['v:koko','v:asobu'], register:'polite' },

  // ── て-form: connecting actions ───────────────────────────────────────────
  { id:'s:136', jp:'朝起きて、朝ご飯を食べます。', reading:'あさおきて、あさごはんをたべます。', en:'I get up in the morning and eat breakfast.', parts:['朝','起きて、','朝ご飯を','食べます'], grammar:['g:teconnect','g:te','g:masu','g:wo'], vocab:['v:asa','v:okiru','v:asagohan','v:taberu'], register:'polite' },
  { id:'s:137', jp:'家に帰って、勉強します。', reading:'いえにかえって、べんきょうします。', en:'I go home and study.', parts:['家に','帰って、','勉強します'], grammar:['g:teconnect','g:te','g:masu','g:ni_he','g:te_u'], vocab:['v:ie','v:kaeru','v:benkyou'], register:'polite' },
  { id:'s:138', jp:'駅に行って、友達に会います。', reading:'えきにいって、ともだちにあいます。', en:'I go to the station and meet a friend.', parts:['駅に','行って、','友達に','会います'], grammar:['g:teconnect','g:te','g:masu','g:ni_he','g:te_u'], vocab:['v:eki','v:iku','v:tomodachi','v:au'], register:'polite', note:'行く is the one common く-verb whose て-form is 行って, not 行いて.' },
  { id:'s:139', jp:'昨日映画を見て、ご飯を食べました。', reading:'きのうえいがをみて、ごはんをたべました。', en:'Yesterday I watched a film and had a meal.', parts:['昨日','映画を','見て、','ご飯を','食べました'], grammar:['g:teconnect','g:te','g:mashita','g:wo'], vocab:['v:kinou','v:eiga','v:miru','v:gohan','v:taberu'], register:'polite', note:'Only the last verb is past. 見て carries no tense of its own.' },
  { id:'s:140', jp:'友達と遊んで、家に帰りました。', reading:'ともだちとあそんで、いえにかえりました。', en:'I hung out with a friend and went home.', parts:['友達と','遊んで、','家に','帰りました'], grammar:['g:teconnect','g:te','g:mashita','g:to','g:de','g:ni_he','g:te_u'], vocab:['v:tomodachi','v:asobu','v:ie','v:kaeru'], register:'polite' },
  { id:'s:141', jp:'パンを買って、家で食べました。', reading:'パンをかって、いえでたべました。', en:'I bought bread and ate it at home.', parts:['パンを','買って、','家で','食べました'], grammar:['g:teconnect','g:te','g:mashita','g:wo','g:de','g:te_u'], vocab:['v:pan','v:kau','v:ie','v:taberu'], register:'polite' },
  { id:'s:142', jp:'本を読んで、寝ます。', reading:'ほんをよんで、ねます。', en:'I read a book and go to sleep.', parts:['本を','読んで、','寝ます'], grammar:['g:teconnect','g:masu','g:wo','g:de','g:te_u'], vocab:['v:hon','v:yomu','v:neru'], register:'polite' },

  // ── integrated ───────────────────────────────────────────────────────────
  { id:'s:143', jp:'毎朝六時に起きて、コーヒーを飲みます。', reading:'まいあさろくじにおきて、コーヒーをのみます。', en:'Every morning I get up at six and drink coffee.', parts:['毎朝','六時に','起きて、','コーヒーを','飲みます'], grammar:['g:teconnect','g:ni_he','g:masu','g:wo','g:counters','g:te'], vocab:['v:okiru','v:koohii','v:nomu'], register:'polite' },
  { id:'s:144', jp:'友達は部屋で音楽を聞いています。', reading:'ともだちはへやでおんがくをきいています。', en:'My friend is listening to music in the room.', parts:['友達は','部屋で','音楽を','聞いて','います'], grammar:['g:teimasu','g:de','g:masu','g:desu','g:wo','g:te_u'], vocab:['v:tomodachi','v:heya','v:ongaku','v:kiku'], register:'polite' },
  { id:'s:145', jp:'すみません、ここに座ってもいいですか。', reading:'すみません、ここにすわってもいいですか。', en:'Excuse me, may I sit here?', parts:['すみません、','ここに','座っても','いいですか'], grammar:['g:temoii','g:masen','g:ni_he','g:mo','g:te_u'], vocab:['v:sumimasen','v:koko','v:suwaru'], register:'polite' },
  { id:'s:146', jp:'ここでは日本語で話してください。', reading:'ここではにほんごではなしてください。', en:'Please speak in Japanese here.', parts:['ここでは','日本語で','話して','ください'], grammar:['g:tekudasai','g:de','g:te'], vocab:['v:koko','v:nihongo','v:hanasu'], register:'polite', note:'Two で again: place, then means. ここでは adds は for contrast — “here, at least”.' },
  { id:'s:147', jp:'たくさん食べてください。', reading:'たくさんたべてください。', en:'Please eat plenty.', parts:['たくさん','食べて','ください'], grammar:['g:tekudasai','g:te'], vocab:['v:takusan','v:taberu'], register:'polite' },
  { id:'s:148', jp:'これを見てください。', reading:'これをみてください。', en:'Please look at this.', parts:['これを','見て','ください'], grammar:['g:tekudasai','g:te','g:wo'], vocab:['v:kore','v:miru'], register:'polite' },
  { id:'s:149', jp:'プールで泳いで、写真を撮りました。', reading:'プールでおよいで、しゃしんをとりました。', en:'I swam at the pool and took photos.', parts:['プールで','泳いで、','写真を','撮りました'], grammar:['g:teconnect','g:te','g:mashita','g:de','g:wo','g:te_u'], vocab:['v:puuru','v:oyogu','v:shashin','v:toru'], register:'polite' },
  { id:'s:150', jp:'私も先生です。', reading:'わたしもせんせいです。', en:'I’m a teacher too.', parts:['私も','先生','です'], grammar:['g:mo','g:desu'], vocab:['v:watashi','v:sensei'], register:'polite' },
  { id:'s:151', jp:'この本は私のです。', reading:'このほんはわたしのです。', en:'This book is mine.', parts:['この','本は','私の','です'], grammar:['g:kono','g:no','g:desu'], vocab:['v:hon','v:watashi'], register:'polite' },
  { id:'s:152', jp:'これも私のかばんです。', reading:'これもわたしのかばんです。', en:'This is my bag too.', parts:['これも','私の','かばん','です'], grammar:['g:mo','g:no','g:kore'], vocab:['v:kore','v:kaban'], register:'polite' },
  // ── と, and counting things ───────────────────────────────────────────────
  { id:'s:153', jp:'友達と映画を見ました。', reading:'ともだちとえいがをみました。', en:'I watched a film with a friend.', parts:['友達と','映画を','見ました'], grammar:['g:to','g:wo','g:mashita'], vocab:['v:tomodachi','v:eiga','v:miru'], register:'polite' },
  { id:'s:154', jp:'切符を二枚ください。', reading:'きっぷをにまいください。', en:'Two tickets, please.', parts:['切符を','二枚','ください'], grammar:['g:counters','g:wo'], vocab:['v:kippu'], register:'polite', note:'The counter follows the noun and its particle: 切符を二枚, not 二枚の切符 in a request like this.' },
  { id:'s:187', jp:'私と友達は学生です。', reading:'わたしとともだちはがくせいです。', en:'My friend and I are students.', parts:['私と','友達は','学生','です'], grammar:['g:to','g:desu'], vocab:['v:watashi','v:tomodachi','v:gakusei'], register:'polite' },
  { id:'s:186', jp:'友達と映画を見ます。', reading:'ともだちとえいがをみます。', en:'I watch films with a friend.', parts:['友達と','映画を','見ます'], grammar:['g:to','g:wo','g:masu'], vocab:['v:tomodachi','v:eiga','v:miru'], register:'polite' },
  { id:'s:155', jp:'パンと卵を買います。', reading:'パンとたまごをかいます。', en:'I’ll buy bread and eggs.', parts:['パンと','卵を','買います'], grammar:['g:to','g:wo','g:masu'], vocab:['v:pan','v:tamago','v:kau'], register:'polite' },
  { id:'s:156', jp:'猫と犬がいます。', reading:'ねこといぬがいます。', en:'I have a cat and a dog.', parts:['猫と','犬が','います'], grammar:['g:to','g:aruiru','g:masu'], vocab:['v:neko','v:inu','v:iru'], register:'polite' },
  { id:'s:157', jp:'家族は四人です。', reading:'かぞくはよにんです。', en:'There are four people in my family.', parts:['家族は','四人','です'], grammar:['g:counters','g:desu'], vocab:['v:kazoku'], register:'polite', note:'四人 is よにん — not よんにん, and never しにん.' },
  { id:'s:158', jp:'車が一台あります。', reading:'くるまがいちだいあります。', en:'There is one car.', parts:['車が','一台','あります'], grammar:['g:counters','g:aruiru','g:masu'], vocab:['v:kuruma','v:aru'], register:'polite' },
  { id:'s:159', jp:'毎週三回泳ぎます。', reading:'まいしゅうさんかいおよぎます。', en:'I swim three times a week.', parts:['毎週','三回','泳ぎます'], grammar:['g:counters','g:masu'], vocab:['v:maishuu','v:oyogu'], register:'polite' },
  { id:'s:160', jp:'卵を六個買いました。', reading:'たまごをろっこかいました。', en:'I bought six eggs.', parts:['卵を','六個','買いました'], grammar:['g:counters','g:wo','g:mashita'], vocab:['v:tamago','v:kau'], register:'polite', note:'六個 is ろっこ — the number and the counter fuse into one sound.' },
  { id:'s:161', jp:'ビールを一本ください。', reading:'ビールをいっぽんください。', en:'One beer, please.', parts:['ビールを','一本','ください'], grammar:['g:counters','g:wo'], vocab:['v:biiru'], register:'polite', note:'一本 is いっぽん. Bottles are long and thin, so they take 本.' },
  { id:'s:162', jp:'八時に駅で会います。', reading:'はちじにえきであいます。', en:'I’ll meet you at the station at eight.', parts:['八時に','駅で','会います'], grammar:['g:counters','g:ni_he','g:de','g:masu'], vocab:['v:eki','v:au'], register:'polite' },
  { id:'s:163', jp:'三十分待ちました。', reading:'さんじゅっぷんまちました。', en:'I waited thirty minutes.', parts:['三十分','待ちました'], grammar:['g:counters','g:mashita'], vocab:['v:matsu'], register:'polite' },
  { id:'s:164', jp:'りんごを三つお願いします。', reading:'りんごをみっつおねがいします。', en:'Three apples, please.', parts:['りんごを','三つ','お願いします'], grammar:['g:counters','g:wo','g:masu'], vocab:['v:ringo','v:onegaishimasu'], register:'polite', note:'つ is the fallback counter — usable for almost any object when you cannot remember the specific one.' },
  // ── plain form, casual speech, and what the plain form unlocks ────────────
  { id:'s:165', jp:'明日行く？', reading:'あしたいく？', en:'Going tomorrow?', parts:['明日','行く'], grammar:['g:plain','g:casual'], vocab:['v:ashita','v:iku'], register:'casual', note:'No か. Casual questions rise in pitch instead — and か here would sound abrupt rather than polite.' },
  { id:'s:166', jp:'うん、行く。', reading:'うん、いく。', en:'Yeah, I’m going.', parts:['うん、','行く'], grammar:['g:plain','g:casual'], vocab:['v:un','v:iku'], register:'casual' },
  { id:'s:167', jp:'これ、おいしい。', reading:'これ、おいしい。', en:'This is tasty.', parts:['これ、','おいしい'], grammar:['g:casual','g:kore'], vocab:['v:kore','v:oishii'], register:'casual', note:'No です, and は is dropped too. Casual Japanese leaves out anything the situation already makes obvious.' },
  { id:'s:168', jp:'今日は忙しい？', reading:'きょうはいそがしい？', en:'Are you busy today?', parts:['今日は','忙しい'], grammar:['g:casual','g:iadj','g:desu'], vocab:['v:kyou','v:isogashii'], register:'casual' },
  { id:'s:169', jp:'ううん、忙しくない。', reading:'ううん、いそがしくない。', en:'Nope, not busy.', parts:['ううん、','忙しくない'], grammar:['g:casual','g:iadj'], vocab:['v:uun','v:isogashii'], register:'casual' },

  { id:'s:170', jp:'明日は雨だと思います。', reading:'あしたはあめだとおもいます。', en:'I think it will rain tomorrow.', parts:['明日は','雨だ','と思います'], grammar:['g:toomou','g:plain','g:masu','g:desu'], vocab:['v:ashita','v:ame','v:omou'], register:'polite', note:'です becomes plain だ before と — the quoted thought is always plain, even in a polite sentence.' },
  { id:'s:171', jp:'この本は面白いと思います。', reading:'このほんはおもしろいとおもいます。', en:'I think this book is interesting.', parts:['この','本は','面白い','と思います'], grammar:['g:toomou','g:kono','g:iadj','g:masu','g:desu'], vocab:['v:hon','v:omoshiroi','v:omou'], register:'polite' },
  { id:'s:172', jp:'田中さんは来ると思います。', reading:'たなかさんはくるとおもいます。', en:'I think Tanaka will come.', parts:['田中さんは','来る','と思います'], grammar:['g:toomou','g:plain','g:masu','g:desu'], vocab:['v:kuru','v:omou'], register:'polite' },
  { id:'s:173', jp:'日本語は難しいと思いますか。', reading:'にほんごはむずかしいとおもいますか。', en:'Do you think Japanese is difficult?', parts:['日本語は','難しい','と思いますか'], grammar:['g:toomou','g:ka','g:iadj','g:masu','g:desu'], vocab:['v:nihongo','v:muzukashii','v:omou'], register:'polite' },

  { id:'s:174', jp:'日本語を話すことができます。', reading:'にほんごをはなすことができます。', en:'I can speak Japanese.', parts:['日本語を','話す','ことができます'], grammar:['g:dekiru','g:plain','g:wo','g:masu'], vocab:['v:nihongo','v:hanasu'], register:'polite' },
  { id:'s:175', jp:'ここで写真を撮ることができますか。', reading:'ここでしゃしんをとることができますか。', en:'Can I take photos here?', parts:['ここで','写真を','撮る','ことができますか'], grammar:['g:dekiru','g:de','g:wo','g:ka','g:masu'], vocab:['v:koko','v:shashin','v:toru'], register:'polite' },
  { id:'s:176', jp:'泳ぐことができません。', reading:'およぐことができません。', en:'I can’t swim.', parts:['泳ぐ','ことができません'], grammar:['g:dekiru','g:plain','g:masen'], vocab:['v:oyogu'], register:'polite' },

  { id:'s:177', jp:'日本語を話す人です。', reading:'にほんごをはなすひとです。', en:'She’s someone who speaks Japanese.', parts:['日本語を','話す','人です'], grammar:['g:relative','g:plain','g:wo'], vocab:['v:nihongo','v:hanasu','v:hito'], register:'polite' },
  { id:'s:178', jp:'毎日使うパソコンです。', reading:'まいにちつかうパソコンです。', en:'It’s the computer I use every day.', parts:['毎日','使う','パソコンです'], grammar:['g:relative','g:plain'], vocab:['v:mainichi','v:tsukau','v:pasokon'], register:'polite' },
  { id:'s:179', jp:'兄が住んでいる町です。', reading:'あにがすんでいるまちです。', en:'It’s the town my brother lives in.', parts:['兄が','住んでいる','町です'], grammar:['g:relative','g:teimasu'], vocab:['v:ani','v:sumu','v:machi'], register:'polite', note:'は became が inside the clause. は belongs to the whole sentence; a modifying clause is not one.' },
  { id:'s:180', jp:'昨日買った本を読みます。', reading:'きのうかったほんをよみます。', en:'I’ll read the book I bought yesterday.', parts:['昨日','買った','本を','読みます'], grammar:['g:relative','g:wo','g:masu'], vocab:['v:kinou','v:kau','v:hon','v:yomu'], register:'polite', note:'買った is the plain past — the て-form with た instead of て. The full plain past comes later; recognise it here.' },

  { id:'s:181', jp:'お酒を飲まない。', reading:'おさけをのまない。', en:'I don’t drink.', parts:['お酒を','飲まない'], grammar:['g:nai','g:casual','g:wo'], vocab:['v:sake','v:nomu'], register:'casual' },
  { id:'s:182', jp:'ここに入らないでください。', reading:'ここにはいらないでください。', en:'Please don’t come in here.', parts:['ここに','入らないで','ください'], grammar:['g:nai','g:ni_he','g:tekudasai','g:de'], vocab:['v:koko','v:hairu'], register:'polite' },
  { id:'s:183', jp:'写真を撮らないでください。', reading:'しゃしんをとらないでください。', en:'Please don’t take photos.', parts:['写真を','撮らないで','ください'], grammar:['g:nai','g:wo','g:tekudasai','g:de'], vocab:['v:shashin','v:toru'], register:'polite' },
  { id:'s:184', jp:'ここで遊ばないでください。', reading:'ここであそばないでください。', en:'Please don’t play here.', parts:['ここで','遊ばないで','ください'], grammar:['g:nai','g:de','g:tekudasai'], vocab:['v:koko','v:asobu'], register:'polite' },
  { id:'s:185', jp:'意味が分からない。', reading:'いみがわからない。', en:'I don’t get what it means.', parts:['意味が','分からない'], grammar:['g:nai','g:casual'], vocab:['v:imi','v:wakaru'], register:'casual', note:'分からない on its own is one of the most-heard casual phrases in Japanese. The polite version is 分かりません.' },
];

export const SENTENCES_BY_ID = Object.fromEntries(SENTENCES.map(s => [s.id, s]));
