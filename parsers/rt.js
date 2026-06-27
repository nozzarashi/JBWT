import { gotoWithRetry } from '../lib/browser.js';

const BASE_URL = 'https://job.rt.ru';

export const name = 'rt';
export const displayName = 'Ростелеком';

export async function fetchVacancies(page) {
  await gotoWithRetry(page, `${BASE_URL}/search`);
  await page.waitForTimeout(2000);

  const items = await page.evaluate(async () => {
    const r = await fetch('/backend/api/vacancies?searchString=&page=0&size=1000', {
      headers: { accept: 'application/json' },
    });
    if (!r.ok) return [];
    const j = await r.json();
    return (j.vacancies || []).map((v) => ({ id: v.id, name: v.name }));
  });

  return items
    .filter((it) => it.id && it.name)
    .map((it) => ({
      id: String(it.id),
      title: it.name.trim(),
      url: `${BASE_URL}/vacancy/${it.id}`,
      searchText: it.name,
    }));
}
