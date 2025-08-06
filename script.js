const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherCard = document.getElementById('weather-card');
const cityElem = document.getElementById('city');
const dateElem = document.getElementById('date');
const iconElem = document.getElementById('icon');
const tempElem = document.getElementById('temp');
const descElem = document.getElementById('desc');
const detailsElem = document.getElementById('details');
const errorElem = document.getElementById('error');

const apiKey = '0ee2c5d60ad62e652b001593433ea76b'; // <-- Place your OpenWeatherMap API key here

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  showError('');
  weatherCard.classList.add('hide');
  try {
    const data = await getWeather(city);
    showWeather(data);
  } catch (err) {
    showError(err.message || 'Could not fetch weather.');
  }
});

async function getWeather(city) {
  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('City not found. Please try again.');
  return await resp.json();
}

function showWeather(data) {
  const dt = new Date(data.dt * 1000);
  cityElem.textContent = `${data.name}, ${data.sys.country}`;
  dateElem.textContent = dt.toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  iconElem.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  iconElem.alt = data.weather[0].description;
  tempElem.textContent = `${Math.round(data.main.temp)}°C`;
  descElem.textContent = data.weather[0].description;
  detailsElem.innerHTML =
    `Humidity: ${data.main.humidity}%<br>Wind: ${data.wind.speed} m/s`;
  weatherCard.classList.remove('hide');
}

function showError(message) {
  if (message) {
    errorElem.textContent = message;
    errorElem.classList.remove('hide');
  } else {
    errorElem.classList.add('hide');
  }
}
