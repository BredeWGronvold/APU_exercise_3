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
    static lat = 0.0;
    static lon = 0.0;

    /**
     * Retrieves the weather data for the given city by calling the Open Weather API.
    */
    async getWeather(cityName) {
        //TODO: Implement...
        let toBreak = false;
        axios.get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=c8da4ee199183df66c17fe7a2b6bf6da`
        )
        .then(cityJson => {
            console.log("\nCITYJSON\n");
            console.log(cityJson);
            console.log("\nCITYJSON_END\n");
            this.lat = cityJson.data.lat;
            this.lon = cityJson.data.lon;
        })
        .catch(function (error){
            console.log(error);
            console.log("\n\nERROR IN GETCITY!!!\n\n");
            toBreak = true;
        })
        .finally(function () {
            //always executed
            console.log("Attempted to collect latitude and longtitude data");
        });
        console.log("\nChecking toBreak value" + toBreak + "\n\n");
        if (toBreak == true) {
          console.log("perform toBreak");
          return;
        }

        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&appid=c8da4ee199183df66c17fe7a2b6bf6da`
          )
          .then(weatherJson => {
            console.log("\nWEATHERJSON\n");
            console.log(weatherJson);
            console.log("\nWEATHERJSON_END\n");
            const weatherObj = JSON.parse(weatherJson);
            const returnWeatherObj = {};
            returnWeatherObj.cityName = cityName;
            returnWeatherObj.temperature = weatherObj.data.main.temp_min - 273.15; //Conversion from Kelvin to Celcius
            returnWeatherObj.weatherDescription = weatherObj.data.weather.description; //Collect description of weather
          })
          .catch(function (error) {
            console.log(error);
            console.log("\n\nERROR IN GETWEATHER!!!\n\n");
            return;
          })
          .finally(function () {
            console.log("Attempted to collect weather data");
          });
          console.log("exited last get request")
        return await this.returnWeatherObj;
        // If valid weather data is found, return JSON object. Else return Null object
        // Check for if returnWeatherObejct === undefined and throw 404 if true
        // To upload to web server, should probably do JSON.stringify(returnWeatherobj);
    }
}

module.exports = OpenWeatherAPIService;
