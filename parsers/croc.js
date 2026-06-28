import { gotoWithRetry } from '../lib/browser.js';

const BASE_URL = 'https://careers.croc.ru';

export const name = 'croc';
export const displayName = 'КРОК';

export async function fetchVacancies(page) {
  await gotoWithRetry(page, `${BASE_URL}/vacancies/`);
  await page.waitForTimeout(1500);

  const sectionLink = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.vacancy__card'));
    const dev = cards.find((c) => c.querySelector('h4')?.textContent?.trim() === 'Разработка');
    return dev?.querySelector('a.vacancy__card-all')?.getAttribute('href') || null;
  });
  if (!sectionLink) return [];

  await gotoWithRetry(page, `${BASE_URL}/vacancies/${sectionLink}`);
  await page.waitForTimeout(1500);

  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const btn = await page.$('text=Показать еще');
    if (!btn) break;
    await btn.scrollIntoViewIfNeeded().catch(() => {});
    await btn.click().catch(() => {});
    await page.waitForTimeout(1200);
  }

  const items = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.vacancy__card-item a'));
    return cards.map((a) => ({
      href: a.getAttribute('href') || '',
      title: (a.querySelector('span')?.textContent || '').trim(),
    }));
  });

  return items
    .filter((it) => it.href && it.title)
    .map((it) => ({
      id: it.href,
      title: it.title,
      url: it.href.startsWith('http') ? it.href : BASE_URL + it.href,
      searchText: it.title,
    }));
}
