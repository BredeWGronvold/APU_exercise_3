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
function handleCache(cityName, duration) {
  mcache.put(cityName, cityWeather, duration * 1000);
  cacheKeyPointers.push(cityName);
  while (mcache.size() <= cacheKeyPointers.size() || mcache.size() > 5) {
    cacheKeyPointers.shift();
  }
}
router.get('/:city', function (req, res) {
  //TODO Implement
  const cityName = req.params.city;
  const weatherAPI = new OpenWeatherAPIService();
  console.log(`Get city weather API called: GET ${req.params.city}`);
  if (!mcache.get(cityName)) {
    const cityWeather = weatherAPI.getWeather(cityName);
    if (typeof cityWeather === 'undefined') {
      router.status(404).send("Unable to resolve city name. Try again.");
      return;
    } else {
      handleCache(cityName, duration);
      router.status(200).send(JSON.stringify(cityWeather));
      return;
    }
  } else {
    router.status(200).send(JSON.stringify(mcache.get(cityName)));
  }
});
router.get('/', function (req, res) {
  //TODO Implement
  const cachedCitiesBody = {};
  if (!req.params.max) {
    for (var i = cacheKeyPointers.length - 1; i >= 0; i--) {
      cachedCitiesBody[[i]] = mcache.get(i);
    }
  } else if (req.params.max >= 1) {
    for (var i = cacheKeyPointers.length - 1; i >= Math.max(0, cacheKeyPointers.length - 1 - req.params.max); i--) {
      cachedCitiesBody[[i]] = mcache.get(i);
    }
  } else {
    router.status(400).send("wallah bror hva prøver du");
    return;
  }
  router.status(200).send(JSON.stringify(cachedCitiesBody));
});
var _default = router;
exports.default = _default;