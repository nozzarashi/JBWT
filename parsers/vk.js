import { autoScroll, gotoWithRetry } from '../lib/browser.js';

const BASE_URL = 'https://team.vk.company';
const PAGE_URL = 'https://team.vk.company/vacancy/?tags=2609';

export const name = 'vk';
export const displayName = 'VK Team';

export async function fetchVacancies(page) {
  await gotoWithRetry(page, PAGE_URL);
  await page.waitForSelector('a[class*="vacancyItem"]', { timeout: 15000 }).catch(() => {});
  await autoScroll(page);

  const items = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[class*="vacancyItem"]'));
    return cards.map((card) => ({
      href: card.getAttribute('href') || '',
      title: (card.querySelector('[class*="vacancyItemTitle"]')?.textContent || '').trim(),
      desc: (card.querySelector('[class*="DescriptionText"]')?.textContent || '').trim(),
    }));
  });

  return items
    .filter((it) => it.href && it.title)
    .map((it) => {
      const idMatch = it.href.match(/\/vacancy\/(\d+)/);
      return {
        id: idMatch ? idMatch[1] : it.href,
        title: it.title,
        url: it.href.startsWith('http') ? it.href : BASE_URL + it.href,
        searchText: `${it.title} ${it.desc}`,
      };
    });
}
