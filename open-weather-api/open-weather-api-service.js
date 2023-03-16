/*import axios from 'axios';*/
var axios = require("axios");
/**
 * This class is used retrieve weather data for a given city, by calling the Open Weather API.
 * See here for the Open Weather API documentation - https://openweathermap.org/current.
 */
class OpenWeatherAPIService {

    // The API key that is needed to successfully authenticate when calling the Open Weather API. 
    // if this does not work, register one yourself using the instruction here: https://openweathermap.org/appid
    static apiKey = "c8da4ee199183df66c17fe7a2b6bf6da";

    /**
     * Retrieves the weather data for the given city by calling the Open Weather API.
    */
    async getWeather(cityName) {
      const getWeatherData = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${OpenWeatherAPIService.apiKey}`
      )
      .then(response => {
        console.log("\nCITYJSON\n");
        console.log(response.data);
        console.log("\nCITYJSON_END\n");
        var [lat, lon] = [response.data[0].lat, response.data[0].lon];
        console.log("Getting city at lat: " + lat + " lon: " + lon);
        return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OpenWeatherAPIService.apiKey}&units=metric`);
      })
      .then(response => {
        console.log("\nWEATHERJSON\n");
        console.log(response.data);
        console.log("\nWEATHERJSON_END\n");
        var returnWeatherObject = {};
        returnWeatherObject["cityName"] = cityName;
        returnWeatherObject["temperature"] = response.data.main.temp_min;
        returnWeatherObject["weatherDescription"] = response.data.weather[0].description;
        return returnWeatherObject;
      })
      .catch(function (error) {
        console.log("\n\n!!! AXIOS GET ERROR !!!\n\n")
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error: " + error.message);
        }
        console.log(error.config);
        return;
      });
      return getWeatherData;
    }
}

module.exports = OpenWeatherAPIService;
