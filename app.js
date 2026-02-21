// ===================================
// НАСТРОЙКА API
// ===================================

// 1. Зарегистрируйся на https://openweathermap.org/api
// 2. Получи бесплатный API ключ
// 3. Вставь его сюда:
const API_KEY = "7e0efcff0081df043c9009e6364c4a0e";
const API_URL = "https://api.openweathermap.org/data/2.5";

// ===================================
// ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ DOM
// ===================================

// TODO: Получи все нужные элементы из HTML
// Подсказка: используй querySelector/getElementById
// Нужны: инпут, кнопки, блоки для отображения данных, сообщения об ошибке
const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");
const locationBtn = document.querySelector("#locationBtn");

const errorMsg = document.querySelector("#errorMessage");
const loading = document.querySelector("#loading");

const cityName = document.querySelector("#cityName");
const country = document.querySelector("#country");

const weatherInfo = document.querySelector("#weatherInfo");
const weatherIcon = document.querySelector("#weatherIcon");

const temp = document.querySelector("#temp");
const tempToggle = document.querySelector(".temp-toggle");
const desc = document.querySelector("#description");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#windSpeed");
const feelsLike = document.querySelector("#feelsLike");
const visibility = document.querySelector("#visibility");

const fahrenheitBtn = document.querySelector("#fahrenheitBtn");
const celsiusBtn = document.querySelector("#celsiusBtn");

const forecast = document.querySelector("#forecast");
let forecastCards = document.querySelector("#forecastCards");

// ===================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ===================================

// TODO: Переменная для хранения единиц измерения (celsius/fahrenheit)
// TODO: Переменная для хранения текущих данных о погоде
let currentUnit = "celsius";

let weatherData = null;
// ===================================
// ОСНОВНЫЕ ФУНКЦИИ
// ===================================

/**
 * Функция для получения погоды по названию города
 *
 * Подсказки:
 * - Используй fetch() для запроса к API
 * - URL: `${API_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
 * - Не забудь async/await
 * - Обработай возможные ошибки (try/catch)
 * - Если город не найден, API вернет статус 404
 */
async function getWeatherByCity(city) {
  // TODO: Реализуй функцию
  // 1. Показать индикатор загрузки
  loading.classList.remove("hidden");
  // 2. Скрыть предыдущие данные и ошибки
  weatherInfo.classList.add("hidden");
  errorMsg.classList.add("hidden");
  // 3. Сделать запрос к API
  // 4. Если успешно - отобразить данные
  // 5. Если ошибка - показать сообщение об ошибке
  try {
    const getCityByName = await fetch(
      `${API_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`,
    );
    if (!getCityByName.ok) {
      throw new Error(`City_not_found status: ${getCityByName.status}`);
    }
    const data = await getCityByName.json();
    return data;
  } catch (err) {
    console.log("Ошибка:", err);
    showError("Город не найден");
  } finally {
    loading.classList.add("hidden");
  }
  // 6. Скрыть индикатор загрузки
}

/**
 * Функция для получения погоды по координатам
 *
 * Подсказки:
 * - URL: `${API_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`
 * - Логика похожа на getWeatherByCity
 */
async function getWeatherByCoords(lat, lon) {
  // TODO: Реализуй функцию

  loading.classList.remove("hidden");

  weatherInfo.classList.add("hidden");
  errorMsg.classList.add("hidden");

  try {
    const getCityByCoords = await fetch(
      `${API_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`,
    );
    if (!getCityByCoords.ok) {
      throw new Error(`City_not_found status: ${getCityByCoords.status}`);
    }
    const data = await getCityByCoords.json();
    return data;
  } catch (err) {
    console.log("Ошибка:", err);
    showError("Город не найден");
  } finally {
    loading.classList.add("hidden");
  }
}

/**
 * Функция для отображения данных о погоде
 *
 * Подсказки:
 * - data.name - название города
 * - data.sys.country - код страны
 * - data.main.temp - температура
 * - data.weather[0].description - описание
 * - data.weather[0].icon - код иконки
 * - data.main.humidity - влажность
 * - data.wind.speed - скорость ветра
 * - data.main.feels_like - ощущается как
 * - data.visibility - видимость
 *
 * Иконка погоды:
 * - URL: `https://openweathermap.org/img/wn/${iconCode}@2x.png`
 */
function displayWeather(data) {
  weatherData = data;
  // TODO: Реализуй функцию
  // 1. Заполни все элементы данными из API
  cityName.textContent = data.name;
  country.textContent = data.sys.country;
  temp.textContent = Math.round(data.main.temp);
  celsius = temp.textContent;
  desc.textContent = data.weather[0].description;
  humidity.textContent = data.main.humidity;
  windSpeed.textContent = Math.round(data.wind.speed);
  feelsLike.textContent = Math.round(data.main.feels_like);
  visibility.textContent = data.visibility;

  celsiusBtn.classList.add("active");
  fahrenheitBtn.classList.remove("active");
  // 2. Установи иконку погоды
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  // 3. Покажи блок с информацией о погоде
  weatherInfo.classList.remove("hidden");
  // 4. Скрой сообщение об ошибке
  errorMsg.classList.add("hidden");
}

/**
 * Функция для показа сообщения об ошибке
 */
function showError(message) {
  // TODO: Реализуй функцию
  // 1. Установи текст ошибки
  errorMsg.textContent = message;
  // 2. Покажи блок с ошибкой
  errorMsg.classList.remove("hidden");
  // 3. Скрой блок с погодой
  loading.classList.add("hidden");
  weatherInfo.classList.add("hidden");
}

/**
 * Функция для конвертации температуры из Цельсия в Фаренгейт
 * Формула: (C × 9/5) + 32 = F
 */
function celsiusToFahrenheit() {
  // TODO: Реализуй функцию
  if (!weatherData) return;

  const tempF = Math.round((weatherData.main.temp * 9) / 5 + 32);
  const feelsF = Math.round((weatherData.main.feels_like * 9) / 5 + 32);

  temp.textContent = tempF;
  feelsLike.textContent = feelsF;
}

/**
 * Функция для конвертации температуры из Фаренгейта в Цельсий
 * Формула: (F − 32) × 5/9 = C
 */
function fahrenheitToCelsius() {
  // TODO: Реализуй функцию
  if (!weatherData) return;

  temp.textContent = Math.round(weatherData.main.temp);
  feelsLike.textContent = Math.round(weatherData.main.feels_like);
}

/**
 * Функция для переключения единиц температуры (°C ↔ °F)
 *
 * Подсказки:
 * - Нужно пересчитать все температуры на странице
 * - Текущая температура, ощущается как
 * - Обнови глобальную переменную единиц измерения
 * - Добавь/убери класс 'active' на кнопках
 */
function toggleTemperatureUnit() {
  // TODO: Реализуй функцию
  if (currentUnit === "celsius") {
    celsiusToFahrenheit();
    currentUnit = "fahrenheit";
  } else {
    fahrenheitToCelsius();
    currentUnit = "celsius";
  }

  celsiusBtn.classList.toggle("active");
  fahrenheitBtn.classList.toggle("active");
}

/**
 * Функция для получения текущего местоположения пользователя
 *
 * Подсказки:
 * - Используй Geolocation API: navigator.geolocation.getCurrentPosition()
 * - Обработай случай, если пользователь запретил доступ
 */
function getCurrentLocation() {
  // TODO: Реализуй функцию
  // 1. Проверь, доступен ли navigator.geolocation
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

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(successFunc, errorFunc);
  }
  // 2. Запроси текущую позицию
  // 3. При успехе - вызови getWeatherByCoords()
  // 4. При ошибке - покажи сообщение
}

// ===================================
// БОНУСНАЯ ФУНКЦИЯ: ПРОГНОЗ НА 5 ДНЕЙ
// ===================================

/**
 * Функция для получения прогноза на 5 дней
 *
 * Подсказки:
 * - URL: `${API_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
 * - API возвращает данные каждые 3 часа
 * - Нужно выбрать один прогноз на день (например, на 12:00)
 * - data.list - массив прогнозов
 * - Каждый элемент содержит: dt_txt, main.temp, weather[0]
 */
async function getForecast(city) {
  // TODO: Реализуй функцию (бонус)
  try {
    const getCityForecast = await fetch(
      `${API_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ru`,
    );
    if (!getCityForecast.ok) {
      throw new Error(
        `City_forecast_not_found status: ${getCityForecast.status}`,
      );
    }

    const data = await getCityForecast.json();
    const twelvePM = data.list.filter(
      (element) => element?.dt_txt?.split(" ")[1] === "12:00:00",
    );
    return twelvePM;
  } catch (err) {
    console.log("Ошибка:", err);
    showError("Прогноз города не найден");
  }
}

/**
 * Функция для отображения прогноза
 */
async function displayForecast(forecastData) {
  // TODO: Реализуй функцию (бонус)
  // 1. Очисти контейнер для карточек
  forecast.classList.add("hidden");
  forecastCards.textContent = "";

  // 2. Для каждого дня создай карточку
  forecastData.forEach((element) => {
    const forecastCard = document.createElement("div");
    const forecastDay = document.createElement("h1");
    const forecastIcon = document.createElement("img");
    const forecastTemp = document.createElement("p");

    forecastCard.classList.add("forecast-card");
    forecastDay.classList.add("forecast-day");
    forecastIcon.classList.add("forecast-icon");
    forecastTemp.classList.add("forecast-temp");

    const date = new Date(element.dt_txt);
    const options = { weekday: "short", day: "numeric", month: "short" };
    forecastDay.textContent = date.toLocaleDateString("ru-RU", options);
    forecastIcon.src = `https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png`;
    forecastTemp.textContent = Math.round(element.main.temp) + "°C";

    forecastCard.append(forecastDay, forecastIcon, forecastTemp);

    forecastCards.append(forecastCard);
  });
  // 3. Добавь день недели, иконку, температуру
  // 4. Покажи блок с прогнозом
  forecast.classList.remove("hidden");
}

// ===================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ===================================

// TODO: Добавь обработчики на кнопки и инпут
// 1. Клик по кнопке "Найти"
const coordsRegex = /^-?\d+\.?\d*,\s?-?\d+\.?\d*$/;

const GetAndPutWeather = async () => {
  let value = cityInput.value.trim();
  if (value === "") {
    showError("Введите название города");
    return;
  }
  let data;

  if (coordsRegex.test(value)) {
    // Если введено что-то вроде "55.75, 37.61"
    const [lat, lon] = value.split(",").map(Number);
    data = await getWeatherByCoords(lat, lon);
  } else if (value !== "") {
    // В остальном считаем, что это название города
    data = await getWeatherByCity(value.toLowerCase());
  }
  if (!data) return;
  displayWeather(data);

  const forecastData = await getForecast(value.toLowerCase());
  if (!forecastData) return;
  displayForecast(forecastData);
  cityInput.value = "";
};

searchBtn.addEventListener("click", GetAndPutWeather);
// 2. Enter в поле ввода
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    GetAndPutWeather();
    cityInput.blur();
  }
});
// 3. Клик по кнопке геолокации
locationBtn.addEventListener("click", getCurrentLocation);
// 4. Клик по кнопкам переключения °C/°F
tempToggle.addEventListener("click", toggleTemperatureUnit);

// ===================================
// ИНИЦИАЛИЗАЦИЯ
// ===================================

// TODO: При загрузке страницы можно:
// - Загрузить погоду для города по умолчанию
// - Или запросить геолокацию
const onload = () => {
  getCurrentLocation();
};

onload();

// ===================================
// ПОДСКАЗКИ ПО СТРУКТУРЕ ОТВЕТА API
// ===================================

/*
Пример ответа от API (current weather):
{
    "name": "Moscow",
    "sys": { "country": "RU" },
    "main": {
        "temp": 15.5,
        "feels_like": 14.2,
        "humidity": 65
    },
    "weather": [
        {
            "description": "облачно",
            "icon": "04d"
        }
    ],
    "wind": { "speed": 3.5 },
    "visibility": 10000
}

Пример ответа от API (forecast):
{
    "list": [
        {
            "dt_txt": "2024-03-20 12:00:00",
            "main": { "temp": 16.2 },
            "weather": [{ "icon": "03d", "description": "облачно" }]
        },
        // ... еще прогнозы
    ]
}
*/
