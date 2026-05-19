(function(){
  'use strict';

  var KOGALYM = {
    name: 'Когалым',
    region: 'ХМАО-Югра',
    lat: 62.2654,
    lon: 74.4791
  };

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

  function getIconAndText(code){
    return WMO[Number(code)] || ['🌡️', 'Погода'];
  }

  function roundTemp(value){
    if (typeof value !== 'number' || !isFinite(value)) return '—';
    var rounded = Math.round(value);
    return (rounded > 0 ? '+' : '') + rounded + '°';
  }

  function renderWeather(data){
    var current = data && data.current;
    if (!current) throw new Error('No current weather data');
    var condition = getIconAndText(current.weather_code);
    var temp = roundTemp(current.temperature_2m);
    var wind = typeof current.wind_speed_10m === 'number' ? Math.round(current.wind_speed_10m) + ' м/с' : '';

    document.querySelectorAll('.weather').forEach(function(box){
      box.classList.remove('weather--loading', 'weather--error');
      box.classList.add('weather--live');
      box.title = condition[1] + (wind ? ', ветер ' + wind : '');
      box.innerHTML = '<span>' + condition[0] + '</span>' +
        '<b>' + temp + '</b>' +
        '<small>' + KOGALYM.name + '<br>' + condition[1] + '</small>';
    });

    document.querySelectorAll('[data-weather-temp]').forEach(function(el){ el.textContent = temp; });
    document.querySelectorAll('[data-weather-status]').forEach(function(el){
      el.textContent = 'Северное сияние · ' + condition[1].toLowerCase();
    });
    document.querySelectorAll('[data-weather-wind]').forEach(function(el){
      el.textContent = wind ? 'ветер ' + wind : 'ветер —';
    });
  }

  function renderLoading(){
    document.querySelectorAll('.weather').forEach(function(box){
      box.classList.add('weather--loading');
      box.innerHTML = '<span>🌡️</span><b>…</b><small>' + KOGALYM.name + '<br>загрузка</small>';
    });
  }

  function renderFallback(){
    document.querySelectorAll('.weather').forEach(function(box){
      box.classList.remove('weather--loading');
      box.classList.add('weather--error');
      box.innerHTML = '<span>🌡️</span><b>—</b><small>' + KOGALYM.name + '<br>погода недоступна</small>';
    });
    document.querySelectorAll('[data-weather-status]').forEach(function(el){
      el.textContent = 'Северное сияние · данные обновятся позже';
    });
  }

  function loadWeather(){
    var boxes = document.querySelectorAll('.weather');
    if (!boxes.length || !window.fetch) return;
    renderLoading();

    var url = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=' + KOGALYM.lat
      + '&longitude=' + KOGALYM.lon
      + '&current=temperature_2m,weather_code,wind_speed_10m'
      + '&timezone=Asia%2FYekaterinburg';

    fetch(url, { cache: 'no-store' })
      .then(function(response){
        if (!response.ok) throw new Error('Weather HTTP ' + response.status);
        return response.json();
      })
      .then(renderWeather)
      .catch(renderFallback);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWeather);
  } else {
    loadWeather();
  }
})();
