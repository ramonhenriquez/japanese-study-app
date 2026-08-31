// End-to-end test of the core loop, run against the real app in a real browser.
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'src');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  const file = path.join(ROOT, url === '/' ? 'index.html' : url);
  if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404); return res.end('nope'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  res.end(fs.readFileSync(file));
});

const fails = [];
const check = (cond, msg) => { if (!cond) fails.push(msg); };

(async () => {
  await new Promise(r => server.listen(8123, r));
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    page.on('pageerror', e => fails.push(`[${scheme}] pageerror: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error' && !/fonts.googleapis|ERR_/.test(m.text())) fails.push(`[${scheme}] console: ${m.text()}`); });

    await page.goto('http://localhost:8123/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.hero', { timeout: 5000 });

    const home = await page.evaluate(() => ({
      heroTitle: document.querySelector('.hero-title')?.textContent,
      due: document.querySelector('.action .action-value')?.textContent,
      nav: [...document.querySelectorAll('.sidebar .nav-item .nav-label')].map(n => n.textContent),
      bg: getComputedStyle(document.body).backgroundColor,
    }));
    console.log(scheme, 'home:', JSON.stringify(home));
    check(home.heroTitle?.includes('あいうえお'), `[${scheme}] first lesson not shown on home`);
    check(home.due === '0', `[${scheme}] fresh install should have 0 reviews due, got ${home.due}`);
    check(home.nav.length === 7, `[${scheme}] sidebar should list 7 destinations, got ${home.nav.length}`);

    await page.screenshot({ path: `/home/claude/nihongo/shots/home-${scheme}.png` });

    // ── run the full lesson loop
    await page.click('.hero');
    await page.waitForSelector('.lesson-actions .btn');
    const blocks = await page.evaluate(() => ({
      kana: document.querySelectorAll('.kana-cell').length,
      tips: document.querySelectorAll('.tip').length,
      prose: document.querySelectorAll('.prose').length,
    }));
    console.log(scheme, 'lesson blocks:', JSON.stringify(blocks));
    check(blocks.kana === 5, `[${scheme}] lesson 1 should show 5 kana, got ${blocks.kana}`);
    await page.screenshot({ path: `/home/claude/nihongo/shots/lesson-${scheme}.png` });

    await page.click('.lesson-actions .btn');
    await page.waitForSelector('.exercise');

    // answer everything correctly by reading the exercise's own answer off the DOM
    let guard = 0;
    while (guard++ < 40) {
      if (await page.$('.session-summary')) break;
      const state = await page.evaluate(() => {
        const hasChoices = !!document.querySelector('.choices .choice:not(:disabled)');
        const hasTyped = !!document.querySelector('input.typed:not(:disabled)');
        const hasNext = !!document.querySelector('.ex-footer .btn');
        return { hasChoices, hasTyped, hasNext };
      });
      if (state.hasNext) { await page.click('.ex-footer .btn'); await page.waitForTimeout(60); continue; }
      if (state.hasChoices) {
        // deliberately pick the FIRST choice — we are testing the machinery, not our own knowledge
        await page.click('.choices .choice:not(:disabled)');
      } else if (state.hasTyped) {
        await page.fill('input.typed', 'a');
        await page.click('.typing .btn');
      } else {
        break;
      }
      await page.waitForTimeout(60);
    }
    await page.waitForSelector('.session-summary', { timeout: 8000 });
    const summary = await page.textContent('.summary-score');
    console.log(scheme, 'session summary:', summary.trim());
    await page.waitForSelector('.lesson-done');
    await page.screenshot({ path: `/home/claude/nihongo/shots/exercise-${scheme}.png` });

    // ── progress must have been saved
    const saved = await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('nihongo.state.v1'));
      return {
        lessons: Object.keys(s.lessons),
        items: Object.keys(s.items).length,
        answers: s.stats.totalAnswers,
        streak: s.stats.streak.current,
      };
    });
    console.log(scheme, 'saved:', JSON.stringify(saved));
    check(saved.lessons.includes('l:01'), `[${scheme}] lesson completion not persisted`);
    check(saved.items >= 5, `[${scheme}] concepts not added to SRS (got ${saved.items})`);
    check(saved.answers > 0, `[${scheme}] answers not recorded`);
    check(saved.streak === 1, `[${scheme}] streak not started`);

    // ── reload: state must survive (navigate home first — we are on the lesson route)
    await page.goto('http://localhost:8123/#/', { waitUntil: 'domcontentloaded' });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.hero');
    const afterReload = await page.evaluate(() => ({
      hero: document.querySelector('.hero-title')?.textContent,
      due: document.querySelector('.action .action-value')?.textContent,
    }));
    console.log(scheme, 'after reload:', JSON.stringify(afterReload));
    check(!afterReload.hero?.includes('あいうえお'), `[${scheme}] home still offering lesson 1 after completing it`);

    // ── review queue
    await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('nihongo.state.v1'));
      for (const k of Object.keys(s.items)) s.items[k].due = Date.now() - 1000;
      localStorage.setItem('nihongo.state.v1', JSON.stringify(s));
    });
    await page.goto('http://localhost:8123/#/review', { waitUntil: 'domcontentloaded' });
    await page.reload();
    await page.waitForSelector('.exercise', { timeout: 5000 });
    const reviewCount = await page.textContent('.ex-count');
    console.log(scheme, 'review started:', reviewCount.trim());
    check(/1 \//.test(reviewCount), `[${scheme}] review did not start`);
    await page.screenshot({ path: `/home/claude/nihongo/shots/review-${scheme}.png` });

    // ── every other screen renders
    for (const [route, sel] of [['#/learn', '.lesson-list'], ['#/practice', '.mode-grid'], ['#/progress', '.progress-rows'], ['#/reference', '.ref-results'], ['#/settings', '.settings-actions']]) {
      await page.goto('http://localhost:8123/' + route, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(220);
      const ok = await page.$(sel);
      check(!!ok, `[${scheme}] route ${route} did not render ${sel}`);
      if (route === '#/progress' || route === '#/reference' || route === '#/practice') {
        await page.screenshot({ path: `/home/claude/nihongo/shots/${route.replace('#/', '')}-${scheme}.png` });
      }
    }

    // ── the practice menu should list exactly the nine modes that earn a place
    await page.goto('http://localhost:8123/#/practice', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(250);
    const modes = await page.evaluate(() => [...document.querySelectorAll('.mode .mode-name')].map(n => n.textContent));
    console.log(`[${scheme}] practice modes:`, modes.join(', '));
    check(modes.length === 9, `[${scheme}] expected 9 practice modes, got ${modes.length}`);
    check(!modes.includes('Translation') && !modes.includes('Matching'), `[${scheme}] Translation/Matching should no longer be top-level modes`);
    check(modes.includes('Listening'), `[${scheme}] Listening should remain a top-level mode`);

    // ── review backlog must be visible before and during the session
    await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('nihongo.state.v1'));
      // seed a backlog larger than the 20-item cap
      const ids = ['kana:h:あ','kana:h:い','kana:h:う','kana:h:え','kana:h:お'];
      for (let i = 0; i < 30; i++) s.items['kana:h:' + 'かきくけこさしすせそたちつてとなにぬねのはひふへほまみむめも'[i]] =
        { id: 'kana:h:' + 'かきくけこさしすせそたちつてとなにぬねのはひふへほまみむめも'[i], type: 'kana', box: 1, due: Date.now() - 1000, reps: 2, correct: 1, wrong: 1, lapses: 0, streak: 0, introducedAt: Date.now(), lastSeen: null };
      for (const id of ids) if (s.items[id]) s.items[id].due = Date.now() - 1000;
      localStorage.setItem('nihongo.state.v1', JSON.stringify(s));
    });
    await page.goto('http://localhost:8123/#/review', { waitUntil: 'domcontentloaded' });
    await page.reload();
    await page.waitForSelector('.exercise', { timeout: 5000 });
    const backlog = await page.evaluate(() => ({
      heading: document.querySelector('.screen-head h1')?.textContent,
      lede: document.querySelector('.screen-head .lede')?.textContent,
      note: document.querySelector('.ex-note')?.textContent,
    }));
    console.log(`[${scheme}] backlog heading: "${backlog.heading}" | note: "${backlog.note}"`);
    check(/^20 of \d+ due$/.test(backlog.heading || ''), `[${scheme}] review heading should read "20 of N due", got "${backlog.heading}"`);
    check(/more due after this session/.test(backlog.note || ''), `[${scheme}] in-session backlog note missing`);
    check(/more will still be waiting/.test(backlog.lede || ''), `[${scheme}] pre-session backlog explanation missing`);
    await page.screenshot({ path: `/home/claude/nihongo/shots/review-backlog-${scheme}.png` });

    // ── lesson 13 is a real integrated challenge, not a placeholder
    await page.goto('http://localhost:8123/#/lesson/l:13', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(250);
    const l13 = await page.evaluate(() => ({
      title: document.querySelector('.screen-head h1')?.textContent,
      tips: document.querySelectorAll('.tip').length,
      vocab: document.querySelectorAll('.vocab-row').length,
      prose: document.querySelectorAll('.prose').length,
    }));
    console.log(`[${scheme}] lesson 13:`, JSON.stringify(l13));
    check(l13.tips >= 3 && l13.vocab >= 14, `[${scheme}] lesson 13 is still thin: ${JSON.stringify(l13)}`);

    // ── the て-form lessons render their conjugation tables
    await page.goto('http://localhost:8123/#/lesson/l:38', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(250);
    const conj = await page.evaluate(() => {
      const rows = [...document.querySelectorAll('table.conj tbody tr')];
      return { rows: rows.length, sample: rows.slice(0, 3).map(r => [...r.children].map(c => c.textContent.trim()).join(' / ')) };
    });
    console.log(`[${scheme}] l:38 conjugation table rows:`, conj.rows, conj.sample[0]);
    check(conj.rows === 9, `[${scheme}] l:38 conjugation table should have 9 rows, got ${conj.rows}`);
    const overflowConj = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(overflowConj <= 1, `[${scheme}] conjugation table pushes the page sideways by ${overflowConj}px`);

    // ── counter tables render, with irregular forms marked
    await page.goto('http://localhost:8123/#/lesson/l:44', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(250);
    const counters = await page.evaluate(() => ({
      cards: document.querySelectorAll('.counter-card').length,
      forms: document.querySelectorAll('.counter-form').length,
      irregular: [...document.querySelectorAll('.counter-form.irregular .cf-form')].map(e => e.textContent),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    console.log(`[${scheme}] l:44 counters:`, counters.cards, 'cards,', counters.forms, 'forms, irregular:', counters.irregular.join(' '));
    check(counters.cards === 2, `[${scheme}] l:44 should show 2 counter tables, got ${counters.cards}`);
    check(counters.irregular.includes('四時') && counters.irregular.includes('七時') && counters.irregular.includes('九時'),
      `[${scheme}] the three irregular hours are not marked: ${counters.irregular.join(' ')}`);
    check(counters.overflow <= 1, `[${scheme}] counter table pushes the page sideways by ${counters.overflow}px`);
    await page.screenshot({ path: `/home/claude/nihongo/shots/counters-${scheme}.png` });

    // ── the plain-form lesson shows a ます ↔ plain table
    await page.goto('http://localhost:8123/#/lesson/l:48', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(250);
    const plain = await page.evaluate(() => {
      const heads = [...document.querySelectorAll('table.conj th')].map(h => h.textContent);
      const first = [...(document.querySelector('table.conj tbody tr')?.children || [])].map(c => c.textContent.trim());
      return { heads, first, rows: document.querySelectorAll('table.conj tbody tr').length };
    });
    console.log(`[${scheme}] l:48 columns:`, plain.heads.join(' | '), '→', plain.first.join(' / '));
    check(plain.heads.includes('plain'), `[${scheme}] l:48 conjugation table lacks a plain column`);
    check(plain.rows === 11, `[${scheme}] l:48 should list 11 verbs, got ${plain.rows}`);

    // ── stage 3 exists and is reachable from Learn
    await page.goto('http://localhost:8123/#/learn', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(250);
    const stages = await page.evaluate(() => ({
      stages: [...document.querySelectorAll('.stage-head h2')].map(h => h.textContent),
      lessons: document.querySelectorAll('.lesson-row').length,
    }));
    console.log(`[${scheme}] stages:`, stages.stages.join(' · '), '|', stages.lessons, 'lessons');
    check(stages.stages.length === 4, `[${scheme}] expected 4 stages, got ${stages.stages.length}`);
    check(stages.lessons === 53, `[${scheme}] expected 53 lessons listed, got ${stages.lessons}`);

    // ── every practice mode must produce exercises or an honest empty state
    for (const mode of ['kana-hiragana', 'kana-katakana', 'vocabulary', 'kanji', 'grammar', 'particles', 'build', 'listening', 'weak']) {
      await page.goto(`http://localhost:8123/#/practice/${mode}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(260);
      const r = await page.evaluate(() => ({
        exercise: !!document.querySelector('.exercise .ex-stage > *'),
        empty: !!document.querySelector('.card .prose'),
      }));
      check(r.exercise || r.empty, `[${scheme}] practice mode ${mode} rendered nothing at all`);
    }

    await ctx.close();
  }

  // ── mobile layout
  const ctx = await browser.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  p.on('pageerror', e => fails.push(`[mobile] pageerror: ${e.message}`));
  await p.goto('http://localhost:8123/', { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.hero');
  const mob = await p.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    bottomnav: !!document.querySelector('.bottomnav') && getComputedStyle(document.querySelector('.bottomnav')).display !== 'none',
    sidebar: getComputedStyle(document.querySelector('.sidebar')).display,
  }));
  console.log('mobile:', JSON.stringify(mob));
  check(mob.overflow <= 1, `mobile page scrolls horizontally by ${mob.overflow}px`);
  check(mob.bottomnav, 'mobile bottom nav missing');
  check(mob.sidebar === 'none', 'sidebar should be hidden on mobile');
  await p.screenshot({ path: '/home/claude/nihongo/shots/mobile-home.png' });
  await p.click('.hero'); await p.waitForSelector('.lesson-actions');
  await p.click('.lesson-actions .btn'); await p.waitForSelector('.exercise');
  await p.screenshot({ path: '/home/claude/nihongo/shots/mobile-exercise.png' });
  const mob2 = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(mob2 <= 1, `mobile exercise view scrolls horizontally by ${mob2}px`);
  await ctx.close();

  await browser.close();
  server.close();

  console.log('\n=== FAILURES ===');
  console.log(fails.length ? fails.join('\n') : 'none');
  process.exit(fails.length ? 1 : 0);
})();
