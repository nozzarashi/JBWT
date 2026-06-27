import { gotoWithRetry } from '../lib/browser.js';

const BASE_URL = 'https://magnit.tech';
const FRONTEND_FILTER = 'speciality_id[]=15960';
const MAX_PAGES = 20;

export const name = 'magnit';
export const displayName = 'Magnit Tech';

export async function fetchVacancies(page) {
  const collected = new Map();

  for (let p = 1; p <= MAX_PAGES; p++) {
    await gotoWithRetry(page, `${BASE_URL}/vacancies?${FRONTEND_FILTER}&page=${p}`);
    await page.waitForSelector('a.vacancies__card', { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(800);

    const items = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('a.vacancies__card'));
      return cards.map((card) => ({
        href: card.getAttribute('href') || '',
        title: (card.querySelector('.vacancies__card-title p')?.textContent || '').trim(),
        tech: (card.querySelector('.vacancies__card-description p')?.textContent || '').trim(),
      }));
    });

    const fresh = items.filter((it) => it.href && it.title && !collected.has(it.href));
    if (fresh.length === 0) break;
    for (const it of fresh) collected.set(it.href, it);
  }

  return [...collected.values()].map((it) => {
    const idMatch = it.href.match(/(\d+)\D*$/);
    return {
      id: idMatch ? idMatch[1] : it.href,
      title: it.title,
      url: it.href.startsWith('http') ? it.href : BASE_URL + it.href,
      searchText: `${it.title} ${it.tech}`,
    };
  });
}
