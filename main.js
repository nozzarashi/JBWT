import { launchBrowser, newContext } from './lib/browser.js';
import { parsers } from './parsers/index.js';
import { matchesFrontend } from './lib/filter.js';
import { loadState, saveState, pickNew, markSeen } from './lib/state.js';
import { notifyBatch } from './lib/notify.js';

const SILENT_FIRST_RUN = process.env.SILENT_FIRST_RUN === '1';
const DRY_RUN = process.env.DRY_RUN === '1';

async function run() {
  const state = await loadState();
  const browser = await launchBrowser();
  const groups = [];
  const errors = [];
  let totalNew = 0;

  for (const parser of parsers) {
    const isFirstRun = !state[parser.name];
    const context = await newContext(browser);
    const page = await context.newPage();

    try {
      console.log(`\n=== ${parser.displayName} ===`);
      const all = await parser.fetchVacancies(page);
      const frontend = all.filter((v) => matchesFrontend(v.searchText || v.title));
      const fresh = pickNew(state, parser.name, frontend);
      console.log(`всего: ${all.length}, фронт: ${frontend.length}, новых: ${fresh.length}`);

      if (isFirstRun && SILENT_FIRST_RUN) {
        console.log('первый запуск — запоминаю без уведомлений');
      } else if (fresh.length) {
        groups.push({
          displayName: parser.displayName,
          vacancies: fresh.map((v) => ({ title: v.title, url: v.url })),
        });
        totalNew += fresh.length;
      }

      markSeen(state, parser.name, frontend);
    } catch (err) {
      console.error(`ошибка в парсере ${parser.name}: ${err.message}`);
      errors.push({ displayName: parser.displayName, message: err.message });
    } finally {
      await context.close();
    }
  }

  await browser.close();

  if ((groups.length || errors.length) && !DRY_RUN) {
    await notifyBatch(groups, errors);
  }
  if (!DRY_RUN) {
    await saveState(state);
  }

  console.log(
    `\nновых вакансий: ${totalNew}, ошибок: ${errors.length}${DRY_RUN ? ' (dry run)' : ''}`
  );
}

run().catch((err) => {
  console.error('фатальная ошибка:', err);
  process.exit(1);
});
