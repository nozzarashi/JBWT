import { gotoWithRetry } from '../lib/browser.js';

const API = 'https://prod-lkk-back.x5.ru/api/v2/x5-tech/vacancies/';
const DETAIL = 'https://x5.tech/vacancy/';

export const name = 'x5';
export const displayName = 'X5 Tech';

export async function fetchVacancies(page) {
  await gotoWithRetry(page, 'https://x5.tech/vacancy');
  await page.waitForTimeout(2000);

  const items = await page.evaluate(async (API) => {
    const out = [];
    let p = 1;
    let pageCount = 1;
    do {
      const r = await fetch(`${API}?page=${p}`, { headers: { accept: 'application/json' } });
      if (!r.ok) break;
      const j = await r.json();
      pageCount = j.page_count || 1;
      (j.items || []).forEach((v) => out.push({ id: v.id, name: v.name }));
      p++;
    } while (p <= pageCount && p <= 50);
    return out;
  }, API);

  return items
    .filter((it) => it.id && it.name)
    .map((it) => ({
      id: String(it.id),
      title: it.name.trim(),
      url: DETAIL + it.id,
      searchText: it.name,
    }));
}
