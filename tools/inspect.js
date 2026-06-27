// разведка структуры сайта: node tools/inspect.js <URL>
import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

const url = process.argv[2];
if (!url) {
  console.error('Использование: node tools/inspect.js <URL>');
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  locale: 'ru-RU',
});
const page = await context.newPage();

await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch((e) => console.log(e.message));
await page.waitForTimeout(4000);

console.log(`\nЗаголовок: ${await page.title()}`);
console.log(`URL:       ${page.url()}`);

const links = await page.evaluate(() =>
  Array.from(document.querySelectorAll('a[href]'))
    .map((a) => ({ href: a.getAttribute('href') || '', text: (a.textContent || '').trim().replace(/\s+/g, ' ') }))
    .filter((l) => /vacanc|vacancy|job|position/i.test(l.href) && l.text.length > 3)
    .map((l) => ({ href: l.href, text: l.text.slice(0, 120) }))
);

console.log(`\nСсылок-кандидатов: ${links.length}`);
for (const l of links.slice(0, 60)) console.log(`  [${l.text}]  →  ${l.href}`);

await writeFile('debug-page.html', await page.content(), 'utf8');
console.log('\nСохранил debug-page.html');

await browser.close();
