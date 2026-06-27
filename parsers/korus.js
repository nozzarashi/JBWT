import { autoScroll, gotoWithRetry } from '../lib/browser.js';

const BASE_URL = 'https://career.korusconsulting.ru';
const PAGE_URL = 'https://career.korusconsulting.ru/vacancies/';

export const name = 'korus';
export const displayName = 'КОРУС Консалтинг';

export async function fetchVacancies(page) {
  await gotoWithRetry(page, PAGE_URL);
  await page.waitForSelector('a.p-vacancies-card', { timeout: 15000 }).catch(() => {});
  await autoScroll(page);

  const items = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a.p-vacancies-card'));
    return cards.map((card) => ({
      href: card.getAttribute('href') || '',
      title: (card.querySelector('.p-vacancies-card__title')?.textContent || '').trim(),
      tag: (card.querySelector('.p-vacancies-card__tag')?.textContent || '').trim(),
    }));
  });

  return items
    .filter((it) => it.href && it.title)
    .map((it) => {
      const idMatch = it.href.match(/\/vacancies\/([^/]+)\//);
      return {
        id: idMatch ? idMatch[1] : it.href,
        title: it.title,
        url: it.href.startsWith('http') ? it.href : BASE_URL + it.href,
        searchText: `${it.title} ${it.tag}`,
      };
    });
}
