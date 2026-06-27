import { autoScroll, clickLoadMore, gotoWithRetry } from '../lib/browser.js';

const BASE_URL = 'https://career.t1.ru';
const PAGE_URL = 'https://career.t1.ru/vacancies?direction=5142';

export const name = 't1';
export const displayName = 'Т1';

export async function fetchVacancies(page) {
  await gotoWithRetry(page, PAGE_URL);
  await page.waitForSelector('a[href*="vacancy-detail"]', { timeout: 15000 }).catch(() => {});
  await clickLoadMore(page, 'text=Загрузить ещё');
  await autoScroll(page);

  const items = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href*="vacancy-detail"]'));
    return cards.map((card) => {
      const top = card.querySelector('[class*="BoxVacancyTop"]');
      const tags = Array.from(card.querySelectorAll('[class*="BoxTag"]'))
        .map((s) => s.textContent.trim())
        .join(' ');
      return {
        href: card.getAttribute('href') || '',
        title: (top?.nextElementSibling?.textContent || '').trim(),
        tags,
      };
    });
  });

  return items
    .filter((it) => it.href && it.title)
    .map((it) => {
      const idMatch = it.href.match(/id=(\d+)/);
      return {
        id: idMatch ? idMatch[1] : it.href,
        title: it.title,
        url: it.href.startsWith('http') ? it.href : BASE_URL + it.href,
        searchText: `${it.title} ${it.tags}`,
      };
    });
}
