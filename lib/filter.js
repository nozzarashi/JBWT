const FRONTEND_KEYWORDS = [
  'frontend',
  'front-end',
  'front end',
  'фронтенд',
  'фронт-енд',
  'фронт энд',
  'react',
  'reactjs',
  'vue',
  'vuejs',
  'javascript',
  'js-разработчик',
  'js разработчик',
  'typescript',
  'верстал',
  'ui-разработчик',
];

// проверяются первыми; ловушки подстрок: 'java' ⊂ 'javascript', 'go'/'node' дают ложные срабатывания
const STOP_KEYWORDS = [
  'fullstack',
  'full-stack',
  'full stack',
  'фуллстак',
  'фулстак',
  'фул-стак',
  'фул стак',
  'backend',
  'back-end',
  'бэкенд',
  'бекенд',
  'devops',
  'qa',
  'тестировщик',
  'аналитик',
  'data',
  'дата-',
  'go-разработчик',
  'golang',
  'python',
  'node',
  'angular',
  'java-разработчик',
  'php',
  'android',
  'ios',
  '1c',
  '1с',
  'битрикс',
  'bitrix',
];

export function matchesFrontend(title) {
  if (!title) return false;
  const t = title.toLowerCase();
  if (STOP_KEYWORDS.some((kw) => t.includes(kw))) return false;
  return FRONTEND_KEYWORDS.some((kw) => t.includes(kw));
}
