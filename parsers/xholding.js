import { autoScroll, gotoWithRetry } from '../lib/browser.js';

const PAGE_URL = 'https://x-holding.ru/career/?q=Frontend';

export const name = 'xholding';
export const displayName = 'ИКС Холдинг';

export async function fetchVacancies(page) {
  await gotoWithRetry(page, PAGE_URL);
  await page.waitForSelector('.career-card', { timeout: 15000 }).catch(() => {});
  await autoScroll(page);

  const items = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.career-card'));
    return cards.map((card) => ({
      title: (card.querySelector('.career-card__caption')?.textContent || '').trim(),
      props: (card.querySelector('.career-card__props')?.textContent || '').replace(/\s+/g, ' ').trim(),
      href: card.querySelector('.career-card__link a')?.getAttribute('href') || '',
    }));
  });

  return items
    .filter((it) => it.href && it.title)
    .map((it) => {
      const idMatch = it.href.match(/vacancy\/(\d+)/);
      return {
        id: idMatch ? idMatch[1] : it.href,
        title: it.title,
        url: it.href,
        searchText: `${it.title} ${it.props}`,
      };
    });
}
