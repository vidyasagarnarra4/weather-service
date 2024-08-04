const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const openweather_api_key = "2b3e4489ced48cc3e85a02db1d626eb6"; 
const openweather_url = "http://api.openweathermap.org/data/2.5/weather";

const initializeServer = async () => {
  try {
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000");
    });
  } catch (error) {
    console.log(`Server Error: ${error.message}`);
    process.exit(1);
  }
};

initializeServer();

const formatWeatherResponse = (data) => {
  return {
    location: data.name, 
    temperature: data.main.temp, 
    weather_descriptions: data.weather.map((w) => w.description).join(", "),
    humidity: data.main.humidity,
    wind_speed: data.wind.speed,
  };
};

app.get("/weather", async (request, response) => {
  const { city } = request.query;

  if (!city) {
    response.status(400).send("City parameter is required");
    return;
  }

  try {
    const weatherResponse = await axios.get(openweather_url, {
      params: {
        q: city,
        appid: openweather_api_key,
        units: "metric"
      },
    });

    const weatherData = weatherResponse.data;

    const formattedWeatherData = formatWeatherResponse(weatherData);
    response.send(formattedWeatherData);
  } catch (error) {
    response.status(500).send("Error fetching weather data");
  }
});

module.exports = app;

