import { writeFile, readFile } from 'node:fs/promises';

const OUT_FILE = new URL('../events-data.json', import.meta.url);
const SOURCES = [
  { name: 'Малый театр', url: 'https://www.maly.ru/kogalym/events', parser: parseMaly },
  { name: 'СКК «Галактика»', url: 'https://www.skk-galaxy.ru/', parser: parseGalaxy },
  { name: 'Афиша7', url: 'https://afisha7.ru/kogalym', parser: parseAfisha7 },
  { name: 'Визит Когалым', url: 'https://vizitkogalym.ru/event/events.php', parser: parseVisitKogalym }
];

const IMAGE_BY_KEYWORD = [
  [/малый|театр|спектак|пётр|петр|беззабот|семья|мудрец/i, 'images/places-v7/34-43-filial-gosudarstvennogo-akademicheskogo-malogo-teatra-rossii-fbce84fa-v7-d4aa869cb1.jpg'],
  [/русск|музе/i, 'images/places-v7/35-32-russkiy-muzey-9e4059cf-v7-f06a79c8c5.jpg'],
  [/океан|аква|морск|галактик|подвод/i, 'images/places-v7/30-25-okeanarium-14369988-v7-e241de6c8d.jpg'],
  [/музей|выстав|нефт|ханты|этнограф/i, 'images/places-v7/36-22-muzeyno-vystavochnyy-tsentr-kogalyma-c33bd5bd-v7-bb88a093c1.jpg'],
  [/метро|молод/i, 'images/places-v7/33-17-kulturno-dosugovyy-kompleks-metro-bae9c6f4-v7-b4786055a7.jpg'],
  [/кино/i, 'images/places-v7/29-15-kinoteatr-aaac9143-v7-be29656937.jpg'],
  [/спорт|турнир|футбол|лед|йог/i, 'images/places-v7/41-11-dvorets-sporta-yubileynyy-5facf5ba-v7-4fc39bd5ea.jpg'],
  [/парк|дет|мастер/i, 'images/places-v7/25-29-park-pobedy-b1130a2f-v7-13200ce5c9.jpg']
];

const RU_MONTH = {
  'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3, 'мая': 4, 'июня': 5,
  'июля': 6, 'августа': 7, 'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11
};
const MONTH_PATTERN = Object.keys(RU_MONTH).join('|');
const WEEKDAY_PATTERN = 'понедельник|вторник|среда|четверг|пятница|суббота|воскресенье';

function cleanHtml(value = '') {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function absUrl(url, base) {
  try { return new URL(url, base).toString(); } catch { return base; }
}

function isoDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseDottedDate(value) {
  const match = String(value || '').match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  return `${yyyy}-${mm}-${dd}`;
}

function parseRuDate(value) {
  const match = String(value || '').toLowerCase().match(new RegExp(`(\\d{1,2})\\s+(${MONTH_PATTERN})(?:\\s+(20\\d{2}))?`, 'i'));
  if (!match) return null;
  const now = new Date();
  const day = Number(match[1]);
  const month = RU_MONTH[match[2]];
  let year = match[3] ? Number(match[3]) : now.getFullYear();
  const candidate = new Date(year, month, day);
  const threshold = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 21);
  if (!match[3] && candidate < threshold) year += 1;
  return isoDate(year, month, day);
}

function todayIso() {
  const now = new Date();
  return isoDate(now.getFullYear(), now.getMonth(), now.getDate());
}

function isRelevant(event) {
  const today = todayIso();
  const end = event.endDate || event.startDate;
  return Boolean(event.title && event.startDate && end >= today);
}

function getCategory(title = '', rawCategory = '') {
  const text = `${title} ${rawCategory}`.toLowerCase();
  if (/театр|спектак|пьес|сцена|премьера/.test(text)) return ['Театр', 'theater'];
  if (/кино|фильм|сеанс/.test(text)) return ['Кино', 'cinema'];
  if (/спорт|турнир|футбол|йог|тренировк|лед/.test(text)) return ['Спорт', 'sport'];
  if (/концерт|музык|групп|оркестр/.test(text)) return ['Концерт', 'concert'];
  if (/экскурс|подвод/.test(text)) return [rawCategory && /экскурс/i.test(rawCategory) ? rawCategory : 'Экскурсия', 'exhibition'];
  if (/выстав|музей|экспозиц/.test(text)) return ['Выставка', 'exhibition'];
  if (/дет|квест|викторин|мастер|семейн|игр|молод/.test(text)) return ['Детям', 'kids'];
  if (/празд|фестивал/.test(text)) return ['Праздник', 'kids'];
  return [rawCategory || 'Событие', 'other'];
}

function pickImage(event) {
  const text = `${event.title || ''} ${event.venue || ''} ${event.category || ''}`;
  const found = IMAGE_BY_KEYWORD.find(([re]) => re.test(text));
  return found ? found[1] : 'images/hero.jpg';
}

function normalizeEvent(event) {
  const [category, categoryKey] = getCategory(event.title, event.category);
  const normalized = {
    title: cleanHtml(event.title),
    category,
    categoryKey,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    time: event.time || '',
    venue: cleanHtml(event.venue || 'Место уточняется'),
    description: cleanHtml(event.description || 'Подробности смотрите в источнике события.'),
    image: event.image || '',
    url: event.url || '',
    price: event.price || '',
    age: event.age || '',
    sourceName: event.sourceName || 'Источник'
  };
  normalized.image = normalized.image || pickImage(normalized);
  return normalized;
}

function dedupe(events) {
  const seen = new Set();
  return events.filter(event => {
    if (!event.title || !event.startDate) return false;
    const key = `${event.title.toLowerCase().replace(/ё/g, 'е')}|${event.startDate}|${event.time}|${event.venue.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; KogalymEventsBot/2.0)' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

async function parseMaly() {
  const url = 'https://www.maly.ru/kogalym/events';
  const html = await fetchText(url);
  const dateRegex = new RegExp(`\\d{1,2}\\s+(?:${MONTH_PATTERN})\\s+20\\d{2}`, 'gi');
  const matches = [...html.matchAll(dateRegex)].map(match => ({ index: match.index, text: match[0] }));
  const events = [];
  for (let i = 0; i < matches.length; i += 1) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : html.length;
    const block = html.slice(start, end);
    const titleMatch = block.match(/<h2[^>]*>[\s\S]*?<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h2>/i);
    if (!titleMatch) continue;
    const title = cleanHtml(titleMatch[2]);
    const time = (cleanHtml(block).match(/\b(?:[01]?\d|2[0-3]):[0-5]\d\b/) || [''])[0];
    if (!title || !time) continue;
    const text = cleanHtml(block);
    const description = text
      .replace(matches[i].text, '')
      .replace(new RegExp(WEEKDAY_PATTERN, 'i'), '')
      .replace(title, '')
      .replace(time, '')
      .replace(/Купить билет.*/i, '')
      .trim()
      .slice(0, 240);
    events.push(normalizeEvent({
      title: `Спектакль «${title.replace(/[«»]/g, '').trim()}»`,
      category: 'Театр',
      startDate: parseRuDate(matches[i].text),
      time,
      venue: 'Филиал Малого театра в Когалыме',
      description: description || 'Спектакль в филиале Государственного академического Малого театра России в Когалыме.',
      url: absUrl(titleMatch[1], url),
      price: 'билеты в продаже',
      age: (text.match(/\b\d{1,2}\+/) || [''])[0],
      sourceName: 'Малый театр'
    }));
  }
  return events;
}

async function parseAfisha7() {
  const pages = [
    ['https://afisha7.ru/kogalym', 'Афиша7'],
    ['https://afisha7.ru/kogalym/teatr', 'Афиша7'],
    ['https://afisha7.ru/kogalym/vystavki', 'Афиша7'],
    ['https://afisha7.ru/kogalym/koncerty', 'Афиша7'],
    ['https://afisha7.ru/kogalym/vstrechi', 'Афиша7'],
    ['https://afisha7.ru/kogalym/obuchenie', 'Афиша7']
  ];
  const events = [];
  for (const [url, sourceName] of pages) {
    let html = '';
    try { html = await fetchText(url); } catch { continue; }
    const blocks = [...html.matchAll(/<h2[^>]*>[\s\S]*?<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h2>([\s\S]*?)(?=<h2|##\s*Места проведения|<footer|$)/gi)];
    for (const block of blocks) {
      const detailUrl = absUrl(block[1], url);
      const title = cleanHtml(block[2]);
      const body = block[3];
      const bodyText = cleanHtml(body);
      const dateRange = bodyText.match(/(\d{2}\.\d{2}\.\d{4})(?:[—–-](\d{2}\.\d{2}\.\d{4}))?/);
      if (!title || !dateRange) continue;
      const links = [...body.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)].map(m => cleanHtml(m[1])).filter(Boolean);
      const venue = links.reverse().find(x => !/подробнее|выставки|встречи|концерты|кино|спорт|театр|обучение|праздники|все события/i.test(x)) || 'Место уточняется';
      const category = (bodyText.match(/Выставки|Концерты|Кино|Спорт|Встречи|Обучение|Праздники|Театр|Детям/i) || ['Событие'])[0];
      const price = (bodyText.match(/от\s*\d+[\s\S]{0,8}₽/i) || [''])[0].trim();
      const age = (bodyText.match(/\b\d{1,2}\+/) || [''])[0];
      events.push(normalizeEvent({
        title,
        category,
        startDate: parseDottedDate(dateRange[1]),
        endDate: dateRange[2] ? parseDottedDate(dateRange[2]) : parseDottedDate(dateRange[1]),
        venue,
        description: `${category}. ${price || 'Стоимость уточняется'}${age ? `, ${age}` : ''}.`,
        url: detailUrl,
        price,
        age,
        sourceName
      }));
    }
  }
  return events;
}

async function parseGalaxy() {
  const url = 'https://www.skk-galaxy.ru/';
  const html = await fetchText(url);
  const text = cleanHtml(html).toLowerCase();
  const now = new Date();
  const year = now.getFullYear();
  const events = [];
  if (/подводная экскурсия[^.]{0,80}июн/i.test(text)) {
    events.push(normalizeEvent({
      title: 'Подводная экскурсия',
      category: 'Экскурсия',
      startDate: isoDate(year, 5, 1),
      endDate: isoDate(year, 5, 30),
      venue: 'Океанариум СКК «Галактика»',
      description: 'Июньское расписание подводных экскурсий в океанариуме СКК «Галактика».',
      url: 'https://www.skk-galaxy.ru/',
      age: '0+',
      sourceName: 'СКК «Галактика»'
    }));
  }
  if (/мастер-класс[^.]{0,120}1,?\s*5\s*и\s*6\s*июн|мастер-классы[^.]{0,120}1,?\s*5\s*и\s*6\s*июн/i.test(text)) {
    for (const day of [1, 5, 6]) {
      events.push(normalizeEvent({
        title: 'Мастер-классы от Морского клуба',
        category: 'Детям',
        startDate: isoDate(year, 5, day),
        venue: 'Океанариум СКК «Галактика»',
        description: 'Тематические мастер-классы Морского клуба в СКК «Галактика».',
        url: 'https://www.skk-galaxy.ru/',
        age: '0+',
        sourceName: 'СКК «Галактика»'
      }));
    }
  }
  return events;
}

async function parseVisitKogalym() {
  const url = 'https://vizitkogalym.ru/event/events.php';
  const html = await fetchText(url);
  // На странице есть официальный календарь дат, но карточки часто подгружаются скриптами.
  // Без названия события карточки не создаём, чтобы не выдумывать данные.
  const text = cleanHtml(html);
  if (!/События Когалыма/i.test(text)) return [];
  return [];
}

function verifiedSeedEvents() {
  const theaterUrl = 'https://www.maly.ru/kogalym/events';
  const galaxyUrl = 'https://www.skk-galaxy.ru/';
  return [
    ['2026-06-05', '19:00', 'Пётр I', '12+'],
    ['2026-06-06', '18:00', 'Пётр I', '12+'],
    ['2026-06-07', '18:00', 'Пётр I', '12+'],
    ['2026-08-28', '19:00', 'На всякого мудреца довольно простоты', '12+'],
    ['2026-08-29', '18:00', 'На всякого мудреца довольно простоты', '12+'],
    ['2026-08-30', '18:00', 'На всякого мудреца довольно простоты', '12+'],
    ['2026-10-08', '19:00', 'Беззаботные', '18+'],
    ['2026-10-09', '19:00', 'Беззаботные', '18+'],
    ['2026-10-10', '18:00', 'Расстроенная семья', '12+'],
    ['2026-10-11', '18:00', 'Расстроенная семья', '12+']
  ].map(([startDate, time, title, age]) => normalizeEvent({
    title: `Спектакль «${title}»`,
    category: 'Театр',
    startDate,
    time,
    venue: 'Филиал Малого театра в Когалыме',
    description: 'Спектакль в филиале Государственного академического Малого театра России в Когалыме.',
    url: theaterUrl,
    price: 'билеты в продаже',
    age,
    sourceName: 'Малый театр'
  })).concat([
    normalizeEvent({
      title: 'Подводная экскурсия',
      category: 'Экскурсия',
      startDate: '2026-06-01',
      endDate: '2026-06-30',
      venue: 'Океанариум СКК «Галактика»',
      description: 'Июньское расписание подводных экскурсий в океанариуме СКК «Галактика».',
      url: galaxyUrl,
      image: 'images/places-v7/30-25-okeanarium-14369988-v7-e241de6c8d.jpg',
      age: '0+',
      sourceName: 'СКК «Галактика»'
    }),
    normalizeEvent({
      title: 'Мастер-классы от Морского клуба',
      category: 'Детям',
      startDate: '2026-06-05',
      venue: 'Океанариум СКК «Галактика»',
      description: 'Тематические мастер-классы Морского клуба в СКК «Галактика».',
      url: galaxyUrl,
      image: 'images/places-v7/32-10-galaktika-7d0f47f0-v7-7323927a6f.jpg',
      age: '0+',
      sourceName: 'СКК «Галактика»'
    }),
    normalizeEvent({
      title: 'Мастер-классы от Морского клуба',
      category: 'Детям',
      startDate: '2026-06-06',
      venue: 'Океанариум СКК «Галактика»',
      description: 'Тематические мастер-классы Морского клуба в СКК «Галактика».',
      url: galaxyUrl,
      image: 'images/places-v7/32-10-galaktika-7d0f47f0-v7-7323927a6f.jpg',
      age: '0+',
      sourceName: 'СКК «Галактика»'
    })
  ]);
}

async function main() {
  const status = [];
  const parsed = [];
  for (const source of SOURCES) {
    try {
      const events = await source.parser();
      parsed.push(...events);
      status.push({ name: source.name, url: source.url, ok: true, count: events.length });
      console.log(`${source.name}: ${events.length}`);
    } catch (error) {
      status.push({ name: source.name, url: source.url, ok: false, error: error.message });
      console.warn(`${source.name}: ${error.message}`);
    }
  }

  const events = dedupe([...parsed, ...verifiedSeedEvents()])
    .filter(isRelevant)
    .sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)) || (a.time || '').localeCompare(b.time || '') || a.title.localeCompare(b.title, 'ru'));

  const payload = {
    updatedAt: new Date().toISOString(),
    source: 'github-actions-auto-update-v2',
    sources: SOURCES.map(source => source.url),
    sourceStatus: status,
    events
  };

  const next = JSON.stringify(payload, null, 2) + '\n';
  let previous = '';
  try { previous = await readFile(OUT_FILE, 'utf8'); } catch {}
  if (previous !== next) {
    await writeFile(OUT_FILE, next, 'utf8');
    console.log(`events-data.json updated: ${events.length} events`);
  } else {
    console.log('events-data.json unchanged');
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
