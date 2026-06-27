import { autoScroll, gotoWithRetry } from '../lib/browser.js';

const BASE_URL = 'https://job.lamoda.ru';
const PAGE_URL = 'https://job.lamoda.ru/vacancies?dir=razrabotka&dep=it&city=none';

export const name = 'lamoda';
export const displayName = 'Lamoda';

export async function fetchVacancies(page) {
  await gotoWithRetry(page, PAGE_URL);
  await page.waitForSelector('[class*="vacancy__name"]', { timeout: 15000 }).catch(() => {});
  await autoScroll(page);

  const items = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[class*="vacanciesResult__item"]'));
    return cards.map((card) => {
      const link = card.querySelector('a[href*="/vacancies/"]');
      return {
        href: link?.getAttribute('href') || '',
        title: (card.querySelector('[class*="vacancy__name"]')?.textContent || '').trim(),
      };
    });
  });

  return items
    .filter((it) => it.href && it.title)
    .map((it) => {
      const idMatch = it.href.match(/--(\d+)/);
      return {
        id: idMatch ? idMatch[1] : it.href,
        title: it.title,
        url: it.href.startsWith('http') ? it.href : BASE_URL + it.href,
        searchText: `${it.title} ${it.href}`,
      };
    });
}
