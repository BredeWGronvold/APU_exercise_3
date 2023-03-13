import axios from 'axios';
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
        //TODO: Implement...
        axios.get(
          'http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}'
        )
        .then(cityJson => {
            const lat = parsefloat(cityJson.lat);
            const lon = parsefloat(cityJson.lon);
            console.log(cityJson);
        })
        .catch(function (error){
            console.log(error);
        })
        .finally(function () {
            //always executed
            console.log("Attempted to collect latitude and longtitude data");
        });

        axios
          .get(
            "https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c8da4ee199183df66c17fe7a2b6bf6da"
          )
          .then(weatherJson => {
            const weatherObj = JSON.parse(response);
            const returnWeatherObj = {};
            returnWeatherObj.cityName = cityName;
            returnWeatherObj.temperature = weatherObj.main.temp_min - 273.15; //Conversion from Kelvin to Celcius
            returnWeatherObj.weatherDescription = weatherObj.weather.description; //Collect description of weather
            returnWeatherObj
          })
          .catch(function (error) {
            const returnWeatherObj = null;
            console.log(error);
          })
          .finally(function () {
            console.log("Attempted to collect weather data");
          });
        return returnWeatherObj;
        // If valid weather data is found, return JSON object. Else return Null object
        // Check for if returnWeatherObejct === null and throw 404 if true
    }
}

module.exports = OpenWeatherAPIService;
