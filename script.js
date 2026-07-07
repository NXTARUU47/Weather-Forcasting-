const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const weatherInfoSection = document.querySelector('.weather-info')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')
const countyTxt = document.querySelector('.country-txt ')
const tempTxt = document.querySelector('.temp-txt ')
const conditiontTxt = document.querySelector('.condition-text ')
const humidityValueTxt = document.querySelector('.condition-value ')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt ')
const forecastItemContainer = document.querySelector('.forecast-item-container')



const apiKey = '12820ea71470723aa4210255248097fe'

searchBtn.addEventListener("click", () => {
    if (cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: "short",
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB', options)

}

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstrom.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}
async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)
    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection)
        return
    }
    console.log(weatherData);

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData

    countyTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + "°C"
    conditiontTxt.textContent = main
    humidityValueTxt.textContent = humidity + "%"
    windValueTxt.textContent = speed + ' M/s'
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`
    currentDateTxt.textContent = getCurrentDate()

    await updateForecastsInfo(city)
    showDisplaySection(weatherInfoSection)
}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection].forEach(element => {
        element.style.display = "none";
    });
    section.style.display = 'flex'
}

async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData("forecast", city);

    const timeTaken = "12:00:00";
    const todayDate = new Date().toISOString().split("T")[0];
    forecastItemContainer.innerHTML = ''
    forecastsData.list.forEach(forecastWeather => {
        if (
            forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)
        ) {
            updateForecastsItem(forecastWeather)
        }
    });
    console.log(forecastsData);
    
}




function updateForecastsItem(weatherData) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData;

    const dateTaken = new Date(date)
    const dateOption={
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US',dateOption)
    const forecastItem = `
        <div class="forcast-item">
            <h5 class="forecast-item-date regular-txt text-white small fw-semibold">
                ${dateResult}
            </h5>
            <img src="assets/weather/${getWeatherIcon(id)}" alt="thunderstorm" class="forecast-item-img">
            <h5 class="forecast-item-temp regular-txt text-white small fw-semibold">
                ${Math.round(temp) +" °C"}
            </h5>
        </div>
    `;

    forecastItemContainer.insertAdjacentHTML("beforeend", forecastItem);
}