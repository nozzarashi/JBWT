// узнать свой CHAT_ID: node --env-file=.env tools/get-chat-id.js
// перед запуском напиши боту в Telegram любое сообщение (например /start)
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('Сначала впиши BOT_TOKEN в .env');
  process.exit(1);
}

const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
const data = await res.json();

if (!data.ok) {
  console.error('Telegram вернул ошибку:', data);
  process.exit(1);
}
if (!data.result.length) {
  console.log('Пока нет сообщений. Напиши боту /start и запусти ещё раз.');
  process.exit(0);
}

const seen = new Set();
for (const upd of data.result) {
  const chat = upd.message?.chat || upd.my_chat_member?.chat;
  if (chat && !seen.has(chat.id)) {
    seen.add(chat.id);
    const who = chat.username ? '@' + chat.username : `${chat.first_name || ''} ${chat.last_name || ''}`.trim();
    console.log(`CHAT_ID = ${chat.id}   (${who})`);
  }
}
