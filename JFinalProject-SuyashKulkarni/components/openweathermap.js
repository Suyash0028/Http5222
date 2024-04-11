const moment = require('moment');
const apiUrl = process.env.OPENWEATHERMAP_API_URL;
const apiKey = process.env.OPENWEATHERMAP_API_KEY;

async function getWeather(lat, lon) {
    const response = await fetch(`${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const weatherData = await response.json();
    const responseData = weatherData.list;
    let finalData = [];
    const seenDates = new Set();
    responseData.forEach(item => {
        const forecastDate = moment.unix(item.dt).startOf('day');
        const forecastDateString = forecastDate.format('YYYY-MM-DD');

        if (!seenDates.has(forecastDateString)) {
            // Parse the UTC date string and convert it to local time
            const date = moment.unix(item.dt);
            // Format the local date as desired
            const formattedDate = date.format('dddd');

            finalData.push({
                icon: "http://openweathermap.org/img/w/" + item.weather[0].icon + ".png",
                temp: item.main.temp,
                feels_like: item.main.feels_like,
                date: formattedDate,
                min_temp: item.main.temp_min,
                max_temp: item.main.temp_max,
                today: Date.now(),
            });
            seenDates.add(forecastDateString);
        }
    });
    return finalData.slice(0, 5);;
}
module.exports = { getWeather };
