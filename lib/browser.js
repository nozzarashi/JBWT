import { chromium } from 'playwright';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export async function launchBrowser() {
  return chromium.launch({ headless: true });
}

export async function newContext(browser) {
  const context = await browser.newContext({
    userAgent: USER_AGENT,
    locale: 'ru-RU',
    timezoneId: 'Europe/Moscow',
    viewport: { width: 1366, height: 900 },
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
  return context;
}

export async function gotoWithRetry(page, url, { tries = 5, timeout = 45000, pause = 2500 } = {}) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
      return;
    } catch (err) {
      lastErr = err;
      await page.waitForTimeout(pause);
    }
  }
  throw lastErr;
}

export async function autoScroll(page, { maxScrolls = 60, stableLimit = 3, pause = 800 } = {}) {
  let stable = 0;
  let lastHeight = 0;
  for (let i = 0; i < maxScrolls; i++) {
    const height = await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
      return document.body.scrollHeight;
    });
    await page.waitForTimeout(pause);
    if (height === lastHeight) {
      if (++stable >= stableLimit) break;
    } else {
      stable = 0;
      lastHeight = height;
    }
  }
}

export async function clickLoadMore(page, selector, { maxClicks = 60, pause = 1500 } = {}) {
  for (let i = 0; i < maxClicks; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const btn = await page.$(selector);
    if (!btn) break;
    await btn.scrollIntoViewIfNeeded().catch(() => {});
    await btn.click().catch(() => {});
    await page.waitForTimeout(pause);
  }
}
