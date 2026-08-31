// Verifies the bundled single file behaves identically to the module version,
// loaded from file:// with no server at all.
const { chromium } = require('playwright');
const fails = [];
const check = (c, m) => { if (!c) fails.push(m); };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ colorScheme: scheme, viewport: { width: 1180, height: 880 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    page.on('pageerror', e => fails.push(`[${scheme}] pageerror: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error' && !/fonts\.googleapis|ERR_/.test(m.text())) fails.push(`[${scheme}] console: ${m.text()}`); });

    await page.goto('file:///home/claude/nihongo/dist/index.html');
    await page.waitForSelector('.hero', { timeout: 6000 });
    check(!!(await page.$('.sidebar')), `[${scheme}] shell missing`);

    // full loop
    await page.click('.hero');
    await page.waitForSelector('.lesson-actions .btn');
    await page.click('.lesson-actions .btn');
    await page.waitForSelector('.exercise');
    for (let i = 0; i < 30; i++) {
      if (await page.$('.session-summary')) break;
      if (await page.$('.ex-footer .btn')) { await page.click('.ex-footer .btn'); }
      else if (await page.$('.choices .choice:not(:disabled)')) await page.click('.choices .choice:not(:disabled)');
      else if (await page.$('input.typed:not(:disabled)')) { await page.fill('input.typed', 'a'); await page.click('.typing .btn'); }
      else if (await page.$('.build-pool .chip:not(:disabled)')) await page.click('.build-pool .chip:not(:disabled)');
      await page.waitForTimeout(50);
    }
    check(!!(await page.$('.lesson-done')), `[${scheme}] lesson did not complete in the bundle`);
    const saved = await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('nihongo.state.v1') || 'null');
      return s && { lessons: Object.keys(s.lessons).length, items: Object.keys(s.items).length, answers: s.stats.totalAnswers };
    });
    check(saved && saved.lessons === 1 && saved.items >= 5 && saved.answers >= 5, `[${scheme}] bundle did not persist progress: ${JSON.stringify(saved)}`);
    console.log(scheme, 'bundle saved:', JSON.stringify(saved));

    // every route renders in the bundle too
    for (const [route, sel] of [['#/learn', '.lesson-list'], ['#/review', '.screen'], ['#/practice', '.mode-grid'], ['#/progress', '.progress-rows'], ['#/reference', '.ref-results'], ['#/settings', '.settings-actions']]) {
      await page.goto('file:///home/claude/nihongo/dist/index.html' + route);
      await page.waitForTimeout(220);
      check(!!(await page.$(sel)), `[${scheme}] bundled route ${route} failed`);
    }
    // reference should now list the kana from lesson 1
    await page.goto('file:///home/claude/nihongo/dist/index.html#/reference');
    await page.waitForTimeout(250);
    await page.click('.tabs .tab:nth-child(4)');
    await page.waitForTimeout(150);
    const refKana = await page.evaluate(() => document.querySelectorAll('.kana-grid.ref .kana-cell').length);
    console.log(scheme, 'reference kana listed:', refKana);
    check(refKana === 5, `[${scheme}] reference should list the 5 learned kana, got ${refKana}`);
    await page.screenshot({ path: `/home/claude/nihongo/shots/dist-reference-${scheme}.png` });

    await page.goto('file:///home/claude/nihongo/dist/index.html#/progress');
    await page.waitForTimeout(250);
    await page.screenshot({ path: `/home/claude/nihongo/shots/dist-progress-${scheme}.png` });
    await page.goto('file:///home/claude/nihongo/dist/index.html#/practice');
    await page.waitForTimeout(250);
    await page.screenshot({ path: `/home/claude/nihongo/shots/dist-practice-${scheme}.png` });
    await ctx.close();
  }
  await browser.close();
  console.log('\n=== FAILURES ===');
  console.log(fails.length ? fails.join('\n') : 'none');
  process.exit(fails.length ? 1 : 0);
})();
