import { autoScroll, clickLoadMore, gotoWithRetry } from '../lib/browser.js';

const BASE_URL = 'https://job.mts.ru';
const PAGE_URL = 'https://job.mts.ru/vacancies?cat=rabota-v-it';

export const name = 'mts';
export const displayName = 'МТС';

export async function fetchVacancies(page) {
  await gotoWithRetry(page, PAGE_URL);
  await page.waitForSelector('a.vacancy-card', { timeout: 15000 }).catch(() => {});
  await clickLoadMore(page, 'text=Загрузить ещё');
  await autoScroll(page);

  const items = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a.vacancy-card'));
    return cards.map((card) => ({
      href: card.getAttribute('href') || '',
      title: (card.querySelector('.vacancy-card__title')?.textContent || '').trim(),
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
