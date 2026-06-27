import { autoScroll, gotoWithRetry } from '../lib/browser.js';

const BASE_URL = 'https://cloud.ru';
const PAGE_URL = 'https://cloud.ru/career/vacancies?unit=1748201';

export const name = 'cloud';
export const displayName = 'Cloud.ru';

export async function fetchVacancies(page) {
  await gotoWithRetry(page, PAGE_URL);
  await page.waitForSelector('a[class*="Catalog_card"]', { timeout: 15000 }).catch(() => {});
  await autoScroll(page);

  const items = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[class*="Catalog_card"]'));
    return cards.map((card) => ({
      href: card.getAttribute('href') || '',
      title: (card.querySelector('[class*="Catalog_title"]')?.textContent || '').trim(),
    }));
  });

  return items
    .filter((it) => it.href && it.title)
    .map((it) => {
      const idMatch = it.href.match(/(\d+)/);
      return {
        id: idMatch ? idMatch[1] : it.href,
        title: it.title,
        url: it.href.startsWith('http') ? it.href : BASE_URL + it.href,
        searchText: it.title,
      };
    });
}
