import { autoScroll, gotoWithRetry } from '../lib/browser.js';

const BASE_URL = 'https://career.uplab.ru';

export const name = 'uplab';
export const displayName = 'Uplab';

// сайт на Tilda: ссылки-атомы без текста, заголовок не привязан к ссылке — собираем из slug
function titleFromSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function fetchVacancies(page) {
  await gotoWithRetry(page, `${BASE_URL}/`);
  await page.waitForTimeout(2000);
  await autoScroll(page);

  const hrefs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href*="/vacancies/"]')).map((a) => a.getAttribute('href') || '')
  );

  const seen = new Set();
  return hrefs
    .map((href) => href.match(/\/vacancies\/([^/]+)\//)?.[1])
    .filter((slug) => slug && !seen.has(slug) && seen.add(slug))
    .map((slug) => ({
      id: slug,
      title: titleFromSlug(slug),
      url: `${BASE_URL}/vacancies/${slug}/`,
      searchText: slug.replace(/-/g, ' '),
    }));
}
