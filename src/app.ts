const API_KEY = '7e0efcff0081df043c9009e6364c4a0e';
const API_URL = 'https://api.openweathermap.org/data/2.5';

const cityInput = document.querySelector<HTMLInputElement>('#cityInput');
const searchBtn = document.querySelector<HTMLButtonElement>('#searchBtn');
const locationBtn = document.querySelector<HTMLButtonElement>('#locationBtn');

const errorMsg = document.querySelector<HTMLDivElement>('#errorMessage');
const loading = document.querySelector<HTMLDivElement>('#loading');

const cityName = document.querySelector<HTMLHeadingElement>('#cityName');
const country = document.querySelector<HTMLParagraphElement>('#country');

const weatherInfo = document.querySelector<HTMLDivElement>('#weatherInfo');
const weatherIcon = document.querySelector<HTMLImageElement>('#weatherIcon');

const temp = document.querySelector<HTMLHeadingElement>('#temp');
const tempToggle = document.querySelector<HTMLDivElement>('.temp-toggle');
const desc = document.querySelector<HTMLParagraphElement>('#description');
const humidity = document.querySelector<HTMLParagraphElement>('#humidity');
const windSpeed = document.querySelector<HTMLParagraphElement>('#windSpeed');
const feelsLike = document.querySelector<HTMLParagraphElement>('#feelsLike');
const visibility = document.querySelector<HTMLParagraphElement>('#visibility');

const fahrenheitBtn =
  document.querySelector<HTMLButtonElement>('#fahrenheitBtn');
const celsiusBtn = document.querySelector<HTMLButtonElement>('#celsiusBtn');

const forecast = document.querySelector<HTMLDivElement>('#forecast');
let forecastCards = document.querySelector<HTMLDivElement>('#forecastCards');

let currentUnit = 'celsius';

let weatherData = null;

async function getWeatherByCity(city) {
  loading.classList.remove('hidden');

  weatherInfo.classList.add('hidden');
  errorMsg.classList.add('hidden');

  try {
    const getCityByName = await fetch(
      `${API_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
    );
    if (!getCityByName.ok) {
      throw new Error(`City_not_found status: ${getCityByName.status}`);
    }
    const data = await getCityByName.json();
    return data;
  } catch (err) {
    console.log('Ошибка:', err);
    showError('Город не найден');
  } finally {
    loading.classList.add('hidden');
  }
}

async function getWeatherByCoords(lat, lon) {
  loading.classList.remove('hidden');

  weatherInfo.classList.add('hidden');
  errorMsg.classList.add('hidden');

  try {
    const getCityByCoords = await fetch(
      `${API_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`
    );
    if (!getCityByCoords.ok) {
      throw new Error(`City_not_found status: ${getCityByCoords.status}`);
    }
    const data = await getCityByCoords.json();
    return data;
  } catch (err) {
    console.log('Ошибка:', err);
    showError('Город не найден');
  } finally {
    loading.classList.add('hidden');
  }
}

function displayWeather(data) {
  weatherData = data;

  cityName.textContent = data.name;
  country.textContent = data.sys.country;
  temp.textContent = Math.round(data.main.temp);
  desc.textContent = data.weather[0].description;
  humidity.textContent = data.main.humidity;
  windSpeed.textContent = Math.round(data.wind.speed);
  feelsLike.textContent = Math.round(data.main.feels_like);
  visibility.textContent = data.visibility;

  celsiusBtn.classList.add('active');
  fahrenheitBtn.classList.remove('active');

  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  weatherInfo.classList.remove('hidden');

  errorMsg.classList.add('hidden');
}

function showError(message) {
  errorMsg.textContent = message;

  errorMsg.classList.remove('hidden');

  loading.classList.add('hidden');
  weatherInfo.classList.add('hidden');
}

function celsiusToFahrenheit() {
  if (!weatherData) return;

  const tempF = Math.round((weatherData.main.temp * 9) / 5 + 32);
  const feelsF = Math.round((weatherData.main.feels_like * 9) / 5 + 32);

  temp.textContent = tempF;
  feelsLike.textContent = feelsF;
}

function fahrenheitToCelsius() {
  if (!weatherData) return;

  temp.textContent = Math.round(weatherData.main.temp);
  feelsLike.textContent = Math.round(weatherData.main.feels_like);
}

function toggleTemperatureUnit() {
  if (currentUnit === 'celsius') {
    celsiusToFahrenheit();
    currentUnit = 'fahrenheit';
  } else {
    fahrenheitToCelsius();
    currentUnit = 'celsius';
  }

  celsiusBtn.classList.toggle('active');
  fahrenheitBtn.classList.toggle('active');
}

function getCurrentLocation() {
  const successFunc = async (position) => {
    const coords = position.coords;
    const latitude = coords.latitude;
    const longitude = coords.longitude;
    const info = await getWeatherByCoords(latitude, longitude);
    displayWeather(info);

    const forecastData = await getForecast(info.name);
    if (forecastData) displayForecast(forecastData);
  };
  const errorFunc = (error) => showError(error.message);

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(successFunc, errorFunc);
  }
}

async function getForecast(city) {
  try {
    const getCityForecast = await fetch(
      `${API_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
    );
    if (!getCityForecast.ok) {
      throw new Error(
        `City_forecast_not_found status: ${getCityForecast.status}`
      );
    }

    const data = await getCityForecast.json();
    const twelvePM = data.list.filter(
      (element) => element?.dt_txt?.split(' ')[1] === '12:00:00'
    );
    return twelvePM;
  } catch (err) {
    console.log('Ошибка:', err);
    showError('Прогноз города не найден');
  }
}

async function displayForecast(forecastData) {
  forecast.classList.add('hidden');
  forecastCards.textContent = '';

  forecastData.forEach((element) => {
    const forecastCard = document.createElement('div');
    const forecastDay = document.createElement('h1');
    const forecastIcon = document.createElement('img');
    const forecastTemp = document.createElement('p');

    forecastCard.classList.add('forecast-card');
    forecastDay.classList.add('forecast-day');
    forecastIcon.classList.add('forecast-icon');
    forecastTemp.classList.add('forecast-temp');

    const date = new Date(element.dt_txt);
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    forecastDay.textContent = date.toLocaleDateString('ru-RU', options);
    forecastIcon.src = `https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png`;
    forecastTemp.textContent = Math.round(element.main.temp) + '°C';

    forecastCard.append(forecastDay, forecastIcon, forecastTemp);

    forecastCards.append(forecastCard);
  });

  forecast.classList.remove('hidden');
}

const coordsRegex = /^-?\d+\.?\d*,\s?-?\d+\.?\d*$/;

const GetAndPutWeather = async () => {
  let value = cityInput.value.trim();
  if (value === '') {
    showError('Введите название города');
    return;
  }
  let data;

  if (coordsRegex.test(value)) {
    const [lat, lon] = value.split(',').map(Number);
    data = await getWeatherByCoords(lat, lon);
  } else if (value !== '') {
    data = await getWeatherByCity(value.toLowerCase());
  }
  if (!data) return;
  displayWeather(data);

  const forecastData = await getForecast(value.toLowerCase());
  if (!forecastData) return;
  displayForecast(forecastData);
  cityInput.value = '';
};

searchBtn.addEventListener('click', GetAndPutWeather);

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    GetAndPutWeather();
    cityInput.blur();
  }
});

locationBtn.addEventListener('click', getCurrentLocation);

tempToggle.addEventListener('click', toggleTemperatureUnit);

const onload = () => {
  getCurrentLocation();
};

onload();
