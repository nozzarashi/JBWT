import { autoScroll, gotoWithRetry } from '../lib/browser.js';

const BASE_URL = 'https://www.tbank.ru';
const PAGE_URL = 'https://www.tbank.ru/career/vacancies/it/?tcareer_it_profession=front-end-razrabotka';

export const name = 'tbank';
export const displayName = 'Т-Банк';

export async function fetchVacancies(page) {
  await gotoWithRetry(page, PAGE_URL);
  await page.waitForSelector('a[href*="/career/it/vacancy/"]', { timeout: 15000 }).catch(() => {});
  await autoScroll(page);

  const items = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a')).filter((a) =>
      (a.getAttribute('href') || '').includes('/career/it/vacancy/')
    );
    return links.map((link) => {
      // заголовок и кнопка лежат в одной карточке — поднимаемся до ближайшего предка с заголовком
      let card = link;
      while (card && !card.querySelector?.('[data-font-variant="heading-5"]')) {
        card = card.parentElement;
      }
      return {
        href: link.getAttribute('href') || '',
        title: (card?.querySelector('[data-font-variant="heading-5"]')?.textContent || '').trim(),
      };
    });
  });

  const seen = new Set();
  return items
    .filter((it) => it.href && it.title && !seen.has(it.href) && seen.add(it.href))
    .map((it) => {
      const idMatch = it.href.match(/([0-9a-f-]{36})/i);
      return {
        id: idMatch ? idMatch[1] : it.href,
        title: it.title,
        url: it.href.startsWith('http') ? it.href : BASE_URL + it.href,
        searchText: it.title,
      };
    });
}
