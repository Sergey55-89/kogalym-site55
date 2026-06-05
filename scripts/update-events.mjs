import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const OUT_FILE = new URL('../events-data.json', import.meta.url);
const EVENTS_IMAGE_DIR = new URL('../images/events/', import.meta.url);
const SOURCES = [
  { name: 'VizitKogalym / Кинотеатр «Галактика»', url: 'https://vizitkogalym.ru/movies/index.php', parser: parseVizitKogalymMovies },
  { name: 'Малый театр', url: 'https://www.maly.ru/kogalym/events', parser: parseMaly },
  { name: 'Кинотеатр «Галактика»', url: 'https://galaxykino.ru/schedule/', parser: parseGalaxyKino },
  { name: 'СКК «Галактика»', url: 'https://www.skk-galaxy.ru/', parser: parseGalaxy },
  { name: 'Афиша7', url: 'https://afisha7.ru/kogalym', parser: parseAfisha7 },
  { name: 'Русский музей', url: 'https://rusmuseum.ru/', parser: parseRusMuseumOfficial },
  { name: 'Визит Когалым', url: 'https://vizitkogalym.ru/event/events.php', parser: parseVisitKogalym }
];


const IMAGE_BY_TITLE = [
  [/п[её]тр\s*i|п[её]тр\s*1/i, 'https://static.dev.maly.ru/gallery/589/615b66f38520f.jpg'],
  [/мудрец|простоты/i, 'https://static.dev.maly.ru/gallery/37/69b7db998a3a0.jpg'],
  [/беззабот/i, 'https://static.dev.maly.ru/gallery/1029/6968cf0619139.jpg'],
  [/расстроенная\s+семья/i, 'https://static.dev.maly.ru/gallery/1041/69984aaf214ed.jpg']
];


const LOCAL_IMAGE_BY_TITLE = [
  [/подвод|океанариум|аквариум|морск/i, 'images/places-v7/30-25-okeanarium-14369988-v7-e241de6c8d.jpg'],
  [/п[её]тр\s*i|п[её]тр\s*1/i, 'images/events/petr-i.jpg'],
  [/мудрец|простоты/i, 'images/events/mudrets.jpg'],
  [/беззабот/i, 'images/events/bezzabotnye.jpg'],
  [/расстроенная\s+семья/i, 'images/events/rasstroennaya-semya.jpg']
];

const IMAGE_BY_KEYWORD = [
  [/подвод|океанариум|аквариум|морск/i, 'images/places-v7/30-25-okeanarium-14369988-v7-e241de6c8d.jpg'],
  [/п[её]тр\s*i|п[её]тр\s*1/i, 'images/events/petr-i.jpg'],
  [/мудрец|простоты/i, 'images/events/mudrets.jpg'],
  [/беззабот/i, 'images/events/bezzabotnye.jpg'],
  [/расстроенная\s+семья/i, 'images/events/rasstroennaya-semya.jpg'],
  [/кино|фильм|сеанс|мультфильм|киноклуб/i, 'images/events/fallback-cinema.jpg'],
  [/малый|театр|спектак|пьес|премьера/i, 'images/events/fallback-theater.jpg'],
  [/спорт|турнир|футбол|лед|йог/i, 'images/events/fallback-sport.jpg'],
  [/концерт|музык|оркестр|групп/i, 'images/events/fallback-concert.jpg'],
  [/парк|дет|мастер|семейн|игр/i, 'images/events/fallback-kids.jpg'],
  [/русск|русский музей|широка страна/i, 'images/places-v7/35-32-russkiy-muzey-9e4059cf-v7-f06a79c8c5.jpg'],
  [/музейно|мвц|нить времени|швейн|музей|выстав|экспозиц|нефт|ханты|этнограф/i, 'images/places-v7/36-22-muzeyno-vystavochnyy-tsentr-kogalyma-c33bd5bd-v7-bb88a093c1.jpg'],
  [/океан|аква|морск|галактик|подвод|экскурс/i, 'images/places-v7/30-25-okeanarium-14369988-v7-e241de6c8d.jpg'],
  [/метро|молод/i, 'images/events/fallback-event.jpg']
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


function htmlDecode(value = '') {
  return String(value)
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&amp;/g, '&')
    .trim();
}

function getAttrs(tag = '') {
  const attrs = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(["'])([\s\S]*?)\2/g)) {
    attrs[match[1].toLowerCase()] = htmlDecode(match[3]);
  }
  return attrs;
}

function looksLikeRealImage(url = '') {
  const value = String(url).trim();
  if (!value || /^data:/i.test(value)) return false;
  if (/\.(svg|ico)(?:[?#].*)?$/i.test(value)) return false;
  if (/logo|favicon|sprite|icon|loader|placeholder|blank|pixel|counter/i.test(value)) return false;
  return /\.(jpe?g|png|webp)(?:[?#].*)?$/i.test(value) || /image|upload|uploads|poster|afisha|media|files|cache|resize|photo|img|picture/i.test(value);
}

function extractImageFromHtml(html = '', baseUrl = '', title = '') {
  const candidates = [];
  for (const tag of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = getAttrs(tag[0]);
    const key = `${attrs.property || ''} ${attrs.name || ''}`.toLowerCase();
    if (/(og:image|twitter:image|image)/.test(key) && attrs.content) candidates.push(attrs.content);
  }
  for (const tag of html.matchAll(/<link\b[^>]*>/gi)) {
    const attrs = getAttrs(tag[0]);
    if (/image_src/i.test(attrs.rel || '') && attrs.href) candidates.push(attrs.href);
  }
  for (const tag of html.matchAll(/<img\b[^>]*>/gi)) {
    const attrs = getAttrs(tag[0]);
    candidates.push(attrs['data-src'], attrs['data-original'], attrs['data-lazy-src'], attrs.src);
  }
  const cleanedTitle = cleanHtml(title).toLowerCase().replace(/[«»]/g, '');
  const titleWords = cleanedTitle.split(/\s+/).filter(word => word.length > 4).slice(0, 5);
  const scored = candidates
    .filter(Boolean)
    .map(src => absUrl(src, baseUrl))
    .filter(looksLikeRealImage)
    .map(url => {
      const lower = decodeURIComponent(url).toLowerCase();
      let score = 0;
      if (/poster|afisha|event|spectacle|performance|upload|uploads|media|files|cache|photo/i.test(lower)) score += 5;
      if (/thumb|small|preview/i.test(lower)) score -= 1;
      for (const word of titleWords) if (lower.includes(word)) score += 3;
      return { url, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored[0]?.url || '';
}

async function fetchDetailImage(url, title) {
  if (!url) return '';
  try {
    const html = await fetchText(url);
    return extractImageFromHtml(html, url, title);
  } catch {
    return '';
  }
}

function imageExtension(url = '', contentType = '') {
  if (/webp/i.test(contentType)) return 'webp';
  if (/png/i.test(contentType)) return 'png';
  if (/jpe?g/i.test(contentType)) return 'jpg';
  const path = new URL(url).pathname.toLowerCase();
  if (path.endsWith('.webp')) return 'webp';
  if (path.endsWith('.png')) return 'png';
  return 'jpg';
}

async function downloadExternalImages(events) {
  await mkdir(EVENTS_IMAGE_DIR, { recursive: true });
  for (const event of events) {
    if (!/^https?:\/\//i.test(event.image || '')) continue;
    const originalImage = event.image;
    try {
      const response = await fetch(originalImage, {
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; KogalymEventsBot/2.1)',
          'accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'referer': event.url || originalImage
        }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const contentType = response.headers.get('content-type') || '';
      if (!/image\//i.test(contentType)) throw new Error(`not image: ${contentType}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length < 4096 || buffer.length > 8 * 1024 * 1024) throw new Error(`bad image size: ${buffer.length}`);
      const hash = createHash('sha1').update(`${event.title}|${event.startDate}|${originalImage}`).digest('hex').slice(0, 18);
      const ext = imageExtension(originalImage, contentType);
      const filename = `${hash}.${ext}`;
      await writeFile(new URL(filename, EVENTS_IMAGE_DIR), buffer);
      event.image = `images/events/${filename}`;
    } catch (error) {
      console.warn(`image skipped for ${event.title}: ${error.message}`);
      event.image = pickLocalImage(event) || pickImage(event);
    }
  }
  return events;
}

function isoDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDottedDate(date) {
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
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


function isNotOldManualEvent(event) {
  const text = `${event.title || ''} ${event.description || ''}`.toLowerCase().replace(/ё/g, 'е');
  if (/подводная экскурсия/.test(text)) return false;
  return true;
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
  if (/выстав|музей|экспозиц/.test(text)) return ['Выставка', 'exhibition'];
  if (/экскурс|подвод/.test(text)) return [rawCategory && /экскурс/i.test(rawCategory) ? rawCategory : 'Экскурсия', 'other'];
  if (/дет|квест|викторин|мастер|семейн|игр|молод/.test(text)) return ['Детям', 'kids'];
  if (/празд|фестивал/.test(text)) return ['Праздник', 'kids'];
  return [rawCategory || 'Событие', 'other'];
}

function pickLocalImage(event) {
  const text = `${event.title || ''} ${event.venue || ''} ${event.category || ''}`;
  const localImage = LOCAL_IMAGE_BY_TITLE.find(([re]) => re.test(text));
  return localImage ? localImage[1] : '';
}

function pickImage(event) {
  const text = `${event.title || ''} ${event.venue || ''} ${event.category || ''}`;
  const localImage = pickLocalImage(event);
  if (localImage) return localImage;
  const found = IMAGE_BY_KEYWORD.find(([re]) => re.test(text));
  return found ? found[1] : 'images/events/fallback-event.jpg';
}


function capRuText(value = '') {
  const text = String(value || '').trim();
  if (!text) return text;
  if (/^(https?:|mailto:)/i.test(text)) return text;
  if (/^г\.\s/i.test(text)) return text;
  return text.replace(/[A-Za-zА-Яа-яЁё]/, ch => ch.toLocaleUpperCase('ru-RU'));
}


function normalizeEvent(event) {
  const [category, categoryKey] = getCategory(event.title, event.category);
  const normalized = {
    title: cleanHtml(event.title),
    category,
    categoryKey,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    time: capRuText(event.time || ''),
    venue: cleanHtml(event.venue || 'Место уточняется'),
    description: cleanHtml(event.description || 'Подробности смотрите в источнике события.'),
    image: event.image || '',
    url: event.url || '',
    sourceUrl: event.sourceUrl || '',
    schedule: capRuText(event.schedule || ''),
    scheduleShort: capRuText(event.scheduleShort || ''),
    sessions: Array.isArray(event.sessions) ? event.sessions : [],
    format: capRuText(event.format || ''),
    address: cleanHtml(event.address || ''),
    price: capRuText(event.price || ''),
    priceDisplay: capRuText(event.priceDisplay || ''),
    age: event.age || '',
    refundPolicy: capRuText(event.refundPolicy || ''),
    refundUrl: event.refundUrl || '',
    trailerUrl: event.trailerUrl || '',
    trailerEmbedUrl: event.trailerEmbedUrl || '',
    trailerSourceName: event.trailerSourceName || '',
    sourceName: event.sourceName || 'Источник'
  };
  normalized.image = normalized.image || pickImage(normalized);
  if (/подвод|океанариум|аквариум|морск/i.test(`${normalized.title} ${normalized.venue} ${normalized.category}`)) normalized.image = 'images/places-v7/30-25-okeanarium-14369988-v7-e241de6c8d.jpg';
  if (normalized.categoryKey === 'cinema' && /places-v7\/29-15-kinoteatr/i.test(normalized.image)) normalized.image = 'images/events/fallback-cinema.jpg';
  if (normalized.categoryKey === 'theater' && /places-v7\/34-43-filial/i.test(normalized.image)) normalized.image = pickImage(normalized);
  return normalized;
}

function dedupe(events) {
  const map = new Map();

  for (const event of events) {
    if (!event.title || !event.startDate) continue;
    const normalizedTitle = event.title.toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ').trim();
    const normalizedVenue = String(event.venue || '').toLowerCase().replace(/ё/g, 'е').trim();
    const isCinema = event.categoryKey === 'cinema' || /кино|фильм/.test(`${event.title} ${event.category}`);
    const key = isCinema
      ? `${normalizedTitle}|${event.startDate}|${normalizedVenue}`
      : `${normalizedTitle}|${event.startDate}|${event.time}|${normalizedVenue}`;

    const prev = map.get(key);
    if (!prev) {
      map.set(key, event);
      continue;
    }

    const prevScore = (Array.isArray(prev.sessions) && prev.sessions.length ? 10 : 0) + (prev.priceDisplay ? 5 : 0) + (prev.schedule ? 2 : 0);
    const nextScore = (Array.isArray(event.sessions) && event.sessions.length ? 10 : 0) + (event.priceDisplay ? 5 : 0) + (event.schedule ? 2 : 0);
    if (nextScore > prevScore) map.set(key, event);
  }

  return [...map.values()];
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
    const detailUrl = absUrl(titleMatch[1], url);
    const time = (cleanHtml(block).match(/\b(?:[01]?\d|2[0-3]):[0-5]\d\b/) || [''])[0];
    if (!title || !time) continue;
    const image = extractImageFromHtml(block, url, title) || await fetchDetailImage(detailUrl, title);
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
      url: detailUrl,
      image,
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
      const image = extractImageFromHtml(body, url, title) || await fetchDetailImage(detailUrl, title);
      events.push(normalizeEvent({
        title,
        category,
        startDate: parseDottedDate(dateRange[1]),
        endDate: dateRange[2] ? parseDottedDate(dateRange[2]) : parseDottedDate(dateRange[1]),
        venue,
        description: `${category}. ${price || 'Стоимость уточняется'}${age ? `, ${age}` : ''}.`,
        url: detailUrl,
        image,
        price,
        age,
        sourceName
      }));
    }
  }
  return events;
}



function uniqueValues(values) {
  return [...new Set(values.map(value => String(value || '').trim()).filter(Boolean))];
}

function extractCinemaSessions(block = '') {
  const text = cleanHtml(block);
  return uniqueValues([...text.matchAll(/\b(?:[01]?\d|2[0-3]):[0-5]\d\b/g)].map(match => match[0]))
    .filter(time => !/^0:/.test(time));
}

function extractCinemaPrice(block = '') {
  const text = cleanHtml(block);
  const numbers = uniqueValues([...text.matchAll(/(?:от\s*)?(\d{2,4})\s*(?:₽|руб\.?|р\.?)/gi)].map(match => match[1]))
    .map(Number)
    .filter(value => value > 0 && value < 5000)
    .sort((a, b) => a - b);
  if (!numbers.length) return '';
  const min = numbers[0];
  const max = numbers[numbers.length - 1];
  return min === max ? `${min} ₽` : `${min}–${max} ₽`;
}

function extractCinemaFormat(block = '') {
  const text = cleanHtml(block).toUpperCase();
  const formats = uniqueValues([...text.matchAll(/\b(?:2D|3D|IMAX|ATMOS)\b/g)].map(match => match[0]));
  return formats.length ? formats.join(', ') : '2D';
}



function stripCinemaPrefix(value = '') {
  return String(value || '').replace(/^\s*Кино:\s*/i, '').trim();
}

function rutubeTrailerSearch(title = '') {
  return `https://rutube.ru/search/?query=${encodeURIComponent(`${stripCinemaPrefix(title)} трейлер`)}`;
}


function trailerEmbedFromUrl(url = '') {
  const value = String(url || '').trim();
  if (!value) return '';

  const rutube = value.match(/rutube\.ru\/(?:video|play\/embed)\/([A-Za-z0-9_-]+)/i);
  if (rutube) return `https://rutube.ru/play/embed/${rutube[1]}`;

  const vk = value.match(/vk\.com\/video(-?\d+)_(\d+)/i) || value.match(/vkvideo\.ru\/video(-?\d+)_(\d+)/i);
  if (vk) return `https://vk.com/video_ext.php?oid=${vk[1]}&id=${vk[2]}&hd=2`;

  if (/rutube\.ru\/search/i.test(value) || /vkvideo\.ru/i.test(value)) return value;
  return '';
}


function extractTrailerUrlFromHtml(html = '', base = '') {
  const candidates = [];

  for (const match of html.matchAll(/<iframe[^>]+src=["']([^"']+)["']/gi)) {
    candidates.push(absUrl(match[1], base));
  }
  for (const match of html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = absUrl(match[1], base);
    const text = cleanHtml(match[2]);
    if (/трейлер|trailer|rutube|vk\s*видео|vkvideo/i.test(text + ' ' + href)) candidates.push(href);
  }
  for (const match of html.matchAll(/<video[^>]+src=["']([^"']+)["']/gi)) {
    candidates.push(absUrl(match[1], base));
  }
  for (const match of html.matchAll(/<source[^>]+src=["']([^"']+)["'][^>]*type=["']video/i)) {
    candidates.push(absUrl(match[1], base));
  }

  const ru = candidates.find(url => /rutube\.ru|vk\.com\/video|vkvideo\.ru/i.test(url));
  if (ru) return ru;
  return '';
}

function extractRefundPolicyFromHtml(html = '') {
  const text = cleanHtml(html);
  const sentence = (text.match(/[^.!?]{0,120}(?:возврат|вернуть)[^.!?]{0,180}[.!?]/i) || [''])[0].trim();
  if (sentence) return sentence;
  return 'Возврат билета — по правилам кинотеатра/билетного сервиса; точные условия уточняйте при покупке.';
}

function cleanCinemaPrice(value = '') {
  const text = String(value || '').replace(/^\s*(?:2D|3D|IMAX|ATMOS)(?:\s*,\s*(?:2D|3D|IMAX|ATMOS))*\s*[·-]\s*/i, '').trim();
  if (!text || /^(?:2D|3D|IMAX|ATMOS)$/i.test(text)) return '';
  return text;
}

async function fetchCinemaDetailMeta(detailUrl = '') {
  if (!detailUrl) return {};
  let html = '';
  try { html = await fetchText(detailUrl); } catch { return {}; }

  const trailerUrl = extractTrailerUrlFromHtml(html, detailUrl);
  return {
    image: extractImageFromHtml(html, detailUrl, ''),
    trailerUrl,
    trailerEmbedUrl: trailerEmbedFromUrl(trailerUrl),
    trailerSourceName: /vk\.com|vkvideo/i.test(trailerUrl) ? 'VK Видео' : (/rutube/i.test(trailerUrl) ? 'RuTube' : ''),
    refundPolicy: extractRefundPolicyFromHtml(html)
  };
}


function formatIsoDate(date) {
  return isoDate(date.getFullYear(), date.getMonth(), date.getDate());
}

function normalizeMovieTitle(value = '') {
  return cleanHtml(value)
    .replace(/\s*\(в\s+рамках\s+Киноклуба\)\s*/i, ' (Киноклуб)')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseVizitMovieBlocks(html = '', pageUrl = '', dateIso = '') {
  const events = [];
  const headingRegex = /###\s*(?:<[^>]+>[\s\S]*?<\/[^>]+>|)([\s\S]*?)(?=\n|2026\s+г\.)/gi;
  const headings = [...html.matchAll(/###\s*(?:<a[^>]+href=["']([^"']+)["'][^>]*>)?\s*([^<\n]+?)(?:\s*<\/a>)?\s*(?:\n|$)/gi)];

  // Fallback for raw/clean text returned by servers.
  const text = cleanHtml(html);
  const parts = text.split(/(?=###\s*)/g).filter(Boolean);

  const rawBlocks = [];
  if (headings.length) {
    for (let i = 0; i < headings.length; i += 1) {
      const start = headings[i].index;
      const end = i + 1 < headings.length ? headings[i + 1].index : html.length;
      rawBlocks.push(html.slice(start, end));
    }
  } else {
    for (const part of parts) rawBlocks.push(part);
  }

  for (const block of rawBlocks) {
    const blockText = cleanHtml(block);
    const titleMatch = blockText.match(/(?:###\s*)?([^#]+?)\s*\((\d{1,2}\+)\)/);
    if (!titleMatch) continue;

    const title = normalizeMovieTitle(titleMatch[1]);
    const age = titleMatch[2] || '';
    if (!title || /фильмы на|кинотеатр|расписание/i.test(title)) continue;

    const sessionMatches = [...blockText.matchAll(/(\d{1,2}):([0-5]\d):?00?\s+(2D|3D|IMAX|ATMOS)\s+(\d{2,4})\s*руб/gi)];
    if (!sessionMatches.length) continue;

    const sessions = sessionMatches.map(match => ({
      time: `${match[1].padStart(2, '0')}:${match[2]}`,
      format: match[3].toUpperCase(),
      price: `${match[4]} ₽`
    }));

    const times = sessions.map(s => s.time).join(', ');
    const schedule = `Сеансы: ${sessions.map(s => `${s.time} · ${s.format} · ${s.price}`).join('; ')}`;
    const uniquePrices = [...new Set(sessions.map(s => s.price))];
    const priceDisplay = uniquePrices.length === 1 ? uniquePrices[0] : `${uniquePrices[0].replace(' ₽', '')}–${uniquePrices[uniquePrices.length - 1]}`;
    const format = [...new Set(sessions.map(s => s.format))].join(', ');

    const image = extractImageFromHtml(block, pageUrl, title) || 'images/events/fallback-cinema.jpg';
    const detailUrlMatch = block.match(/<a[^>]+href=["']([^"']+)["'][^>]*>\s*Подробнее/gi);
    const detailUrl = pageUrl;

    events.push(normalizeEvent({
      title: `Кино: ${title}`,
      category: 'Кино',
      startDate: dateIso,
      time: times,
      schedule,
      scheduleShort: times,
      sessions,
      format,
      venue: 'Кинотеатр «Галактика»',
      address: 'г. Когалым, ул. Дружбы Народов, 60',
      description: `Показ фильма «${title}» в кинотеатре «Галактика».`,
      url: pageUrl,
      sourceUrl: pageUrl,
      image,
      price: `${format} · ${priceDisplay}`,
      priceDisplay,
      age,
      refundPolicy: 'Возврат билета — по правилам кинотеатра/билетного сервиса; точные условия уточняйте при покупке.',
      refundUrl: pageUrl,
      trailerUrl: rutubeTrailerSearch(title),
      trailerEmbedUrl: rutubeTrailerSearch(title),
      trailerSourceName: 'RuTube',
      sourceName: 'VizitKogalym / Кинотеатр «Галактика»'
    }));
  }

  return events;
}

async function parseVizitKogalymMovies() {
  const now = new Date();
  const events = [];

  for (let offset = 0; offset < 14; offset += 1) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const dateIso = formatIsoDate(day);
    const url = `https://vizitkogalym.ru/movies/index.php?date=${dateIso}`;
    let html = '';
    try { html = await fetchText(url); } catch { continue; }

    const parsed = parseVizitMovieBlocks(html, url, dateIso);
    events.push(...parsed);
  }

  return events;
}


async function parseGalaxyKino() {
  return [];
}

async function parseGalaxy() {
  const url = 'https://www.skk-galaxy.ru/';
  const html = await fetchText(url);
  const text = cleanHtml(html).toLowerCase();
  const pageImage = 'images/places-v7/30-25-okeanarium-14369988-v7-e241de6c8d.jpg';
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
      image: pageImage,
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
        image: pageImage,
        age: '0+',
        sourceName: 'СКК «Галактика»'
      }));
    }
  }
  return events;
}


async function parseRusMuseumOfficial() {
  const url = 'https://rusmuseum.ru/news/v-kulturno-vystavochnom-tsentre-russkogo-muzeya-v-kogalyme-proshli-lektsii-k-vystavke-shiroka-strana/';
  let html = '';
  try { html = await fetchText(url); } catch { html = ''; }
  const text = cleanHtml(html);

  if (html && !/Широка страна моя родная|Культурно-выставочном центре Русского музея в Когалыме/i.test(text)) {
    return [];
  }

  return [normalizeEvent({
    title: 'Выставка «Широка страна моя родная»',
    category: 'Выставка',
    startDate: '2025-08-26',
    endDate: '2026-08-23',
    time: 'ср–вс 10:00–19:00',
    venue: 'Культурно-выставочный центр Русского музея',
    address: 'г. Когалым, ул. Югорская, 30',
    description: 'Выставка живописных пейзажей «Широка страна моя родная» в Культурно-выставочном центре Русского музея в Когалыме. Официальные новости Русского музея подтверждают работу выставки и проведение просветительской программы к ней.',
    url,
    sourceUrl: url,
    image: 'images/events/fallback-exhibition.jpg',
    price: 'уточнять в центре',
    age: '6+',
    sourceName: 'Русский музей'
  })];
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


function cinemaSeedEvents() {
  const url = 'https://galaxykino.ru/schedule/';
  const now = new Date();
  const titles = [
    ['Джек Райан: Призрачная война', '18+', 'боевик'],
    ['Майкл', '18+', 'биография, драма, музыка'],
    ['Кощей. Тайна живой воды', '6+', 'мультфильм, приключения, комедия, фэнтези'],
    ['Не одна дома 3. Выпускной', '6+', 'комедия, приключения, семейный'],
    ['Тролли возвращаются!', '6+', 'мультфильм, семейный'],
    ['Грязные деньги', '18+', 'боевик, триллер']
  ];
  return titles.map((item, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + Math.min(index, 6));
    const [title, age, genre] = item;
    return normalizeEvent({
      title: `Кино: ${title}`,
      category: 'Кино',
      startDate: isoDate(date.getFullYear(), date.getMonth(), date.getDate()),
      time: 'расписание на сайте',
      venue: 'Кинотеатр «Галактика»',
      description: `Сеансы фильма «${title}» в кинотеатре «Галактика». Жанр: ${genre}.`,
      url,
      sourceUrl: url,
      image: 'images/events/fallback-cinema.jpg',
      priceDisplay: 'Уточняйте при покупке',
      refundPolicy: 'Возврат билета — по правилам кинотеатра/билетного сервиса; точные условия уточняйте при покупке.',
      refundUrl: url,
      trailerUrl: rutubeTrailerSearch(title),
      trailerEmbedUrl: rutubeTrailerSearch(title),
      trailerSourceName: 'RuTube',
      age,
      sourceName: 'Кинотеатр «Галактика»'
    });
  });
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
    image: pickImage({ title: `Спектакль «${title}»`, category: 'Театр', venue: 'Филиал Малого театра в Когалыме' }),
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


function isStaleOceanariumEvent(event) {
  const text = `${event.title || ''} ${event.venue || ''} ${event.description || ''}`.toLowerCase().replace(/ё/g, 'е');
  return text.includes('подводная экскурсия')
    || text.includes('мастер-классы от морского клуба')
    || (text.includes('океанариум') && (text.includes('мастер-класс') || text.includes('морского клуба') || text.includes('июньское расписание')));
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

  const hasCinemaFromSources = parsed.some(event => event.categoryKey === 'cinema' || /кино|фильм|сеанс/i.test(`${event.title || ''} ${event.category || ''}`));
  const seedEvents = hasCinemaFromSources ? verifiedSeedEvents() : [...verifiedSeedEvents(), ...cinemaSeedEvents()];
  const events = await downloadExternalImages(dedupe([...parsed, ...seedEvents])
    .filter(isRelevant)
    .filter(isNotOldManualEvent)
    .sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)) || (a.time || '').localeCompare(b.time || '') || a.title.localeCompare(b.title, 'ru')));

  const payload = {
    updatedAt: new Date().toISOString(),
    source: 'github-actions-auto-update-v3-with-event-images',
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
