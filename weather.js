(function(){
  'use strict';

  var KOGALYM = {
    name: 'Когалым',
    region: 'ХМАО-Югра',
    lat: 62.2654,
    lon: 74.4791
  };

  var CACHE_KEY = 'kogalym_weather_v29';
  var TIMEOUT_MS = 8500;

  var WMO = {
    0: ['☀️', 'Ясно'],
    1: ['🌤️', 'Малооблачно'],
    2: ['⛅', 'Переменная облачность'],
    3: ['☁️', 'Пасмурно'],
    45: ['🌫️', 'Туман'],
    48: ['🌫️', 'Изморозь'],
    51: ['🌦️', 'Морось'],
    53: ['🌦️', 'Морось'],
    55: ['🌧️', 'Сильная морось'],
    56: ['🌧️', 'Ледяная морось'],
    57: ['🌧️', 'Ледяная морось'],
    61: ['🌧️', 'Дождь'],
    63: ['🌧️', 'Дождь'],
    65: ['🌧️', 'Сильный дождь'],
    66: ['🌧️', 'Ледяной дождь'],
    67: ['🌧️', 'Ледяной дождь'],
    71: ['🌨️', 'Снег'],
    73: ['🌨️', 'Снег'],
    75: ['❄️', 'Сильный снег'],
    77: ['❄️', 'Снежные зёрна'],
    80: ['🌦️', 'Ливень'],
    81: ['🌧️', 'Ливень'],
    82: ['⛈️', 'Сильный ливень'],
    85: ['🌨️', 'Снегопад'],
    86: ['❄️', 'Сильный снегопад'],
    95: ['⛈️', 'Гроза'],
    96: ['⛈️', 'Гроза с градом'],
    99: ['⛈️', 'Гроза с градом']
  };

  function isNum(value){
    return typeof value === 'number' && isFinite(value);
  }

  function toNumber(value){
    var n = Number(value);
    return isFinite(n) ? n : null;
  }

  function roundTemp(value){
    value = toNumber(value);
    if (value === null) return '—';
    var rounded = Math.round(value);
    return (rounded > 0 ? '+' : '') + rounded + '°';
  }

  function windKmhToMs(value){
    value = toNumber(value);
    if (value === null) return null;
    return value / 3.6;
  }

  function hpaToMm(value){
    value = toNumber(value);
    if (value === null) return null;
    return value * 0.750062;
  }

  function getIconAndText(code, fallbackText){
    if (code !== null && code !== undefined && WMO[Number(code)]) return WMO[Number(code)];
    if (fallbackText) return ['🌡️', String(fallbackText)];
    return ['🌡️', 'Погода'];
  }

  function fetchJson(url){
    var controller = window.AbortController ? new AbortController() : null;
    var timer = null;
    var options = { cache: 'no-store' };
    if (controller) {
      options.signal = controller.signal;
      timer = setTimeout(function(){ controller.abort(); }, TIMEOUT_MS);
    }

    return fetch(url, options).then(function(response){
      if (timer) clearTimeout(timer);
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    });
  }

  function normalizeOpenMeteo(data){
    var current = data && (data.current || data.current_weather);
    if (!current) throw new Error('Open-Meteo: no current weather');

    var temp = toNumber(current.temperature_2m);
    if (temp === null) temp = toNumber(current.temperature);

    var apparent = toNumber(current.apparent_temperature);
    if (apparent === null) apparent = temp;

    var windMs = null;
    if (current.wind_speed_10m !== undefined) {
      // Open-Meteo отдаёт скорость ветра в км/ч, переводим в м/с.
      windMs = windKmhToMs(current.wind_speed_10m);
    } else if (current.windspeed !== undefined) {
      windMs = windKmhToMs(current.windspeed);
    }

    var pressureMm = hpaToMm(current.surface_pressure);
    var humidity = toNumber(current.relative_humidity_2m);
    var code = current.weather_code !== undefined ? current.weather_code : current.weathercode;

    var condition = getIconAndText(code);

    return {
      source: 'Open-Meteo',
      icon: condition[0],
      status: condition[1],
      temp: temp,
      apparent: apparent,
      windMs: windMs,
      humidity: humidity,
      pressureMm: pressureMm,
      time: new Date()
    };
  }

  function normalizeWttr(data){
    var current = data && data.current_condition && data.current_condition[0];
    if (!current) throw new Error('wttr.in: no current weather');

    var temp = toNumber(current.temp_C);
    var apparent = toNumber(current.FeelsLikeC);
    if (apparent === null) apparent = temp;

    var windMs = windKmhToMs(current.windspeedKmph);
    var humidity = toNumber(current.humidity);
    var pressureMm = hpaToMm(current.pressure);
    var text = '';
    if (current.lang_ru && current.lang_ru[0] && current.lang_ru[0].value) {
      text = current.lang_ru[0].value;
    } else if (current.weatherDesc && current.weatherDesc[0] && current.weatherDesc[0].value) {
      text = current.weatherDesc[0].value;
    }

    return {
      source: 'wttr.in',
      icon: '🌡️',
      status: text || 'Погода',
      temp: temp,
      apparent: apparent,
      windMs: windMs,
      humidity: humidity,
      pressureMm: pressureMm,
      time: new Date()
    };
  }

  function cacheWeather(weather){
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        savedAt: Date.now(),
        weather: weather
      }));
    } catch (e) {}
  }

  function getCachedWeather(){
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.weather || !parsed.savedAt) return null;
      // Кэш годится 6 часов.
      if (Date.now() - Number(parsed.savedAt) > 6 * 60 * 60 * 1000) return null;
      parsed.weather.cached = true;
      parsed.weather.time = new Date(parsed.savedAt);
      return parsed.weather;
    } catch (e) {
      return null;
    }
  }

  function renderWeather(weather){
    if (!weather) throw new Error('No normalized weather');

    var temp = roundTemp(weather.temp);
    var apparent = roundTemp(weather.apparent);
    var wind = isNum(weather.windMs) ? Math.round(weather.windMs) + ' м/с' : '—';
    var humidity = isNum(weather.humidity) ? Math.round(weather.humidity) + '%' : '—';
    var pressure = isNum(weather.pressureMm) ? Math.round(weather.pressureMm) + ' мм' : '—';
    var status = weather.status || 'Погода';
    var icon = weather.icon || '🌡️';
    var stamp = weather.time ? new Date(weather.time) : new Date();
    var updatedText = (weather.cached ? 'Последние данные ' : 'Обновлено ')
      + stamp.toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'});

    document.querySelectorAll('.weather').forEach(function(box){
      box.classList.remove('weather--loading', 'weather--error');
      box.classList.add('weather--live');
      box.title = status + (wind !== '—' ? ', ветер ' + wind : '');
      box.innerHTML = '<span>' + icon + '</span>' +
        '<b>' + temp + '</b>' +
        '<small>' + KOGALYM.name + '<br>' + status + '</small>';
    });

    document.querySelectorAll('[data-weather-temp]').forEach(function(el){ el.textContent = temp; });
    document.querySelectorAll('[data-weather-status]').forEach(function(el){ el.textContent = status; });
    document.querySelectorAll('[data-weather-feels]').forEach(function(el){ el.textContent = 'Ощущается как ' + apparent; });
    document.querySelectorAll('[data-weather-icon]').forEach(function(el){ el.textContent = icon; });
    document.querySelectorAll('[data-weather-wind]').forEach(function(el){ el.textContent = wind; });
    document.querySelectorAll('[data-weather-humidity]').forEach(function(el){ el.textContent = humidity; });
    document.querySelectorAll('[data-weather-pressure]').forEach(function(el){ el.textContent = pressure; });
    document.querySelectorAll('[data-weather-updated]').forEach(function(el){ el.textContent = updatedText; });
  }

  function renderLoading(){
    document.querySelectorAll('.weather').forEach(function(box){
      box.classList.add('weather--loading');
      box.innerHTML = '<span>🌡️</span><b>…</b><small>' + KOGALYM.name + '<br>загрузка</small>';
    });
    document.querySelectorAll('[data-weather-status]').forEach(function(el){ el.textContent = 'Загрузка погоды'; });
    document.querySelectorAll('[data-weather-updated]').forEach(function(el){ el.textContent = 'Обновление…'; });
  }

  function renderFallback(){
    var cached = getCachedWeather();
    if (cached) {
      renderWeather(cached);
      return;
    }

    document.querySelectorAll('.weather').forEach(function(box){
      box.classList.remove('weather--loading');
      box.classList.add('weather--error');
      box.innerHTML = '<span>🌡️</span><b>—</b><small>' + KOGALYM.name + '<br>нет связи с погодой</small>';
    });
    document.querySelectorAll('[data-weather-temp]').forEach(function(el){ el.textContent = '—'; });
    document.querySelectorAll('[data-weather-status]').forEach(function(el){ el.textContent = 'Нет связи с погодой'; });
    document.querySelectorAll('[data-weather-feels]').forEach(function(el){ el.textContent = 'Ощущается как —'; });
    document.querySelectorAll('[data-weather-icon]').forEach(function(el){ el.textContent = '🌡️'; });
    document.querySelectorAll('[data-weather-wind]').forEach(function(el){ el.textContent = '—'; });
    document.querySelectorAll('[data-weather-humidity]').forEach(function(el){ el.textContent = '—'; });
    document.querySelectorAll('[data-weather-pressure]').forEach(function(el){ el.textContent = '—'; });
    document.querySelectorAll('[data-weather-updated]').forEach(function(el){ el.textContent = 'Проверьте подключение'; });
  }

  function loadWeather(){
    var targets = document.querySelectorAll(
      '.weather, [data-weather-temp], [data-weather-status], [data-weather-feels], [data-weather-icon], [data-weather-wind], [data-weather-humidity], [data-weather-pressure], [data-weather-updated]'
    );
    if (!targets.length || !window.fetch) return;

    renderLoading();

    var openMeteoCurrent = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=' + KOGALYM.lat
      + '&longitude=' + KOGALYM.lon
      + '&current=temperature_2m,apparent_temperature,relative_humidity_2m,surface_pressure,weather_code,wind_speed_10m'
      + '&timezone=Asia%2FYekaterinburg';

    var openMeteoLegacy = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=' + KOGALYM.lat
      + '&longitude=' + KOGALYM.lon
      + '&current_weather=true'
      + '&timezone=Asia%2FYekaterinburg';

    var wttr = 'https://wttr.in/Kogalym?format=j1&lang=ru';

    fetchJson(openMeteoCurrent)
      .then(normalizeOpenMeteo)
      .catch(function(){
        return fetchJson(openMeteoLegacy).then(normalizeOpenMeteo);
      })
      .catch(function(){
        return fetchJson(wttr).then(normalizeWttr);
      })
      .then(function(weather){
        cacheWeather(weather);
        renderWeather(weather);
      })
      .catch(renderFallback);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWeather);
  } else {
    loadWeather();
  }
})();
