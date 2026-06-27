import { gotoWithRetry } from '../lib/browser.js';

const BASE_URL = 'https://career.rwb.ru';

export const name = 'rwb';
export const displayName = 'Wildberries';

export async function fetchVacancies(page) {
  // запрос к API делаем из контекста страницы — так проходим антибот WB
  await gotoWithRetry(page, `${BASE_URL}/vacancies`);
  await page.waitForTimeout(2500);

  const items = await page.evaluate(async () => {
    const out = [];
    const limit = 100;
    for (let offset = 0; offset < 3000; offset += limit) {
      const url = `/crm-api/api/v1/pub/vacancies?limit=${limit}&offset=${offset}&direction_ids[]=3`;
      const r = await fetch(url, { headers: { accept: 'application/json' } });
      if (!r.ok) break;
      const j = await r.json();
      const batch = j?.data?.items || [];
      out.push(...batch.map((v) => ({ id: v.id, name: v.name })));
      const count = j?.data?.range?.count ?? batch.length;
      if (batch.length === 0 || offset + limit >= count) break;
    }
    return out;
  });

  return items
    .filter((it) => it.id && it.name)
    .map((it) => ({
      id: String(it.id),
      title: it.name.trim(),
      url: `${BASE_URL}/vacancies/${it.id}`,
      searchText: it.name,
    }));
}
