import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const STATE_PATH = new URL('../state.json', import.meta.url);
const MAX_IDS_PER_SOURCE = 500;

export async function loadState() {
  if (!existsSync(STATE_PATH)) return {};
  try {
    return JSON.parse(await readFile(STATE_PATH, 'utf8'));
  } catch {
    return {};
  }
}

export async function saveState(state) {
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

export function pickNew(state, source, vacancies) {
  const seen = new Set(state[source] || []);
  return vacancies.filter((v) => !seen.has(v.id));
}

export function markSeen(state, source, vacancies) {
  const seen = new Set(state[source] || []);
  for (const v of vacancies) seen.add(v.id);
  state[source] = [...seen].slice(-MAX_IDS_PER_SOURCE);
}
