// Function to fetch weather data from Weatherstack API
async function getWeatherData(location) {
  const apiKey = 'aff4316db6b7075cba8f78d1d2e1a165'; // Your Weatherstack API key
  const apiUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${location}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error.info);
    }
  } catch (error) {
    throw new Error(`Error fetching weather data: ${error.message}`);
  }
}
// Function to display weather information
function showWeatherInfo(weatherData) {
  const weatherInfoElement = document.getElementById('weatherInfo');
  weatherInfoElement.innerHTML = `
    <h2>${weatherData.location.name}</h2>
    <p>Temperature: ${weatherData.current.temperature}°C</p>
    <p>Weather: ${weatherData.current.weather_descriptions[0]}</p>
    <p>Wind Speed: ${weatherData.current.wind_speed} km/h</p>
    <p>Humidity: ${weatherData.current.humidity}%</p>
    <p>Visibility: ${weatherData.current.visibility} km</p>
    <p>Sunrise: ${weatherData.current.sunrise}</p>
    <p>Sunset: ${weatherData.current.sunset}</p>
  `;

  const weatherAnimationElement = document.getElementById('weatherAnimation');
  weatherAnimationElement.className = '';

  const currentDateTime = new Date();
  const sunriseTime = new Date(weatherData.current.sunrise);
  const sunsetTime = new Date(weatherData.current.sunset);

  if (currentDateTime >= sunriseTime && currentDateTime < sunsetTime) {
    // Daytime
    weatherAnimationElement.classList.add('day');
  } else {
    // Nighttime
    weatherAnimationElement.classList.add('night');
  }

  if (weatherData.current.weather_code === 113) {
    // Clear Sky
    weatherAnimationElement.classList.add('clear-sky');
  } else if (weatherData.current.weather_code === 119 || weatherData.current.weather_code === 122) {
    // Cloudy
    weatherAnimationElement.classList.add('cloudy');
  } else if (weatherData.current.weather_code === 353 || weatherData.current.weather_code === 356) {
    // Light rain
    weatherAnimationElement.classList.add('rain');
  } else {
    // Other conditions
    weatherAnimationElement.classList.add('default');
  }
}


// Function to display weather information
function showWeatherInfo(weatherData) {
  const weatherInfoElement = document.getElementById('weatherInfo');
  weatherInfoElement.innerHTML = `
    <h2 style="text-align: center;">${weatherData.location.name}</h2>
    <p stlye="font-size: 20px;">Temperature: ${weatherData.current.temperature}°C</p>
    <p>Weather: ${weatherData.current.weather_descriptions[0]}</p>
    <p>Wind Speed: ${weatherData.current.wind_speed} km/h</p>
    <p>Humidity: ${weatherData.current.humidity}%</p>
    <p>Visibility: ${weatherData.current.visibility} km</p>
  `;

  const weatherAnimationElement = document.getElementById('weatherAnimation');
  weatherAnimationElement.className = '';

  if (weatherData.current.weather_code === 113) {
    // Clear Sky
    weatherAnimationElement.classList.add('clear-sky');
  } else if (weatherData.current.weather_code === 119 || weatherData.current.weather_code === 122) {
    // Cloudy
    weatherAnimationElement.classList.add('cloudy');
  } else if (weatherData.current.weather_code === 353 || weatherData.current.weather_code === 356) {
    // Light rain
    weatherAnimationElement.classList.add('rain');
  } else {
    // Other conditions
    weatherAnimationElement.classList.add('default');
  }
}

// Function to handle geolocation success
function handleGeolocationSuccess(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const apiUrl = `http://api.weatherstack.com/current?access_key=aff4316db6b7075cba8f78d1d2e1a165&query=${latitude},${longitude}`;

  getWeatherData(apiUrl)
    .then((weatherData) => {
      showWeatherInfo(weatherData);
    })
    .catch((error) => {
      const weatherInfoElement = document.getElementById('weatherInfo');
      weatherInfoElement.innerHTML = `<p>${error.message}</p>`;
    });
}

// Function to handle geolocation error
function handleGeolocationError(error) {
  console.log('Geolocation error:', error);
}

// Function to fetch weather data based on geolocation
function fetchWeatherByGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError);
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
}

// Event listener for the "Get Weather" button
document.getElementById('getWeatherBtn').addEventListener('click', () => {
  const locationInput = document.getElementById('locationInput');
  const location = locationInput.value.trim();

  if (location !== '') {
    getWeatherData(location)
      .then((weatherData) => {
        showWeatherInfo(weatherData);
      })
      .catch((error) => {
        const weatherInfoElement = document.getElementById('weatherInfo');
        weatherInfoElement.innerHTML = `<p>${error.message}</p>`;
      });
  }
});


// Event listener for the geolocation button
document.getElementById('geolocationBtn').addEventListener('click', fetchWeatherByGeolocation);

// Autocomplete for location input
$(function() {
  const locationInput = document.getElementById('locationInput');

  $(locationInput).autocomplete({
    source: function(request, response) {
      const apiKey = 'aff4316db6b7075cba8f78d1d2e1a165'; // Your Weatherstack API key
      const autocompleteUrl = `http://api.weatherstack.com/autocomplete?access_key=${apiKey}&query=${request.term}`;

      $.ajax({
        url: autocompleteUrl,
        method: 'GET',
        success: function(data) {
          response(data.results);
        }
      });
    },
    select: function(event, ui) {
      locationInput.value = ui.item.name;
      return false;
    }
  });
});

