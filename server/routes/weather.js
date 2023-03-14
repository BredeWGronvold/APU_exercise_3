import express from 'express'
var mcache = require('memory-cache');
const router = express.Router();
let cacheKeyPointers = [];
const duration = 300;

function handleCache(cityName) {
  mcache.put(cityName, cityWeather, duration * 1000);
  cacheKeyPointers.push(cityName);
  while (mcache.size() <= cacheKeyPointers.size() || mcache.size() > 5) {
    cacheKeyPointers.shift();
  }
}

router.get('/:city', cache(300), function(req, res) {
  //TODO Implement
  const cityName = req.params.city;

  if (!mcache.get(cityName)) {
    const cityWeather = OpenWeatherAPIService.getWeather(cityName);
    if(typeof cityWeather === 'undefined') {
      router.status(404).send("Unable to resolve city name. Try again.");
      return;
    } else {
      handleCache(cityName);
      router.status(200).send(JSON.stringify(cityWeather));
      return;
    }
  } else {
    router.status(200).send(JSON.stringify(mcache.get(cityName)));
  }


});

router.get('/', function(req, res) {
  //TODO Implement
  const cachedCitiesBody = {};
  if (!req.params.max) {
    for (var i = cacheKeyPointers.length - 1; i >= 0; i--) {
      cachedCitiesBody[[i]] = mcache.get(i);
    }
  } else if (req.params.max >= 1) {
    for (var i = cacheKeyPointers.length - 1; i >= Math.max(0, (cacheKeyPointers.length - 1) - req.params.max); i--) {
      cachedCitiesBody[[i]] = mcache.get(i);
    }
  } else {
    router.status(400).send("wallah bror hva prøver du");
    return;
  }
  router.status(200).send(JSON.stringify(cachedCitiesBody));
});

export default router;
