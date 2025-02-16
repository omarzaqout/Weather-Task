function addToRecentSearches(city) {
    if (!city) return;
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    recentSearches = recentSearches.filter(item => item !== city);
    recentSearches.unshift(city);
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    updateRecentSearches();
}

function displayLastSearch() {
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    if (recentSearches.length > 0) {
        const lastCity = recentSearches[0];  
        fetchWeatherForCity(lastCity, false);
    }
}

async function fetchWeatherForCity(city, addToRecent = true) {
    const apiKey = "70e6806bc0b24220bed201504251502";
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("City not found!");
        }
        const data = await response.json();
        document.getElementById("temp").innerText = data.current.temp_c + "℃";
        document.getElementById("country").innerText = data.location.country;
        document.getElementById("city").innerText = city + " " + new Date(data.location.localtime).toLocaleString();
        document.getElementById("condition").innerText = data.current.condition.text;
        document.getElementById("humidity").innerText = "Humidity: " + data.current.humidity + "%";
        document.getElementById("wind").innerText = "Wind: " + data.current.wind_kph + " km/h";

        const iconUrl = "https:" + data.current.condition.icon;
        document.getElementById("weather-icon").src = iconUrl;
        
        if (addToRecent) {
            addToRecentSearches(city);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Error fetching data");
    }
}

function updateRecentSearches() {
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    const list = document.querySelector(".recent-search ul");
    list.innerHTML = "";
    recentSearches.forEach(city => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#" onclick="fetchWeatherForCity('${city}', false)">${city}</a>`;
        list.appendChild(li);
    });
}

async function fetchWeather() {
    const city = document.getElementById("search").value.trim();
    if (!city) return;
    await fetchWeatherForCity(city, true);
}

document.getElementById("search").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        fetchWeather();
    }
});

window.onload = function() {
    displayLastSearch(); 
};

updateRecentSearches();
