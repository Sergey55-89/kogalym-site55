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
  return /^[A-Za-zА-Яа-яЁё]/.test(text) ? text.charAt(0).toLocaleUpperCase('ru-RU') + text.slice(1) : text;
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

  if (/rutube\.ru\/search/i.test(value)) return '';
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
      trailerEmbedUrl: '',
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
  // Проверенный резерв: актуальное расписание Galaxykino от 08.06.2026.
  // Используется только если внешние парсеры временно вернули пустой киносписок.
  const seed = JSON.parse(String.raw`[
  {
    "title": "Кино: Тролли возвращаются!",
    "category": "Кино",
    "categoryKey": "cinema",
    "startDate": "2026-06-08",
    "endDate": "2026-06-17",
    "time": "8 июня — 14:30 (350 ₽); 9 июня — 12:40, 14:30 (350 ₽); 10 июня — 12:40, 14:30 (270 ₽)",
    "venue": "Кинотеатр «Галактика»",
    "description": "Показ фильма «Тролли возвращаются!» в кинотеатре «Галактика». Жанр: мультфильм, семейный. Продолжительность: 1 ч 31 мин. Сеансы и цены указаны по официальному расписанию кинотеатра.",
    "image": "images/events/fallback-cinema.jpg",
    "url": "https://galaxykino.ru/filmbase/detail/4306/",
    "sourceUrl": "https://galaxykino.ru/filmbase/detail/4306/",
    "schedule": "8 июня: 14:30 · зал № 1 · 350 ₽\n9 июня: 12:40 · зал № 1 · 350 ₽; 14:30 · зал № 1 · 350 ₽\n10 июня: 12:40 · зал № 1 · 270 ₽; 14:30 · зал № 1 · 270 ₽\n11 июня: 10:25 · зал № 1 · 350 ₽; 12:10 · зал № 1 · 350 ₽\n12 июня: 10:25 · зал № 1 · 450 ₽; 12:10 · зал № 1 · 450 ₽\n13 июня: 10:25 · зал № 1 · 450 ₽; 12:10 · зал № 1 · 450 ₽\n14 июня: 10:25 · зал № 1 · 450 ₽; 12:10 · зал № 1 · 450 ₽\n15 июня: 10:25 · зал № 1 · 350 ₽; 12:10 · зал № 1 · 350 ₽\n16 июня: 10:25 · зал № 1 · 350 ₽; 12:10 · зал № 1 · 350 ₽\n17 июня: 10:25 · зал № 1 · 230 ₽; 12:10 · зал № 1 · 230 ₽",
    "scheduleShort": "8 июня — 14:30 (350 ₽); 9 июня — 12:40, 14:30 (350 ₽); 10 июня — 12:40, 14:30 (270 ₽)",
    "sessions": [
      {
        "date": "2026-06-08",
        "time": "14:30",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-09",
        "time": "12:40",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-09",
        "time": "14:30",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "12:40",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "270 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "14:30",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "270 ₽"
      },
      {
        "date": "2026-06-11",
        "time": "10:25",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-11",
        "time": "12:10",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-12",
        "time": "10:25",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-12",
        "time": "12:10",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-13",
        "time": "10:25",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-13",
        "time": "12:10",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-14",
        "time": "10:25",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-14",
        "time": "12:10",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-15",
        "time": "10:25",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-15",
        "time": "12:10",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-16",
        "time": "10:25",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-16",
        "time": "12:10",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-17",
        "time": "10:25",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "230 ₽"
      },
      {
        "date": "2026-06-17",
        "time": "12:10",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "230 ₽"
      }
    ],
    "format": "2D",
    "address": "г. Когалым, ул. Дружбы народов, 60",
    "price": "230–450 ₽",
    "priceDisplay": "230–450 ₽",
    "age": "6+",
    "refundPolicy": "Возврат билета — по правилам кинотеатра/билетного сервиса; точные условия уточняйте при покупке.",
    "refundUrl": "https://galaxykino.ru/",
    "trailerUrl": "https://rutube.ru/video/823321379e691c35525f2ce1bf212023/",
    "trailerEmbedUrl": "https://rutube.ru/play/embed/823321379e691c35525f2ce1bf212023",
    "trailerSourceName": "RuTube",
    "sourceName": "Кинотеатр «Галактика»"
  },
  {
    "title": "Кино: Закулисье реальности",
    "category": "Кино",
    "categoryKey": "cinema",
    "startDate": "2026-06-08",
    "endDate": "2026-06-17",
    "time": "8 июня — 16:15, 18:30, 20:50 (350–450 ₽); 9 июня — 16:15, 18:30, 20:50 (350–450 ₽); 10 июня — 16:15, 18:30, 20:50 (270 ₽)",
    "venue": "Кинотеатр «Галактика»",
    "description": "Показ фильма «Закулисье реальности» в кинотеатре «Галактика». Жанр: триллер, ужасы. Продолжительность: 1 ч 41 мин. Сеансы и цены указаны по официальному расписанию кинотеатра.",
    "image": "images/events/fallback-cinema.jpg",
    "url": "https://galaxykino.ru/filmbase/detail/4241/",
    "sourceUrl": "https://galaxykino.ru/filmbase/detail/4241/",
    "schedule": "8 июня: 16:15 · зал № 1 · 350 ₽; 18:30 · зал № 1 · 450 ₽; 20:50 · зал № 1 · 450 ₽\n9 июня: 16:15 · зал № 1 · 350 ₽; 18:30 · зал № 1 · 450 ₽; 20:50 · зал № 1 · 450 ₽\n10 июня: 16:15 · зал № 1 · 270 ₽; 18:30 · зал № 1 · 270 ₽; 20:50 · зал № 1 · 270 ₽\n11 июня: 16:40 · зал № 4 · 350 ₽; 18:50 · зал № 4 · 550 ₽; 21:05 · зал № 4 · 550 ₽\n12 июня: 16:40 · зал № 4 · 450 ₽; 18:50 · зал № 4 · 550 ₽; 21:05 · зал № 4 · 550 ₽\n13 июня: 16:40 · зал № 4 · 450 ₽; 18:50 · зал № 4 · 550 ₽; 21:05 · зал № 4 · 550 ₽\n14 июня: 16:40 · зал № 4 · 450 ₽; 18:50 · зал № 4 · 550 ₽; 21:05 · зал № 4 · 550 ₽\n15 июня: 16:40 · зал № 4 · 350 ₽; 18:50 · зал № 4 · 450 ₽; 21:05 · зал № 4 · 450 ₽\n16 июня: 16:40 · зал № 4 · 350 ₽; 18:50 · зал № 4 · 450 ₽; 21:05 · зал № 4 · 450 ₽\n17 июня: 16:40 · зал № 4 · 230 ₽; 18:50 · зал № 4 · 230 ₽; 21:05 · зал № 4 · 230 ₽",
    "scheduleShort": "8 июня — 16:15, 18:30, 20:50 (350–450 ₽); 9 июня — 16:15, 18:30, 20:50 (350–450 ₽); 10 июня — 16:15, 18:30, 20:50 (270 ₽)",
    "sessions": [
      {
        "date": "2026-06-08",
        "time": "16:15",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-08",
        "time": "18:30",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-08",
        "time": "20:50",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-09",
        "time": "16:15",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-09",
        "time": "18:30",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-09",
        "time": "20:50",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "16:15",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "270 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "18:30",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "270 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "20:50",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "270 ₽"
      },
      {
        "date": "2026-06-11",
        "time": "16:40",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-11",
        "time": "18:50",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "550 ₽"
      },
      {
        "date": "2026-06-11",
        "time": "21:05",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "550 ₽"
      },
      {
        "date": "2026-06-12",
        "time": "16:40",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-12",
        "time": "18:50",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "550 ₽"
      },
      {
        "date": "2026-06-12",
        "time": "21:05",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "550 ₽"
      },
      {
        "date": "2026-06-13",
        "time": "16:40",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-13",
        "time": "18:50",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "550 ₽"
      },
      {
        "date": "2026-06-13",
        "time": "21:05",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "550 ₽"
      },
      {
        "date": "2026-06-14",
        "time": "16:40",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-14",
        "time": "18:50",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "550 ₽"
      },
      {
        "date": "2026-06-14",
        "time": "21:05",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "550 ₽"
      },
      {
        "date": "2026-06-15",
        "time": "16:40",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-15",
        "time": "18:50",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-15",
        "time": "21:05",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-16",
        "time": "16:40",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-16",
        "time": "18:50",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-16",
        "time": "21:05",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-17",
        "time": "16:40",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "230 ₽"
      },
      {
        "date": "2026-06-17",
        "time": "18:50",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "230 ₽"
      },
      {
        "date": "2026-06-17",
        "time": "21:05",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "230 ₽"
      }
    ],
    "format": "2D",
    "address": "г. Когалым, ул. Дружбы народов, 60",
    "price": "230–550 ₽",
    "priceDisplay": "230–550 ₽",
    "age": "18+",
    "refundPolicy": "Возврат билета — по правилам кинотеатра/билетного сервиса; точные условия уточняйте при покупке.",
    "refundUrl": "https://galaxykino.ru/",
    "trailerUrl": "https://rutube.ru/video/7080a1fea6b29dcebc9287c034f9c9f6/",
    "trailerEmbedUrl": "https://rutube.ru/play/embed/7080a1fea6b29dcebc9287c034f9c9f6",
    "trailerSourceName": "RuTube",
    "sourceName": "Кинотеатр «Галактика»"
  },
  {
    "title": "Кино: Дени и Мэни в кино",
    "category": "Кино",
    "categoryKey": "cinema",
    "startDate": "2026-06-08",
    "endDate": "2026-06-17",
    "time": "8 июня — 14:50, 16:25 (350 ₽); 9 июня — 13:15, 14:50, 16:25 (350 ₽); 10 июня — 13:15, 14:50, 16:25 (270 ₽)",
    "venue": "Кинотеатр «Галактика»",
    "description": "Показ фильма «Дени и Мэни в кино» в кинотеатре «Галактика». Жанр: анимация, приключения. Продолжительность: 1 ч 25 мин. Сеансы и цены указаны по официальному расписанию кинотеатра.",
    "image": "images/events/fallback-cinema.jpg",
    "url": "https://galaxykino.ru/filmbase/detail/4254/",
    "sourceUrl": "https://galaxykino.ru/filmbase/detail/4254/",
    "schedule": "8 июня: 14:50 · зал № 3 · 350 ₽; 16:25 · зал № 3 · 350 ₽\n9 июня: 13:15 · зал № 3 · 350 ₽; 14:50 · зал № 3 · 350 ₽; 16:25 · зал № 3 · 350 ₽\n10 июня: 13:15 · зал № 3 · 270 ₽; 14:50 · зал № 3 · 270 ₽; 16:25 · зал № 3 · 270 ₽\n11 июня: 13:25 · зал № 3 · 350 ₽\n12 июня: 13:25 · зал № 3 · 450 ₽\n13 июня: 13:25 · зал № 3 · 450 ₽\n14 июня: 13:25 · зал № 3 · 450 ₽\n15 июня: 13:25 · зал № 3 · 350 ₽\n16 июня: 13:25 · зал № 3 · 350 ₽\n17 июня: 13:25 · зал № 3 · 230 ₽",
    "scheduleShort": "8 июня — 14:50, 16:25 (350 ₽); 9 июня — 13:15, 14:50, 16:25 (350 ₽); 10 июня — 13:15, 14:50, 16:25 (270 ₽)",
    "sessions": [
      {
        "date": "2026-06-08",
        "time": "14:50",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-08",
        "time": "16:25",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-09",
        "time": "13:15",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-09",
        "time": "14:50",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-09",
        "time": "16:25",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "13:15",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "270 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "14:50",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "270 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "16:25",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "270 ₽"
      },
      {
        "date": "2026-06-11",
        "time": "13:25",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-12",
        "time": "13:25",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-13",
        "time": "13:25",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-14",
        "time": "13:25",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-15",
        "time": "13:25",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-16",
        "time": "13:25",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-17",
        "time": "13:25",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "230 ₽"
      }
    ],
    "format": "2D",
    "address": "г. Когалым, ул. Дружбы народов, 60",
    "price": "230–450 ₽",
    "priceDisplay": "230–450 ₽",
    "age": "6+",
    "refundPolicy": "Возврат билета — по правилам кинотеатра/билетного сервиса; точные условия уточняйте при покупке.",
    "refundUrl": "https://galaxykino.ru/",
    "trailerUrl": "https://rutube.ru/video/d3e6c7d855e30f00cb00efb9afbe54d3/",
    "trailerEmbedUrl": "https://rutube.ru/play/embed/d3e6c7d855e30f00cb00efb9afbe54d3",
    "trailerSourceName": "RuTube",
    "sourceName": "Кинотеатр «Галактика»"
  },
  {
    "title": "Кино: Майкл",
    "category": "Кино",
    "categoryKey": "cinema",
    "startDate": "2026-06-08",
    "endDate": "2026-06-17",
    "time": "8 июня — 16:05, 18:40, 21:10 (350–450 ₽); 9 июня — 16:05, 18:40, 21:10 (350–450 ₽); 10 июня — 16:05, 18:40, 21:10 (230 ₽)",
    "venue": "Кинотеатр «Галактика»",
    "description": "Показ фильма «Майкл» в кинотеатре «Галактика». Жанр: драма, биография, музыка. Продолжительность: 2 ч 15 мин. Сеансы и цены указаны по официальному расписанию кинотеатра.",
    "image": "images/events/fallback-cinema.jpg",
    "url": "https://galaxykino.ru/filmbase/detail/4253/",
    "sourceUrl": "https://galaxykino.ru/filmbase/detail/4253/",
    "schedule": "8 июня: 16:05 · зал № 4 · 350 ₽; 18:40 · зал № 4 · 450 ₽; 21:10 · зал № 4 · 450 ₽\n9 июня: 16:05 · зал № 4 · 350 ₽; 18:40 · зал № 4 · 450 ₽; 21:10 · зал № 4 · 450 ₽\n10 июня: 16:05 · зал № 4 · 230 ₽; 18:40 · зал № 4 · 230 ₽; 21:10 · зал № 4 · 230 ₽\n11 июня: 14:10 · зал № 4 · 350 ₽\n12 июня: 14:10 · зал № 4 · 450 ₽\n13 июня: 14:10 · зал № 4 · 450 ₽\n14 июня: 14:10 · зал № 4 · 450 ₽\n15 июня: 14:10 · зал № 4 · 350 ₽\n16 июня: 14:10 · зал № 4 · 350 ₽\n17 июня: 14:10 · зал № 4 · 230 ₽",
    "scheduleShort": "8 июня — 16:05, 18:40, 21:10 (350–450 ₽); 9 июня — 16:05, 18:40, 21:10 (350–450 ₽); 10 июня — 16:05, 18:40, 21:10 (230 ₽)",
    "sessions": [
      {
        "date": "2026-06-08",
        "time": "16:05",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-08",
        "time": "18:40",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-08",
        "time": "21:10",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-09",
        "time": "16:05",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-09",
        "time": "18:40",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-09",
        "time": "21:10",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "16:05",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "230 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "18:40",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "230 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "21:10",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "230 ₽"
      },
      {
        "date": "2026-06-11",
        "time": "14:10",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-12",
        "time": "14:10",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-13",
        "time": "14:10",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-14",
        "time": "14:10",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-15",
        "time": "14:10",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-16",
        "time": "14:10",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-17",
        "time": "14:10",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "230 ₽"
      }
    ],
    "format": "2D",
    "address": "г. Когалым, ул. Дружбы народов, 60",
    "price": "230–450 ₽",
    "priceDisplay": "230–450 ₽",
    "age": "18+",
    "refundPolicy": "Возврат билета — по правилам кинотеатра/билетного сервиса; точные условия уточняйте при покупке.",
    "refundUrl": "https://galaxykino.ru/",
    "trailerUrl": "https://rutube.ru/video/b1898e2a35025e56aca050183936bfac/",
    "trailerEmbedUrl": "https://rutube.ru/play/embed/b1898e2a35025e56aca050183936bfac",
    "trailerSourceName": "RuTube",
    "sourceName": "Кинотеатр «Галактика»"
  },
  {
    "title": "Кино: Грязные деньги",
    "category": "Кино",
    "categoryKey": "cinema",
    "startDate": "2026-06-08",
    "endDate": "2026-06-10",
    "time": "8 июня — 18:15, 20:30 (450 ₽); 9 июня — 18:15, 20:30 (450 ₽); 10 июня — 18:15, 20:30 (230 ₽)",
    "venue": "Кинотеатр «Галактика»",
    "description": "Показ фильма «Грязные деньги» в кинотеатре «Галактика». Жанр: боевик, триллер. Продолжительность: 1 ч 45 мин. Сеансы и цены указаны по официальному расписанию кинотеатра.",
    "image": "images/events/fallback-cinema.jpg",
    "url": "https://galaxykino.ru/filmbase/detail/4261/",
    "sourceUrl": "https://galaxykino.ru/filmbase/detail/4261/",
    "schedule": "8 июня: 18:15 · зал № 2 · 450 ₽; 20:30 · зал № 2 · 450 ₽\n9 июня: 18:15 · зал № 2 · 450 ₽; 20:30 · зал № 2 · 450 ₽\n10 июня: 18:15 · зал № 2 · 230 ₽; 20:30 · зал № 2 · 230 ₽",
    "scheduleShort": "8 июня — 18:15, 20:30 (450 ₽); 9 июня — 18:15, 20:30 (450 ₽); 10 июня — 18:15, 20:30 (230 ₽)",
    "sessions": [
      {
        "date": "2026-06-08",
        "time": "18:15",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-08",
        "time": "20:30",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-09",
        "time": "18:15",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-09",
        "time": "20:30",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "18:15",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "230 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "20:30",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "230 ₽"
      }
    ],
    "format": "2D",
    "address": "г. Когалым, ул. Дружбы народов, 60",
    "price": "230–450 ₽",
    "priceDisplay": "230–450 ₽",
    "age": "18+",
    "refundPolicy": "Возврат билета — по правилам кинотеатра/билетного сервиса; точные условия уточняйте при покупке.",
    "refundUrl": "https://galaxykino.ru/",
    "trailerUrl": "https://rutube.ru/video/a0e355a87cb51d37f9a1f64517c0f1aa/",
    "trailerEmbedUrl": "https://rutube.ru/play/embed/a0e355a87cb51d37f9a1f64517c0f1aa",
    "trailerSourceName": "RuTube",
    "sourceName": "Кинотеатр «Галактика»"
  },
  {
    "title": "Кино: В чужой шкуре",
    "category": "Кино",
    "categoryKey": "cinema",
    "startDate": "2026-06-08",
    "endDate": "2026-06-10",
    "time": "8 июня — 13:50 (350 ₽); 9 июня — 13:50 (350 ₽); 10 июня — 13:50 (230 ₽)",
    "venue": "Кинотеатр «Галактика»",
    "description": "Показ фильма «В чужой шкуре» в кинотеатре «Галактика». Жанр: мультфильм, фэнтези, комедия, приключения, семейный. Продолжительность: 1 ч 32 мин. Сеансы и цены указаны по официальному расписанию кинотеатра.",
    "image": "images/events/fallback-cinema.jpg",
    "url": "https://galaxykino.ru/filmbase/detail/4203/",
    "sourceUrl": "https://galaxykino.ru/filmbase/detail/4203/",
    "schedule": "8 июня: 13:50 · зал № 2 · 350 ₽\n9 июня: 13:50 · зал № 2 · 350 ₽\n10 июня: 13:50 · зал № 2 · 230 ₽",
    "scheduleShort": "8 июня — 13:50 (350 ₽); 9 июня — 13:50 (350 ₽); 10 июня — 13:50 (230 ₽)",
    "sessions": [
      {
        "date": "2026-06-08",
        "time": "13:50",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-09",
        "time": "13:50",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "13:50",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "230 ₽"
      }
    ],
    "format": "2D",
    "address": "г. Когалым, ул. Дружбы народов, 60",
    "price": "230–350 ₽",
    "priceDisplay": "230–350 ₽",
    "age": "6+",
    "refundPolicy": "Возврат билета — по правилам кинотеатра/билетного сервиса; точные условия уточняйте при покупке.",
    "refundUrl": "https://galaxykino.ru/",
    "trailerUrl": "https://rutube.ru/video/77b87fc4650f73bf105152b49ae8dc3b/",
    "trailerEmbedUrl": "https://rutube.ru/play/embed/77b87fc4650f73bf105152b49ae8dc3b",
    "trailerSourceName": "RuTube",
    "sourceName": "Кинотеатр «Галактика»"
  },
  {
    "title": "Кино: Побег из волшебного измерения",
    "category": "Кино",
    "categoryKey": "cinema",
    "startDate": "2026-06-09",
    "endDate": "2026-06-17",
    "time": "9 июня — 10:55 (350 ₽); 10 июня — 10:55 (270 ₽); 11 июня — 11:00 (350 ₽)",
    "venue": "Кинотеатр «Галактика»",
    "description": "Показ фильма «Побег из волшебного измерения» в кинотеатре «Галактика». Жанр: мультфильм, приключения, семейный. Продолжительность: 1 ч 29 мин. Сеансы и цены указаны по официальному расписанию кинотеатра.",
    "image": "images/events/fallback-cinema.jpg",
    "url": "https://galaxykino.ru/filmbase/detail/4233/",
    "sourceUrl": "https://galaxykino.ru/filmbase/detail/4233/",
    "schedule": "9 июня: 10:55 · зал № 3 · 350 ₽\n10 июня: 10:55 · зал № 3 · 270 ₽\n11 июня: 11:00 · зал № 3 · 350 ₽\n12 июня: 11:00 · зал № 3 · 450 ₽\n13 июня: 11:00 · зал № 3 · 450 ₽\n14 июня: 11:00 · зал № 3 · 450 ₽\n15 июня: 11:00 · зал № 3 · 350 ₽\n16 июня: 11:00 · зал № 3 · 350 ₽\n17 июня: 11:00 · зал № 3 · 230 ₽",
    "scheduleShort": "9 июня — 10:55 (350 ₽); 10 июня — 10:55 (270 ₽); 11 июня — 11:00 (350 ₽)",
    "sessions": [
      {
        "date": "2026-06-09",
        "time": "10:55",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "10:55",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "270 ₽"
      },
      {
        "date": "2026-06-11",
        "time": "11:00",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-12",
        "time": "11:00",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-13",
        "time": "11:00",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-14",
        "time": "11:00",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-15",
        "time": "11:00",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-16",
        "time": "11:00",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-17",
        "time": "11:00",
        "hall": "Зал № 3",
        "format": "2D",
        "price": "230 ₽"
      }
    ],
    "format": "2D",
    "address": "г. Когалым, ул. Дружбы народов, 60",
    "price": "230–450 ₽",
    "priceDisplay": "230–450 ₽",
    "age": "6+",
    "refundPolicy": "Возврат билета — по правилам кинотеатра/билетного сервиса; точные условия уточняйте при покупке.",
    "refundUrl": "https://galaxykino.ru/",
    "trailerUrl": "https://rutube.ru/video/a6793ad52b6e19d15097312ab8b59650/",
    "trailerEmbedUrl": "https://rutube.ru/play/embed/a6793ad52b6e19d15097312ab8b59650",
    "trailerSourceName": "RuTube",
    "sourceName": "Кинотеатр «Галактика»"
  },
  {
    "title": "Кино: Кощей. Тайна живой воды",
    "category": "Кино",
    "categoryKey": "cinema",
    "startDate": "2026-06-09",
    "endDate": "2026-06-17",
    "time": "9 июня — 10:25, 12:10 (350 ₽); 10 июня — 10:25, 12:10 (230 ₽); 11 июня — 10:15 (350 ₽)",
    "venue": "Кинотеатр «Галактика»",
    "description": "Показ фильма «Кощей. Тайна живой воды» в кинотеатре «Галактика». Жанр: мультфильм, приключения, комедия, фэнтези. Продолжительность: 1 ч 40 мин. Сеансы и цены указаны по официальному расписанию кинотеатра.",
    "image": "images/events/fallback-cinema.jpg",
    "url": "https://galaxykino.ru/filmbase/detail/4130/",
    "sourceUrl": "https://galaxykino.ru/filmbase/detail/4130/",
    "schedule": "9 июня: 10:25 · зал № 2 · 350 ₽; 12:10 · зал № 2 · 350 ₽\n10 июня: 10:25 · зал № 2 · 230 ₽; 12:10 · зал № 2 · 230 ₽\n11 июня: 10:15 · зал № 2 · 350 ₽\n12 июня: 10:15 · зал № 2 · 450 ₽\n13 июня: 10:15 · зал № 2 · 450 ₽\n14 июня: 10:15 · зал № 2 · 450 ₽\n15 июня: 10:15 · зал № 2 · 350 ₽\n16 июня: 10:15 · зал № 2 · 350 ₽\n17 июня: 10:15 · зал № 2 · 230 ₽",
    "scheduleShort": "9 июня — 10:25, 12:10 (350 ₽); 10 июня — 10:25, 12:10 (230 ₽); 11 июня — 10:15 (350 ₽)",
    "sessions": [
      {
        "date": "2026-06-09",
        "time": "10:25",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-09",
        "time": "12:10",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "10:25",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "230 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "12:10",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "230 ₽"
      },
      {
        "date": "2026-06-11",
        "time": "10:15",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-12",
        "time": "10:15",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-13",
        "time": "10:15",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-14",
        "time": "10:15",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "450 ₽"
      },
      {
        "date": "2026-06-15",
        "time": "10:15",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-16",
        "time": "10:15",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-17",
        "time": "10:15",
        "hall": "Зал № 2",
        "format": "2D",
        "price": "230 ₽"
      }
    ],
    "format": "2D",
    "address": "г. Когалым, ул. Дружбы народов, 60",
    "price": "230–450 ₽",
    "priceDisplay": "230–450 ₽",
    "age": "6+",
    "refundPolicy": "Возврат билета — по правилам кинотеатра/билетного сервиса; точные условия уточняйте при покупке.",
    "refundUrl": "https://galaxykino.ru/",
    "trailerUrl": "https://rutube.ru/video/4bc887a2d8eaa13730905d6d2e76407f/",
    "trailerEmbedUrl": "https://rutube.ru/play/embed/4bc887a2d8eaa13730905d6d2e76407f",
    "trailerSourceName": "RuTube",
    "sourceName": "Кинотеатр «Галактика»"
  },
  {
    "title": "Кино: Не одна дома 3. Выпускной",
    "category": "Кино",
    "categoryKey": "cinema",
    "startDate": "2026-06-09",
    "endDate": "2026-06-10",
    "time": "9 июня — 10:30 (350 ₽); 10 июня — 10:30 (230 ₽)",
    "venue": "Кинотеатр «Галактика»",
    "description": "Показ фильма «Не одна дома 3. Выпускной» в кинотеатре «Галактика». Жанр: комедия, приключения, семейный. Продолжительность: 1 ч 25 мин. Сеансы и цены указаны по официальному расписанию кинотеатра.",
    "image": "images/events/fallback-cinema.jpg",
    "url": "https://galaxykino.ru/filmbase/detail/4257/",
    "sourceUrl": "https://galaxykino.ru/filmbase/detail/4257/",
    "schedule": "9 июня: 10:30 · зал № 1 · 350 ₽\n10 июня: 10:30 · зал № 1 · 230 ₽",
    "scheduleShort": "9 июня — 10:30 (350 ₽); 10 июня — 10:30 (230 ₽)",
    "sessions": [
      {
        "date": "2026-06-09",
        "time": "10:30",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "10:30",
        "hall": "Зал № 1",
        "format": "2D",
        "price": "230 ₽"
      }
    ],
    "format": "2D",
    "address": "г. Когалым, ул. Дружбы народов, 60",
    "price": "230–350 ₽",
    "priceDisplay": "230–350 ₽",
    "age": "6+",
    "refundPolicy": "Возврат билета — по правилам кинотеатра/билетного сервиса; точные условия уточняйте при покупке.",
    "refundUrl": "https://galaxykino.ru/",
    "trailerUrl": "https://rutube.ru/video/d7af6fa12e51268d51e0b8e99711c951/",
    "trailerEmbedUrl": "https://rutube.ru/play/embed/d7af6fa12e51268d51e0b8e99711c951",
    "trailerSourceName": "RuTube",
    "sourceName": "Кинотеатр «Галактика»"
  },
  {
    "title": "Кино: Богатыри",
    "category": "Кино",
    "categoryKey": "cinema",
    "startDate": "2026-06-09",
    "endDate": "2026-06-10",
    "time": "9 июня — 10:20 (350 ₽); 10 июня — 10:20 (230 ₽)",
    "venue": "Кинотеатр «Галактика»",
    "description": "Показ фильма «Богатыри» в кинотеатре «Галактика». Жанр: комедия, семейный, фэнтези. Продолжительность: 1 ч 40 мин. Сеансы и цены указаны по официальному расписанию кинотеатра.",
    "image": "images/events/fallback-cinema.jpg",
    "url": "https://galaxykino.ru/filmbase/detail/4242/",
    "sourceUrl": "https://galaxykino.ru/filmbase/detail/4242/",
    "schedule": "9 июня: 10:20 · зал № 4 · 350 ₽\n10 июня: 10:20 · зал № 4 · 230 ₽",
    "scheduleShort": "9 июня — 10:20 (350 ₽); 10 июня — 10:20 (230 ₽)",
    "sessions": [
      {
        "date": "2026-06-09",
        "time": "10:20",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "350 ₽"
      },
      {
        "date": "2026-06-10",
        "time": "10:20",
        "hall": "Зал № 4",
        "format": "2D",
        "price": "230 ₽"
      }
    ],
    "format": "2D",
    "address": "г. Когалым, ул. Дружбы народов, 60",
    "price": "230–350 ₽",
    "priceDisplay": "230–350 ₽",
    "age": "6+",
    "refundPolicy": "Возврат билета — по правилам кинотеатра/билетного сервиса; точные условия уточняйте при покупке.",
    "refundUrl": "https://galaxykino.ru/",
    "trailerUrl": "https://rutube.ru/video/3ce33df6cd3173def8a2cd384e795712/",
    "trailerEmbedUrl": "https://rutube.ru/play/embed/3ce33df6cd3173def8a2cd384e795712",
    "trailerSourceName": "RuTube",
    "sourceName": "Кинотеатр «Галактика»"
  }
]`);
  return seed.map(item => normalizeEvent(item));
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
