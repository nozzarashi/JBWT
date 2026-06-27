import { autoScroll, gotoWithRetry } from '../lib/browser.js';

const BASE_URL = 'https://ibs.ru';
const PAGE_URL = 'https://ibs.ru/career/jobs/filter/napravlenie-is-razrabotka/apply/';

export const name = 'ibs';
export const displayName = 'IBS';

export async function fetchVacancies(page) {
  await gotoWithRetry(page, PAGE_URL);
  await page.waitForSelector('a.job_item', { timeout: 15000 }).catch(() => {});
  await autoScroll(page);

  const items = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a.job_item'));
    return cards.map((card) => ({
      href: card.getAttribute('href') || '',
      title: (card.querySelector('.job_item__title')?.textContent || '').trim(),
      tags: (card.querySelector('.job_item__tags')?.textContent || '').replace(/\s+/g, ' ').trim(),
    }));
  });

  return items
    .filter((it) => it.href && it.title)
    .map((it) => {
      const idMatch = it.href.match(/\/jobs\/([^/]+)\//);
      return {
        id: idMatch ? idMatch[1] : it.href,
        title: it.title,
        url: it.href.startsWith('http') ? it.href : BASE_URL + it.href,
        searchText: `${it.title} ${it.tags}`,
      };
    });
}
