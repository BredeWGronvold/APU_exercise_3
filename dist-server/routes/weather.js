"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const OpenWeatherAPIService = require('../../open-weather-api/open-weather-api-service.js');
/*import OpenWeatherAPIService from '../../open-weather-api/open-weather-api-service.js';*/
var mcache = require('memory-cache');
const router = _express.default.Router();
let cacheKeyPointers = [];
const duration = 300;
function handleCache(cityName, cityWeather, duration) {
  if (mcache.size() >= 5) {
    mcache.del(mcache.keys()[0]);
    console.log("Clearing oldest element from cache.");
  }
  mcache.put(cityName, cityWeather, duration * 1000);
  console.log(`Adding to cache and printing. Cache size: ${mcache.size()}`);
  console.log(mcache.keys());
}
/* //Both this and the other router.get function works, however none of them validate the tests.
router.get('/:city', async(req, res) => {
  const cityName = req.params.city;
  //console.log("\n#1: Calling Weather API\n");
  const weatherAPI = new OpenWeatherAPIService;
  const cityWeather = await weatherAPI.getWeather(cityName);
  //console.log("#2: Get City Weather API called: ");

  if (!mcache.get(cityName)) {
    //console.log(`STATUS | Not in cache, fetching from API. Cache size: ${mcache.size()}`);
    //console.log("cityWeather object on next line: ");
    console.log(cityWeather);
    if(cityWeather == null) {
      //console.log("STATUS | Check if undefined");
      res.status(404).send("Error 404. Unable to resolve request. Try again.");
    } else {
      handleCache(cityName, cityWeather, duration);
      //console.log(`STATUS | Put city data in cache.`);
      res.status(200).send(JSON.stringify(cityWeather));
    }
  } else {
    //console.log(`Get from cache. Cache size: ${mcache.size()}`);
    console.log(cityWeather);
    res.status(200).send(JSON.stringify(mcache.get(cityName)));
  }
});
*/

router.get('/:city', function (req, res) {
  const cityName = req.params.city;
  //console.log("\n#1: Calling Weather API\n");
  const weatherAPI = new OpenWeatherAPIService();
  let cityWeatherResponse = weatherAPI.getWeather(cityName);
  cityWeatherResponse.then(cityWeather => {
    if (!mcache.get(cityName)) {
      console.log(`STATUS | Not in cache, fetching from API. Cache size: ${mcache.size()}`);
      console.log("cityWeather object on next line: ");
      console.log(cityWeather);
      if (cityWeather == null) {
        console.log("STATUS | Check if undefined");
        res.status(404).send("Error 404. Unable to resolve request. Try again.");
      } else {
        handleCache(cityName, cityWeather, duration);
        console.log(`STATUS | Put city data in cache.`);
        res.status(200).send(JSON.stringify(cityWeather));
      }
    } else {
      console.log(`Get from cache. Cache size: ${mcache.size()}`);
      console.log(cityWeather);
      res.status(200).send(JSON.stringify(mcache.get(cityName)));
    }
  });
  //console.log("#2: Get City Weather API called: ");
});

router.get('/', function (req, res) {
  //TODO Implement
  const cachedCitiesBody = {};
  console.log(req.query.max);
  if (req.query.max == null) {
    //console.log("\n req query max not set");
    for (var i = mcache.size() - 1; i >= 0; i--) {
      //console.log(mcache.keys()[i]); 
      cachedCitiesBody[mcache.keys()[i]] = mcache.get(mcache.keys()[i]);
      //console.log(mcache.get(mcache.keys()[i]));
    }
  } else if (req.query.max >= 1) {
    for (var i = mcache.size() - 1; i >= Math.max(0, mcache.size() - req.query.max); i--) {
      cachedCitiesBody[mcache.keys()[i]] = mcache.get(mcache.keys()[i]);
    }
  } else {
    res.status(400).send("Specify a query with max > 0");
  }
  res.status(200).send(JSON.stringify(cachedCitiesBody));
});
var _default = router;
exports.default = _default;