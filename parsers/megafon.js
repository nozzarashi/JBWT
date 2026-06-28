import { gotoWithRetry } from '../lib/browser.js';

const BASE_URL = 'https://job.megafon.ru';
const FRONTEND_FILTER = 'specialties=25';
const MAX_PAGES = 10;

export const name = 'megafon';
export const displayName = 'МегаФон';

export async function fetchVacancies(page) {
  const collected = new Map();

  for (let p = 1; p <= MAX_PAGES; p++) {
    await gotoWithRetry(page, `${BASE_URL}/vacancy/all/any?${FRONTEND_FILTER}&page=${p}`);
    await page.waitForTimeout(1500);

    const items = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('a.tile__link'));
      return cards.map((a) => ({
        href: a.getAttribute('href') || '',
        title: (a.querySelector('h3.tile-vacancy__title')?.textContent || '').trim(),
        tech: (a.querySelector('.tile-vacancy__text')?.textContent || '').trim(),
      }));
    });

    const fresh = items.filter((it) => it.href && it.title && !collected.has(it.href));
    if (fresh.length === 0) break;
    for (const it of fresh) collected.set(it.href, it);
  }

  return [...collected.values()].map((it) => {
    const idMatch = it.href.match(/-(\d+)$/);
    return {
      id: idMatch ? idMatch[1] : it.href,
      title: it.title,
      url: it.href.startsWith('http') ? it.href : BASE_URL + it.href,
      searchText: `${it.title} ${it.tech}`,
    };
  });
}
