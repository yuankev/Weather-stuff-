var cityInputEl = document.getElementById("city-input");
var cityFormEl = document.getElementById("city-form");
var searchEl = document.getElementById("search-button");
var searchHistoryEl = document.getElementById("search-history")
var currentContainerEl = document.getElementById("current-container")
var forecastContainerEl = document.getElementById("forecast-container")

var APIkey = "1f40db029d8aa5986ddf3ab9927c8d74";
var cities = []

var loadCities = function() {
    var citiesLoaded = localStorage.getItem("cities")
    if(!citiesLoaded) {
        return false;
    }
    
    citiesLoaded = JSON.parse(citiesLoaded);
    
    for (var i=0; i < citiesLoaded.length; i++) {
        displaySearchedCities(citiesLoaded[i])
        cities.push(citiesLoaded[i])
    }
}

var saveCities = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
}

var displaySearchedCities = function(city) {
    var cityCardEl = document.createElement("div");
    cityCardEl.setAttribute("class", "card");
    var cityCardNameEl = document.createElement("div");
    cityCardNameEl.setAttribute("class", "card-body searched-city");
    cityCardNameEl.textContent = city;
    
    cityCardEl.appendChild(cityCardNameEl)

    cityCardEl.addEventListener("click", function () {
        getCityData(city)
    });

    searchHistoryEl.appendChild(cityCardEl)

}

var displayCurrentData = function(city, data) {
 
    var tempCurrent = Math.round(data.current.temp);
    var humidity = Math.round(data.current.humidity);
    var windSpeed = data.current.wind_speed;
    var uvIndex = data.current.uvi;
    var iconCurrent = data.current.weather[0].icon;

    currentContainerEl.textContent = ""
    currentContainerEl.setAttribute("class", "m-3 border col-10 text-center")
    var divCityHeader = document.createElement("div")
    var headerCityDate = document.createElement("h2");
    var currentdate = moment().format("L");
    var imageIcon = document.createElement("img");
    imageIcon.setAttribute('src', "") 
    imageIcon.setAttribute('src', "https://openweathermap.org/img/wn/" + iconCurrent + "@2x.png")
    headerCityDate.textContent = city + "   (" + currentdate + ")";

    divCityHeader.appendChild(headerCityDate)
    divCityHeader.appendChild(imageIcon)
    currentContainerEl.appendChild(divCityHeader)

    var divCurrent = document.createElement("div")
    var tempEl = document.createElement("p");
    var humidityEl = document.createElement("p");
    var windSpeedEl = document.createElement("p");
    var uvIndexEl = document.createElement ("p");
    var uvIndexColorEl = document.createElement("span")
    uvIndexColorEl.textContent = uvIndex
        if (uvIndex <= 4) {
            uvIndexColorEl.setAttribute("class", "bg-success text-white p-2")
        } else if (uvIndex <= 8) {
            uvIndexColorEl.setAttribute("class","bg-warning text-black p-2")
        } else {
            uvIndexColorEl.setAttribute("class", "bg-danger text-white p-2")
        }
  
    tempEl.textContent = "Temperature: " + tempCurrent + "°F";
    humidityEl.textContent = "Humidity: " + humidity + "%";
    windSpeedEl.textContent = "Wind Speed: " + windSpeed + " MPH";
    uvIndexEl.textContent = "UV Index: ";

    uvIndexEl.appendChild(uvIndexColorEl)

    divCurrent.appendChild(tempEl);
    divCurrent.appendChild(humidityEl);
    divCurrent.appendChild(windSpeedEl);
    divCurrent.appendChild(uvIndexEl);

    currentContainerEl.appendChild(divCurrent);
    
};

var displayForecastData = function(data) {
    console.log(data)
    forecastContainerEl.textContent = "";
    var forecastHeaderEl = document.getElementById("five-day");
    forecastHeaderEl.textContent = "5-day Forecast:"

    for (var i=1; i < 6; i++) {
        var tempForecast = Math.round(data.daily[i].temp.day);
        var humidityForecast = data.daily[i].humidity;
        var iconForecast = data.daily[i].weather[0].icon;

    var cardEl = document.createElement("div");
    cardEl.setAttribute("class","card col-xl-2 col-md-5 col-sm-10 mx-3 my-2 bg-primary text-white text-center");

    var cardBodyEl = document.createElement("div");
    cardBodyEl.setAttribute("class","card-body");

    var cardDateEl = document.createElement("h6");
    cardDateEl.textContent = moment().add(i, 'days').format("L");

    var cardIconEl = document.createElement("img");
    cardIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + iconForecast + "@2x.png")

    var cardTempEl = document.createElement("p");
    cardTempEl.setAttribute("class", "card-text");
    cardTempEl.textContent = "Temperature:  " + tempForecast + "°F";

    var cardHumidEl = document.createElement("p")
    cardHumidEl.setAttribute("class", "card-text");
    cardHumidEl.textContent = "Humidity:  " + humidityForecast + "%";
 
    cardBodyEl.appendChild(cardDateEl)
    cardBodyEl.appendChild(cardIconEl)
    cardBodyEl.appendChild(cardTempEl)
    cardBodyEl.appendChild(cardHumidEl)
   
    cardEl.appendChild(cardBodyEl);
    forecastContainerEl.appendChild(cardEl);
    cityFormEl.reset()

    }
};

var getCityData = function(city) {
    event.preventDefault();
  
    var cityInfoUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIkey;

    fetch(cityInfoUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
            console.log(data);

    var cityName = data.name;
    var latitude = data.coord.lat;
    var longitude = data.coord.lon;

    var prevSearch = cities.includes(cityName)
    if (!prevSearch) {
        cities.push(cityName)
        saveCities()
        displaySearchedCities(cityName)
    }

    getWeatherData(cityName,latitude,longitude);

    });

    } else { 
        alert("City not found. Please try again.")
        cityFormEl.reset()
     }
   });
};

var getWeatherData = function(city,latitude,longitude) { 
    var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly&appid=" + APIkey;
        
    fetch(forecastUrl).then(function(response) {
        response.json().then(function(data) {
            console.log(data);

        displayCurrentData(city, data);
        displayForecastData(data);

        });
    });
};

loadCities()

cityFormEl.addEventListener("submit", function() {
    cityInput = cityInputEl.value.trim();
    getCityData(cityInput);