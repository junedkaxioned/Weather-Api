var apiKey = "479542b2e11f432e407bc2d934c0dcdc";
var form = document.querySelector('.form')
var searchInput = document.querySelector('.input-search');
var backImage = document.querySelector('.backgorund-image');
var mainContent = document.querySelector('.main-content');
var weatherContainer = document.querySelector('.weather-container');
var cityNotFound = document.querySelector('.not-found');
var dates = new Date;
var options = {weekday: 'long', day: 'numeric',  month: 'short', year: "2-digit" };
var time = dates.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
var days = dates.toLocaleDateString('en-GB',options);

// function for Showing weather Data
function showWeather(data) {
  var name = data.name;
  var weather = data.weather[0].main;
  var minTemp = Math.ceil(data.main.temp_min - 273.15);
  var maxTemp = Math.ceil(data.main.temp_max - 273.15);
  var tempinCelcius = Math.ceil(data.main.temp - 273.15); 
  var feelsLike = Math.ceil(data.main.feels_like - 273.15); 
  var humidity = data.main.humidity; 
  var wind = data.wind.speed; 
  var icon = data.weather[0].icon;

  // Displaying Weather Data
  weatherContainer.innerHTML = `
    <div class="weather-data">
      <span class="degre">${tempinCelcius}<sup>&#xb0;C</sup></span>
      <div class="data">
        <h2>${name}</h2>
        <span class="date"> ${time} - ${days} IST</span>
      </div>
      <div class="weather">
        <figure><img src='https://openweathermap.org/img/wn/${icon}.png' alt='Weather Icon'>
          <figcaption class="weather-name">
            ${weather}
          </figcaption>
        </figure>
      </div>
    </div>
    <div class="weather-details">
      <h3>Weather Details</h3>
      <ul class="details">
        <li class="detail">
          <h5 class="weather-name">Feels Like</h5>
          <span>${feelsLike}<sup>&#xb0;C</sup></span>
        </li>
        <li class="detail">
          <h5 class="weather-name">Max Temp</h5>
          <span>${maxTemp}<sup>&#xb0;C</sup></span>
        </li>
        <li class="detail">
          <h5 class="weather-name">Min Temp</h5>
          <span>${minTemp}<sup>&#xb0;C</sup></span>
        </li>
        <li class="detail">
          <h5 class="weather-name">Humidity</h5>
          <span>${humidity}%</span>
        </li>
        <li class="detail">
          <h5 class="weather-name">Wind</h5>
          <span>${wind} Km/h</span>
        </li>
      </ul>
    </div>
    `
// Condition on type of weather to display tha background
  if (weather.toLowerCase() == 'clouds') {
    weatherContainer.style.backgroundImage = 'url("./assets/images/cloudy.jfif")';
    backImage.style.backgroundImage = 'url("./assets/images/cloudy.jfif")';
  } else if (weather.toLowerCase() == 'thunderstorm') {
    weatherContainer.style.backgroundImage = 'url("./assets/images/thunderstorm.jfif")';
    backImage.style.backgroundImage = 'url("./assets/images/thunderstorm.jfif")';
  } else if (weather.toLowerCase() == 'drizzle') {
    weatherContainer.style.backgroundImage = 'url("./assets/images/drizzel.jfif")';
    backImage.style.backgroundImage = 'url("./assets/images/drizzel.jfif")';
  } else if (weather.toLowerCase() == 'rain') {
    weatherContainer.style.backgroundImage = 'url("./assets/images/rainy.jfif")';
    backImage.style.backgroundImage = 'url("./assets/images/rainy.jfif")';
  } else if (weather.toLowerCase() == 'clear') {
    weatherContainer.style.backgroundImage = 'url("./assets/images/clear.jfif")';  
    backImage.style.backgroundImage = 'url("./assets/images/clear.jfif")';
  } else if (weather.toLowerCase() == 'snow') {
    weatherContainer.style.backgroundImage = 'url("./assets/images/snow.jfif")';
    backImage.style.backgroundImage = 'url("./assets/images/snow.jfif")';
    weatherContainer.style.color = '#000';  
  } else {
    weatherContainer.style.backgroundImage = 'url("./assets/images/haze.jfif")';
    backImage.style.backgroundImage = 'url("./assets/images/haze.jfif")';
    weatherContainer.style.color = '#000';
  }
}

// Events on form submit
form.addEventListener('submit', function (e) {
  e.preventDefault();
  fetchApi(searchInput);
})

// Fetching Weather Api
function fetchApi(searchInput) {
  var baseApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=${apiKey}`;
  fetch(baseApi)
  .then(function (response) {
    // Condition if response ok disable invalid text and display response
    if (response.ok) {
      cityNotFound.style.display = 'none';
      return response.json();
    // Condition if response is 404 display invalid text and disable response
    } else if (response.status === 404){  
      weatherContainer.innerHTML = "";
      cityNotFound.style.display = 'block';
      cityNotFound.innerHTML = `<h2>Invalid or ${searchInput.value} not found in database</h2>`
    } 
  })
  .then(function (data) {
    showWeather(data);
  })
}

// function for getting current coordinates
function getCoordintes() {
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  }

  function success(pos) {
    var crd = pos.coords;
    var lat = crd.latitude.toString();
    var lng = crd.longitude.toString();
    var coordinates = [lat, lng];
    fetchLocation(coordinates)
    return;
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  navigator.geolocation.getCurrentPosition(success, error, options);
}

// function of getting current city
function fetchLocation(coordinates) {
  var lat = coordinates[0];
  var lng = coordinates[1];
  var locKey = "pk.48c24cc9e92d7c9e86d0675e578a7fc9"
  var locApi = `https://us1.locationiq.com/v1/reverse.php?key=${locKey}&lat="${lat}"&lon="${lng}"&format=json`;
//  fetching api for getting current city
  fetch(locApi)
  .then(function (response) {
    return response.json();
  })
  .then(function (result) {
    var city = {"value":result.address.city}
    fetchApi(city);
  })
}
getCoordintes();``