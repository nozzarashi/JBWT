import { autoScroll, gotoWithRetry } from '../lib/browser.js';

const BASE_URL = 'https://innostage-group.ru';
const PAGE_URL = 'https://innostage-group.ru/career/vakancy/';

export const name = 'innostage';
export const displayName = 'Innostage';

export async function fetchVacancies(page) {
  await gotoWithRetry(page, PAGE_URL);
  await page.waitForSelector('a.vacancy-item', { timeout: 15000 }).catch(() => {});
  await autoScroll(page);

  const items = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a.vacancy-item'));
    return cards.map((card) => ({
      href: card.getAttribute('href') || '',
      title: (card.querySelector('.vacancy-content .h5')?.textContent || '').trim(),
    }));
  });

  return items
    .filter((it) => it.href && it.title)
    .map((it) => {
      const idMatch = it.href.match(/(\d+)/);
      const id = idMatch ? idMatch[1] : it.href;
      return {
        id,
        title: it.title,
        url: `${BASE_URL}/career/vakancy/${id}/`,
        searchText: it.title,
      };
    });
}
