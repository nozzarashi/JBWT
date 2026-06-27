import { autoScroll, gotoWithRetry } from '../lib/browser.js';

const BASE_URL = 'https://magnit.tech';
const PAGE_URL = 'https://magnit.tech/vacancies';

export const name = 'magnit';
export const displayName = 'Magnit Tech';

export async function fetchVacancies(page) {
  await gotoWithRetry(page, PAGE_URL);
  await page.waitForSelector('a.vacancies__card', { timeout: 15000 }).catch(() => {});
  await autoScroll(page);

  const items = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a.vacancies__card'));
    return cards.map((card) => ({
      href: card.getAttribute('href') || '',
      title: (card.querySelector('.vacancies__card-title p')?.textContent || '').trim(),
      tech: (card.querySelector('.vacancies__card-description p')?.textContent || '').trim(),
    }));
  });

  return items
    .filter((it) => it.href && it.title)
    .map((it) => {
      const idMatch = it.href.match(/(\d+)\D*$/);
      return {
        id: idMatch ? idMatch[1] : it.href,
        title: it.title,
        url: it.href.startsWith('http') ? it.href : BASE_URL + it.href,
        searchText: `${it.title} ${it.tech}`,
      };
    });
}
