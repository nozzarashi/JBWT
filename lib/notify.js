const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const MAX_MESSAGE_LEN = 3500;

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

async function sendMessage(text) {
  if (!BOT_TOKEN || !CHAT_ID) {
    throw new Error('Не заданы BOT_TOKEN и/или CHAT_ID');
  }
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    throw new Error(`Telegram error ${res.status}: ${await res.text()}`);
  }
}

export async function notifyBatch(groups) {
  if (!groups.length) return;

  const total = groups.reduce((n, g) => n + g.vacancies.length, 0);
  const header = `🆕 <b>Новые фронтенд-вакансии: ${total}</b>`;

  const blocks = groups.map((g, i) => {
    const lines = g.vacancies.map(
      (v) => `   • <a href="${escapeHtml(v.url)}">${escapeHtml(v.title)}</a>`
    );
    return `${i + 1}. <b>${escapeHtml(g.displayName)}</b>\n${lines.join('\n')}`;
  });

  const messages = [];
  let current = header;
  for (const block of blocks) {
    if ((current + '\n\n' + block).length > MAX_MESSAGE_LEN) {
      messages.push(current);
      current = block;
    } else {
      current += '\n\n' + block;
    }
  }
  messages.push(current);

  for (const msg of messages) {
    await sendMessage(msg);
  }
}
