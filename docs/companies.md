# Карьерные сайты IT-компаний РФ

Справочник для поиска фронтенд-вакансий. Часть сайтов уже мониторит бот (✅), часть —
для ручного отклика (нет удобной страницы / антибот / вакансии через hh.ru).

## Уже мониторит бот (parsers/)

| Компания | Сайт | Как берём |
|---|---|---|
| Magnit Tech | magnit.tech/vacancies | DOM |
| Lamoda | job.lamoda.ru | DOM (раздел «Разработка») |
| Т1 | career.t1.ru | DOM + кнопка «Загрузить ещё» |
| КОРУС Консалтинг | career.korusconsulting.ru | DOM |
| Cloud.ru | cloud.ru/career | DOM (раздел «Разработка») |
| МТС | job.mts.ru | DOM + «Загрузить ещё» (категория IT) |
| OCS | hr.ocs.ru | DOM (категория IT) |
| Wildberries | career.rwb.ru | **API** (раздел «Разработка») |
| IBS | ibs.ru/career | DOM (направление «Разработка») |
| Т-Банк | tbank.ru/career | DOM (фильтр front-end) ⚠️ антибот, иногда не пускает |
| VK Team | team.vk.company | DOM (тег Frontend) |
| ИКС Холдинг | x-holding.ru/career | DOM (отклик ведёт на hh.ru) |
| Innostage | innostage-group.ru/career | DOM |
| Uplab | career.uplab.ru | DOM (Tilda, заголовок из slug) |
| X5 Tech | x5.tech/vacancy | **API** (пагинация) |
| Ростелеком | job.rt.ru | **API** (все 500+ одним запросом) |

### Отложены (вернуться)
- **ДНС Технологии** — dns-tech.ru/vacancies: на момент разработки сайт лежал («Ошибка сервера»).
  Запасной источник: career.habr.com/companies/dns-tech.
- **Skyeng** — vacancies.skyeng.ru: на сайте только продажи/маркетинг, разработки нет
  (тех-найм идёт через Huntflow). Парсер дал бы вечный 0.

## Для ручного отклика (крупные/средние IT РФ)

Удобной/стабильной страницы вакансий нет, либо вакансии на hh.ru, либо сильный антибот.
Проверяй руками — отклик через форму на сайте или через hh.ru.

| Компания | Где искать вакансии |
|---|---|
| Яндекс | yandex.ru/jobs (фильтр «Разработка → Фронтенд») |
| Сбер / SberTech | sbertech.ru/career, sber.ru/vacancies |
| Avito | avito.tech/vacancy |
| Ozon | career.ozon.ru ⚠️ сильный антибот (Cloudflare) |
| Kaspersky | kaspersky.ru → career |
| Positive Technologies | career.ptsecurity.com |
| Selectel | selectel.ru/careers |
| Nexign | nexign.com/career |
| Aston (ex-Andersen) | astondev.ru/vacancies |
| Naumen | naumen.ru/career |
| СКБ Контур | kontur.ru/jobs |
| 2ГИС | 2gis.ru/careers |
| inDrive | indrive.com/careers |
| Самокат | samokat.tech |
| ЦИАН | cian.ru → вакансии |
| HeadHunter (hh.ru сам) | hh.ru/employer/... |
| Dodo Engineering | dodo.dev / hh |
| Точка (банк) | rabota.tochka.com |
| Купер (ex-СберМаркет) | kuper.tech |
| Wildberries (общий) | job.wb.ru (сервисные позиции) |
| Газпромбанк Тех | gazprombank.tech |
| Альфа-Банк | alfabank.ru/career (IT) |
| Райффайзен Тех | raiffeisen.tech |
| VK (общий) | team.vk.company (другие теги, не только 2609) |
| Авито, Ozon, Циан — | также активно постят на hh.ru / career.habr.com |

> Глобально: **hh.ru** и **career.habr.com** агрегируют большинство фронт-вакансий этих
> компаний — если у компании нет своей страницы, ищи её вакансии там по названию.
