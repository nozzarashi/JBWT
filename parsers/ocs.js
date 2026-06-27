import { autoScroll, gotoWithRetry } from '../lib/browser.js';

const PAGE_URL = 'https://hr.ocs.ru/vacancies?category=informaczionnye-tehnologii';

export const name = 'ocs';
export const displayName = 'OCS';

export async function fetchVacancies(page) {
  await gotoWithRetry(page, PAGE_URL);
  await page.waitForSelector('a.vacancy-list', { timeout: 15000 }).catch(() => {});
  await autoScroll(page);

  const items = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a.vacancy-list'));
    return cards.map((card) => ({
      href: card.getAttribute('href') || '',
      title: (card.querySelector('.vacancy-list__title')?.textContent || '').trim(),
      info: (card.querySelector('.vacancy-list__info')?.textContent || '').trim(),
    }));
  });

  return items
    .filter((it) => it.href && it.title)
    .map((it) => {
      const idMatch = it.href.match(/\/vacancies\/([^/]+)\//);
      return {
        id: idMatch ? idMatch[1] : it.href,
        title: it.title,
        url: it.href,
        searchText: `${it.title} ${it.info}`,
      };
    });
}
